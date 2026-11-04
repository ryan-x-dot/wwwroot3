function LS_tw(){
    var _self = this;
    var parentClass;
    var LangxAry;

    _self.init=function(){
        LangxAry = _self.set();
    }

    _self.set=function(){
        var array = new Object();
        array["loading_txt"] = "加載中";
        array["page_dashboard"] = "首頁";
        array["page_report"] = "報表";
        array["page_totalbet"] = "即時注單";
        array["page_set"] = "有結果";
        array["page_un"] = "未有結果";
        array["page_summary"] = "賽事結果概要";
        array["page_period"] = "月帳期數表";//Accounting Period
        array["page_exchange"] = "匯率";
        array["page_cancel"] = "取消單";
        array["page_cancel"] = "取消單";
        array["page_quicksearch"] = "快速搜索";
        array["page_onlinemem"] = "線上會員";
        array["page_mysetting"] = "我的設定";
        array["page_myactivities"] = "我的活動記錄";
        array["page_feature"] = "特色";
        array["page_requirements"] = "系統需求";
        array["page_newurl"] = "最新網址";
        array["page_contactus"] = "聯繫我們";
        array["page_pwd_recovery"] = "密碼恢復";
        array["page_chg_pwd_inside"] = "更改密碼";
	    array["page_problem_accounts"] = "問題帳號";
        array["page_announcement"] = "公告";
        array["page_account"] = "帳戶管理";//A/C Mgmt
        array["page_sub"] = "子帳號";
        array["page_su_add"] = "新增總代理";
        array["page_ag_add"] = "新增代理";
        array["page_mem_add"] = "新增會員";
        array["page_sub_add"] = "新增子帳號";//New Sub Agent

        array["str_copied"] = "資料已複製";

        array["page_overview"] = "總覽";
        array["page_INPLAY"] = "滾球";
        array["page_TODAY"] = "今日";
        array["page_EARLY"] = "早盤";
        array["page_STARTED"] = "已開賽";
        array["page_PARLAY"] = "過關";
        array["page_OUTRIGHT"] = "冠軍";
        array["page_RESULTS"] = "賽果";

        //new_url Start
        array["newcro666"] = "會員端";
        array["phcro666"] = "手機會員端";
        array["newagcro666"] = "管理端";//New Manager Site
        array["agphonecro666"] = "手機管理端";
        array["acc"] = "舊帳";
        //new_url End
        //恢復密碼
        array["0X001"] = "參數錯誤";
        array["4X001"] = "IP不合法";
        array["4X002"] = "帳號停用";
        array["4X003"] = "帳號禁止登入";
        array["4X004"] = "密碼錯誤多次被鎖";
        array["4X005"] = "帳密不正確";
        array["4X006"] = "三分鐘後再試";
        array["4X007"] = "未設定email";
        array["4X025"] = "此功能暫時已被禁用，請聯繫您的上線。";
        array["4X026"] = "驗證碼發送次數過多，系統暫時不能接受申請，請檢查您的資料是否正確。";
        array["4X027"] = "連不到MailServer";
        array["4X028"] = "MailServer發送驗證碼失敗";
        array["4O005"] = "驗證碼已發送到您的電子郵件";
        array["4O006"] = "已成功註冊";
        array["get_mail_canceal"] = "請輸入有效的電子郵件";//Please enter a valid email address
        array["input_verify_cancel"] = "取消密碼恢復？";
        array["remove_email"] = "密碼恢復電子郵件已被刪除";
        array["remove_email_message"] = "刪除密碼恢復電郵？";

        array["enable_Y"] = "啓用";
        array["enable_N"] = "停用";
        array["enable_S"] = "只能看帳";
        array["enable_F"] = "禁止登入";
        array["input_acc"] = "請輸入帳號";//Enter User Code

        //額度模式
        array["pay_type_0"] = "自動恢復";
        array["pay_type_1"] = "餘額浮動";
        array["long_pay_type_0"] = "自動恢復";
        array["long_pay_type_1"] = "餘額浮動";

        array["str_co"] = "股東";//Corprator
        array["str_su"] = "總代理";//Agency
        array["str_ag"] = "代理商";
        array["str_mem"] = "會員";

        array["str_co_sub"] = "股東 子帳號";//Corprator
        array["str_su_sub"] = "總代理 子帳號";//Agency
        array["str_ag_sub"] = "代理商 子帳號";

        array["str_ags"] = "代理";//Agents
        array["str_mems"] = "會員";//Members

        //帳戶新增修改
        array["max_limit_head"] = "最高: "//最大限額字串 Max: RMB 1,100,000
        array["empty_user"] = "此處不能留空"; //帳號請務必輸入
        array["empty_alias"] = "此處不能留空"; //名稱請務必輸入
        array["empty_passwd"] = "此處不能留空"; //請輸入新密碼
        array["empty_confirm"] = "此處不能留空"; //請輸入新密碼
        array["empty_credit"] = "此處不能留空"; //總信用額度請務必輸入
        array["empty_safe"] = "此處不能留空";
        array["empty_enddate"] = "此處不能留空";
        array["empty_enddate1"] = "此處日期格式不正確";
        array["str_confirm_add_su"] = "是否確定寫入總代理"; //是否確定寫入總代理
        array["str_confirm_add_ag"] = "是否確定寫入代理商";//是否確定寫入代理商
        array["str_confirm_add_mem"] = "是否確定寫入會員資料";//是否確定寫入會員資料
        array["credit_over"] = "您輸入的額度大於剩餘額度，請重新輸入.";
        array["user_limit"] = "帳號至少四個字元長.";
        array["user_manage"] = "你沒有勾選 ‘管理帳號’，請勾選其中一個或是全選。";
        array["cash_sw_in_edit_user"] = "因未知原因，系統暫時停止修改額度功能，請稍後再試。";
        array["cash_sw_in_add_user"] = "功能未開放使用，我們將在短期內完成測試並開放功能。";

        array["add_account_success"] = "新增帳戶成功";
        array["copy_success"] = "登入帳號和密碼已複製到剪貼板";
        array["copy_user"] = "帳號：";
        array["copy_pwd"] = "密碼：";
        array["winloss_percent"] = "%";
        //array["su_ag_winloss_error"] = "股東及總代理及代理商的成數總和須在 5 - 8 成內 , 請重新設定 !!";//股東及總代理及代理商的成數總和須在 5 - 8 成內 , 請重新設定 !!
        array["su_ag_winloss_error"] = "成數總和必须要xx% - yy%内， 請重新設定。";
        array["su_ag_winloss8_error"] = "成數總和必須要xx％， 請重新設定。";
        array["status_update"] = "更改帳戶狀態成功";
        array["credit_update"] = "更改信用額度成功";
        array["account_copy"] = "複製";

        //子帳號
        array["max_sub3"] = "已超過可使用子帳戶限制, 無法新增子帳戶。";
        array["sub_mlimit"] = "您最多可選";//You may select maximum of
        array["sub_mlimit2"] = "個帳號。";//accounts at a time.
        array["listsub_safe"] = "安全代碼";
        array["listsub_safe_ag"] = "登入帳號";


        //修改成數
        array["str_possess_down"] = "最低可設";
        array["str_possess_up"] = "最高可設";
        array["str_possess_allowed"] = "可設";//Allowed:
        array["RMB"] = "人民幣";

        //密碼強度
        array["pwd_Very Weak"] = "非常弱";
        array["pwd_Weak"] = "弱";
        array["pwd_Fair"] = "一般";
        array["pwd_Good"] = "好";
        array["pwd_Strong"] = "強";

        //破解時間
        array["pwd_break_Seconds"] = "秒";
        array["pwd_break_Minutes"] = "分鐘";
        array["pwd_break_Hours"] = "小時";
        array["pwd_break_Days"] = "天";
        array["pwd_break_Months"] = "個月";
        array["pwd_break_Years"] = "年";
        array["pwd_break_Centuries"] = "世紀";

        array["pwd_TRILLION"] = "兆";
        array["pwd_100_BILLION"] = "千億";
        array["pwd_10_BILLION"] = "百億";
        array["pwd_BILLION"] = "十億";
        array["pwd_100_MILLION"] = "億";
        array["pwd_10_MILLION"] = "千萬";
        array["pwd_MILLION"] = "百萬";
        array["pwd_100_THOUSAND"] = "十萬";
        array["pwd_10_THOUSAND"] = "萬";
        array["pwd_THOUSAND"] = "千";
        array["pwd_HUNDRED"] = "百";

        //信用額度
        array["str_maxcre"] = "總信用額度僅能輸入數字";
        array["str_maxcre_zero"] = "信用額度不可為0";//0 is not a valid value.
        array["str_maxcre_zero1"] = "請輸入大於 0 的信用額度";//Credit limit should be greater than 0.
        array["str_edit_credit_confirm"] = "是否確定修改信用額度?";//Make sure to modify the credit limit?

        // array["empty_credit"] = "總信用額度請務必輸入"; //總信用額度請務必輸入
        array["empty_credit"] = "此處不能留空";
        array["str_maxcre_zero"] = "信用額度不可為 0";//0 is not a valid value.
        array["str_maxcre_zero1"] = "請輸入大於 0 的信用額度";//Credit limit should be greater than 0
        array["str_maxcre"] = "總信用額度僅能輸入數字";//Credit Limit only accept numbers.

        array["sub_selMax"] = "可管理帳號的權限已達最大使用數。請聯絡您的上線移除已暫停使用的帳號";//You have exceeded the number of ‘Managed Accounts’ allowed.  Please contact your upline to remove inactive accounts.
        //快速搜尋
        //2019-03-28 Ricky 248.登一帳號-Quick Search快速搜尋-sub account，level(層級)幫改為SMA，目前秀錯字Corprator
        //array["layer_type_name_corprator"] = "Corprator";
        array["layer_type_name_corprator"] = "股東";//SMA
        array["layer_type_name_super_agents"] = "總代理";
        array["layer_type_name_agents"] = "代理商";
        array["layer_type_name_members"] = "會員";
        array["enable_str_Active"] = "啓用";
        array["enable_str_Suspended"] = "禁止登入";
        array["enable_str_ViewOnly"] = "只能看帳";
        array["enable_str_Inactive"] = "停用";
        array["layer_type_name_subAccount"] = "子帳號";//Sub Account
        //我的紀錄
        // array["myAct_str_Create_Account"] = "啓用";
        array["myAct_str_Create_Account"] = "新增帳號";
        array["myAct_str_Password_Reset"] = "更改密碼";
        // array["myAct_str_Change_Credits"] = "修改額度"//Change Credits
        array["myAct_str_Change_Credits"] = "更改額度"
        array["myAct_str_super_admin"] = "超帳";//Super Admin
        array["myAct_str_corprator"] = "股東";//Corprator
        array["myAct_str_super_agents"] = " 總代理商";
        array["myAct_str_agents"] = "代理商";
        array["myAct_str_mem"] = "會員";

        //帳戶管理
        array["acc_su"]     = "總代理";
        array["acc_ag"]     = "代理商";
        array["acc_mem"]    = "會員";
        array["acc_sub"]    = "子帳號";
        // array["acc_str_credit"] = "修改額度";//Change Credits
        array["acc_str_credit"] = "更改額度";
        array["acc_str_enable"] = "更改帳戶狀態";//Change Status
        array["acc_str_add"] = "新增帳號";//Account created
        array["acc_str_beadd"] = "此帳號被誰新增";//Account Update By
        array["acc_str_password"] = "更改密碼";//Change Password

        //密碼恢復
        array["recv_enable"] = "啓用";
        array["recv_disable"] = "禁用";

        array['upd_success'] = "更改成功";//更改成功

        // dashboard
        array["dash_D"] = "第";
        array["dash_Ds"] = "天";
        array["dash_PR"] = "佔成收入";
        array["dash_MW"] = "投注人數";
        array["dash_TO"] = "實貨量";
        array["dash_WL"] = "贏 / 輸";

        // totalBets result detail start
        array["PGF"]="最先進球";
        array["OSF"]="最先越位";
        array["STF"]="最先替補球員";
        array["CNF"]="第一顆角球";
        array["CDF"]="第一張卡";
        array["RCF"]="會進球";
        array["YCF"]="第一張黃卡";
        array["GAF"]="有失球";
        array["PGL"]="最後進球";
        array["OSL"]="最後越位";
        array["STL"]="最後替補球員";
        array["CNL"]="最後一顆角球";
        array["CDL"]="最後一張卡";
        array["RCL"]="不會進球";
        array["YCL"]="最後一張黃卡";
        array["GAL"]="沒有失球";
        array["PG"]="最先/最後進球球隊";
        array["OS"]="最先/最後越位球隊";
        array["ST"]="最先/最後替補球員球隊";
        array["CN"]="第一顆/最後一顆角球";
        array["CD"]="第一張/最後一張卡";
        array["RC"]="會進球/不會進球";
        array["YC"]="第一張/最後一張黃卡";
        array["GA"]="有失球/沒有失球";

        array["No"] = "無";
        array["Y"] = "是";
        array["N"] = "否";
        array["FG_S"] = "射門";
        array["FG_H"] = "頭球";
        array["FG_N"] = "無進球";
        array["FG_P"] = "點球";
        array["FG_F"] = "任意球";
        array["FG_O"] = "烏龍球";

        array["RPF_1"] = "第三輪";
        array["RPF_2"] = "第四輪";
        array["RPF_3"] = "第五輪";
        array["RPF_OV"] = "第六輪或之後";

        array["T3G_1"] = "26分鐘以下";
        array["T3G_2"] = "27分鐘+";
        array["T3G_N"] = "無進球";

        array["T1G_N"] = "無進球";
        array["T1G_1"] = "0 - 14:59";
        array["T1G_2"] = "15 - 29:59";
        array["T1G_3"] = "30 – 半場";
        array["T1G_4"] = "45 – 59:59";
        array["T1G_5"] = "60 – 74:59";
        array["T1G_6"] = "75 – 全場";

        array["MQ_H"]=" - 90分鐘";
        array["MQ_C"]=" - 90分鐘";
        array["MQ_HOT"]=" - 加時賽";
        array["MQ_COT"]=" - 加時賽";
        array["MQ_HPK"]=" - 點球";
        array["MQ_CPK"]=" - 點球";
        array["RNB_P"]="沒有罰牌";
        array["RNC_P"]="沒有角球";
        array["RS_P"]="沒有點球";
        array["RS_Y"]="進球";
        array["RS_N"]="無進球";

        // array["AGMH"] = "0 - 14:59";
        // array["BGMH"] = "15 - 29:59";
        // array["CGMH"] = "30 – 半場";
        // array["DGMH"] = "45 – 59:59";
        // array["EGMH"] = "60 – 74:59";
        // array["FGMH"] = "75 – 全場";
        array["FT_title1"]="進球數";
        array["FT_title2"]="進球數";

        array["AGMH"] = "上半場開始 - 14:59 分鐘";
        array["BGMH"] = "15:00 - 29:59 分鐘";
        array["CGMH"] = "30:00 分鐘 - 半場";
        array["HGMH"] = "半場";
        array["DGMH"] = "下半場開始 - 59:59 分鐘";
        array["EGMH"] = "60:00 - 74:59 分鐘";
        array["FGMH"] = "75:00 分鐘 - 全場";
        array["GMH"] = "全場";

        array["TAGMH"] = "開始 - 04:59 分鐘";
        array["TBGMH"] = "05:00 - 09:59 分鐘";
        array["TCGMH"] = "10:00 分鐘 - 半場";
        array["THGMH"] = "半場";
        array["TDGMH"] = "下半場開始 - 19:59 分鐘";
        array["TEGMH"] = "20:00 - 24:59分鐘";
        array["TFGMH"] = "25:00分鐘 - 全場";
        array["TGMH"] = "全場";

        array["BH"] = "落後反超獲勝";
        array["ARG"] = "第一進球";
        array["BRG"] = "第二進球";
        array["CRG"] = "第三進球";
        array["DRG"] = "第四進球";
        array["ERG"] = "第五進球";
        array["FRG"] = "第六進球";
        array["GRG"] = "第七進球";
        array["HRG"] = "第八進球";
        array["IRG"] = "第九進球";
        array["JRG"] = "第十進球";
        array["FG"] = "首個進球方式";
        array["F2G"] = "先進2球的一方";
        array["F3G"] = "先進3球的一方";
        array["T1G"] = "首個進球時間";
        array["T3G"] = "首個進球時間-三項";
        array["TK"] = "先開球球隊";
        array["PA"] = "點球懲罰";
        array["RCD"] = "紅卡(球員)";
        array["RPS"] = "點球大戰";

        array["MQ"]="晉級方法";
        array["MW"]="獲勝方法";
        array["OG"]="烏龍球";
        array["OT"]="加時賽";
        array["RSHA"]="點球大戰 - 第一回合";
        array["RSHB"]="點球大戰 - 第二回合";
        array["RSHC"]="點球大戰 - 第三回合";
        array["RSHD"]="點球大戰 - 第四回合";
        array["RSHE"]="點球大戰 - 第五回合";
        array["RSHF"]="點球大戰 - 第六回合";
        array["RSHG"]="點球大戰 - 第七回合";
        array["RSHH"]="點球大戰 - 第八回合";
        array["RSHI"]="點球大戰 - 第九回合";
        array["RSHJ"]="點球大戰 - 第十回合";
        array["RSHK"]="點球大戰 - 第十一回合";
        array["RSHL"]="點球大戰 - 第十二回合";
        array["RSHM"]="點球大戰 - 第十三回合";
        array["RSHN"]="點球大戰 - 第十四回合";
        array["RSHO"]="點球大戰 - 第十五回合";
        array["RPF"]="最後結束回合";
        array["RNC1"]="第一個角球";
        array["RNC2"]="第二個角球";
        array["RNC3"]="第三個角球";
        array["RNC4"]="第四個角球";
        array["RNC5"]="第五個角球";
        array["RNC6"]="第六個角球";
        array["RNC7"]="第七個角球";
        array["RNC8"]="第八個角球";
        array["RNC9"]="第九個角球";
        array["RNCA"]="第十個角球";
        array["RNCB"]="第十一個角球";
        array["RNCC"]="第十二個角球";
        array["RNCD"]="第十三個角球";
        array["RNCE"]="第十四個角球";
        array["RNCF"]="第十五個角球";
        array["RNCG"]="第十六個角球";
        array["RNCH"]="第十七個角球";
        array["RNCI"]="第十八個角球";
        array["RNCJ"]="第十九個角球";
        array["RNCK"]="第二十個角球";
        array["RNCL"]="第二一個角球";
        array["RNCM"]="第二二個角球";
        array["RNCN"]="第二三個角球";
        array["RNCO"]="第二四個角球";
        array["RNCP"]="第二五個角球";
        array["RNCQ"]="第二六個角球";
        array["RNCR"]="第二七個角球";
        array["RNCS"]="第二八個角球";
        array["RNCT"]="第二九個角球";
        array["RNCU"]="第三十個角球";
        array["RNBA"]="第一個罰牌";
        array["RNBB"]="第二個罰牌";
        array["RNBC"]="第三個罰牌";
        array["RNBD"]="第四個罰牌";
        array["RNBE"]="第五個罰牌";
        array["RNBF"]="第六個罰牌";
        array["RNBG"]="第七個罰牌";
        array["RNBH"]="第八個罰牌";
        array["RNBI"]="第九個罰牌";
        array["RNBJ"]="第十個罰牌";
        array["RNBK"]="第十一個罰牌";
        array["RNBL"]="第十二個罰牌";
        array["RNBM"]="第十三個罰牌";
        array["RNBN"]="第十四個罰牌";
        array["RNBO"]="第十五個罰牌";

        array["F01"] = "第1局";
        array["F02"] = "第2局";
        array["F03"] = "第3局";
        array["F04"] = "第4局";
        array["F05"] = "第5局";
        array["F06"] = "第6局";
        array["F07"] = "第7局";
        array["F08"] = "第8局";
        array["F09"] = "第9局";
        array["F10"] = "第10局";
        array["F11"] = "第11局";
        array["F12"] = "第12局";
        array["F13"] = "第13局";
        array["F14"] = "第14局";
        array["F15"] = "第15局";
        array["F16"] = "第16局";
        array["F17"] = "第17局";
        array["F18"] = "第18局";
        array["F19"] = "第19局";
        array["F20"] = "第20局";
        array["F21"] = "第21局";
        array["F22"] = "第22局";
        array["F23"] = "第23局";
        array["F24"] = "第24局";
        array["F25"] = "第25局";
        array["F26"] = "第26局";
        array["F27"] = "第27局";
        array["F28"] = "第28局";
        array["F29"] = "第29局";
        array["F30"] = "第30局";
        array["F31"] = "第31局";
        array["F32"] = "第32局";
        array["F33"] = "第33局";
        array["F34"] = "第34局";
        array["F35"] = "第35局";

        array["RFA01"] = "第一局";
        array["RFA02"] = "第二局";
        array["RFA03"] = "第三局";
        array["RFA04"] = "第四局";
        array["RFA05"] = "第五局";
        array["RFA06"] = "第六局";
        array["RFA07"] = "第七局";
        array["RFA08"] = "第八局";
        array["RFA09"] = "第九局";
        array["RFA10"] = "第十局";
        array["RFA11"] = "第十一局";
        array["RFA12"] = "第十二局";
        array["RFA13"] = "第十三局";

        array["RFB01"] = "第一局";
        array["RFB02"] = "第二局";
        array["RFB03"] = "第三局";
        array["RFB04"] = "第四局";
        array["RFB05"] = "第五局";
        array["RFB06"] = "第六局";
        array["RFB07"] = "第七局";
        array["RFB08"] = "第八局";
        array["RFB09"] = "第九局";
        array["RFB10"] = "第十局";
        array["RFB11"] = "第十一局";
        array["RFB12"] = "第十二局";
        array["RFB13"] = "第十三局";

        array["RFC01"] = "第一局";
        array["RFC02"] = "第二局";
        array["RFC03"] = "第三局";
        array["RFC04"] = "第四局";
        array["RFC05"] = "第五局";
        array["RFC06"] = "第六局";
        array["RFC07"] = "第七局";
        array["RFC08"] = "第八局";
        array["RFC09"] = "第九局";
        array["RFC10"] = "第十局";
        array["RFC11"] = "第十一局";
        array["RFC12"] = "第十二局";
        array["RFC13"] = "第十三局";
        array["RFC14"] = "第十四局";
        array["RFC15"] = "第十五局";
        array["RFC16"] = "第十六局";
        array["RFC17"] = "第十七局";
        array["RFC18"] = "第十八局";
        array["RFC19"] = "第十九局";
        array["RFC20"] = "第二十局";
        array["RFC21"] = "第二十一局";
        array["RFC22"] = "第二十二局";
        array["RFC23"] = "第二十三局";
        array["RFC24"] = "第二十四局";
        array["RFC25"] = "第二十五局";
        array["RFC26"] = "第二十六局";
        array["RFC27"] = "第二十七局";
        array["RFC28"] = "第二十八局";
        array["RFC29"] = "第二十九局";
        array["RFC30"] = "第三十局";
        array["RFC31"] = "第三十一局";
        array["RFC32"] = "第三十二局";
        array["RFC33"] = "第三十三局";
        array["RFC34"] = "第三十四局";
        array["RFC35"] = "第三十五局";
        array["RFC36"] = "第三十六局";
        array["RFC37"] = "第三十七局";
        array["RFC38"] = "第三十八局";
        array["RFC39"] = "第三十九局";
        array["RFC40"] = "第四十局";
        array["RFC41"] = "第四十一局";
        array["RFC42"] = "第四十二局";
        array["RFC43"] = "第四十三局";
        array["RFC44"] = "第四十四局";
        array["RFC45"] = "第四十五局";
        array["RFC46"] = "第四十六局";
        array["RFC47"] = "第四十七局";
        array["RFC48"] = "第四十八局";
        array["RFC49"] = "第四十九局";
        array["RFC50"] = "第五十局";

        array["RFD01"] = "第一局";
        array["RFD02"] = "第二局";
        array["RFD03"] = "第三局";
        array["RFD04"] = "第四局";
        array["RFD05"] = "第五局";
        array["RFD06"] = "第六局";
        array["RFD07"] = "第七局";
        array["RFD08"] = "第八局";
        array["RFD09"] = "第九局";
        array["RFD10"] = "第十局";
        array["RFD11"] = "第十一局";
        array["RFD12"] = "第十二局";
        array["RFD13"] = "第十三局";

        array["RFE01"] = "第一局";
        array["RFE02"] = "第二局";
        array["RFE03"] = "第三局";
        array["RFE04"] = "第四局";
        array["RFE05"] = "第五局";
        array["RFE06"] = "第六局";
        array["RFE07"] = "第七局";
        array["RFE08"] = "第八局";
        array["RFE09"] = "第九局";
        array["RFE10"] = "第十局";
        array["RFE11"] = "第十一局";
        array["RFE12"] = "第十二局";
        array["RFE13"] = "第十三局";
        array["RFE14"] = "第十四局";
        array["RFE15"] = "第十五局";
        array["RFE16"] = "第十六局";
        array["RFE17"] = "第十七局";
        array["RFE18"] = "第十八局";
        array["RFE19"] = "第十九局";
        array["RFE20"] = "第二十局";
        array["RFE21"] = "第二十一局";
        array["RFE22"] = "第二十二局";
        array["RFE23"] = "第二十三局";
        array["RFE24"] = "第二十四局";
        array["RFE25"] = "第二十五局";
        array["RFE26"] = "第二十六局";
        array["RFE27"] = "第二十七局";
        array["RFE28"] = "第二十八局";
        array["RFE29"] = "第二十九局";
        array["RFE30"] = "第三十局";
        array["RFE31"] = "第三十一局";
        array["RFE32"] = "第三十二局";
        array["RFE33"] = "第三十三局";
        array["RFE34"] = "第三十四局";
        array["RFE35"] = "第三十五局";
        array["RFE36"] = "第三十六局";
        array["RFE37"] = "第三十七局";
        array["RFE38"] = "第三十八局";
        array["RFE39"] = "第三十九局";
        array["RFE40"] = "第四十局";
        array["RFE41"] = "第四十一局";
        array["RFE42"] = "第四十二局";
        array["RFE43"] = "第四十三局";
        array["RFE44"] = "第四十四局";
        array["RFE45"] = "第四十五局";
        array["RFE46"] = "第四十六局";
        array["RFE47"] = "第四十七局";
        array["RFE48"] = "第四十八局";
        array["RFE49"] = "第四十九局";
        array["RFE50"] = "第五十局";

        // basketball
        array["str_BK_0"] ="第一節";
        array["str_BK_1"] ="第二節";
        array["str_BK_2"] ="第三節";
        array["str_BK_3"] ="第四節";
        array["str_BK_4"] ="上半場";
        array["str_BK_5"] ="下半場";
        array["str_BK_6"] ="加時";
        array["str_BK_7"] ="總計";

        // tennis game
        array["str_TN_game_1"] = "第一盤";
        array["str_TN_game_2"] = "第二盤";
        array["str_TN_game_3"] = "第三盤";
        array["str_TN_game_4"] = "第四盤";
        array["str_TN_game_5"] = "第五盤";

        // tennis overall result
        array["str_TN_0"] = "第一盤";
        array["str_TN_1"] = "第二盤";
        array["str_TN_2"] = "第三盤";
        array["str_TN_3"] = "第四盤";
        array["str_TN_4"] = "第五盤";
        array["str_TN_5"] = "讓局";
        array["str_TN_6"] = "球員局數: 大 / 小";
        array["str_TN_7"] = "完賽";

        // volleyball
        array["str_VB_0"] = "第一局";
        array["str_VB_1"] = "第二局";
        array["str_VB_2"] = "第三局";
        array["str_VB_3"] = "第四局";
        array["str_VB_4"] = "第五局";
        array["str_VB_5"] = "第六局";
        array["str_VB_6"] = "第七局";
        array["str_VB_7"] = "讓分";
        array["str_VB_8"] = "完賽"

        // badminton tabletennis
        array["str_BMTT_0"] = "第一局";
        array["str_BMTT_1"] = "第二局";
        array["str_BMTT_2"] = "第三局";
        array["str_BMTT_3"] = "第四局";
        array["str_BMTT_4"] = "第五局";
        array["str_BMTT_5"] = "第六局";
        array["str_BMTT_6"] = "第七局";
        array["str_BMTT_7"] = "讓分";
        array["str_BMTT_8"] = "球員得分: 大 / 小";
        array["str_BMTT_9"] = "完賽"

        //baseball
        array["str_BS_Y"] = "是";
        array["str_BS_N"] = "不是";
        array["str_BS_0"] = "首五局";
        array["str_BS_1"] = "全場";

        //shooker
        array["str_SK_0"] = "第1 - 5局";
        array["str_SK_1"] = "第6 - 8局";
        array["str_SK_2"] = "第10 - 14局";
        array["str_SK_3"] = "第15 - 17局";
        array["str_SK_4"] = "第19 - 23局";
        array["str_SK_5"] = "第24 - 26局";
        array["str_SK_6"] = "全場";
        // totalBets result detail end

        //過濾器
		array["str_ALL"] = "所有球類";
		array["str_FT"] = "足球";
		array["str_BK"] = "籃球 / 美式足球";
		array["str_TN"] = "網球";
		array["str_VB"] = "排球";
		array["str_BM"] = "羽毛球";
		array["str_TT"] = "乒乓球";
		array["str_BS"] = "棒球";
		array["str_SK"] = "斯諾克/台球";
		array["str_OP"] = "其他球類";
		array["str_SFS"] = "特殊冠軍";
        array["str_FS"] = "冠軍";

        array["str_wmc_ALL"] = array["str_ALL"];
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

        array["btns_gtype"] = "球類";
		array["btns_stake"] = "下注金額";
		array["btns_view"] = "觀看";
		array["btns_downline"] = "下線";
		array["btns_league"] = "聯盟";
		array["btns_datestarted"] = "日期";
		array["btns_market"] = "盤口類型";
		array["btns_eventdate"] = "賽事日期";
		array["btns_class"] = "冠軍類別";
		array["btns_dateoutright"] = "日期";
		array["btns_date"] = "日期";
		array["btns_dateresult"] = "日期";
		array["btns_event"] = "賽事";
		array["btns_bettype"] = "玩法";
        array["btns_site"] = "網站";

        array["str_market_ALL"] = "所有盤口";
        array["str_market_rb"] = "滾球";
        array["str_market_ft"] = "今日";
        array["str_market_fu"] = "早盤";

        array["str_wmc_market_ALL"] =array["str_market_ALL"];
        array["str_wmc_market_rb"] = array["str_market_rb"];
        array["str_wmc_market_ft"] = array["str_market_ft"];
        array["str_wmc_market_fu"] = array["str_market_fu"];

        array["filter_view_full"] = "顯示所有";
        array["filter_view_com"] = "公司佔成" ;
        array["filter_view_c"] = "股東佔成" ;
        array["filter_view_s"] = "總代理佔成" ;
        array["filter_view_a"] = "代理商佔成" ;
        array["filter_view_csa"] = "股東 + 總代理 + 代理商佔成" ;
        array["filter_view_cs"] = "股東 + 總代理佔成" ;
        array["filter_view_sa"] = "總代理 + 代理商佔成" ;
        array["filter_view_my"] = "我的佔成";

        array["filter_date_yesterday"] = "昨日";
        array["filter_date_today"] = "今日";
        array["filter_date_future"] = "未來";
        array["filter_date_all"] = "所有";
        array["filter_date_show"] = "日期";

        array["filter_downline_show"] = "下線";
        array["filter_league_show"] = "聯盟";
        array["filter_market_show"] = "盤口類型";

        array["filter_err_downline_max"] = "您最多可選擇*LIMITCOUNT*個帳號";

        array["filter_market_all"] = "所有";
        array["filter_market_rb"] = "滾球";
        array["filter_market_pl"] = "單式";

        array["filter_more"] = "大於";
		array["filter_less"] = "小於";
		array["filter_same"] = "等於";

        array["str_day"] = "日";

        array["CancelType0"]  = "正式比分";
        array["CancelType-1"]  = "賽事取消";
        array["CancelType-2"]  = "隊名錯誤";
        array["CancelType-3"]  = "賽事延賽";
        array["CancelType-4"]  = "賽事時間不正規";
        array["CancelType-5"]  = "賽事腰斬";
        array["CancelType-6"]  = "球員棄權";
        array["CancelType-7"]  = "主客場錯誤";
        array["CancelType-8"]  = "聯賽名稱錯誤";
        array["CancelType-9"]  = "賽事無PK/ 加時";
        array["CancelType-10"] = "賽程錯誤";
        array["CancelType-11"] = "不顯示賽程";
        array["CancelType-12"] = "取消";
        array["CancelType-13"] = "賽事腰斬";
        array["CancelType-14"] = "無局數";
        array["CancelType_SK-14"] = "無局數";

        //Ricky 2018-03-06 PJB-188 CRM-249網球下一局獨贏
        array["title_RFA01_0_TN"] = "獨贏 - 第一盤 第一局";
        array["title_RFA02_0_TN"] = "獨贏 - 第一盤 第二局";
        array["title_RFA03_0_TN"] = "獨贏 - 第一盤 第三局";
        array["title_RFA04_0_TN"] = "獨贏 - 第一盤 第四局";
        array["title_RFA05_0_TN"] = "獨贏 - 第一盤 第五局";
        array["title_RFA06_0_TN"] = "獨贏 - 第一盤 第六局";
        array["title_RFA07_0_TN"] = "獨贏 - 第一盤 第七局";
        array["title_RFA08_0_TN"] = "獨贏 - 第一盤 第八局";
        array["title_RFA09_0_TN"] = "獨贏 - 第一盤 第九局";
        array["title_RFA10_0_TN"] = "獨贏 - 第一盤 第十局";
        array["title_RFA11_0_TN"] = "獨贏 - 第一盤 第十一局";
        array["title_RFA12_0_TN"] = "獨贏 - 第一盤 第十二局";
        array["title_RFA13_0_TN"] = "獨贏 - 第一盤 第十三局";
        array["title_RFB01_0_TN"] = "獨贏 - 第二盤 第一局";
        array["title_RFB02_0_TN"] = "獨贏 - 第二盤 第二局";
        array["title_RFB03_0_TN"] = "獨贏 - 第二盤 第三局";
        array["title_RFB04_0_TN"] = "獨贏 - 第二盤 第四局";
        array["title_RFB05_0_TN"] = "獨贏 - 第二盤 第五局";
        array["title_RFB06_0_TN"] = "獨贏 - 第二盤 第六局";
        array["title_RFB07_0_TN"] = "獨贏 - 第二盤 第七局";
        array["title_RFB08_0_TN"] = "獨贏 - 第二盤 第八局";
        array["title_RFB09_0_TN"] = "獨贏 - 第二盤 第九局";
        array["title_RFB10_0_TN"] = "獨贏 - 第二盤 第十局";
        array["title_RFB11_0_TN"] = "獨贏 - 第二盤 第十一局";
        array["title_RFB12_0_TN"] = "獨贏 - 第二盤 第十二局";
        array["title_RFB13_0_TN"] = "獨贏 - 第二盤 第十三局";
        array["title_RFC01_0_TN"] = "獨贏 - 第三盤 第一局";
        array["title_RFC02_0_TN"] = "獨贏 - 第三盤 第二局";
        array["title_RFC03_0_TN"] = "獨贏 - 第三盤 第三局";
        array["title_RFC04_0_TN"] = "獨贏 - 第三盤 第四局";
        array["title_RFC05_0_TN"] = "獨贏 - 第三盤 第五局";
        array["title_RFC06_0_TN"] = "獨贏 - 第三盤 第六局";
        array["title_RFC07_0_TN"] = "獨贏 - 第三盤 第七局";
        array["title_RFC08_0_TN"] = "獨贏 - 第三盤 第八局";
        array["title_RFC09_0_TN"] = "獨贏 - 第三盤 第九局";
        array["title_RFC10_0_TN"] = "獨贏 - 第三盤 第十局";
        array["title_RFC11_0_TN"] = "獨贏 - 第三盤 第十一局";
        array["title_RFC12_0_TN"] = "獨贏 - 第三盤 第十二局";
        array["title_RFC13_0_TN"] = "獨贏 - 第三盤 第十三局";
        array["title_RFC14_0_TN"] = "獨贏 - 第三盤 第十四局";
        array["title_RFC15_0_TN"] = "獨贏 - 第三盤 第十五局";
        array["title_RFC16_0_TN"] = "獨贏 - 第三盤 第十六局";
        array["title_RFC17_0_TN"] = "獨贏 - 第三盤 第十七局";
        array["title_RFC18_0_TN"] = "獨贏 - 第三盤 第十八局";
        array["title_RFC19_0_TN"] = "獨贏 - 第三盤 第十九局";
        array["title_RFC20_0_TN"] = "獨贏 - 第三盤 第二十局";
        array["title_RFC21_0_TN"] = "獨贏 - 第三盤 第二十一局";
        array["title_RFC22_0_TN"] = "獨贏 - 第三盤 第二十二局";
        array["title_RFC23_0_TN"] = "獨贏 - 第三盤 第二十三局";
        array["title_RFC24_0_TN"] = "獨贏 - 第三盤 第二十四局";
        array["title_RFC25_0_TN"] = "獨贏 - 第三盤 第二十五局";
        array["title_RFC26_0_TN"] = "獨贏 - 第三盤 第二十六局";
        array["title_RFC27_0_TN"] = "獨贏 - 第三盤 第二十七局";
        array["title_RFC28_0_TN"] = "獨贏 - 第三盤 第二十八局";
        array["title_RFC29_0_TN"] = "獨贏 - 第三盤 第二十九局";
        array["title_RFC30_0_TN"] = "獨贏 - 第三盤 第三十局";
        array["title_RFC31_0_TN"] = "獨贏 - 第三盤 第三十一局";
        array["title_RFC32_0_TN"] = "獨贏 - 第三盤 第三十二局";
        array["title_RFC33_0_TN"] = "獨贏 - 第三盤 第三十三局";
        array["title_RFC34_0_TN"] = "獨贏 - 第三盤 第三十四局";
        array["title_RFC35_0_TN"] = "獨贏 - 第三盤 第三十五局";
        array["title_RFC36_0_TN"] = "獨贏 - 第三盤 第三十六局";
        array["title_RFC37_0_TN"] = "獨贏 - 第三盤 第三十七局";
        array["title_RFC38_0_TN"] = "獨贏 - 第三盤 第三十八局";
        array["title_RFC39_0_TN"] = "獨贏 - 第三盤 第三十九局";
        array["title_RFC40_0_TN"] = "獨贏 - 第三盤 第四十局";
        array["title_RFC41_0_TN"] = "獨贏 - 第三盤 第四十一局";
        array["title_RFC42_0_TN"] = "獨贏 - 第三盤 第四十二局";
        array["title_RFC43_0_TN"] = "獨贏 - 第三盤 第四十三局";
        array["title_RFC44_0_TN"] = "獨贏 - 第三盤 第四十四局";
        array["title_RFC45_0_TN"] = "獨贏 - 第三盤 第四十五局";
        array["title_RFC46_0_TN"] = "獨贏 - 第三盤 第四十六局";
        array["title_RFC47_0_TN"] = "獨贏 - 第三盤 第四十七局";
        array["title_RFC48_0_TN"] = "獨贏 - 第三盤 第四十八局";
        array["title_RFC49_0_TN"] = "獨贏 - 第三盤 第四十九局";
        array["title_RFC50_0_TN"] = "獨贏 - 第三盤 第五十局";
        array["title_RFD01_0_TN"] = "獨贏 - 第四盤 第一局";
        array["title_RFD02_0_TN"] = "獨贏 - 第四盤 第二局";
        array["title_RFD03_0_TN"] = "獨贏 - 第四盤 第三局";
        array["title_RFD04_0_TN"] = "獨贏 - 第四盤 第四局";
        array["title_RFD05_0_TN"] = "獨贏 - 第四盤 第五局";
        array["title_RFD06_0_TN"] = "獨贏 - 第四盤 第六局";
        array["title_RFD07_0_TN"] = "獨贏 - 第四盤 第七局";
        array["title_RFD08_0_TN"] = "獨贏 - 第四盤 第八局";
        array["title_RFD09_0_TN"] = "獨贏 - 第四盤 第九局";
        array["title_RFD10_0_TN"] = "獨贏 - 第四盤 第十局";
        array["title_RFD11_0_TN"] = "獨贏 - 第四盤 第十一局";
        array["title_RFD12_0_TN"] = "獨贏 - 第四盤 第十二局";
        array["title_RFD13_0_TN"] = "獨贏 - 第四盤 第十三局";
        array["title_RFE01_0_TN"] = "獨贏 - 第五盤 第一局";
        array["title_RFE02_0_TN"] = "獨贏 - 第五盤 第二局";
        array["title_RFE03_0_TN"] = "獨贏 - 第五盤 第三局";
        array["title_RFE04_0_TN"] = "獨贏 - 第五盤 第四局";
        array["title_RFE05_0_TN"] = "獨贏 - 第五盤 第五局";
        array["title_RFE06_0_TN"] = "獨贏 - 第五盤 第六局";
        array["title_RFE07_0_TN"] = "獨贏 - 第五盤 第七局";
        array["title_RFE08_0_TN"] = "獨贏 - 第五盤 第八局";
        array["title_RFE09_0_TN"] = "獨贏 - 第五盤 第九局";
        array["title_RFE10_0_TN"] = "獨贏 - 第五盤 第十局";
        array["title_RFE11_0_TN"] = "獨贏 - 第五盤 第十一局";
        array["title_RFE12_0_TN"] = "獨贏 - 第五盤 第十二局";
        array["title_RFE13_0_TN"] = "獨贏 - 第五盤 第十三局";
        array["title_RFE14_0_TN"] = "獨贏 - 第五盤 第十四局";
        array["title_RFE15_0_TN"] = "獨贏 - 第五盤 第十五局";
        array["title_RFE16_0_TN"] = "獨贏 - 第五盤 第十六局";
        array["title_RFE17_0_TN"] = "獨贏 - 第五盤 第十七局";
        array["title_RFE18_0_TN"] = "獨贏 - 第五盤 第十八局";
        array["title_RFE19_0_TN"] = "獨贏 - 第五盤 第十九局";
        array["title_RFE20_0_TN"] = "獨贏 - 第五盤 第二十局";
        array["title_RFE21_0_TN"] = "獨贏 - 第五盤 第二十一局";
        array["title_RFE22_0_TN"] = "獨贏 - 第五盤 第二十二局";
        array["title_RFE23_0_TN"] = "獨贏 - 第五盤 第二十三局";
        array["title_RFE24_0_TN"] = "獨贏 - 第五盤 第二十四局";
        array["title_RFE25_0_TN"] = "獨贏 - 第五盤 第二十五局";
        array["title_RFE26_0_TN"] = "獨贏 - 第五盤 第二十六局";
        array["title_RFE27_0_TN"] = "獨贏 - 第五盤 第二十七局";
        array["title_RFE28_0_TN"] = "獨贏 - 第五盤 第二十八局";
        array["title_RFE29_0_TN"] = "獨贏 - 第五盤 第二十九局";
        array["title_RFE30_0_TN"] = "獨贏 - 第五盤 第三十局";
        array["title_RFE31_0_TN"] = "獨贏 - 第五盤 第三十一局";
        array["title_RFE32_0_TN"] = "獨贏 - 第五盤 第三十二局";
        array["title_RFE33_0_TN"] = "獨贏 - 第五盤 第三十三局";
        array["title_RFE34_0_TN"] = "獨贏 - 第五盤 第三十四局";
        array["title_RFE35_0_TN"] = "獨贏 - 第五盤 第三十五局";
        array["title_RFE36_0_TN"] = "獨贏 - 第五盤 第三十六局";
        array["title_RFE37_0_TN"] = "獨贏 - 第五盤 第三十七局";
        array["title_RFE38_0_TN"] = "獨贏 - 第五盤 第三十八局";
        array["title_RFE39_0_TN"] = "獨贏 - 第五盤 第三十九局";
        array["title_RFE40_0_TN"] = "獨贏 - 第五盤 第四十局";
        array["title_RFE41_0_TN"] = "獨贏 - 第五盤 第四十一局";
        array["title_RFE42_0_TN"] = "獨贏 - 第五盤 第四十二局";
        array["title_RFE43_0_TN"] = "獨贏 - 第五盤 第四十三局";
        array["title_RFE44_0_TN"] = "獨贏 - 第五盤 第四十四局";
        array["title_RFE45_0_TN"] = "獨贏 - 第五盤 第四十五局";
        array["title_RFE46_0_TN"] = "獨贏 - 第五盤 第四十六局";
        array["title_RFE47_0_TN"] = "獨贏 - 第五盤 第四十七局";
        array["title_RFE48_0_TN"] = "獨贏 - 第五盤 第四十八局";
        array["title_RFE49_0_TN"] = "獨贏 - 第五盤 第四十九局";
        array["title_RFE50_0_TN"] = "獨贏 - 第五盤 第五十局";

        array["HT"] = "半場";
        array["1H"] = "上半場";
        array["2H"] = "下半場";
        array["BK_HT"] = "上半場";
        array["BK_H2"] = "下半場";
        array["BK_Q1"] = "第一節";
        array["BK_Q2"] = "第二節";
        array["BK_Q3"] = "第三節";
        array["BK_Q4"] = "第四節";
        array["BK_OT"] = "加時";
        array["BK_half_time"] = "半場";

        array["BK_HT_allbet"] = "上半場";
        array["BK_H2_allbet"] = "下半場";
        array["BK_Q1_allbet"] = "第一節";
        array["BK_Q2_allbet"] = "第二節";
        array["BK_Q3_allbet"] = "第三節";
        array["BK_Q4_allbet"] = "第四節";
        array["BK_OT_allbet"] = "加時";
        array["BK_half_time_allbet"] = "半場";

        array["Best_of_3"] = "三盤兩勝";
        array["Best_of_5"] = "五盤三勝";
        array["Best_of_7"] = "七盤四勝";
        array["Best_of_12"] = "十二盤制";

        array["midfield"] = "中";
        array["live"] = "滾球";


        return array;
    }

    _self.get=function(_key){
        return LangxAry[_key];
    }

}
