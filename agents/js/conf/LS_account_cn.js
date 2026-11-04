function LS_account_cn() {
    var _self = this;
    var parentClass;
    var LangxAry;
    var isDebug = false;
    _self.init = function () {
        LangxAry = _self.set()
    };
    _self.set = function () {
        var ary = new Object;
        ary["loginID_Null"] = "登入帐号请务必输入";
        ary["curPwd_Null"] = "请输入您的当前密码";
        ary["pwd_Null"] = "密码请务必输入";
        ary["err_pwd_safe_rule"] = "1. 安全代码必须至少要有一个大写，一个小写英文字母和数字(0 - 9)组合, 字数最少8至16个。 <br>2. 安全代码必须三个不同的字母数字。 <br>3. 安全代码不允许有空格。";
        ary["err_pwd_safe_rule_mem"] = "您的安全代码必须根据以下规则:</br>1. 至少要有两个大或小写英文字母和数字(0 - 9)组合, 字数最少6至12个。</br>2. 三个不同的字母数字。</br>3. 不准许有空格。";
        ary["err_pwd_rule"] = "1. 密码必须至少要有一个大写, 一个小写英文字母和数字(0 - 9)组合, 字数最少8至16个。 </br>2. 密码必须三个不同的字母数字。 </br>3. 密码不允许有空格。";
        ary["err_pwd_rule_mem"] = "1. 密码必须至少要有两个大或小写英文字母和数字(0 - 9)组合, 字数最少6至12个。 </br>2. 密码必须三个不同的字母数字。 </br>3. 密码不允许有空格。";
        ary["err_pwd_block"] = "密码过于简易会导致安全性的问题，请尝试使用其他密码组合。";
        ary["npwd_same_cpwd"] = "您的新密码不能和现用密码相同.请重新输入。";
        ary["confirmpwd_diff"] = "密码不匹配。";
        ary["err_pwd_safe_block"] = "安全代码过于简易会导致安全性的问题，请尝试使用其他安全代码组合。";
        ary["loginID_same"] = "您的登入帐号请勿和帐号或密码相同。";
        ary["loginID_notOK"] = "此登入帐号已有人使用。";
        ary["loginID_OK"] = "此登入帐号无人使用。";
        ary["err_loginID_rule"] = "1. 您的登入帐号必须由2个英文大小写字母(A-Z或a-z)和数字(0-9)组合，输入限制6-12字元.</br>" + "2. 您的登入帐号不准许有空格.";
        ary["forgot_pwd_Invaild"] = "您输入的帐户或登入帐号跟电子邮件不匹配, 请再尝试输入。";
        ary["verif_Invalid"] = "验证码不正确。";
        ary["chg_pwd_success"] = "成功重设密码。";
        ary["dash_text"] = "保留";
        ary["str_unsave"] = "若您离开此页所有未保存的更改都将丢失。确定要离开此页吗？";
        ary["today_wagers_N"] = "待确认";
        ary["today_wagers_A"] = "确认";
        ary["today_wagers_R"] = "投注失败";
        ary["str_new"] = "新值";
        ary["str_old"] = "旧值";

        return ary
    };
    _self.get = function (_key) {
        if (LangxAry[_key] == undefined || LangxAry[_key] == null) {
            LangxAry[_key] = "";
            if (isDebug) console.log("the status_code is:" + _key)
        }
        return LangxAry[_key]
    }
};
