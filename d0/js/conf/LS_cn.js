function LS_cn() {
    var _self = this;
    var parentClass;
    var LangxAry;

    _self.init = function () {
        LangxAry = _self.set();
    }

    _self.set = function () {
        var array = new Object();
        array["loading_txt"] = "加载中";
        array["page_dashboard"] = "首页";
        array["page_report"] = "报表";
        array["page_totalbet"] = "即时注单";
        array["page_match"] = "操盘";
        array["page_bet"] = "注单管理";
        array["page_set"] = "有结果";
        array["page_un"] = "未有结果";
        array["page_summary"] = "赛事结果概要";
        array["page_period"] = "月帐期数表";//Accounting Period
        array["page_exchange"] = "汇率";
        array["page_cancel"] = "取消单";
        array["page_cancel"] = "取消单";
        array["page_quicksearch"] = "快速搜索";
        array["page_onlinemem"] = "线上会员";
        array["page_onlineag"] = "线上代理";
        array["page_onlinesu"] = "线上总代";
        array["page_onlineco"] = "线上股东";
        array["page_onlined0"] = "线上分公司";
        array["page_onlinead"] = "线上公司";
        array["page_mysetting"] = "我的设定";
        array["page_myactivities"] = "我的活动记录";
        array["page_feature"] = "特色";
        array["page_requirements"] = "系统需求";
        array["page_newurl"] = "最新网址";
        array["page_contactus"] = "联系我们";
        array["page_pwd_recovery"] = "密码恢复";
        array["page_chg_pwd_inside"] = "更改密码";
	    array["page_problem_accounts"] = "问题帐号";
        array["page_announcement"] = "公告";
        array["page_edit_ok"] = "修改成功";
        array["page_ann_one"] = "请选择至少一条公告";
        array["add_success"] = "新增成功";
        array["dele_success"] = "删除成功";
        array["page_account"] = "帐户管理";//A/C Mgmt
        array["page_sub"] = "子帐号";
        array["page_co_add"] = "新增股东";
        array["page_su_add"] = "新增总代理";
        array["page_ag_add"] = "新增代理";
        array["page_mem_add"] = "新增会员";
        array["page_sub_add"] = "新增子帐号";//New Sub Agent
        array["page_log"] = "日志管理";

        array["str_copied"] = "資料已复制";

        array["page_overview"] = "总览";
        array["page_INPLAY"] = "滚球";
        array["page_TODAY"] = "今日";
        array["page_EARLY"] = "早盘";
        array["page_STARTED"] = "已开赛";
        array["page_PARLAY"] = "过关";
        array["page_OUTRIGHT"] = "冠军";
        array["page_RESULTS"] = "赛果";
        array["page_MATCH"] = "赛程";
        array["page_SCORE"] = "比分";

        //new_url Start
        array["newcro666"] = "会员端";
        array["phcro666"] = "手机会员端";
        array["newagcro666"] = "管理端";//New Manager Site
        array["agphonecro666"] = "手机管理端";
        array["acc"] = "旧帐";
        //new_url End
        //恢复密码
        array["0X001"] = "参数错误";
        array["4X001"] = "IP不合法";
        array["4X002"] = "帐号停用";
        array["4X003"] = "帐号禁止登入";
        array["4X004"] = "密码错误多次被锁";
        array["4X005"] = "帐密不正确";
        array["4X006"] = "三分钟后再试";
        array["4X007"] = "未设定email";
        array["4X025"] = "此功能暂时已被禁用，请联系您的上线。";
        array["4X026"] = "验证码发送次数过多，系统暂时不能接受申请，请检查您的资料是否正确。";
        array["4X027"] = "连不到MailServer";
        array["4X028"] = "MailServer发送验证码失败";
        array["4O005"] = "验证码已发送到您的电子邮件";
        array["4O006"] = "已成功注册";
        array["get_mail_canceal"] = "请输入有效的电子邮件";//Please enter a valid email address
        array["input_verify_cancel"] = "取消密码恢复？";
        array["remove_email"] = "密码恢复电子邮件已被删除";
        array["remove_email_message"] = "删除密码恢复电邮？";

        array["enable_Y"] = "启用";
        array["enable_N"] = "停用";
        array["enable_S"] = "只能看帐";
        array["enable_F"] = "禁止登入";
        array["input_acc"] = "请输入帐号";//Enter User Code

        //額度模式
        array["pay_type_0"] = "自动恢复";
        array["pay_type_1"] = "余额浮动";
        array["long_pay_type_0"] = "自动恢复";
        array["long_pay_type_1"] = "余额浮动";


        array["str_co"] = "股东";//Corprator
        array["str_su"] = "总代理";//Agency
        array["str_ag"] = "代理商";
        array["str_mem"] = "会员";


        array["str_co_sub"] = "股东 子帐号";//Corprator
        array["str_su_sub"] = "总代理 子帐号";//Agency
        array["str_ag_sub"] = "代理商 子帐号";



        array["str_cos"] = "股东";//Corprator
        array["str_sus"] = "总代";//Agency
        array["str_ags"] = "代理";//Agents
        array["str_mems"] = "会员";//Members

        //帐户新增修改
        array["max_limit_head"] = "最高: "//最大限额字串 Max: RMB 1,100,000
        array["empty_user"] = "此处不能留空"; //帐号请务必输入
        array["empty_alias"] = "此处不能留空"; //名称请务必输入
        array["empty_passwd"] = "此处不能留空"; //请输入新密码
        array["empty_confirm"] = "此处不能留空"; //请输入新密码
        array["empty_credit"] = "此处不能留空"; //总信用额度请务必输入
        array["empty_safe"] = "此处不能留空";
        array["empty_content"] = "此处不能留空";
        array["empty_enddate"] = "此处不能留空";
        array["empty_enddate1"] = "此处日期格式不正确";
        array["str_confirm_add_su"] = "是否确定写入总代理"; //是否确定写入总代理
        array["str_confirm_add_ag"] = "是否确定写入代理商";//是否确定写入代理商
        array["str_confirm_add_mem"] = "是否确定写入会员资料";//是否确定写入会员资料
        array["credit_over"] = "您输入的额度大于剩余额度，请重新输入.";
        array["user_limit"] = "帐号至少四个字元长.";
        array["user_manage"] = "你没有勾选 ‘管理帐号’，请勾选其中一个或是全选。";
        array["cash_sw_in_edit_user"] = "因未知原因，系统暂时停止修改额度功能，请稍后再试。";
        array["cash_sw_in_add_user"] = "功能未开放使用，我们将在短期内完成测试并开放功能。";

        array["add_account_success"] = "新增帐户成功";
        array["copy_success"] = "登入帐号和密码已复制到剪贴板";
        array["copy_user"] = "帐号：";
        array["copy_pwd"] = "密码：";
        array["winloss_percent"] = "%";
        //array["su_ag_winloss_error"] = "股东及总代理及代理商的成数总和须在 5 - 8 成内 , 请重新设定 !!";//股东及总代理及代理商的成数总和须在 5 - 8 成内 , 请重新设定 !!
        array["su_ag_winloss_error"] = "成数总和必须要xx% - yy%内， 请重新设定。";
        array["su_ag_winloss8_error"] = "成数总和必须要xx％， 请重新设定。";
        array["status_update"] = "更改帐户状态成功";
        array["hide_user_update"] = "更改隐单账号成功";
        array["setip_update"] = "更改绑定ip成功";
        array["seturl_update"] = "更改登陆网址成功";
        array["credit_update"] = "更改信用额度成功";
        array["account_copy"] = "复制";

        //子帐号
        array["max_sub3"] = "已超过可使用子帐户限制, 无法新增子帐户。";
        array["sub_mlimit"] = "您最多可选";//You may select maximum of
        array["sub_mlimit2"] = "个帐号。";//accounts at a time.
        array["listsub_safe"] = "安全代码";
        array["listsub_safe_ag"] = "登入帐号";


        //修改成数
        array["str_possess_down"] = "最低可设";
        array["str_possess_up"] = "最高可设";
        array["str_possess_allowed"] = "可设";//Allowed:
        array["RMB"] = "人民币";

        //密码强度
        array["pwd_Very Weak"] = "非常弱";
        array["pwd_Weak"] = "弱";
        array["pwd_Fair"] = "一般";
        array["pwd_Good"] = "好";
        array["pwd_Strong"] = "强";

        //破解时间
        array["pwd_break_Seconds"] = "秒";
        array["pwd_break_Minutes"] = "分钟";
        array["pwd_break_Hours"] = "小时";
        array["pwd_break_Days"] = "天";
        array["pwd_break_Months"] = "个月";
        array["pwd_break_Years"] = "年";
        array["pwd_break_Centuries"] = "世纪";

        array["pwd_TRILLION"] = "兆";
        array["pwd_100_BILLION"] = "千亿";
        array["pwd_10_BILLION"] = "百亿";
        array["pwd_BILLION"] = "十亿";
        array["pwd_100_MILLION"] = "亿";
        array["pwd_10_MILLION"] = "千万";
        array["pwd_MILLION"] = "百万";
        array["pwd_100_THOUSAND"] = "十万";
        array["pwd_10_THOUSAND"] = "万";
        array["pwd_THOUSAND"] = "千";
        array["pwd_HUNDRED"] = "百";

        //信用额度
        array["str_maxcre"] = "总信用额度仅能输入数字";
        array["str_maxcre_zero"] = "信用额度不可为0";//0 is not a valid value.
        array["str_maxcre_zero1"] = "请输入大于 0 的信用额度";//Credit limit should be greater than 0.
        array["str_edit_credit_confirm"] = "是否确定修改信用额度?";//Make sure to modify the credit limit?

        // array["empty_credit"] = "总信用额度请务必输入"; //总信用额度请务必输入
        array["empty_credit"] = "此处不能留空";
        array["str_min_m"] = "独赢, 滚球独赢 单注最低限额,请输入大于0的数字";
        array["str_min_r"] = "让球, 大 / 小, 单 / 双 单注最低限额,请输入大于0的输入数字";
        array["str_min_re"] = "滚球让球, 滚球大 / 小, 滚球单 / 双 单注最低限额,请输入大于0的输入数字";
        array["str_min_dt"] = "其他玩法 单注最低限额,请输入大于0的输入数字";
        array["str_min_rdt"] = "滚球其他玩法 单注最低限额,请输入大于0的输入数字";
        array["str_min_fs"] = "冠军单注最低限额,请输入大于0的输入数字";

        array["str_max_m"] = "独赢, 滚球独赢 单注最高派彩,请输入大于0的数字";
        array["str_max_r"] = "让球, 大 / 小, 单 / 双 单注最高派彩,请输入大于0的输入数字";
        array["str_max_re"] = "滚球让球, 滚球大 / 小, 滚球单 / 双 单注最高派彩,请输入大于0的输入数字";
        array["str_max_dt"] = "其他玩法 单注最高派彩,请输入大于0的输入数字";
        array["str_max_rdt"] = "滚球其他玩法 单注最高派彩,请输入大于0的输入数字";
        array["str_max_fs"] = "冠军单注最高派彩,请输入大于0的输入数字";

        array["sub_selMax"] = "可管理帐号的权限已达最大使用数。请联络您的上线移除已暂停使用的帐号";//You have exceeded the number of ‘Managed Accounts’ allowed.  Please contact your upline to remove inactive accounts.
        //快速搜寻
        //2019-03-28 Ricky 248.登一帐号-Quick Search快速搜寻-sub account，level(层级)帮改为SMA，目前秀错字Corprator
        //array["layer_type_name_corprator"] = "Corprator";
        array["layer_type_name_corprator"] = "股东";//SMA
        array["layer_type_name_super_agents"] = "总代理";
        array["layer_type_name_agents"] = "代理商";
        array["layer_type_name_members"] = "会员";
        array["enable_str_Active"] = "启用";
        array["enable_str_Suspended"] = "禁止登入";
        array["enable_str_ViewOnly"] = "只能看帐";
        array["enable_str_Inactive"] = "停用";
        array["layer_type_name_subAccount"] = "子帐号";//Sub Account
        //我的纪录
        // array["myAct_str_Create_Account"] = "启用";
        array["myAct_str_Create_Account"] = "新增帐号";
        array["myAct_str_Password_Reset"] = "更改密码";
        // array["myAct_str_Change_Credits"] = "修改额度"//Change Credits
        array["myAct_str_Change_Credits"] = "更改額度"
        array["myAct_str_super_admin"] = "超帐";//Super Admin
        array["myAct_str_corprator"] = "股东";//Corprator
        array["myAct_str_super_agents"] = " 总代理商";
        array["myAct_str_agents"] = "代理商";
        array["myAct_str_mem"] = "会员";

        //帐户管理
        array["acc_co"]     = "股东";
        array["acc_su"]     = "总代理";
        array["acc_ag"]     = "代理商";
        array["acc_mem"]    = "会员";
        array["acc_sub"]    = "子帐号";
        // array["acc_str_credit"] = "修改额度";//Change Credits
        array["acc_str_credit"] = "更改額度";
        array["acc_str_enable"] = "更改帐户状态";//Change Status
        array["acc_str_add"] = "新增帐号";//Account created
        array["acc_str_beadd"] = "此帐号被谁新增";//Account Update By
        array["acc_str_password"] = "更改密码";//Change Password

        //密码恢复
        array["recv_enable"] = "启用";
        array["recv_disable"] = "禁用";

        array['upd_success'] = "更改成功";//更改成功

        // dashboard
        array["dash_D"] = "第";
        array["dash_Ds"] = "天";
        array["dash_PR"] = "占成收入";
        array["dash_MW"] = "投注人数";
        array["dash_TO"] = "实货量";
        array["dash_WL"] = "赢 / 输";

        // totalBets result detail start
        array["PGF"]="最先进球";
        array["OSF"]="最先越位";
        array["STF"]="最先替补球员";
        array["CNF"]="第一颗角球";
        array["CDF"]="第一张卡";
        array["RCF"]="会进球";
        array["YCF"]="第一张黄卡";
        array["GAF"]="有失球";
        array["PGL"]="最后进球";
        array["OSL"]="最后越位";
        array["STL"]="最后替补球员";
        array["CNL"]="最后一颗角球";
        array["CDL"]="最后一张卡";
        array["RCL"]="不会进球";
        array["YCL"]="最后一张黄卡";
        array["GAL"]="没有失球";
        array["PG"]="最先/最后进球球队";
        array["OS"]="最先/最后越位球队";
        array["ST"]="最先/最后替补球员球队";
        array["CN"]="第一颗/最后一颗角球";
        array["CD"]="第一张/最后一张卡";
        array["RC"]="会进球/不会进球";
        array["YC"]="第一张/最后一张黄卡";
        array["GA"]="有失球/没有失球";

        array["No"] = "无";
        array["Y"] = "是";
        array["N"] = "否";
        array["FG_S"] = "射门";
        array["FG_H"] = "头球";
        array["FG_N"] = "无进球";
        array["FG_P"] = "点球";
        array["FG_F"] = "任意球";
        array["FG_O"] = "乌龙球";

        array["RPF_1"] = "第三轮";
        array["RPF_2"] = "第四轮";
        array["RPF_3"] = "第五轮";
        array["RPF_OV"] = "第六轮或之后";

        array["T3G_1"] = "26分钟以下";
        array["T3G_2"] = "27分钟+";
        array["T3G_N"] = "无进球";

        array["T1G_N"] = "无进球";
        array["T1G_1"] = "0 - 14:59";
        array["T1G_2"] = "15 - 29:59";
        array["T1G_3"] = "30 – 半场";
        array["T1G_4"] = "45 – 59:59";
        array["T1G_5"] = "60 – 74:59";
        array["T1G_6"] = "75 – 全场";

        array["MQ_H"]=" - 90分钟";
        array["MQ_C"]=" - 90分钟";
        array["MQ_HOT"]=" - 加时赛";
        array["MQ_COT"]=" - 加时赛";
        array["MQ_HPK"]=" - 点球";
        array["MQ_CPK"]=" - 点球";
        array["RNB_P"]="没有罚牌";
        array["RNC_P"]="没有角球";
        array["RS_P"]="没有点球";
        array["RS_Y"]="进球";
        array["RS_N"]="无进球";

        // array["AGMH"] = "0 - 14:59";
        // array["BGMH"] = "15 - 29:59";
        // array["CGMH"] = "30 – 半场";
        // array["DGMH"] = "45 – 59:59";
        // array["EGMH"] = "60 – 74:59";
        // array["FGMH"] = "75 – 全场";
        array["FT_title1"]="进球数";
        array["FT_title2"]="进球数";

        array["AGMH"] = "上半场开始 - 14:59 分钟";
        array["BGMH"] = "15:00 - 29:59 分钟";
        array["CGMH"] = "30:00 分钟 - 半场";
        array["HGMH"] = "半场";
        array["DGMH"] = "下半场开始 - 59:59 分钟";
        array["EGMH"] = "60:00 - 74:59 分钟";
        array["FGMH"] = "75:00 分钟 - 全场";
        array["GMH"] = "全场";

        array["TAGMH"] = "开始 - 04:59 分钟";
        array["TBGMH"] = "05:00 - 09:59 分钟";
        array["TCGMH"] = "10:00 分钟 - 半场";
        array["THGMH"] = "半场";
        array["TDGMH"] = "下半场开始 - 19:59 分钟";
        array["TEGMH"] = "20:00 - 24:59分钟";
        array["TFGMH"] = "25:00分钟 -全场";
        array["TGMH"] = "全场";

        array["BH"] = "落后反超获胜";
        array["ARG"] = "第一进球";
        array["BRG"] = "第二进球";
        array["CRG"] = "第三进球";
        array["DRG"] = "第四进球";
        array["ERG"] = "第五进球";
        array["FRG"] = "第六进球";
        array["GRG"] = "第七进球";
        array["HRG"] = "第八进球";
        array["IRG"] = "第九进球";
        array["JRG"] = "第十进球";
        array["FG"] = "首个进球方式";
        array["F2G"] = "先进2球的一方";
        array["F3G"] = "先进3球的一方";
        array["T1G"] = "首个进球时间";
        array["T3G"] = "首个进球时间-三项";
        array["TK"] = "先开球球队";
        array["PA"] = "点球惩罚";
        array["RCD"] = "红卡(球员)";
        array["RPS"] = "点球大战";

        array["MQ"]="晋级方法";
        array["MW"]="胜出方法";
        array["OG"]="乌龙球";
        array["OT"]="加时赛";
        array["RSHA"]="点球大战 - 第一回合";
        array["RSHB"]="点球大战 - 第二回合";
        array["RSHC"]="点球大战 - 第三回合";
        array["RSHD"]="点球大战 - 第四回合";
        array["RSHE"]="点球大战 - 第五回合";
        array["RSHF"]="点球大战 - 第六回合";
        array["RSHG"]="点球大战 - 第七回合";
        array["RSHH"]="点球大战 - 第八回合";
        array["RSHI"]="点球大战 - 第九回合";
        array["RSHJ"]="点球大战 - 第十回合";
        array["RSHK"]="点球大战 - 第十一回合";
        array["RSHL"]="点球大战 - 第十二回合";
        array["RSHM"]="点球大战 - 第十三回合";
        array["RSHN"]="点球大战 - 第十四回合";
        array["RSHO"]="点球大战 - 第十五回合";
        array["RPF"]="最后结束回合";
        array["RNC1"]="第一个角球";
        array["RNC2"]="第二个角球";
        array["RNC3"]="第三个角球";
        array["RNC4"]="第四个角球";
        array["RNC5"]="第五个角球";
        array["RNC6"]="第六个角球";
        array["RNC7"]="第七个角球";
        array["RNC8"]="第八个角球";
        array["RNC9"]="第九个角球";
        array["RNCA"]="第十个角球";
        array["RNCB"]="第十一个角球";
        array["RNCC"]="第十二个角球";
        array["RNCD"]="第十三个角球";
        array["RNCE"]="第十四个角球";
        array["RNCF"]="第十五个角球";
        array["RNCG"]="第十六个角球";
        array["RNCH"]="第十七个角球";
        array["RNCI"]="第十八个角球";
        array["RNCJ"]="第十九个角球";
        array["RNCK"]="第二十个角球";
        array["RNCL"]="第二一个角球";
        array["RNCM"]="第二二个角球";
        array["RNCN"]="第二三个角球";
        array["RNCO"]="第二四个角球";
        array["RNCP"]="第二五个角球";
        array["RNCQ"]="第二六个角球";
        array["RNCR"]="第二七个角球";
        array["RNCS"]="第二八个角球";
        array["RNCT"]="第二九个角球";
        array["RNCU"]="第三十个角球";
        array["RNBA"]="第一个罚牌";
        array["RNBB"]="第二个罚牌";
        array["RNBC"]="第三个罚牌";
        array["RNBD"]="第四个罚牌";
        array["RNBE"]="第五个罚牌";
        array["RNBF"]="第六个罚牌";
        array["RNBG"]="第七个罚牌";
        array["RNBH"]="第八个罚牌";
        array["RNBI"]="第九个罚牌";
        array["RNBJ"]="第十个罚牌";
        array["RNBK"]="第十一个罚牌";
        array["RNBL"]="第十二个罚牌";
        array["RNBM"]="第十三个罚牌";
        array["RNBN"]="第十四个罚牌";
        array["RNBO"]="第十五个罚牌";

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
        array["str_BK_0"] ="第一节";
        array["str_BK_1"] ="第二节";
        array["str_BK_2"] ="第三节";
        array["str_BK_3"] ="第四节";
        array["str_BK_4"] ="上半场";
        array["str_BK_5"] ="下半场";
        array["str_BK_6"] ="加时";
        array["str_BK_7"] ="总计";

        // tennis game
        array["str_TN_game_1"] = "第一盘";
        array["str_TN_game_2"] = "第二盘";
        array["str_TN_game_3"] = "第三盘";
        array["str_TN_game_4"] = "第四盘";
        array["str_TN_game_5"] = "第五盘";

        // tennis overall result
        array["str_TN_0"] = "第一盘";
        array["str_TN_1"] = "第二盘";
        array["str_TN_2"] = "第三盘";
        array["str_TN_3"] = "第四盘";
        array["str_TN_4"] = "第五盘";
        array["str_TN_5"] = "让局";
        array["str_TN_6"] = "球员得分: 大 / 小";
        array["str_TN_7"] = "完赛";

        // volleyball
        array["str_VB_0"] = "第一局";
        array["str_VB_1"] = "第二局";
        array["str_VB_2"] = "第三局";
        array["str_VB_3"] = "第四局";
        array["str_VB_4"] = "第五局";
        array["str_VB_5"] = "第六局";
        array["str_VB_6"] = "第七局";
        array["str_VB_7"] = "让分";
        array["str_VB_8"] = "完赛"

        // badminton tabletennis
        array["str_BMTT_0"] = "第一局";
        array["str_BMTT_1"] = "第二局";
        array["str_BMTT_2"] = "第三局";
        array["str_BMTT_3"] = "第四局";
        array["str_BMTT_4"] = "第五局";
        array["str_BMTT_5"] = "第六局";
        array["str_BMTT_6"] = "第七局";
        array["str_BMTT_7"] = "让分";
        array["str_BMTT_8"] = "球员局数: 大 / 小";
        array["str_BMTT_9"] = "完赛"

        //baseball
        array["str_BS_Y"] = "是";
        array["str_BS_N"] = "不是";
        array["str_BS_0"] = "首五局";
        array["str_BS_1"] = "全场";

        //shooker
        array["str_SK_0"] = "第1 - 5局";
        array["str_SK_1"] = "第6 - 8局";
        array["str_SK_2"] = "第10 - 14局";
        array["str_SK_3"] = "第15 - 17局";
        array["str_SK_4"] = "第19 - 23局";
        array["str_SK_5"] = "第24 - 26局";
        array["str_SK_6"] = "全场";
        // totalBets result detail end

        //過濾器
        array["str_ALL"] = "所有球类";
		array["str_FT"] = "足球";
		array["str_BK"] = "篮球 / 美式足球";
		array["str_TN"] = "网球";
		array["str_VB"] = "排球";
		array["str_BM"] = "羽毛球";
		array["str_TT"] = "乒乓球";
		array["str_BS"] = "棒球";
		array["str_SK"] = "斯诺克/台球";
		array["str_OP"] = "其他球类";
        array["str_SFS"] = "特殊冠军";
        array["str_FS"] = "冠军";

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

        array["btns_gtype"] = "球类";
		array["btns_stake"] = "下注金额";
		array["btns_view"] = "观看";
		array["btns_downline"] = "下线";
		array["btns_league"] = "联盟";
		array["btns_datestarted"] = "日期";
		array["btns_market"] = "盘口类型";
		array["btns_eventdate"] = "赛事日期";
		array["btns_class"] = "冠军类别";
		array["btns_dateoutright"] = "日期";
		array["btns_date"] = "日期";
		array["btns_dateresult"] = "日期";
		array["btns_event"] = "赛事";
		array["btns_bettype"] = "玩法";
        array["btns_bet"] = "注单";
        array["btns_score"] = "比分";

        array["btns_site"] = "网站";

        array["str_market_ALL"] = "所有盘口";
        array["str_market_rb"] = "滚球";
        array["str_market_ft"] = "今日";
        array["str_market_fu"] = "早盘";

        array["str_wmc_market_ALL"] =array["str_market_ALL"];
        array["str_wmc_market_rb"] = array["str_market_rb"];
        array["str_wmc_market_ft"] = array["str_market_ft"];
        array["str_wmc_market_ft1"] = "初盘";
        array["str_wmc_market_fu"] = array["str_market_fu"];

        array["filter_view_full"] = "显示所有";
        array["filter_view_com"] = "公司占成" ;
        array["filter_view_c"] = "股东占成" ;
        array["filter_view_s"] = "总代理占成" ;
        array["filter_view_a"] = "代理商占成" ;
        array["filter_view_csa"] = "股东 + 总代理 + 代理商占成" ;
        array["filter_view_cs"] = "股东 + 总代理占成" ;
        array["filter_view_sa"] = "总代理 + 代理商占成" ;
        array["filter_view_my"] = "我的占成";

        array["filter_date_yesterday"] = "昨日";
        array["filter_date_today"] = "今日";
        array["filter_date_future"] = "未来";
        array["filter_date_all"] = "所有";
        array["filter_date_show"] = "日期";

        array["filter_downline_show"] = "下线";
        array["filter_league_show"] = "联盟";
        array["filter_market_show"] = "盘口类型";

        array["filter_err_downline_max"] = "您最多可选择*LIMITCOUNT*个帐号";

        array["filter_market_all"] = "所有";
        array["filter_market_rb"] = "滚球";
        array["filter_market_pl"] = "单式";

        array["filter_more"] = "大于";
		array["filter_less"] = "小于";
        array["filter_same"] = "等于";

        array["str_day"] = "日";

        //簡體
        array["CancelType0"] = "正式比分";
        array["CancelType-1"] = "赛事取消";
        array["CancelType-2"] = "队名错误";
        array["CancelType-3"] = "赛事延赛";
        array["CancelType-4"] = "赛事时间不正规";
        array["CancelType-5"] = "赛事腰斩";
        array["CancelType-6"] = "球员弃权";
        array["CancelType-7"] = "主客场错误";
        array["CancelType-8"] = "联赛名称错误";
        array["CancelType-9"] = "赛事无PK/ 加时";
        array["CancelType-10"] = "赛程错误";
        array["CancelType-11"] = "不显示赛程";
        array["CancelType-12"] = "取消";
        array["CancelType-13"] = "赛事腰斩";
        array["CancelType-14"] = "无局数";
        array["CancelType_SK-14"] = "无局数";

        //Ricky 2018-03-06 PJB-188 CRM-249網球下一局独赢
        array["title_RFA01_0_TN"] = "独赢 - 第一盘 第一局";
        array["title_RFA02_0_TN"] = "独赢 - 第一盘 第二局";
        array["title_RFA03_0_TN"] = "独赢 - 第一盘 第三局";
        array["title_RFA04_0_TN"] = "独赢 - 第一盘 第四局";
        array["title_RFA05_0_TN"] = "独赢 - 第一盘 第五局";
        array["title_RFA06_0_TN"] = "独赢 - 第一盘 第六局";
        array["title_RFA07_0_TN"] = "独赢 - 第一盘 第七局";
        array["title_RFA08_0_TN"] = "独赢 - 第一盘 第八局";
        array["title_RFA09_0_TN"] = "独赢 - 第一盘 第九局";
        array["title_RFA10_0_TN"] = "独赢 - 第一盘 第十局";
        array["title_RFA11_0_TN"] = "独赢 - 第一盘 第十一局";
        array["title_RFA12_0_TN"] = "独赢 - 第一盘 第十二局";
        array["title_RFA13_0_TN"] = "独赢 - 第一盘 第十三局";
        array["title_RFB01_0_TN"] = "独赢 - 第二盘 第一局";
        array["title_RFB02_0_TN"] = "独赢 - 第二盘 第二局";
        array["title_RFB03_0_TN"] = "独赢 - 第二盘 第三局";
        array["title_RFB04_0_TN"] = "独赢 - 第二盘 第四局";
        array["title_RFB05_0_TN"] = "独赢 - 第二盘 第五局";
        array["title_RFB06_0_TN"] = "独赢 - 第二盘 第六局";
        array["title_RFB07_0_TN"] = "独赢 - 第二盘 第七局";
        array["title_RFB08_0_TN"] = "独赢 - 第二盘 第八局";
        array["title_RFB09_0_TN"] = "独赢 - 第二盘 第九局";
        array["title_RFB10_0_TN"] = "独赢 - 第二盘 第十局";
        array["title_RFB11_0_TN"] = "独赢 - 第二盘 第十一局";
        array["title_RFB12_0_TN"] = "独赢 - 第二盘 第十二局";
        array["title_RFB13_0_TN"] = "独赢 - 第二盘 第十三局";
        array["title_RFC01_0_TN"] = "独赢 - 第三盘 第一局";
        array["title_RFC02_0_TN"] = "独赢 - 第三盘 第二局";
        array["title_RFC03_0_TN"] = "独赢 - 第三盘 第三局";
        array["title_RFC04_0_TN"] = "独赢 - 第三盘 第四局";
        array["title_RFC05_0_TN"] = "独赢 - 第三盘 第五局";
        array["title_RFC06_0_TN"] = "独赢 - 第三盘 第六局";
        array["title_RFC07_0_TN"] = "独赢 - 第三盘 第七局";
        array["title_RFC08_0_TN"] = "独赢 - 第三盘 第八局";
        array["title_RFC09_0_TN"] = "独赢 - 第三盘 第九局";
        array["title_RFC10_0_TN"] = "独赢 - 第三盘 第十局";
        array["title_RFC11_0_TN"] = "独赢 - 第三盘 第十一局";
        array["title_RFC12_0_TN"] = "独赢 - 第三盘 第十二局";
        array["title_RFC13_0_TN"] = "独赢 - 第三盘 第十三局";
        array["title_RFC14_0_TN"] = "独赢 - 第三盘 第十四局";
        array["title_RFC15_0_TN"] = "独赢 - 第三盘 第十五局";
        array["title_RFC16_0_TN"] = "独赢 - 第三盘 第十六局";
        array["title_RFC17_0_TN"] = "独赢 - 第三盘 第十七局";
        array["title_RFC18_0_TN"] = "独赢 - 第三盘 第十八局";
        array["title_RFC19_0_TN"] = "独赢 - 第三盘 第十九局";
        array["title_RFC20_0_TN"] = "独赢 - 第三盘 第二十局";
        array["title_RFC21_0_TN"] = "独赢 - 第三盘 第二十一局";
        array["title_RFC22_0_TN"] = "独赢 - 第三盘 第二十二局";
        array["title_RFC23_0_TN"] = "独赢 - 第三盘 第二十三局";
        array["title_RFC24_0_TN"] = "独赢 - 第三盘 第二十四局";
        array["title_RFC25_0_TN"] = "独赢 - 第三盘 第二十五局";
        array["title_RFC26_0_TN"] = "独赢 - 第三盘 第二十六局";
        array["title_RFC27_0_TN"] = "独赢 - 第三盘 第二十七局";
        array["title_RFC28_0_TN"] = "独赢 - 第三盘 第二十八局";
        array["title_RFC29_0_TN"] = "独赢 - 第三盘 第二十九局";
        array["title_RFC30_0_TN"] = "独赢 - 第三盘 第三十局";
        array["title_RFC31_0_TN"] = "独赢 - 第三盘 第三十一局";
        array["title_RFC32_0_TN"] = "独赢 - 第三盘 第三十二局";
        array["title_RFC33_0_TN"] = "独赢 - 第三盘 第三十三局";
        array["title_RFC34_0_TN"] = "独赢 - 第三盘 第三十四局";
        array["title_RFC35_0_TN"] = "独赢 - 第三盘 第三十五局";
        array["title_RFC36_0_TN"] = "独赢 - 第三盘 第三十六局";
        array["title_RFC37_0_TN"] = "独赢 - 第三盘 第三十七局";
        array["title_RFC38_0_TN"] = "独赢 - 第三盘 第三十八局";
        array["title_RFC39_0_TN"] = "独赢 - 第三盘 第三十九局";
        array["title_RFC40_0_TN"] = "独赢 - 第三盘 第四十局";
        array["title_RFC41_0_TN"] = "独赢 - 第三盘 第四十一局";
        array["title_RFC42_0_TN"] = "独赢 - 第三盘 第四十二局";
        array["title_RFC43_0_TN"] = "独赢 - 第三盘 第四十三局";
        array["title_RFC44_0_TN"] = "独赢 - 第三盘 第四十四局";
        array["title_RFC45_0_TN"] = "独赢 - 第三盘 第四十五局";
        array["title_RFC46_0_TN"] = "独赢 - 第三盘 第四十六局";
        array["title_RFC47_0_TN"] = "独赢 - 第三盘 第四十七局";
        array["title_RFC48_0_TN"] = "独赢 - 第三盘 第四十八局";
        array["title_RFC49_0_TN"] = "独赢 - 第三盘 第四十九局";
        array["title_RFC50_0_TN"] = "独赢 - 第三盘 第五十局";
        array["title_RFD01_0_TN"] = "独赢 - 第四盘 第一局";
        array["title_RFD02_0_TN"] = "独赢 - 第四盘 第二局";
        array["title_RFD03_0_TN"] = "独赢 - 第四盘 第三局";
        array["title_RFD04_0_TN"] = "独赢 - 第四盘 第四局";
        array["title_RFD05_0_TN"] = "独赢 - 第四盘 第五局";
        array["title_RFD06_0_TN"] = "独赢 - 第四盘 第六局";
        array["title_RFD07_0_TN"] = "独赢 - 第四盘 第七局";
        array["title_RFD08_0_TN"] = "独赢 - 第四盘 第八局";
        array["title_RFD09_0_TN"] = "独赢 - 第四盘 第九局";
        array["title_RFD10_0_TN"] = "独赢 - 第四盘 第十局";
        array["title_RFD11_0_TN"] = "独赢 - 第四盘 第十一局";
        array["title_RFD12_0_TN"] = "独赢 - 第四盘 第十二局";
        array["title_RFD13_0_TN"] = "独赢 - 第四盘 第十三局";
        array["title_RFE01_0_TN"] = "独赢 - 第五盘 第一局";
        array["title_RFE02_0_TN"] = "独赢 - 第五盘 第二局";
        array["title_RFE03_0_TN"] = "独赢 - 第五盘 第三局";
        array["title_RFE04_0_TN"] = "独赢 - 第五盘 第四局";
        array["title_RFE05_0_TN"] = "独赢 - 第五盘 第五局";
        array["title_RFE06_0_TN"] = "独赢 - 第五盘 第六局";
        array["title_RFE07_0_TN"] = "独赢 - 第五盘 第七局";
        array["title_RFE08_0_TN"] = "独赢 - 第五盘 第八局";
        array["title_RFE09_0_TN"] = "独赢 - 第五盘 第九局";
        array["title_RFE10_0_TN"] = "独赢 - 第五盘 第十局";
        array["title_RFE11_0_TN"] = "独赢 - 第五盘 第十一局";
        array["title_RFE12_0_TN"] = "独赢 - 第五盘 第十二局";
        array["title_RFE13_0_TN"] = "独赢 - 第五盘 第十三局";
        array["title_RFE14_0_TN"] = "独赢 - 第五盘 第十四局";
        array["title_RFE15_0_TN"] = "独赢 - 第五盘 第十五局";
        array["title_RFE16_0_TN"] = "独赢 - 第五盘 第十六局";
        array["title_RFE17_0_TN"] = "独赢 - 第五盘 第十七局";
        array["title_RFE18_0_TN"] = "独赢 - 第五盘 第十八局";
        array["title_RFE19_0_TN"] = "独赢 - 第五盘 第十九局";
        array["title_RFE20_0_TN"] = "独赢 - 第五盘 第二十局";
        array["title_RFE21_0_TN"] = "独赢 - 第五盘 第二十一局";
        array["title_RFE22_0_TN"] = "独赢 - 第五盘 第二十二局";
        array["title_RFE23_0_TN"] = "独赢 - 第五盘 第二十三局";
        array["title_RFE24_0_TN"] = "独赢 - 第五盘 第二十四局";
        array["title_RFE25_0_TN"] = "独赢 - 第五盘 第二十五局";
        array["title_RFE26_0_TN"] = "独赢 - 第五盘 第二十六局";
        array["title_RFE27_0_TN"] = "独赢 - 第五盘 第二十七局";
        array["title_RFE28_0_TN"] = "独赢 - 第五盘 第二十八局";
        array["title_RFE29_0_TN"] = "独赢 - 第五盘 第二十九局";
        array["title_RFE30_0_TN"] = "独赢 - 第五盘 第三十局";
        array["title_RFE31_0_TN"] = "独赢 - 第五盘 第三十一局";
        array["title_RFE32_0_TN"] = "独赢 - 第五盘 第三十二局";
        array["title_RFE33_0_TN"] = "独赢 - 第五盘 第三十三局";
        array["title_RFE34_0_TN"] = "独赢 - 第五盘 第三十四局";
        array["title_RFE35_0_TN"] = "独赢 - 第五盘 第三十五局";
        array["title_RFE36_0_TN"] = "独赢 - 第五盘 第三十六局";
        array["title_RFE37_0_TN"] = "独赢 - 第五盘 第三十七局";
        array["title_RFE38_0_TN"] = "独赢 - 第五盘 第三十八局";
        array["title_RFE39_0_TN"] = "独赢 - 第五盘 第三十九局";
        array["title_RFE40_0_TN"] = "独赢 - 第五盘 第四十局";
        array["title_RFE41_0_TN"] = "独赢 - 第五盘 第四十一局";
        array["title_RFE42_0_TN"] = "独赢 - 第五盘 第四十二局";
        array["title_RFE43_0_TN"] = "独赢 - 第五盘 第四十三局";
        array["title_RFE44_0_TN"] = "独赢 - 第五盘 第四十四局";
        array["title_RFE45_0_TN"] = "独赢 - 第五盘 第四十五局";
        array["title_RFE46_0_TN"] = "独赢 - 第五盘 第四十六局";
        array["title_RFE47_0_TN"] = "独赢 - 第五盘 第四十七局";
        array["title_RFE48_0_TN"] = "独赢 - 第五盘 第四十八局";
        array["title_RFE49_0_TN"] = "独赢 - 第五盘 第四十九局";
        array["title_RFE50_0_TN"] = "独赢 - 第五盘 第五十局";

        array["HT"] = "半场";
        array["1H"] = "上半场";
        array["2H"] = "下半场";
        array["BK_HT"] = "上半场";
        array["BK_H2"] = "下半场";
        array["BK_Q1"] = "第一节";
        array["BK_Q2"] = "第二节";
        array["BK_Q3"] = "第三节";
        array["BK_Q4"] = "第四节";
        array["BK_OT"] = "加时";
        array["BK_half_time"] = "半场";

        array["BK_HT_allbet"] = "上半场";
        array["BK_H2_allbet"] = "下半场";
        array["BK_Q1_allbet"] = "第一节";
        array["BK_Q2_allbet"] = "第二节";
        array["BK_Q3_allbet"] = "第三节";
        array["BK_Q4_allbet"] = "第四节";
        array["BK_OT_allbet"] = "加时";
        array["BK_half_time_allbet"] = "半场";

        array["Best_of_3"] = "三盘两胜";
        array["Best_of_5"] = "五盘三胜";
        array["Best_of_7"] = "七盘四胜";
        array["Best_of_12"] = "十二盘制";

        array["midfield"] = "中";
        array["live"] = "滚球";


        return array;
    }

    _self.get = function (_key) {
        return LangxAry[_key];
    }

}
