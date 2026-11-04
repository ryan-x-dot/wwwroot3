function LS_code_us(){
    var _self = this;
    var parentClass;
    var LangxAry;

    _self.init=function(){
        LangxAry = _self.set();
    }

    _self.set=function(){
        var ary = new Object();
        ary["0X000"] = "無此code碼";
        ary["0X001"] = "參數錯誤";
        ary["0X002"] = "系統錯誤";

        ary["4X001"] = "IP不合法";
        ary["4X002"] = "Your account is inactive.  Please contact your upline for assistance.";
        ary["4X003"] = "Your account was Suspended. Please contact your upline to active your account！";
        ary["4X004"] = "Your account has been locked due to multiple failed login attempts.  Please contact your upline to unlock.";
        ary["4X035"] = "Your account has expired. Please contact your upline to active your account！";
        ary["4X005"] = "Login ID, Password or Safe Code entered is invalid.";
        ary["4X006"] = "三分鐘後再試";
        ary["4X007"] = "未設定email";
        ary["4X008"] = "no data";
        ary["4X009"] = "含有特殊字元";
        ary["4X010"] = "1. Your login ID must be between 6 to 12 alphanumeric characters with at least 2 capital (A-Z) or lowercase letters (a-z) and at least 1 numeric character (0-9)</br>2. Your safe code must not contain any spaces.";
        //ary["4X011"] = "1. Your safe code must be between 6 to 12 alphanumeric characters with at least 2 capital (A-Z) or lowercase letters (a-z) and at least 1 numeric character (0-9)</br>2. Your safe code must not contain any spaces.";
        ary["4X011"] = "Your Safe Code must:</br>1. Be between 6 - 12 alphanumeric characters with at least 2 upper (A - Z) or lowercase letters (a - z) and at least 1 numeric characters (0 - 9).</br>2. Contain at least 3 different alphanumeric characters.</br>3. Not contain any spaces.";
        ary["4X011_ag"] = "Login ID must be between 6 to 12 alphanumeric characters with at least 2 capital (A-Z) or lowercase letters (a - z) and at least 1 numeric character (0 - 9).";
        ary["4X012"] = "uid格式錯誤";
        ary["4X013"] = "首次登入";

        ary["4X014"] = "You have been logged out from this session. Please log in again.\n";
        ary["4X014"] += "You have been logged out for one of the following reasons:\n";
        ary["4X014"] += "1.Your session has timed-out.\n";
        ary["4X014"] += "2.You are logged in on another session.\n";
        ary["4X014"] += "Please log in again. If you have questions or need assistance, please contact you upline or customer service.\n";

        //登3
        ary["4X015_ag"] = "Your Login ID cannot be the same as your password or user code.";
        //登1或登2
        ary["4X015"] = "Your Safe Code cannot be the same as your Password or User Code.";
        ary["4X016"] = "The user name currently used,please go back and input again";
        ary["4X017"] = "已設置過安全代碼";
        ary["4X018"] = "Current Password is invalid.";
        //ary["4X019"] = "Password has been used already.  Please choose another.";
        ary["4X019"] = "Your new Password cannot be the same as your Current Password. Please try again.";
        ary["4X020"] = "Passwords do not match.  Please try again.";
        //ary["4X021"] = "Password must include 6 - 12 words and involve numbers (0-9) and letters (a-z)";
        ary["4X021"] = "Your Password must:</br>1. Be between 6 - 12 alphanumeric characters with at least 2 upper (A - Z) or lowercase letters (a - z) and at least 1 numeric characters (0 - 9).</br>2. Contain at least 3 different alphanumeric characters.</br>3. Not contain any spaces.";
        //ary["4X022"] = "Login ID cannot be the same as your password or user code.";
        //ary["4X023"] = "New Password cannot be the same as you login ID or safe code.";
        ary["4X022"] = "Your Password cannot be the same as you login ID.";
        ary["4X023"] = "Your Password cannot be the same as you login ID or safe code.";
        ary["4X024"] = "Your Password cannot be the same as you login ID.";
        ary["4X042"] = "The verification code is incorrect, Please try again.";
        //2019-10-25 密碼強度 新增語系
        ary["4X040"] = "A simple Password may cause security problems. Please use a different Password combination.";
        ary["4X041"] = "A simple Safe Code may cause security problems. Please use a different Safe Code combination.";

        ary["4X024"] = "Password has been used already.  Please choose another.";
        ary["4X025"] = "Password Recovery is currently disabled.  Please contact your upline.";
        ary["4X026"] = "You have exceeded the number of new verification code allowed.  Unable to generate a new verification code.  Please verify your information.";
        ary["4X027"] = "連不到MailServer";
        ary["4X028"] = "MailServer發送驗證失敗";
        ary["4X029"] = "You have exceeded the number of tries for this verification code.  Please generate a new verification code.";
        ary["4X030"] = "Verification Code entered is invalid.  Please try again.";
        ary["4X031"] = "Invalid verification code.";
        ary["4X032"] = "mail enabled不為Y";
        ary["4X033"] = "The User Code or Login ID and Email Address does not match.  Please try again.";
        ary["4X034"] = "You have exceeded the number of new verification code allowed per day.  Please contact your upline.";
        ary["4O005"] = "Verification Code has been sent to your email.";
        ary["4O006"] = "Successfully Registered.";

        return ary;
    }

    _self.get=function(_key){
        return LangxAry[_key]? LangxAry[_key] : _key;
    }

}