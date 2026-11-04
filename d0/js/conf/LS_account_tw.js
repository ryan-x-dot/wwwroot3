function LS_account_tw(){
    var _self = this;
    var parentClass;
    var LangxAry;
    var isDebug = false;

    _self.init=function(){
        LangxAry = _self.set();
    }

    _self.set=function(){
        var ary = new Object();

        ary["loginID_Null"] = "登入帳號請務必輸入";
        ary["curPwd_Null"] = "請輸入您的當前密碼";//Please enter your current password
        ary["pwd_Null"] = "密碼請務必輸入";

        //pwd_safe
        //ary["err_pwd_safe_rule"] = "1. 您的安全代碼必須由2個英文大小寫字母和數字(0-9)組合, 輸入限制6-12字元。</br>2. 您的安全代碼不准許有空格。";
        ary["err_pwd_safe_rule"] = "您的安全代碼必須根據以下規則:</br>1. 至少要有兩個大或小寫英文字母和數字(0 - 9)組合, 字數最少6至12個。</br>2. 三個不同的字母數字。</br>3. 不准許有空格。";
        //ary["pwd_safe_same"] = "Safe Code cannot be the same as your Password or User Code.";

        //pwd
        //ary["err_pwd_rule"] = "您的新密碼必須由 6-12個字母和數字 (A-Z 和 0-9)組成。";
        ary["err_pwd_rule"] = "您的密碼必須根據以下規則:</br>1. 至少要有兩個大或小寫英文字母和數字(0 - 9)組合, 字數最少6至12個。</br>2. 三個不同的字母數字。</br>3. 不准許有空格。";
        ary["npwd_same_cpwd"] = "您的新密碼不能和現用密碼相同.請重新輸入。";
        //ary["pwd_same"] = "New Password cannot be the same as you login ID or safe code.";
        //2019-10-25 密碼強度 新增語系
        ary["err_pwd_block"] = "密碼過於簡易會導致安全性的問題，請嘗試使用其他密碼組合。";
        ary["err_pwd_safe_block"] = "安全代碼過於簡易會導致安全性的問題，請嘗試使用其他安全代碼組合。";

        //loginID
        ary["loginID_same"] = "您的登入帳號請勿和帳號或密碼相同。";
        ary["loginID_notOK"] = "此登入帳號已有人使用。";
        ary["loginID_OK"] = "此登入帳號無人使用。";
        //ary["err_loginID_rule"] = "您的登入帳號必須由 6-12個字母和數字 (A-Z 或 0-9)組成。";
        ary["err_loginID_rule"] = "1. 您的登入帳號必須由2個英文大小寫字母(A-Z或a-z)和數字(0-9)組合, 輸入限制6-12字元.</br>"+"2. 您的登入帳號不准許有空格.";
        //ary["loginID_same2"] = "Your Login ID cannot be the same as you user code or safe code.";

        //forgot_pwd
        ary["forgot_pwd_Invaild"] = "您輸入的帳戶或登入帳號跟電子郵件不匹配, 請再嘗試輸入。";//Invaild User Code, Login ID or Email Address.
        ary["verif_Invalid"] = "驗證碼不正確。";

        ary["chg_pwd_success"] = "成功重設密碼。";
        ary["dash_text"] = "保留";

        ary["str_unsave"] = "若您離開此頁所有未保存的更改都將丟失。確定要離開此頁嗎？";

        ary["today_wagers_N"] = "待確認";
        ary["today_wagers_A"] = "確認";
        ary["today_wagers_R"] = "投注失敗";

        ary["str_new"] = "新值";
        ary["str_old"] = "舊值";

        return ary;
    }

    _self.get=function(_key){
        if(LangxAry[_key]==undefined || LangxAry[_key]==null){
            LangxAry[_key]="";
            if(isDebug) console.log("the status_code is:"+_key);
        }
        return LangxAry[_key];
    }
}