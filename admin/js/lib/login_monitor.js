/**
 * login_monitor.js —— 后台"会员/代理登录提示音"监听器
 *
 * 集成方式：
 *   1) admin/app/wmc/index.php 的 $js_arr 中引入本文件
 *   2) admin/js/wmc/wmc_index.js 的 init() 末尾 new + init
 *
 * 开关（在 admin/js/conf/config_set.js 中修改）：
 *   LOGIN_MONITOR_MEMBER   true/false  会员登录提示音（mem_login_log）
 *   LOGIN_MONITOR_AGENT    true/false  代理登录提示音（ag_login_log）
 *   LOGIN_MONITOR_INTERVAL 毫秒        轮询间隔
 *   LOGIN_MONITOR_MAX      条          单次最多响应条数
 *
 * 手动控制（浏览器控制台）：
 *   top.loginMonitor.toggle()          临时切换总开关（不持久化）
 *   top.loginMonitor.enable() / .disable()
 *   top.loginMonitor.playTone()        手动试听一次
 *   top.loginMonitor.getLastTs()       查看当前时间戳
 *   top.loginMonitor.reset()           清空 localStorage 时间戳
 */
function login_monitor(_win, _dom) {
    var _self = this;
    var classname = "login_monitor";
    var win = _win;
    var dom = _dom;
    var parentClass;

    var util;
    var config_set;
    var storage;
    var Timer;

    var audioObj = null;
    var timerObj = null;
    var httpObj = null;

    var lastTs = 0;                 // 上次轮询到的服务器时间戳
    var firstPoll = true;           // 是否首次轮询（首次不响历史）
    var running = false;            // 定时器是否运行中
    var polling = false;            // 是否正在请求中（防抖，避免上次未回来就发起下次）
    var enabledRuntime = true;      // 运行时总开关（可通过 toggle 切换，不持久化）
    var errCount = 0;               // 连续错误计数
    var ERR_STOP_THRESHOLD = 20;    // 连续错误上限（超过则停止，避免无效请求刷屏）

    var STORAGE_TS_KEY = "admin_login_monitor_ts";

    // ================= 生命周期 =================

    _self.init = function () {
        try {
            if (!_self.readConfig()) {
                // 两个开关都是 off，直接不启动
                return;
            }
            _self.createAudio();
            _self.restoreLastTs();
            _self.createTimer();
            running = true;
        } catch (e) {
            _self.log("init error: " + (e && e.message ? e.message : e));
        }
    };

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        try {
            util = parentClass.getThis("util");
            config_set = parentClass.getThis("config_set");
            storage = parentClass.getThis("storage");
            Timer = win.Timer;
        } catch (e) {
            _self.log("setParentclass error: " + (e && e.message ? e.message : e));
        }
    };

    _self.destroy = function () {
        try {
            if (timerObj) { timerObj.clearObj(); timerObj = null; }
            if (audioObj && audioObj.parentNode) { audioObj.parentNode.removeChild(audioObj); }
            audioObj = null;
            running = false;
        } catch (e) {}
    };

    // ================= 配置 =================

    /**
     * 读取 config_set 中的开关；返回是否需要启动
     */
    _self.readConfig = function () {
        var enableMem = _self.cfg("LOGIN_MONITOR_MEMBER", true);
        var enableAg = _self.cfg("LOGIN_MONITOR_AGENT", true);
        if (!enableMem && !enableAg) {
            _self.log("both switches off, monitor not started");
            return false;
        }
        return true;
    };

    _self.cfg = function (key, def) {
        try {
            if (config_set && typeof config_set.get === "function") {
                var v = config_set.get(key);
                if (v !== undefined && v !== null) return v;
            }
        } catch (e) {}
        return def;
    };

    _self.getLayersParam = function () {
        var arr = [];
        if (_self.cfg("LOGIN_MONITOR_MEMBER", true)) arr.push("mem");
        if (_self.cfg("LOGIN_MONITOR_AGENT", true)) arr.push("ag");
        return arr.join(",");
    };

    // ================= 音频 =================

    _self.createAudio = function () {
        try {
            // 独立的 audio 元素，与 wmc.js 的 musicObj（下注音 TPBTLOW.WAV）完全隔离
            audioObj = dom.createElement("audio");
            audioObj.id = "login_tone_audio";
            audioObj.setAttribute("preload", "auto");
            audioObj.setAttribute("src", "/login_tone.mp3");
            audioObj.style.display = "none";
            audioObj.onerror = function () {
                _self.log("audio load error: /login_tone.mp3");
            };
            dom.body.appendChild(audioObj);
            try { audioObj.load(); } catch (e) {}
        } catch (e) {
            _self.log("createAudio error: " + (e && e.message ? e.message : e));
        }
    };

    /**
     * 播放一次登录提示音；合并策略：一次轮询有多条 event 也只播一次
     */
    _self.playTone = function () {
        if (!enabledRuntime) return;
        if (!audioObj) return;
        try {
            audioObj.currentTime = 0;
            var p = audioObj.play();
            // 现代浏览器 play() 返回 Promise，需捕获自动播放策略拒绝
            if (p && typeof p.catch === "function") {
                p.catch(function (err) {
                    _self.log("play blocked by browser autoplay policy: " + err);
                });
            }
        } catch (e) {
            _self.log("playTone error: " + (e && e.message ? e.message : e));
        }
    };

    // ================= 时间戳持久化 =================

    _self.restoreLastTs = function () {
        try {
            var v = _self.storageGet(STORAGE_TS_KEY);
            if (v && !isNaN(parseInt(v, 10))) {
                lastTs = parseInt(v, 10);
                firstPoll = false;   // 已有历史时间戳，本次即视为增量查询
            } else {
                lastTs = 0;
                firstPoll = true;    // 首次进入，等待服务器时间初始化
            }
        } catch (e) {
            lastTs = 0;
            firstPoll = true;
        }
    };

    _self.saveLastTs = function (ts) {
        ts = parseInt(ts, 10);
        if (!ts || ts <= 0) return;
        lastTs = ts;
        try { _self.storageSet(STORAGE_TS_KEY, String(ts)); } catch (e) {}
    };

    _self.storageGet = function (key) {
        try {
            if (storage && typeof storage.get === "function") {
                var v = storage.get(key);
                if (v !== "null" && v !== null && v !== undefined) return v;
            }
        } catch (e) {}
        try { return win.localStorage.getItem(key); } catch (e2) {}
        return null;
    };

    _self.storageSet = function (key, val) {
        try {
            if (storage && typeof storage.set === "function") {
                storage.set(key, val);
                return;
            }
        } catch (e) {}
        try { win.localStorage.setItem(key, val); } catch (e2) {}
    };

    _self.storageDel = function (key) {
        try {
            if (storage && typeof storage.remove === "function") { storage.remove(key); return; }
        } catch (e) {}
        try { win.localStorage.removeItem(key); } catch (e2) {}
    };

    // ================= 定时器 =================

    _self.createTimer = function () {
        var interval = _self.cfg("LOGIN_MONITOR_INTERVAL", 15000);
        if (!interval || interval < 3000) interval = 15000;  // 最低 3 秒，防误配

        timerObj = new Timer(interval);
        timerObj.setParentclass(_self);
        timerObj.dont_clear = true;   // 主容器切换 body 页时不清除此 timer
        timerObj.init();
        timerObj.addEventListener("TimerEvent.TIMER", _self.onTimer);
        timerObj.addEventListener("TimerEvent.TIMER_COMPLETE", _self.onTimerComplete);
        timerObj.startTimer();

        // 立即先拉一次，尽快完成 firstPoll 初始化
        _self.poll();
    };

    _self.onTimer = function () {
        if (!running) return;
        _self.poll();
    };

    _self.onTimerComplete = function () {
        // 无限循环，不会触发
    };

    // ================= 轮询 =================

    _self.poll = function () {
        if (!enabledRuntime) return;
        if (polling) return;              // 上次未回，跳过本轮
        if (errCount >= ERR_STOP_THRESHOLD) {
            _self.log("too many errors, stop polling");
            _self.stopTimer();
            return;
        }
        if (!top || !top.uid || !top.url) return;   // 未登录/未初始化

        var layers = _self.getLayersParam();
        if (!layers) return;              // 两个开关都关

        var params = "p=get_new_login"
                   + "&ver=" + (top.ver || "")
                   + "&uid=" + encodeURIComponent(top.uid)
                   + "&login_layer=" + encodeURIComponent(top.login_layer || "")
                   + "&langx=" + encodeURIComponent(top.langx || "zh-cn")
                   + "&since=" + lastTs
                   + "&layers=" + encodeURIComponent(layers)
                   + "&max=" + _self.cfg("LOGIN_MONITOR_MAX", 20);

        polling = true;
        try {
            httpObj = new win.HttpRequest();
            httpObj.addEventListener("LoadComplete", _self.onLoadComplete);
            httpObj.addEventListener("onError", _self.onError);
            httpObj.loadURL(top.url, "POST", params);
        } catch (e) {
            polling = false;
            errCount++;
            _self.log("poll send error: " + (e && e.message ? e.message : e));
        }
    };

    _self.onLoadComplete = function (json) {
        polling = false;
        try {
            var hash = json;
            if (typeof hash === "string") {
                // 与 login.js 相同的容错解析：兼容响应带 UTF-8 BOM 的环境（生产老文件）
                try {
                    hash = JSON.parse(hash);
                } catch (e) {
                    hash = (new Function("return " + hash))();
                }
            }
            if (!hash) return;

            if (hash.status === "error") {
                errCount++;
                // uid 失效等场景，避免刷屏，仅记录不弹窗
                _self.log("server returned error: " + (hash.msg || hash.code || ""));
                return;
            }

            errCount = 0;
            var serverTime = parseInt(hash.server_time, 10) || 0;
            var events = hash.events || [];

            if (firstPoll) {
                // 首次访问：仅用服务器时间初始化时间戳，不响历史事件
                if (serverTime > 0) _self.saveLastTs(serverTime);
                firstPoll = false;
                _self.log("first poll initialized, since=" + lastTs + ", skipped " + events.length + " history events");
                return;
            }

            if (events.length > 0) {
                _self.playTone();   // 合并响一次
                _self.log("new login events: " + events.length);
            }

            if (serverTime > 0) _self.saveLastTs(serverTime);
        } catch (e) {
            errCount++;
            _self.log("onLoadComplete parse error: " + (e && e.message ? e.message : e));
        }
    };

    _self.onError = function () {
        polling = false;
        errCount++;
        _self.log("http error, count=" + errCount);
    };

    _self.stopTimer = function () {
        try {
            running = false;
            if (timerObj) timerObj.stopTimer();
        } catch (e) {}
    };

    _self.startTimer = function () {
        try {
            if (timerObj && !running) {
                running = true;
                timerObj.startTimer();
            }
        } catch (e) {}
    };

    // ================= 对外控制接口 =================

    /**
     * 临时切换总开关（不持久化，刷新页面后按 config_set 恢复）
     */
    _self.toggle = function () {
        enabledRuntime = !enabledRuntime;
        _self.log("runtime " + (enabledRuntime ? "enabled" : "disabled"));
        return enabledRuntime;
    };

    _self.enable = function () {
        enabledRuntime = true;
        _self.startTimer();
    };

    _self.disable = function () {
        enabledRuntime = false;
    };

    _self.isEnabled = function () {
        return enabledRuntime && running;
    };

    _self.getLastTs = function () {
        return lastTs;
    };

    /**
     * 清空持久化时间戳，下次轮询将视为首次（不响历史）
     */
    _self.reset = function () {
        _self.storageDel(STORAGE_TS_KEY);
        lastTs = 0;
        firstPoll = true;
        _self.log("reset done");
    };

    // ================= 工具 =================

    _self.log = function (msg) {
        try {
            if (util && typeof util.echo === "function") {
                util.echo("[" + classname + "] " + msg);
            } else if (win.console && win.console.log) {
                win.console.log("[" + classname + "] " + msg);
            }
        } catch (e) {}
    };
}
