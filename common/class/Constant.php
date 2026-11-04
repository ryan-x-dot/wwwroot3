<?php
/**
 * Class Constant
 * 定义常量
 */

class Constant
{
    /* 数据库 */
    const DB_CLIENT = "`db_client`";//玩家数据

    const DB_SPORTS = "`db_sports`";//体育赛事

    const T_ADMIN = self::DB_CLIENT.".`ad`";//公司
    const T_ADMIN_RECORD = self::DB_CLIENT.".`ad_record`";//公司活动轨迹表
    const T_ADMIN_LOGIN_LOG = self::DB_CLIENT.".`ad_login_log`";//公司登陆日志

    const T_CHAT =  self::DB_CLIENT.".`chats`";//会话表

    const T_RANK = self::DB_CLIENT.".`ag`";//代理商表
    const T_RANK_RECORD = self::DB_CLIENT.".`ag_record`";//代理商 活动轨迹表
    const T_RANK_LOGIN_LOG = self::DB_CLIENT.".`ag_login_log`";//登0 登陆日志

    const T_MEMBER = self::DB_CLIENT.".`mem`";//会员
    const T_MEMBER_RECORD = self::DB_CLIENT.".`mem_record`";//会员 活动轨迹表
    const T_MEMBER_LOGIN_LOG = self::DB_CLIENT.".`mem_login_log`";//会员 登陆日志

    const T_BET = self::DB_CLIENT.".`bets`";//注单表
    const T_BET_P3 = self::DB_CLIENT.".`bets_p3`";//过关注单表

    const T_CONFIG = self::DB_CLIENT.".`cfg`";//配置表
    const T_CONFIG_DEFAULT = self::DB_CLIENT.".`cfg_default`";//默认配置表 

    const T_CREDIT_LOG =  self::DB_CLIENT.".`credit_log`";//现金额度记录
    const T_STOP_ERROR_LOG = self::DB_CLIENT.".`stop_error_log`";//禁止登陆日志

    const T_MESSAGE = self::DB_CLIENT.".`message`";//公告表
    const T_FORGET = self::DB_CLIENT.".`forget_pwd`";//忘记密码
    const T_TEMPLATE = self::DB_CLIENT.".`template_value`";//会员模板

    const T_UID = self::DB_SPORTS.".`uid`"; //采集账号表
    const T_URL = self::DB_SPORTS.".`url`";//采集网址表
    const T_AGUID = self::DB_SPORTS.".`aguid`";//代理采集账号表 
    const T_HTML = self::DB_SPORTS.".`html`";//html采集

    /* 体育赛事 - 表*/
    const S_FT = self::DB_SPORTS.".`foot_match`";//足球
    const S_FT_XML = self::DB_SPORTS.".`foot_match_xml`";//足球xml

    const S_BK = self::DB_SPORTS.".`bask_match`";//篮球
    const S_BK_XML = self::DB_SPORTS.".`bask_match_xml`";//篮球xml

    const S_TT = self::DB_SPORTS.".`tt_match`";//乒乓球
    const S_TT_XML = self::DB_SPORTS.".`tt_match_xml`";//乒乓球xml

    const S_SK = self::DB_SPORTS.".`sk_match`";//斯诺克
    const S_SK_XML = self::DB_SPORTS.".`sk_match_xml`";//斯诺克xml

    const S_ES = self::DB_SPORTS.".`es_match`";//电竞
    const S_ES_XML = self::DB_SPORTS.".`es_match_json`";//电竞json

    const S_BM = self::DB_SPORTS.".`bm_match`";//羽毛球
    const S_BM_XML = self::DB_SPORTS.".`bm_match_xml`";//羽毛球xml

    const S_TN = self::DB_SPORTS.".`tennis`";//网球
    const S_TN_XML = self::DB_SPORTS.".`tennis_xml`";//网球xml

    const S_VB = self::DB_SPORTS.".`volleyball`";//排球
    const S_VB_XML = self::DB_SPORTS.".`volleyball_xml`";//排球xml

    const S_BS = self::DB_SPORTS.".`baseball`";//棒球
    const S_BS_XML = self::DB_SPORTS.".`baseball_xml`";//棒球xml

    const S_OP = self::DB_SPORTS.".`other_play`";//其他
    const S_OP_XML = self::DB_SPORTS.".`other_play_xml`";//其他

    const S_SP = self::DB_SPORTS.".`sfs_match`";//冠军

   
    const VIEW_CLIENT_CURL = self::DB_SPORTS.".`c_curl`"; //前端采集可用UID

    const VIEW_SEVER_CURL = self::DB_SPORTS.".`s_curl`"; //后端采集可用UID


    /* 常用字符 */
    const ADS = "ads";//超管别名

    const AD = "ad";//总后别名

    const D0 = "d0";//登0别名

    const CO = "co";//登1别名

    const SU = "su";//登2别名

    const AG = "ag";//登3别名

    const MEM = "mem";//会员别名

    const SUB = "sub";//子账号

    const LOGIN_LAYER = "login_layer";//登陆类型参数

    /* 传入参数 */
    const LOGIN = "login";

    const LOGIN_CHK = "login_chk";//登陆验证

    const CHG_PWD = "chg_pwd";//修改密码

    const TMP_LOGINID_CHK = "tmp_loginID_chk";

    const CHG_PWD_SAFE = "chg_pwd_safe";

    const TOP_MENU = "top_menu";

    const LEFT_MENU = "left_menu";

    const BOTTOM_MENU = "bottome_menu";

    const DASHBOARD_MAIN = "dashboard_main";

    const ALERT_MSG = "alert_msg";

    const GET_ANNOUNCEMENT = "get_announcement";//公告

    const GET_PERFORMANCE = "get_performance";//各性能概况

    const GET_DASHBOARD = "get_dashboard";//账户仪表板

    const GET_ACC_MEM_LIST = "get_acc_mem_list";//会员列表

    const GET_UPPER_CONF = "get_upper_conf";//上层参数

    const PREV_DATA = "prevData";//检查权限

    const CHK_USERNAME = "chk_username";//检测账号

    const MEMBERS_ADD = "body_members_add";//添加会员账户

    const ADMIN_ADD = "body_admin_add";//添加公司

    const ACC_AD_LIST = "acc_ad_list";//公司列表 界面

    const GET_ACC_AD_LIST = "get_acc_ad_list";//公司列表 数据

    const ACC_AD_ADD = "acc_ad_add";//新增公司

    const ACC_AD_EDIT = "acc_ad_edit";//修改公司

    const ACC_AD_DETAIL = "acc_ad_detail";

    const ACC_DETAIL = "acc_detail";

    const GET_AD_LIST = "get_ad_list";//公司资料查询

    const GET_USER_CREDIT = "get_user_credit";

    const ACC_D0_LIST = "acc_d0_list";//分公司列表

    const ACC_CO_LIST = "acc_co_list";//股东列表

    const ACC_SU_LIST = "acc_su_list";//总代列表

    const ACC_AG_LIST = "acc_ag_list";//代理列表

    const ACC_MEM_LIST = "acc_mem_list";//会员列表

    const ACC_SUB_LIST = "acc_sub_list";//子账号列表

    const GET_MEM_LIST = "get_mem_list";//修改会员-会员查询

    const GET_ACC_MEM_COMM = "get_acc_mem_comm";//修改会员-会员退水和限额（查询/修改）

    const BODY_MEMBERS_EDIT = "body_members_edit";//修改会员[用户详细设定]-入库

    const CHG_PSW = "chg_psw";//修改会员[用户详细设定-修改密码]-入库
}