/**
 * order_monitor.js —— 后台"大额下单提示音"监听器
 *
 * 功能：当有会员下注且单笔金额 >= 阈值（默认 500）时，后台播放 /order_tone.mp3
 *
 * 集成方式：
 *   1) admin/app/wmc/index.php 的 $js_arr 中引入本文件
 *   2) admin/js/wmc/wmc_index.js 的 init() 末尾 new + init
 *
 * 配置（在 admin/js/conf/config_set.js 中修改）：
 *   ORDER_MONITOR_ENABLE    true/false  总开关
 *   ORDER_MONITOR_AMOUNT    数值        金额阈值（单笔 bet_golds >= 此值时提示）
 *   ORDER_MONITOR_INTERVAL  毫秒        轮询间隔（默认 15 秒）
 *   ORDER_MONITOR_MAX       条          单次最多响应条数
 *
 * 手动控制（浏览器控制台）：
 *   top.orderMonitor.toggle()          临时切换总开关（不持久化）
 *   top.orderMonitor.enable() / .disable()
 *   top.orderMonitor.playTone()        手动试听一次
 *   top.orderMonitor.getLastId()       查看当前注单 ID 游标
 *   top.orderMonitor.reset()           清空 localStorage 游标（下次视为首次，不响历史）
 *
 * 与登录提示音（login_monitor.js）的对称设计：
 *   - 独立 <audio> 元素，与 wmc 页下注音 TPBTLOW.WAV 完全隔离
 *   - 首次进入不响历史注单，仅初始化游标
 *   - 一个轮询周期内多笔大额注单合并响一次
 *   - localStorage 持久化游标，多标签页共享，避免重复响铃
 *
 * 与登录音的差异：
 *   - 游标用 bets.ID（自增主键）而非时间戳，绝对递增、无客户端时钟问题
 */
