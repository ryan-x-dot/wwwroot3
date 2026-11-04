function LS_account_us(){
    var _self = this;
    var parentClass;
    var LangxAry;
    var isDebug = false;

    _self.init=function(){
        LangxAry = _self.set();
    }

    _self.set=function(){
        var ary = new Object();

        ary["loginID_Null"] = "Please enter your Login ID";
        ary["curPwd_Null"] = "Please enter your current password.";
        ary["pwd_Null"] = "Please enter your Passwords.";

        //pwd_safe
        //ary["err_pwd_safe_rule"] = "1. Your safe code must be between 6 to 12 alphanumeric characters with at least 2 capital (A-Z) or lowercase letters (a-z) and at least 1 numeric character (0-9).</br>2. Your safe code must not contain any spaces.";
        ary["err_pwd_safe_rule"] = "Your Safe Code must:</br>1. Be between 6 - 12 alphanumeric characters with at least 2 upper (A - Z) or lowercase letters (a - z) and at least 1 numeric characters (0 - 9).</br>2. Contain at least 3 different alphanumeric characters.</br>3. Not contain any spaces.";
        //ary["pwd_safe_same"] = "Safe Code cannot be the same as your Password or User Code.";

        //pwd
        //ary["err_pwd_rule"] = "Your Password must be between 6 to 12 alphanumeric (A-Z & 0-9) characters";
        ary["err_pwd_rule"] = "Your Password must:</br>1. Be between 6 - 12 alphanumeric characters with at least 2 upper (A - Z) or lowercase letters (a - z) and at least 1 numeric characters (0 - 9).</br>2. Contain at least 3 different alphanumeric characters.</br>3. Not contain any spaces.";
        ary["npwd_same_cpwd"] = "Your new Password cannot be the same as your Current Password. Please try again.";
        //ary["pwd_same"] = "New Password cannot be the same as you login ID or safe code.";
        //2019-10-25 密碼強度 新增語系
        ary["err_pwd_block"] = "A simple Password may cause security problems. Please use a different Password combination.";
        ary["err_pwd_safe_block"] = "A simple Safe Code may cause security problems. Please use a different Safe Code combination.";

        //loginID
        ary["loginID_same"] = "Your Login ID cannot be the same as your Password or User Code.";
        ary["loginID_notOK"] = "Login ID is NOT available";
        ary["loginID_OK"] = "Login ID is available";
        //ary["err_loginID_rule"] = "Your Login ID must be between 6 to 12 alphanumeric (A-Z & 0-9) characters";
        ary["err_loginID_rule"] = "1. Your Login ID must be between 6 to 12 alphanumeric characters with at least 2 capital (A-Z) or lowercase letters (a-z) and at least 1 numeric character (0-9).</br>"+"2. Your Login ID must not contain any spaces.";
        //ary["loginID_same2"] = "Your Login ID cannot be the same as you user code or safe code.";

        //forgot_pwd
        ary["forgot_pwd_Invaild"] = "Invaild User Code, Login ID or Email Address.";
        ary["verif_Invalid"] = "Invalid verification code.";

        ary["chg_pwd_success"] = "Password Successfully Reset.";
        ary["dash_text"] = "No Change";

        ary["str_unsave"] = "Your unsaved changes will be lost if you decide to navigate away. Are you sure you want to leave this page?";

        ary["today_wagers_N"] = "Pending";
        ary["today_wagers_A"] = "Confirmed";
        ary["today_wagers_R"] = "Rejected";

        ary["str_new"] = "New";
        ary["str_old"] = "Old";

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