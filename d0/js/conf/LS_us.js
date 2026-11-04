function LS_us() {
    var _self = this;
    var parentClass;
    var LangxAry;

    _self.init = function () {
        LangxAry = _self.set();
    }

    _self.set = function () {
        var array = new Object();
        array["loading_txt"] = "LOADING";
        array["page_dashboard"] = "Dashboard";
        array["page_report"] = "Reports";
        array["page_totalbet"] = "Total Bets";
        array["page_set"] = "Settled Wager";
        array["page_un"] = "Unsettled Wager";
        array["page_summary"] = "Settlement Summary";
        array["page_period"] = "Accounting Period";
        array["page_exchange"] = "Exchange Rate";
        array["page_cancel"] = "Cancelled Report";
        array["page_cancel"] = "Cancelled Report";
        array["page_quicksearch"] = "Quick Search";
        array["page_onlinemem"] = "Online Members";
        array["page_mysetting"] = "My Settings";
        array["page_myactivities"] = "My Activities";
        array["page_feature"] = "Features";
        array["page_requirements"] = "System Requirements";
        array["page_newurl"] = "New URL";
        array["page_contactus"] = "Contact Us";
        array["page_pwd_recovery"] = "Password Recovery";
        array["page_chg_pwd_inside"] = "Change Password";
	    array["page_problem_accounts"] = "Problem Accounts";
        array["page_announcement"] = "Announcement";
        array["page_account"] = "A/C Mgmt";
        array["page_sub"] = "Sub Account";
        array["page_su_add"] = "New Master Agent";
        array["page_ag_add"] = "New Agent";
        array["page_mem_add"] = "New Member";
        array["page_sub_add"] = "New Sub Account";

        array["str_copied"] = "The data has been copied.";

        array["page_overview"] = "Overview";
        array["page_INPLAY"] = "In-Play";
        array["page_TODAY"] = "Today";
        array["page_EARLY"] = "Early";
        array["page_STARTED"] = "Started";
        array["page_PARLAY"] = "Parlay";
        array["page_OUTRIGHT"] = "Outright";
        array["page_RESULTS"] = "Results";

        //new_url Start
        array["newcro666"] = "Member Site";
        array["phcro666"] = "Mobile Member Site";
        array["newagcro666"] = "New Manager Site";
        array["agphonecro666"] = "Mobile Manager Site";
        array["acc"] = "Historical Report Site";
        //new_url End
        //恢復密碼
        array["0X001"] = "參數錯誤";
        array["4X001"] = "IP不合法";
        array["4X002"] = "Your account is inactive.  Please contact your upline for assistance.";
        array["4X003"] = "Your account was Suspended. Please contact your upline to active your account！";
        array["4X004"] = "Your account has been locked due to multiple failed login attempts.  Please contact your upline to unlock.";
        array["4X005"] = "Login ID, Password or Safe Code entered is invalid.";
        array["4X006"] = "三分鐘後再試";
        array["4X007"] = "未設定email";
        array["4X025"] = "Password Recovery is currently disabled.  Please contact your upline.";
        array["4X026"] = "You have exceeded the number of new verification code allowed.  Unable to generate a new verification code.  Please verify your information.";
        array["4X027"] = "連不到MailServer";
        array["4X028"] = "MailServer發送驗證碼失敗";
        array["4O005"] = "Verification Code has been sent to your email.";
        array["4O006"] = "Successfully Registered.";
        array["get_mail_canceal"] = "Please enter a valid email address.";
        array["input_verify_cancel"] = "Cancel Password Recovery?";
        array["remove_email"] = "You have deleted your Password Recovery Email.";
        array["remove_email_message"] = "Delete Password Recovery Email?";

        array["enable_Y"] = "Active";
        array["enable_N"] = "Inactive";
        array["enable_S"] = "View Only";
        array["enable_F"] = "Suspended";
        array["input_acc"] = "Enter User Code";

        //額度模式
        array["pay_type_0"] = "AR";
        array["pay_type_1"] = "W/L";
        array["long_pay_type_0"] = "Auto Recovery Account";
        array["long_pay_type_1"] = "Win/Loss Account";

        array["str_co"] = "Corprator";
        array["str_su"] = "Master Agent";
        array["str_ag"] = "Agent";
        array["str_mem"] = "Member";

        array["str_co_sub"] = "Corprator Sub";
        array["str_su_sub"] = "Master Agent Sub";
        array["str_ag_sub"] = "Agent Sub";

        
        array["str_ags"] = "Agents";
        array["str_mems"] = "Members";

        //帳戶新增修改
        array["max_limit_head"] = "Max: "//最大限額字串 Max: RMB 1,100,000
        array["empty_user"] = "You cannot leave this empty."; //帳號請務必輸入
        array["empty_alias"] = "You cannot leave this empty."; //名稱請務必輸入
        array["empty_passwd"] = "You cannot leave this empty."; //請輸入新密碼
        array["empty_confirm"] = "You cannot leave this empty."; //請輸入新密碼
        array["empty_credit"] = "You cannot leave this empty."; //總信用額度請務必輸入
        array["empty_safe"] = "You cannot leave this empty.";
        array["empty_enddate"] = "You cannot leave this empty.";
        array["empty_enddate1"] = "Wrong date format here.";
        array["str_confirm_add_su"] = "Confirm Write this agency?"; //是否確定寫入總代理
        array["str_confirm_add_ag"] = "Confirm wrtied this agent?";//是否確定寫入代理商
        array["str_confirm_add_mem"] = "Confirm writed this member's data?";//是否確定寫入會員資料
        array["credit_over"] = "Credits entered exceeds the Credit Balance. Please try again.";
        array["user_limit"] = "User code should contain at least 4 characters.";
        array["user_manage"] = "You do not have any Managed Accounts selected.Please select a Managed Account or select\"All\"";
        //array["add_account_success"] = "Account successfully created";
        array["add_account_success"] = "New Account Created";
        array["copy_success"] = "ID and password has been copied to clipboard.";
        array["copy_user"] = "ID：";
        array["copy_pwd"] = "PW：";
        array["winloss_percent"] = "%";
        array["su_ag_winloss_error"] = "Total Possess should be between xx% to yy%.  Please try again.";//股東及總代理及代理商的成數總和須在 5 - 8 成內 , 請重新設定 !!
        array["su_ag_winloss8_error"] = "Total Posess should be exactly xx%.  Please try again.";
        array["status_update"] = "Status successfully updated";
        array["credit_update"] = "Credit successfully updated";
        array["account_copy"] = "COPY";
        array["cash_sw_in_edit_user"] = "Due to unknown reason,  changing of credit function is temporarily unavailable. Please try again later.";
        array["cash_sw_in_add_user"] = "This function is not yet release to public. We will get it fully tested and release to public as soon as possible.";


        //子帳號
        array["max_sub3"] = "You have exceeded the maxiumum number of Sub Account.  Unable to proceed with account creation.";
        array["sub_mlimit"] = "You may select maximum of ";
        array["sub_mlimit2"] = " accounts at a time.";
        array["listsub_safe"] = "Safe Code";
        array["listsub_safe_ag"] = "Login ID";


        //修改成數
        array["str_possess_down"] = "Min. Allowed:";
        array["str_possess_up"] = "Max. Allowed:";
        array["str_possess_allowed"] = "Allowed:";
        array["RMB"] = "RMB";

        //密碼強度
        array["pwd_Very Weak"] = "Very Weak";
        array["pwd_Weak"] = "Weak";
        array["pwd_Fair"] = "Fair";
        array["pwd_Good"] = "Good";
        array["pwd_Strong"] = "Strong";

        //破解時間
        array["pwd_break_Seconds"] = "Seconds";
        array["pwd_break_Minutes"] = "Minutes";
        array["pwd_break_Hours"] = "Hours";
        array["pwd_break_Days"] = "Days";
        array["pwd_break_Months"] = "Months";
        array["pwd_break_Years"] = "Years";
        array["pwd_break_Centuries"] = "Centuries";

        array["pwd_TRILLION"] = "TRILLION";
        array["pwd_BILLION"] = "BILLION";
        array["pwd_MILLION"] = "MILLION";
        array["pwd_THOUSAND"] = "THOUSAND";
        array["pwd_HUNDRED"] = "HUNDRED";

        //信用額度
        array["str_maxcre"] = "Credit Limit only accept numbers.";
        array["str_maxcre_zero"] = "0 is not a valid value.  ";
        // array["str_maxcre_zero1"] = "Credit limit should be greater than 0.";
        array["str_maxcre_zero1"] = "Please enter a value greater than 0."; //更改信用額度時不能輸入0的錯誤訊息
        array["str_edit_credit_confirm"] = "Make sure to modify the credit limit?";

        array["empty_credit"] = "You cannot leave this empty."; //總信用額度請務必輸入
        array["str_maxcre_zero"] = "0 is not a valid value.  ";
        // array["str_maxcre_zero1"] = "Credit limit should be greater than 0.";
        array["str_maxcre_zero1"] = "Please enter a value greater than 0.";
        array["str_maxcre"] = "Credit Limit only accept numbers.";

        array["sub_selMax"] = "You have exceeded the number of ‘Managed Accounts’ allowed.  Please contact your upline to remove inactive accounts.";
        //快速搜尋
        //2019-03-28 Ricky 248.登一帳號-Quick Search快速搜尋-sub account，level(層級)幫改為SMA，目前秀錯字Corprator
        //array["layer_type_name_corprator"] = "Corprator";
        array["layer_type_name_corprator"] = "SMA";
        array["layer_type_name_super_agents"] = "Master Agent";
        array["layer_type_name_agents"] = "Agent";
        array["layer_type_name_members"] = "Member";
        array["enable_str_Active"] = "Active";
        array["enable_str_Suspended"] = "Suspended";
        array["enable_str_ViewOnly"] = "View Only";
        array["enable_str_Inactive"] = "Inactive";
        array["layer_type_name_subAccount"] = "Sub Account";
        //我的紀錄
        array["myAct_str_Create_Account"] = "Account Created";
        array["myAct_str_Password_Reset"] = "Password Reset";
        array["myAct_str_Change_Credits"] = "Change Credit";
        array["myAct_str_Change_Status"] = "Change Status";
        array["myAct_str_super_admin"] = "Super Admin";
        array["myAct_str_corprator"] = "Corprator";
        array["myAct_str_super_agents"] = "Master Agent";
        array["myAct_str_agents"] = "Agent";
        array["myAct_str_mem"] = "Member";

        //帳戶管理
        array["acc_su"]     = "Master Agent";
        array["acc_ag"]     = "Agent";
        array["acc_mem"]    = "Member";
        array["acc_sub"]    = "Sub Account";
        array["acc_str_credit"] = "Change Credit";
        array["acc_str_enable"] = "Change Status";
        array["acc_str_add"] = "Account created";
        array["acc_str_beadd"] = "Account created By";
        array["acc_str_password"] = "Change Password";

        //密碼恢復
        array["recv_enable"] = "Enabled";
        array["recv_disable"] = "Disabled";

        array['upd_success'] = "Successfully updated";//更改成功


        // dashboard
        array["dash_D"] = "Day";
        array["dash_Ds"] = "";
        array["dash_PR"] = "Possess Revenue";
        array["dash_MW"] = "Members with Wagers";
        array["dash_TO"] = "Turnover";
        array["dash_WL"] = "Win / Loss";


        // totalBets result detail start

        array["PGF"]="First team to score";
        array["OSF"]="First offside";
        array["STF"]="First substitution";
        array["CNF"]="First corner";
        array["CDF"]="First card";
        array["RCF"]="To Score";
        array["YCF"]="First yellow card";
        array["GAF"]="No clean sheet";
        array["PGL"]="Last team to score";
        array["OSL"]="Last offside";
        array["STL"]="Last substitution";
        array["CNL"]="Last corner";
        array["CDL"]="Last card";
        array["RCL"]="Not To Score";
        array["YCL"]="Last yellow card";
        array["GAL"]="Clean sheet";
        array["PG"]="First / Last team to score";
        array["OS"]="First offside / Last offside";
        array["ST"]="First substitution / Last substitution";
        array["CN"]="First corner / Last corner";
        array["CD"]="First card / Last card";
        array["RC"]="To Score / Not To Score";
        array["YC"]="First yellow card / Last yellow card";
        array["GA"]="No clean sheet / Clean sheet";

        array["No"] = "No";
        array["Y"] = "YES";
        array["N"] = "NO";
        array["FG_S"] = "Shot";
        array["FG_H"] = "Header";
        array["FG_N"] = "No Goal";
        array["FG_P"] = "Penalty";
        array["FG_F"] = "Free Kick";
        array["FG_O"] = "Own Goal";

        array["RPF_1"] = "3rd Round";
        array["RPF_2"] = "4th Round";
        array["RPF_3"] = "5th Round";
        array["RPF_OV"] = "6th Round or Later";

        array["T3G_1"] = "U26";
        array["T3G_2"] = "U27+";
        array["T3G_N"] = "No Goal";

        array["T1G_N"] = "No Goal";
        array["T1G_1"] = "0 - 14:59 Mins";
        array["T1G_2"] = "15 - 29:59 Mins";
        array["T1G_3"] = "30 Mins – Half Time";
        array["T1G_4"] = "Start of 2nd Half – 59:59 Mins";
        array["T1G_5"] = "60 – 74:59 Mins";
        array["T1G_6"] = "75 – Full Time End of 90 Mins";

        array["MQ_H"]=" - U90";
        array["MQ_C"]=" - U90";
        array["MQ_HOT"]=" - Extra Time";
        array["MQ_COT"]=" - Extra Time";
        array["MQ_HPK"]=" - Penalty";
        array["MQ_CPK"]=" - Penalty";
        array["RNB_P"]="No Booking";
        array["RNC_P"]="No Corner";
        array["RS_P"]="No Penalty";
        array["RS_Y"]="Goal";
        array["RS_N"]="No Goal";

        array["FT_title1"]="GOALS";
        array["FT_title2"]="GOALS";
        // array["AGMH"] = "0 - 14:59 Mins";
        // array["BGMH"] = "15 - 29:59 Mins";
        // array["CGMH"] = "30 Mins – Half Time";
        // array["DGMH"] = "Start of 2nd Half – 59:59 Mins";
        // array["EGMH"] = "60 – 74:59 Mins";
        // array["FGMH"] = "75 – Full Time End of 90 Mins";

        array["AGMH"] = "Start of 1st Half - 14:59 Mins";
        array["BGMH"] = "15:00 - 29:59 Mins";
        array["CGMH"] = "30:00 Mins - Half Time";
        array["HGMH"] = "Half Time";
        array["DGMH"] = "Start of 2nd Half - 59:59 Mins";
        array["EGMH"] = "60:00 - 74:59 Mins";
        array["FGMH"] = "75:00 Mins - Full Time";
        array["GMH"] = "Full Time";

        array["TAGMH"] = "Start of Match - 4:59 Mins";
        array["TBGMH"] = "5:00 - 9:59 Mins";
        array["TCGMH"] = "10:00 Mins - Half Time";
        array["THGMH"] = "Half Time";
        array["TDGMH"] = "Start of 2nd Half - 19:59 Mins";
        array["TEGMH"] = "20:00 - 24:59 Mins";
        array["TFGMH"] = " 25:00 Mins - Full Time";
        array["TGMH"] = "Full Time";

        array["BH"] = "To Win from Behind";
        array["ARG"] = "1st Goal";
        array["BRG"] = "2nd Goal";
        array["CRG"] = "3rd Goal";
        array["DRG"] = "4th Goal";
        array["ERG"] = "5th Goal";
        array["FRG"] = "6th Goal";
        array["GRG"] = "7th Goal";
        array["HRG"] = "8th Goal";
        array["IRG"] = "9th Goal";
        array["JRG"] = "10th Goal";
        array["FG"] = "First Goal Method";
        array["F2G"] = "Race to 2 Goals";
        array["F3G"] = "Race to 3 Goals";
        array["T1G"] = "Time of 1st Goal";
        array["T3G"] = "Time of 1st Goal - 3-Way";
        array["TK"] = "Team to Kick Off";
        array["PA"] = "Penalty Awarded";
        array["RCD"] = "Red Card(Player)";
        array["RPS"] = "Penalty Shootout";

        array["MQ"]="Qualifying Method";
        array["MW"]="Winning Method";
        array["OG"]="Own Goal";
        array["OT"]="Extra Time";
        array["RSHA"]="1st Penalty Shootout";
        array["RSHB"]="2nd Penalty Shootout";
        array["RSHC"]="3rd Penalty Shootout";
        array["RSHD"]="4th Penalty Shootout";
        array["RSHE"]="5th Penalty Shootout";
        array["RSHF"]="6th Penalty Shootout";
        array["RSHG"]="7th Penalty Shootout";
        array["RSHH"]="8th Penalty Shootout";
        array["RSHI"]="9th Penalty Shootout";
        array["RSHJ"]="10th Penalty Shootout";
        array["RSHK"]="11th Penalty Shootout";
        array["RSHL"]="12th Penalty Shootout";
        array["RSHM"]="13th Penalty Shootout";
        array["RSHN"]="14th Penalty Shootout";
        array["RSHO"]="15th Penalty Shootout";
        array["RPF"]="Finishing Round";
        array["RNC1"]="1st Corner";
        array["RNC2"]="2nd Corner";
        array["RNC3"]="3rd Corner";
        array["RNC4"]="4th Corner";
        array["RNC5"]="5th Corner";
        array["RNC6"]="6th Corner";
        array["RNC7"]="7th Corner";
        array["RNC8"]="8th Corner";
        array["RNC9"]="9th Corner";
        array["RNCA"]="10th Corner";
        array["RNCB"]="11th Corner";
        array["RNCC"]="12th Corner";
        array["RNCD"]="13th Corner";
        array["RNCE"]="14th Corner";
        array["RNCF"]="15th Corner";
        array["RNCG"]="16th Corner";
        array["RNCH"]="17th Corner";
        array["RNCI"]="18th Corner";
        array["RNCJ"]="19th Corner";
        array["RNCK"]="20th Corner";
        array["RNCL"]="21th Corner";
        array["RNCM"]="22th Corner";
        array["RNCN"]="23th Corner";
        array["RNCO"]="24th Corner";
        array["RNCP"]="25th Corner";
        array["RNCQ"]="26th Corner";
        array["RNCR"]="27th Corner";
        array["RNCS"]="28th Corner";
        array["RNCT"]="29th Corner";
        array["RNCU"]="30th Corner";
        array["RNBA"]="1st Booking";
        array["RNBB"]="2nd Booking";
        array["RNBC"]="3rd Booking";
        array["RNBD"]="4th Booking";
        array["RNBE"]="5th Booking";
        array["RNBF"]="6th Booking";
        array["RNBG"]="7th Booking";
        array["RNBH"]="8th Booking";
        array["RNBI"]="9th Booking";
        array["RNBJ"]="10th Booking";
        array["RNBK"]="11th Booking";
        array["RNBL"]="12th Booking";
        array["RNBM"]="13th Booking";
        array["RNBN"]="14th Booking";
        array["RNBO"]="15th Booking";

        array["F01"] = "Frame 1";
        array["F02"] = "Frame 2";
        array["F03"] = "Frame 3";
        array["F04"] = "Frame 4";
        array["F05"] = "Frame 5";
        array["F06"] = "Frame 6";
        array["F07"] = "Frame 7";
        array["F08"] = "Frame 8";
        array["F09"] = "Frame 9";
        array["F10"] = "Frame 10";
        array["F11"] = "Frame 11";
        array["F12"] = "Frame 12";
        array["F13"] = "Frame 13";
        array["F14"] = "Frame 14";
        array["F15"] = "Frame 15";
        array["F16"] = "Frame 16";
        array["F17"] = "Frame 17";
        array["F18"] = "Frame 18";
        array["F19"] = "Frame 19";
        array["F20"] = "Frame 20";
        array["F21"] = "Frame 21";
        array["F22"] = "Frame 22";
        array["F23"] = "Frame 23";
        array["F24"] = "Frame 24";
        array["F25"] = "Frame 25";
        array["F26"] = "Frame 26";
        array["F27"] = "Frame 27";
        array["F28"] = "Frame 28";
        array["F29"] = "Frame 29";
        array["F30"] = "Frame 30";
        array["F31"] = "Frame 31";
        array["F32"] = "Frame 32";
        array["F33"] = "Frame 33";
        array["F34"] = "Frame 34";
        array["F35"] = "Frame 35";

        array["RFA01"] = "Game 1";
        array["RFA02"] = "Game 2";
        array["RFA03"] = "Game 3";
        array["RFA04"] = "Game 4";
        array["RFA05"] = "Game 5";
        array["RFA06"] = "Game 6";
        array["RFA07"] = "Game 7";
        array["RFA08"] = "Game 8";
        array["RFA09"] = "Game 9";
        array["RFA10"] = "Game 10";
        array["RFA11"] = "Game 11";
        array["RFA12"] = "Game 12";
        array["RFA13"] = "Game 13";

        array["RFB01"] = "Game 1";
        array["RFB02"] = "Game 2";
        array["RFB03"] = "Game 3";
        array["RFB04"] = "Game 4";
        array["RFB05"] = "Game 5";
        array["RFB06"] = "Game 6";
        array["RFB07"] = "Game 7";
        array["RFB08"] = "Game 8";
        array["RFB09"] = "Game 9";
        array["RFB10"] = "Game 10";
        array["RFB11"] = "Game 11";
        array["RFB12"] = "Game 12";
        array["RFB13"] = "Game 13";

        array["RFC01"] = "Game 1";
        array["RFC02"] = "Game 2";
        array["RFC03"] = "Game 3";
        array["RFC04"] = "Game 4";
        array["RFC05"] = "Game 5";
        array["RFC06"] = "Game 6";
        array["RFC07"] = "Game 7";
        array["RFC08"] = "Game 8";
        array["RFC09"] = "Game 9";
        array["RFC10"] = "Game 10";
        array["RFC11"] = "Game 11";
        array["RFC12"] = "Game 12";
        array["RFC13"] = "Game 13";
        array["RFC14"] = "Game 14";
        array["RFC15"] = "Game 15";
        array["RFC16"] = "Game 16";
        array["RFC17"] = "Game 17";
        array["RFC18"] = "Game 18";
        array["RFC19"] = "Game 19";
        array["RFC20"] = "Game 20";
        array["RFC21"] = "Game 21";
        array["RFC22"] = "Game 22";
        array["RFC23"] = "Game 23";
        array["RFC24"] = "Game 24";
        array["RFC25"] = "Game 25";
        array["RFC26"] = "Game 26";
        array["RFC27"] = "Game 27";
        array["RFC28"] = "Game 28";
        array["RFC29"] = "Game 29";
        array["RFC30"] = "Game 30";
        array["RFC31"] = "Game 31";
        array["RFC32"] = "Game 32";
        array["RFC33"] = "Game 33";
        array["RFC34"] = "Game 34";
        array["RFC35"] = "Game 35";
        array["RFC36"] = "Game 36";
        array["RFC37"] = "Game 37";
        array["RFC38"] = "Game 38";
        array["RFC39"] = "Game 39";
        array["RFC40"] = "Game 40";
        array["RFC41"] = "Game 41";
        array["RFC42"] = "Game 42";
        array["RFC43"] = "Game 43";
        array["RFC44"] = "Game 44";
        array["RFC45"] = "Game 45";
        array["RFC46"] = "Game 46";
        array["RFC47"] = "Game 47";
        array["RFC48"] = "Game 48";
        array["RFC49"] = "Game 49";
        array["RFC50"] = "Game 50";

        array["RFD01"] = "Game 1";
        array["RFD02"] = "Game 2";
        array["RFD03"] = "Game 3";
        array["RFD04"] = "Game 4";
        array["RFD05"] = "Game 5";
        array["RFD06"] = "Game 6";
        array["RFD07"] = "Game 7";
        array["RFD08"] = "Game 8";
        array["RFD09"] = "Game 9";
        array["RFD10"] = "Game 10";
        array["RFD11"] = "Game 11";
        array["RFD12"] = "Game 12";
        array["RFD13"] = "Game 13";

        array["RFE01"] = "Game 1";
        array["RFE02"] = "Game 2";
        array["RFE03"] = "Game 3";
        array["RFE04"] = "Game 4";
        array["RFE05"] = "Game 5";
        array["RFE06"] = "Game 6";
        array["RFE07"] = "Game 7";
        array["RFE08"] = "Game 8";
        array["RFE09"] = "Game 9";
        array["RFE10"] = "Game 10";
        array["RFE11"] = "Game 11";
        array["RFE12"] = "Game 12";
        array["RFE13"] = "Game 13";
        array["RFE14"] = "Game 14";
        array["RFE15"] = "Game 15";
        array["RFE16"] = "Game 16";
        array["RFE17"] = "Game 17";
        array["RFE18"] = "Game 18";
        array["RFE19"] = "Game 19";
        array["RFE20"] = "Game 20";
        array["RFE21"] = "Game 21";
        array["RFE22"] = "Game 22";
        array["RFE23"] = "Game 23";
        array["RFE24"] = "Game 24";
        array["RFE25"] = "Game 25";
        array["RFE26"] = "Game 26";
        array["RFE27"] = "Game 27";
        array["RFE28"] = "Game 28";
        array["RFE29"] = "Game 29";
        array["RFE30"] = "Game 30";
        array["RFE31"] = "Game 31";
        array["RFE32"] = "Game 32";
        array["RFE33"] = "Game 33";
        array["RFE34"] = "Game 34";
        array["RFE35"] = "Game 35";
        array["RFE36"] = "Game 36";
        array["RFE37"] = "Game 37";
        array["RFE38"] = "Game 38";
        array["RFE39"] = "Game 39";
        array["RFE40"] = "Game 40";
        array["RFE41"] = "Game 41";
        array["RFE42"] = "Game 42";
        array["RFE43"] = "Game 43";
        array["RFE44"] = "Game 44";
        array["RFE45"] = "Game 45";
        array["RFE46"] = "Game 46";
        array["RFE47"] = "Game 47";
        array["RFE48"] = "Game 48";
        array["RFE49"] = "Game 49";
        array["RFE50"] = "Game 50";

        // basketball
        array["str_BK_0"] ="1st Quarter";
        array["str_BK_1"] ="2nd Quarter";
        array["str_BK_2"] ="3rd Quarter";
        array["str_BK_3"] ="4th Quarter";
        array["str_BK_4"] ="1st Half";
        array["str_BK_5"] ="2nd Half";
        array["str_BK_6"] ="Extra Time";
        array["str_BK_7"] ="Full Time";

        // tennis game
        array["str_TN_game_1"] = "SET 1";
        array["str_TN_game_2"] = "SET 2";
        array["str_TN_game_3"] = "SET 3";
        array["str_TN_game_4"] = "SET 4";
        array["str_TN_game_5"] = "SET 5";

        // tennis overall result
        array["str_TN_0"] = "1st Set";
        array["str_TN_1"] = "2nd Set";
        array["str_TN_2"] = "3rd Set";
        array["str_TN_3"] = "4th Set";
        array["str_TN_4"] = "5th Set";
        array["str_TN_5"] = "Game Handicap";
        array["str_TN_6"] = "Player Games Over / Under";
        array["str_TN_7"] = "Final";

        // volleyball
        array["str_VB_0"] = "1st Set";
        array["str_VB_1"] = "2nd Set";
        array["str_VB_2"] = "3rd Set";
        array["str_VB_3"] = "4th Set";
        array["str_VB_4"] = "5th Set";
        array["str_VB_5"] = "6th Set";
        array["str_VB_6"] = "7th Set";
        array["str_VB_7"] = "Point Handicap";
        array["str_VB_8"] = "Final"

        //  badminton tabletennis
        array["str_BMTT_0"] = "1st Game";
        array["str_BMTT_1"] = "2nd Game";
        array["str_BMTT_2"] = "3rd Game";
        array["str_BMTT_3"] = "4th Game";
        array["str_BMTT_4"] = "5th Game";
        array["str_BMTT_5"] = "6th Game";
        array["str_BMTT_6"] = "7th Game";
        array["str_BMTT_7"] = "Point Handicap";
        array["str_BMTT_8"] = "Player Points Over / Under";
        array["str_BMTT_9"] = "Final"

        //baseball
        array["str_BS_Y"] = "YES";
        array["str_BS_N"] = "NO";
        array["str_BS_0"] = "1st 5 Innings";
        array["str_BS_1"] = "Full Time";

        //shooker
        array["str_SK_0"] = "Frames 1 - 5";
        array["str_SK_1"] = "Frames 6 - 8";
        array["str_SK_2"] = "Frames 10 - 14";
        array["str_SK_3"] = "Frames 15 - 17";
        array["str_SK_4"] = "Frames 19 - 23";
        array["str_SK_5"] = "Frames 24 - 26";
        array["str_SK_6"] = "Full Time";
        // totalBets result detail end

        //過濾器
        array["str_ALL"] = "All Sports";
        array["str_FT"] = "Soccer";
        array["str_BK"] = "Basketball / American Football";
        array["str_TN"] = "Tennis";
        array["str_VB"] = "Volleyball";
        array["str_BM"] = "Badminton";
        array["str_TT"] = "Table Tennis";
        array["str_BS"] = "Baseball";
        array["str_SK"] = "Snooker";
        array["str_OP"] = "Other Sports";
        array["str_SFS"] = "S Outright";
        array["str_FS"] = "Outright";

        array["str_wmc_ALL"] = "All";
        array["str_wmc_FT"] = array["str_FT"];
        array["str_wmc_BK"] = array["str_BK"];
        array["str_wmc_TN"] = array["str_TN"];
        array["str_wmc_VB"] = array["str_VB"];
        array["str_wmc_BM"] = array["str_BM"];
        array["str_wmc_TT"] = array["str_TT"];
        array["str_wmc_BS"] = array["str_BS"];
        array["str_wmc_SK"] = array["str_SK"];
        array["str_wmc_OP"] = array["str_OP"];
        array["str_wmc_SFS"] =array["str_SFS"];
        array["str_wmc_FS"] = array["str_FS"];

        array["btns_gtype"] = "SPORTS";
        array["btns_stake"] = "STAKE";
        array["btns_view"] = "VIEW";
        array["btns_downline"] = "DOWNLINE";
        array["btns_league"] = "LEAGUE";
        array["btns_datestarted"] = "DATE";
        array["btns_market"] = "MARKET";
        array["btns_eventdate"] = "EVENT DATE";
        array["btns_class"] = "CLASS";
        array["btns_dateoutright"] = "DATE";
        array["btns_date"] = "DATE";
        array["btns_dateresult"] = "DATE";
        array["btns_event"] = "EVENT";
        array["btns_bettype"] = "BET TYPE";
        array["btns_site"] = "SITE";

        array["str_market_ALL"] = "All Market";
        array["str_market_rb"] = "In-Play";
        array["str_market_ft"] = "Today";
        array["str_market_fu"] = "Early";

        array["str_wmc_market_ALL"] ="All";
        array["str_wmc_market_rb"] = array["str_market_rb"];
        array["str_wmc_market_ft"] = array["str_market_ft"];
        array["str_wmc_market_fu"] = array["str_market_fu"];

        array["filter_view_full"] = "Full Percentage";
        array["filter_view_com"] = "Company %" ;
        array["filter_view_c"] = "SMA %" ;
        array["filter_view_s"] = "MA %" ;
        array["filter_view_a"] = "Agent %" ;
        array["filter_view_csa"] = "SMA + MA + Agent %" ;
        array["filter_view_cs"] = "SMA + MA %" ;
        array["filter_view_sa"] = "MA + Agent %" ;
        array["filter_view_my"] = "My Percentage";

        array["filter_date_yesterday"] = "Yesterday";
        array["filter_date_today"] = "Today";
        array["filter_date_future"] = "Future";
        array["filter_date_all"] = "All";
        array["filter_date_show"] = "Dates";

        array["filter_downline_show"] = "Downline";
        array["filter_league_show"] = "League";
        array["filter_market_show"] = "Market";

        array["filter_err_downline_max"] = "You may select a maximum of *LIMITCOUNT* accounts at a time";

        array["filter_market_all"] = "All";
        array["filter_market_rb"] = "In-Play only";
        array["filter_market_pl"] = "Pre-Start only";

        array["filter_more"] = ">";
		array["filter_less"] = "<";
		array["filter_same"] = "=";

        array["str_day"] = "Day";

        array["CancelType0"]  = "Result";
        array["CancelType-1"]  = "Match Cancelled";
        array["CancelType-2"]  = "Wrong Team Name";
        array["CancelType-3"]  = "Postponed";
        array["CancelType-4"]  = "Irregular Event Time";
        array["CancelType-5"]  = "Suspended";
        array["CancelType-6"]  = "Retirement";
        array["CancelType-7"]  = "Wrong Home / away";
        array["CancelType-8"]  = "Wrong League Name";
        array["CancelType-9"]  = "No PK / Extra Time";
        array["CancelType-10"] = "Fixture Event Error";
        array["CancelType-11"] = "Invisible Match";
        array["CancelType-12"] = "Cancel";
        array["CancelType-13"] = "Suspended";
        array["CancelType-14"] = "No Set";
        array["CancelType_SK-14"] = "No Frame";




        //Ricky 2018-03-06 PJB-188 CRM-249網球下一局獨贏
        array["title_RFA01_0_TN"] = "Money Line - Set 1 Game 1";
        array["title_RFA02_0_TN"] = "Money Line - Set 1 Game 2";
        array["title_RFA03_0_TN"] = "Money Line - Set 1 Game 3";
        array["title_RFA04_0_TN"] = "Money Line - Set 1 Game 4";
        array["title_RFA05_0_TN"] = "Money Line - Set 1 Game 5";
        array["title_RFA06_0_TN"] = "Money Line - Set 1 Game 6";
        array["title_RFA07_0_TN"] = "Money Line - Set 1 Game 7";
        array["title_RFA08_0_TN"] = "Money Line - Set 1 Game 8";
        array["title_RFA09_0_TN"] = "Money Line - Set 1 Game 9";
        array["title_RFA10_0_TN"] = "Money Line - Set 1 Game 10";
        array["title_RFA11_0_TN"] = "Money Line - Set 1 Game 11";
        array["title_RFA12_0_TN"] = "Money Line - Set 1 Game 12";
        array["title_RFA13_0_TN"] = "Money Line - Set 1 Game 13";
        array["title_RFB01_0_TN"] = "Money Line - Set 2 Game 1";
        array["title_RFB02_0_TN"] = "Money Line - Set 2 Game 2";
        array["title_RFB03_0_TN"] = "Money Line - Set 2 Game 3";
        array["title_RFB04_0_TN"] = "Money Line - Set 2 Game 4";
        array["title_RFB05_0_TN"] = "Money Line - Set 2 Game 5";
        array["title_RFB06_0_TN"] = "Money Line - Set 2 Game 6";
        array["title_RFB07_0_TN"] = "Money Line - Set 2 Game 7";
        array["title_RFB08_0_TN"] = "Money Line - Set 2 Game 8";
        array["title_RFB09_0_TN"] = "Money Line - Set 2 Game 9";
        array["title_RFB10_0_TN"] = "Money Line - Set 2 Game 10";
        array["title_RFB11_0_TN"] = "Money Line - Set 2 Game 11";
        array["title_RFB12_0_TN"] = "Money Line - Set 2 Game 12";
        array["title_RFB13_0_TN"] = "Money Line - Set 2 Game 13";
        array["title_RFC01_0_TN"] = "Money Line - Set 3 Game 1";
        array["title_RFC02_0_TN"] = "Money Line - Set 3 Game 2";
        array["title_RFC03_0_TN"] = "Money Line - Set 3 Game 3";
        array["title_RFC04_0_TN"] = "Money Line - Set 3 Game 4";
        array["title_RFC05_0_TN"] = "Money Line - Set 3 Game 5";
        array["title_RFC06_0_TN"] = "Money Line - Set 3 Game 6";
        array["title_RFC07_0_TN"] = "Money Line - Set 3 Game 7";
        array["title_RFC08_0_TN"] = "Money Line - Set 3 Game 8";
        array["title_RFC09_0_TN"] = "Money Line - Set 3 Game 9";
        array["title_RFC10_0_TN"] = "Money Line - Set 3 Game 10";
        array["title_RFC11_0_TN"] = "Money Line - Set 3 Game 11";
        array["title_RFC12_0_TN"] = "Money Line - Set 3 Game 12";
        array["title_RFC13_0_TN"] = "Money Line - Set 3 Game 13";
        array["title_RFC14_0_TN"] = "Money Line - Set 3 Game 14";
        array["title_RFC15_0_TN"] = "Money Line - Set 3 Game 15";
        array["title_RFC16_0_TN"] = "Money Line - Set 3 Game 16";
        array["title_RFC17_0_TN"] = "Money Line - Set 3 Game 17";
        array["title_RFC18_0_TN"] = "Money Line - Set 3 Game 18";
        array["title_RFC19_0_TN"] = "Money Line - Set 3 Game 19";
        array["title_RFC20_0_TN"] = "Money Line - Set 3 Game 20";
        array["title_RFC21_0_TN"] = "Money Line - Set 3 Game 21";
        array["title_RFC22_0_TN"] = "Money Line - Set 3 Game 22";
        array["title_RFC23_0_TN"] = "Money Line - Set 3 Game 23";
        array["title_RFC24_0_TN"] = "Money Line - Set 3 Game 24";
        array["title_RFC25_0_TN"] = "Money Line - Set 3 Game 25";
        array["title_RFC26_0_TN"] = "Money Line - Set 3 Game 26";
        array["title_RFC27_0_TN"] = "Money Line - Set 3 Game 27";
        array["title_RFC28_0_TN"] = "Money Line - Set 3 Game 28";
        array["title_RFC29_0_TN"] = "Money Line - Set 3 Game 29";
        array["title_RFC30_0_TN"] = "Money Line - Set 3 Game 30";
        array["title_RFC31_0_TN"] = "Money Line - Set 3 Game 31";
        array["title_RFC32_0_TN"] = "Money Line - Set 3 Game 32";
        array["title_RFC33_0_TN"] = "Money Line - Set 3 Game 33";
        array["title_RFC34_0_TN"] = "Money Line - Set 3 Game 34";
        array["title_RFC35_0_TN"] = "Money Line - Set 3 Game 35";
        array["title_RFC36_0_TN"] = "Money Line - Set 3 Game 36";
        array["title_RFC37_0_TN"] = "Money Line - Set 3 Game 37";
        array["title_RFC38_0_TN"] = "Money Line - Set 3 Game 38";
        array["title_RFC39_0_TN"] = "Money Line - Set 3 Game 39";
        array["title_RFC40_0_TN"] = "Money Line - Set 3 Game 40";
        array["title_RFC41_0_TN"] = "Money Line - Set 3 Game 41";
        array["title_RFC42_0_TN"] = "Money Line - Set 3 Game 42";
        array["title_RFC43_0_TN"] = "Money Line - Set 3 Game 43";
        array["title_RFC44_0_TN"] = "Money Line - Set 3 Game 44";
        array["title_RFC45_0_TN"] = "Money Line - Set 3 Game 45";
        array["title_RFC46_0_TN"] = "Money Line - Set 3 Game 46";
        array["title_RFC47_0_TN"] = "Money Line - Set 3 Game 47";
        array["title_RFC48_0_TN"] = "Money Line - Set 3 Game 48";
        array["title_RFC49_0_TN"] = "Money Line - Set 3 Game 49";
        array["title_RFC50_0_TN"] = "Money Line - Set 3 Game 50";
        array["title_RFD01_0_TN"] = "Money Line - Set 4 Game 1";
        array["title_RFD02_0_TN"] = "Money Line - Set 4 Game 2";
        array["title_RFD03_0_TN"] = "Money Line - Set 4 Game 3";
        array["title_RFD04_0_TN"] = "Money Line - Set 4 Game 4";
        array["title_RFD05_0_TN"] = "Money Line - Set 4 Game 5";
        array["title_RFD06_0_TN"] = "Money Line - Set 4 Game 6";
        array["title_RFD07_0_TN"] = "Money Line - Set 4 Game 7";
        array["title_RFD08_0_TN"] = "Money Line - Set 4 Game 8";
        array["title_RFD09_0_TN"] = "Money Line - Set 4 Game 9";
        array["title_RFD10_0_TN"] = "Money Line - Set 4 Game 10";
        array["title_RFD11_0_TN"] = "Money Line - Set 4 Game 11";
        array["title_RFD12_0_TN"] = "Money Line - Set 4 Game 12";
        array["title_RFD13_0_TN"] = "Money Line - Set 4 Game 13";
        array["title_RFE01_0_TN"] = "Money Line - Set 5 Game 1";
        array["title_RFE02_0_TN"] = "Money Line - Set 5 Game 2";
        array["title_RFE03_0_TN"] = "Money Line - Set 5 Game 3";
        array["title_RFE04_0_TN"] = "Money Line - Set 5 Game 4";
        array["title_RFE05_0_TN"] = "Money Line - Set 5 Game 5";
        array["title_RFE06_0_TN"] = "Money Line - Set 5 Game 6";
        array["title_RFE07_0_TN"] = "Money Line - Set 5 Game 7";
        array["title_RFE08_0_TN"] = "Money Line - Set 5 Game 8";
        array["title_RFE09_0_TN"] = "Money Line - Set 5 Game 9";
        array["title_RFE10_0_TN"] = "Money Line - Set 5 Game 10";
        array["title_RFE11_0_TN"] = "Money Line - Set 5 Game 11";
        array["title_RFE12_0_TN"] = "Money Line - Set 5 Game 12";
        array["title_RFE13_0_TN"] = "Money Line - Set 5 Game 13";
        array["title_RFE14_0_TN"] = "Money Line - Set 5 Game 14";
        array["title_RFE15_0_TN"] = "Money Line - Set 5 Game 15";
        array["title_RFE16_0_TN"] = "Money Line - Set 5 Game 16";
        array["title_RFE17_0_TN"] = "Money Line - Set 5 Game 17";
        array["title_RFE18_0_TN"] = "Money Line - Set 5 Game 18";
        array["title_RFE19_0_TN"] = "Money Line - Set 5 Game 19";
        array["title_RFE20_0_TN"] = "Money Line - Set 5 Game 20";
        array["title_RFE21_0_TN"] = "Money Line - Set 5 Game 21";
        array["title_RFE22_0_TN"] = "Money Line - Set 5 Game 22";
        array["title_RFE23_0_TN"] = "Money Line - Set 5 Game 23";
        array["title_RFE24_0_TN"] = "Money Line - Set 5 Game 24";
        array["title_RFE25_0_TN"] = "Money Line - Set 5 Game 25";
        array["title_RFE26_0_TN"] = "Money Line - Set 5 Game 26";
        array["title_RFE27_0_TN"] = "Money Line - Set 5 Game 27";
        array["title_RFE28_0_TN"] = "Money Line - Set 5 Game 28";
        array["title_RFE29_0_TN"] = "Money Line - Set 5 Game 29";
        array["title_RFE30_0_TN"] = "Money Line - Set 5 Game 30";
        array["title_RFE31_0_TN"] = "Money Line - Set 5 Game 31";
        array["title_RFE32_0_TN"] = "Money Line - Set 5 Game 32";
        array["title_RFE33_0_TN"] = "Money Line - Set 5 Game 33";
        array["title_RFE34_0_TN"] = "Money Line - Set 5 Game 34";
        array["title_RFE35_0_TN"] = "Money Line - Set 5 Game 35";
        array["title_RFE36_0_TN"] = "Money Line - Set 5 Game 36";
        array["title_RFE37_0_TN"] = "Money Line - Set 5 Game 37";
        array["title_RFE38_0_TN"] = "Money Line - Set 5 Game 38";
        array["title_RFE39_0_TN"] = "Money Line - Set 5 Game 39";
        array["title_RFE40_0_TN"] = "Money Line - Set 5 Game 40";
        array["title_RFE41_0_TN"] = "Money Line - Set 5 Game 41";
        array["title_RFE42_0_TN"] = "Money Line - Set 5 Game 42";
        array["title_RFE43_0_TN"] = "Money Line - Set 5 Game 43";
        array["title_RFE44_0_TN"] = "Money Line - Set 5 Game 44";
        array["title_RFE45_0_TN"] = "Money Line - Set 5 Game 45";
        array["title_RFE46_0_TN"] = "Money Line - Set 5 Game 46";
        array["title_RFE47_0_TN"] = "Money Line - Set 5 Game 47";
        array["title_RFE48_0_TN"] = "Money Line - Set 5 Game 48";
        array["title_RFE49_0_TN"] = "Money Line - Set 5 Game 49";
        array["title_RFE50_0_TN"] = "Money Line - Set 5 Game 50";

        array["HT"] = "HT";
        array["1H"] = "1H";
        array["2H"] = "2H";
        array["BK_HT"] = "1st Half";
        array["BK_H2"] = "2nd Half";
        array["BK_Q1"] = "Q1";
        array["BK_Q2"] = "Q2";
        array["BK_Q3"] = "Q3";
        array["BK_Q4"] = "Q4";
        array["BK_OT"] = "OT";
        array["BK_half_time"] = "Half Time";

        array["BK_HT_allbet"] = "1st Half";
        array["BK_H2_allbet"] = "2nd Half";
        array["BK_Q1_allbet"] = "Q1";
        array["BK_Q2_allbet"] = "Q2";
        array["BK_Q3_allbet"] = "Q3";
        array["BK_Q4_allbet"] = "Q4";
        array["BK_OT_allbet"] = "OT";
        array["BK_half_time_allbet"] = "Half Time";

        array["Best_of_3"] = "Best of 3";
        array["Best_of_5"] = "Best of 5";
        array["Best_of_7"] = "Best of 7";
        array["Best_of_12"] = "Best of 12";

        array["midfield"] = "N";
        array["live"] = "live";


        return array;
    }

    _self.get = function (_key) {
        // if(LangxAry[_key]==null)return _key;
        return LangxAry[_key];
    }

}