function order_monitor(_win, _dom) {
    var _self = this;
    var classname = "order_monitor";
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

    var lastId = 0;                 // 上次轮询到的最大注单 ID（游标）
    var firstPoll = true;           // 是否首次轮询（首次不响历史）
    var running = false;            // 定时器是否运行中
    var polling = false;            // 是否正在请求中（防抖，避免上次未回来就发起下次）
    var pollGuardTimer = null;      // polling 安全超时句柄（防回调丢失导致永久卡死）
    var POLL_GUARD_MS = 30000;      // polling 安全超时（毫秒），略大于轮询间隔
    var enabledRuntime = true;      // 运行时总开关（可通过 toggle 切换，不持久化）
    var errCount = 0;               // 连续错误计数
    var ERR_STOP_THRESHOLD = 20;    // 连续错误上限（超过则停止，避免无效请求刷屏）

    var STORAGE_ID_KEY = "admin_order_monitor_id";

    // ================= 生命周期 =================

    _self.init = function () {
        try {
            if (!_self.readConfig()) {
                // 总开关 off，直接不启动
                return;
            }
            _self.createAudio();
            _self.restoreLastId();
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
            _self.clearPollGuard();
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
        if (!_self.cfg("ORDER_MONITOR_ENABLE", true)) {
            _self.log("ORDER_MONITOR_ENABLE is off, monitor not started");
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

    /**
     * 金额阈值（数值化，防配置成字符串）
     */
    _self.getAmount = function () {
        var a = parseFloat(_self.cfg("ORDER_MONITOR_AMOUNT", 500));
        if (isNaN(a) || a < 0) a = 0;
        return a;
    };

    // ================= 音频 =================

    _self.createAudio = function () {
        try {
            // 独立的 audio 元素，与 wmc.js 的 musicObj（下注音 TPBTLOW.WAV）、
            // login_monitor 的 login_tone_audio 完全隔离
            audioObj = dom.createElement("audio");
            audioObj.id = "order_tone_audio";
            audioObj.setAttribute("preload", "auto");
            audioObj.setAttribute("src", "/order_tone.mp3");
            audioObj.style.display = "none";
            audioObj.onerror = function () {
                _self.log("audio load error: /order_tone.mp3");
            };
            dom.body.appendChild(audioObj);
            try { audioObj.load(); } catch (e) {}
        } catch (e) {
            _self.log("createAudio error: " + (e && e.message ? e.message : e));
        }
    };

    /**
     * 播放一次下单提示音；合并策略：一个轮询周期多笔大额注单也只播一次
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

    // ================= 游标持久化 =================

    _self.restoreLastId = function () {
        try {
            var v = _self.storageGet(STORAGE_ID_KEY);
            if (v && !isNaN(parseInt(v, 10))) {
                lastId = parseInt(v, 10);
                firstPoll = false;   // 已有历史游标，本次即视为增量查询
            } else {
                lastId = 0;
                firstPoll = true;    // 首次进入，等待服务器 maxid 初始化
            }
        } catch (e) {
            lastId = 0;
            firstPoll = true;
        }
    };

    _self.saveLastId = function (id) {
        id = parseInt(id, 10);
        if (!id || id <= 0) return;
        if (id <= lastId) return;    // 游标只前进不后退
        lastId = id;
        try { _self.storageSet(STORAGE_ID_KEY, String(id)); } catch (e) {}
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
            // LocalstorageManager 的删除方法名是 del（非 remove）
            if (storage && typeof storage.del === "function") { storage.del(key); return; }
        } catch (e) {}
        try { win.localStorage.removeItem(key); } catch (e2) {}
    };

    // ================= 定时器 =================

    _self.createTimer = function () {
        var interval = _self.cfg("ORDER_MONITOR_INTERVAL", 15000);
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

        var params = "p=get_new_bet"
                   + "&ver=" + (top.ver || "")
                   + "&uid=" + encodeURIComponent(top.uid)
                   + "&login_layer=" + encodeURIComponent(top.login_layer || "")
                   + "&langx=" + encodeURIComponent(top.langx || "zh-cn")
                   + "&since_id=" + lastId
                   + "&amount=" + _self.getAmount()
                   + "&max=" + _self.cfg("ORDER_MONITOR_MAX", 20);

        polling = true;
        // 安全超时：HttpRequest 在极端情况下可能不触发任何回调，
        // 超时后强制复位 polling，避免监听器静默死亡
        _self.clearPollGuard();
        pollGuardTimer = win.setTimeout(function () {
            if (polling) {
                polling = false;
                errCount++;
                _self.log("poll timeout guard triggered, count=" + errCount);
            }
        }, POLL_GUARD_MS);

        try {
            httpObj = new win.HttpRequest();
            httpObj.addEventListener("LoadComplete", _self.onLoadComplete);
            httpObj.addEventListener("onError", _self.onError);
            httpObj.loadURL(top.url, "POST", params);
        } catch (e) {
            _self.clearPollGuard();
            polling = false;
            errCount++;
            _self.log("poll send error: " + (e && e.message ? e.message : e));
        }
    };

    _self.clearPollGuard = function () {
        if (pollGuardTimer) {
            try { win.clearTimeout(pollGuardTimer); } catch (e) {}
            pollGuardTimer = null;
        }
    };

    _self.onLoadComplete = function (json) {
        _self.clearPollGuard();
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
            var maxid = parseInt(hash.maxid, 10) || 0;
            var events = hash.events || [];

            if (firstPoll) {
                // 首次访问：仅用服务器 maxid 初始化游标，不响历史注单
                if (maxid > 0) _self.saveLastId(maxid);
                firstPoll = false;
                _self.log("first poll initialized, since_id=" + lastId + ", skipped " + events.length + " history bets");
                return;
            }

            if (events.length > 0) {
                _self.playTone();   // 合并响一次
                _self.log("big-order events: " + events.length + ", amount>=" + _self.getAmount());
            }

            // 游标推进用服务器返回的 maxid（权限内所有新注单的最大 ID，
            // 不受金额过滤影响，保证游标始终前进、扫描区间最小）
            if (maxid > 0) _self.saveLastId(maxid);
        } catch (e) {
            errCount++;
            _self.log("onLoadComplete parse error: " + (e && e.message ? e.message : e));
        }
    };

    _self.onError = function () {
        _self.clearPollGuard();
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
        errCount = 0;   // 重置错误计数，避免触发停止阈值后 enable 立即再停
        _self.startTimer();
    };

    _self.disable = function () {
        enabledRuntime = false;
    };

    _self.isEnabled = function () {
        return enabledRuntime && running;
    };

    _self.getLastId = function () {
        return lastId;
    };

    /**
     * 清空持久化游标，下次轮询将视为首次（不响历史）
     */
    _self.reset = function () {
        _self.storageDel(STORAGE_ID_KEY);
        lastId = 0;
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
