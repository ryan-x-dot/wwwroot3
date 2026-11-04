<?php
$ag_url = "https://ag.hga050.com";
$prefix = "hg";
$out_time = 20 * 60;//不活动自动提线时间
$max_sub = 5;//最多子账号数
$default_page_size = 30;//默认单页显示条数
$dangerous_max_time = 35;//滚球超过该秒数自动确认
$dangerous_time = 30;//滚球确认时间
$default_ior = 1.90;//默认共计水位
$default_ior1 = 3.90;//默认共计水位(去本金)
$copy_day = 2;//分离两天前的赛事
//$bet_table_names = ["bet","bet_copy1"];//注单分表 表名配置
$announcements = [//公告分类
    1=>"general",//一般公告
    2=>"personal",//个人公告
    3=>"important",//重要公告
    4=>"proNews",//私人消息
    5=>"proChat",//私人会话
    6=>"forgetPwd"//密码申诉
];
$announcements_arr = [
    "general" => "一般公告",
    "personal" => "个人公告",
    "important" => "重要公告",
    "proNews" => "私人消息",
    "proChat" => "私人会话",
    "forgetPwd" => "密码申诉"
];
$statusArr = [1=>"Y",2=>"N",3=>"S",4=>"F",5=>"E"];//账户状态分类
$dir = dirname(dirname(__FILE__));
$cn = include_once $dir."/lang/zh-cn.php";
$tw = include_once $dir."/lang/zh-tw.php";
$en = include_once $dir."/lang/en-us.php";
$currencys = [
    "zh-cn" => $cn["currencys"],
    "zh-tw" => $tw["currencys"],
    "en-us" => $en["currencys"],
];
$status_arr = [
    "zh-cn" => $cn["status_arr"],
    "zh-tw" => $tw["status_arr"],
    "en-us" => $en["status_arr"],
];
$ls_msg = [
    "zh-cn" => $cn["ls_msg"],
    "zh-tw" => $tw["ls_msg"],
    "en-us" => $en["ls_msg"],
];

$langx_name = ["zh-cn"=>"简体","zh-tw"=>"繁体","en-us"=>"英文"];

$online_name = [
    "zh-cn" => ["su"=>"线上总代","ag"=>"线上代理","mem"=>"线上会员","edit"=>"修改","swap"=>"对调","result"=>"结算","delete"=>"删除","bet_manger"=>"注单处理","hidden"=>"隐藏","add"=>"添单"],
    "zh-tw" => ["su"=>"線上總代","ag"=>"線上代理","mem"=>"線上會員","edit"=>"修改","swap"=>"對調","result"=>"結算","delete"=>"刪除","bet_manger"=>"註單處理","hidden"=>"隱藏","add"=>"添单"],
    "en-us" => ["su"=>"Online Master Agent","ag"=>"Online Agent","mem"=>"Online Member","edit"=>"Edit","swap"=>"Swap","result"=>"Result","delete"=>"Delete","bet_manger"=>"Bet Manger","hidden"=>"Hidden","add"=>"Add"]
];

$result_status = [
    "zh-cn" => [
        "正式比分","赛事取消","队名错误","赛事延赛","赛事时间不正规","赛事腰斩","球员弃权","主客场错误",
        "联赛名称错误","赛事无pk/加时","赛程错误","不显示赛程","取消","赛事腰斩","无局数","比分错误","进球取消","赔率错误","非正常注单","无点球","赛事时间不正规","无赛事","视频助理裁判"
    ],
    "zh-tw" => [
        "正式比分","賽事取消","隊名錯誤","賽事延賽","賽事時間不正規","賽事腰斬","球員棄權","主客場錯誤",
        "聯賽名稱錯誤","賽事無pk/加時","賽程錯誤","不顯示賽程","取消","賽事腰斬","無局數","比分错误","進球取消","賠率錯誤","非正常註單","無點球","賽事時間不正規","無賽事","視頻助理裁判"
    ],
    "en-us" => [
        "result","matchcancelled","wrongteamname","postponed","irregulareventtime","suspended","retirement","wronghome/away",
        "wrongleaguename","nopk/extratime","fixtureeventerror","invisiblematch","cancel","suspended","noset","noframe","Goal cancellation","Odds error","Abnormal Bets","No PK","Irregular Event Time","No Game","playernotparticipate"
    ]
];

//默认 退水和限额
$game_default_config = [
    'FT' => [
        'data' => [
            'R_1' => [
                'type' => 'R_1',
                'rtype' => 'R',
                'ltype' => '1',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 2.25,
            ],
            'R_2' => [
                'type' => 'R_2',
                'rtype' => 'R',
                'ltype' => '2',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 1.25,
            ],
            'R_3' => [
                'type' => 'R_3',
                'rtype' => 'R',
                'ltype' => '3',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 0.75,
            ],
            'R_4' => [
                'type' => 'R_4',
                'rtype' => 'R',
                'ltype' => '4',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 0,
            ],
            'RE_1' => [
                'type' => 'RE_1',
                'rtype' => 'RE',
                'ltype' => '1',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 2.25,
            ],
            'RE_2' => [
                'type' => 'RE_2',
                'rtype' => 'RE',
                'ltype' => '2',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 1.25,
            ],
            'RE_3' => [
                'type' => 'RE_3',
                'rtype' => 'RE',
                'ltype' => '3',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 0.75,
            ],
            'RE_4' => [
                'type' => 'RE_4',
                'rtype' => 'RE',
                'ltype' => '4',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 0,
            ],
            'M_1' => [
                'type' => 'M_1',
                'rtype' => 'M',
                'ltype' => '1',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 0,
            ],
            'M_2' => [
                'type' => 'M_2',
                'rtype' => 'M',
                'ltype' => '2',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 0,
            ],
            'M_3' => [
                'type' => 'M_3',
                'rtype' => 'M',
                'ltype' => '3',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 0,
            ],
            'M_4' => [
                'type' => 'M_4',
                'rtype' => 'M',
                'ltype' => '4',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 0,
            ],
            'DT_1' => [
                'type' => 'DT_1',
                'rtype' => 'DT',
                'ltype' => '1',
                'sc' => '220000',
                'so' => '55000',
                'war' => 0,
            ],
            'DT_2' => [
                'type' => 'DT_2',
                'rtype' => 'DT',
                'ltype' => '2',
                'sc' => '220000',
                'so' => '55000',
                'war' => 0,
            ],
            'DT_3' => [
                'type' => 'DT_3',
                'rtype' => 'DT',
                'ltype' => '3',
                'sc' => '220000',
                'so' => '55000',
                'war' => 0,
            ],
            'DT_4' => [
                'type' => 'DT_4',
                'rtype' => 'DT',
                'ltype' => '4',
                'sc' => '220000',
                'so' => '55000',
                'war' => 0,
            ],
            'RDT_1' => [
                'type' => 'RDT_1',
                'rtype' => 'RDT',
                'ltype' => '1',
                'sc' => '220000',
                'so' => '55000',
                'war' => 0,
            ],
            'RDT_2' => [
                'type' => 'RDT_2',
                'rtype' => 'RDT',
                'ltype' => '2',
                'sc' => '220000',
                'so' => '55000',
                'war' => 0,
            ],
            'RDT_3' => [
                'type' => 'RDT_3',
                'rtype' => 'RDT',
                'ltype' => '3',
                'sc' => '220000',
                'so' => '55000',
                'war' => 0,
            ],
            'RDT_4' => [
                'type' => 'RDT_4',
                'rtype' => 'RDT',
                'ltype' => '4',
                'sc' => '220000',
                'so' => '55000',
                'war' => 0,
            ],
        ],
        'gtype' => 'FT',
    ],
    'BK' => [
        'data' => [
            'DT_1' => [
                'type' => 'DT_1',
                'rtype' => 'DT',
                'ltype' => '1',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'DT_2' => [
                'type' => 'DT_2',
                'rtype' => 'DT',
                'ltype' => '2',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'DT_3' => [
                'type' => 'DT_3',
                'rtype' => 'DT',
                'ltype' => '3',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'DT_4' => [
                'type' => 'DT_4',
                'rtype' => 'DT',
                'ltype' => '4',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'M_1' => [
                'type' => 'M_1',
                'rtype' => 'M',
                'ltype' => '1',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'M_2' => [
                'type' => 'M_2',
                'rtype' => 'M',
                'ltype' => '2',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'M_3' => [
                'type' => 'M_3',
                'rtype' => 'M',
                'ltype' => '3',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'M_4' => [
                'type' => 'M_4',
                'rtype' => 'M',
                'ltype' => '4',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'R_1' => [
                'type' => 'R_1',
                'rtype' => 'R',
                'ltype' => '1',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 2.25,
            ],
            'R_2' => [
                'type' => 'R_2',
                'rtype' => 'R',
                'ltype' => '2',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 1.25,
            ],
            'R_3' => [
                'type' => 'R_3',
                'rtype' => 'R',
                'ltype' => '3',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 0.75,
            ],
            'R_4' => [
                'type' => 'R_4',
                'rtype' => 'R',
                'ltype' => '4',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 0,
            ],
            'RE_1' => [
                'type' => 'RE_1',
                'rtype' => 'RE',
                'ltype' => '1',
                'sc' => '1100000',
                'so' => '220000',
                'war' => 2.25,
            ],
            'RE_2' => [
                'type' => 'RE_2',
                'rtype' => 'RE',
                'ltype' => '2',
                'sc' => '1100000',
                'so' => '220000',
                'war' => 1.25,
            ],
            'RE_3' => [
                'type' => 'RE_3',
                'rtype' => 'RE',
                'ltype' => '3',
                'sc' => '1100000',
                'so' => '220000',
                'war' => 0.75,
            ],
            'RE_4' => [
                'type' => 'RE_4',
                'rtype' => 'RE',
                'ltype' => '4',
                'sc' => '1100000',
                'so' => '220000',
                'war' => 0,
            ],
        ],
        'gtype' => 'BK',
    ],
    'FS' => [
        'data' => [
            'FS_1' => [
                'type' => 'FS_1',
                'rtype' => 'FS',
                'ltype' => '1',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'FS_2' => [
                'type' => 'FS_2',
                'rtype' => 'FS',
                'ltype' => '2',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'FS_3' => [
                'type' => 'FS_3',
                'rtype' => 'FS',
                'ltype' => '3',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'FS_4' => [
                'type' => 'FS_4',
                'rtype' => 'FS',
                'ltype' => '4',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
        ],
        'gtype' => 'FS',
    ],
    'OP' => [
        'data' => [
            'DT_1' => [
                'type' => 'DT_1',
                'rtype' => 'DT',
                'ltype' => '1',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'DT_2' => [
                'type' => 'DT_2',
                'rtype' => 'DT',
                'ltype' => '2',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'DT_3' => [
                'type' => 'DT_3',
                'rtype' => 'DT',
                'ltype' => '3',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'DT_4' => [
                'type' => 'DT_4',
                'rtype' => 'DT',
                'ltype' => '4',
                'sc' => '110000',
                'so' => '55000',
                'war' => 0,
            ],
            'M_1' => [
                'type' => 'M_1',
                'rtype' => 'M',
                'ltype' => '1',
                'sc' => '220000',
                'so' => '55000',
                'war' => 0,
            ],
            'M_2' => [
                'type' => 'M_2',
                'rtype' => 'M',
                'ltype' => '2',
                'sc' => '220000',
                'so' => '55000',
                'war' => 0,
            ],
            'M_3' => [
                'type' => 'M_3',
                'rtype' => 'M',
                'ltype' => '3',
                'sc' => '220000',
                'so' => '55000',
                'war' => 0,
            ],
            'M_4' => [
                'type' => 'M_4',
                'rtype' => 'M',
                'ltype' => '4',
                'sc' => '220000',
                'so' => '55000',
                'war' => 0,
            ],
            'R_1' => [
                'type' => 'R_1',
                'rtype' => 'R',
                'ltype' => '1',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 2.25,
            ],
            'R_2' => [
                'type' => 'R_2',
                'rtype' => 'R',
                'ltype' => '2',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 1.25,
            ],
            'R_3' => [
                'type' => 'R_3',
                'rtype' => 'R',
                'ltype' => '3',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 0.75,
            ],
            'R_4' => [
                'type' => 'R_4',
                'rtype' => 'R',
                'ltype' => '4',
                'sc' => '1100000',
                'so' => '550000',
                'war' => 0,
            ],
            'RE_1' => [
                'type' => 'RE_1',
                'rtype' => 'RE',
                'ltype' => '1',
                'sc' => '1100000',
                'so' => '220000',
                'war' => 2.25,
            ],
            'RE_2' => [
                'type' => 'RE_2',
                'rtype' => 'RE',
                'ltype' => '2',
                'sc' => '1100000',
                'so' => '220000',
                'war' => 1.25,
            ],
            'RE_3' => [
                'type' => 'RE_3',
                'rtype' => 'RE',
                'ltype' => '3',
                'sc' => '1100000',
                'so' => '220000',
                'war' => 0.75,
            ],
            'RE_4' => [
                'type' => 'RE_4',
                'rtype' => 'RE',
                'ltype' => '4',
                'sc' => '1100000',
                'so' => '220000',
                'war' => 0,
            ],
        ],
        'gtype' => 'OP',
    ],
];
$special_d0_sub = ["D0_CO","D0_SU","D0_AG","D0_MEM","D0_MESS","D0_MEM_LOG","D0_MEM_DOMAIN","D0_MEM_DOBET","D0_MEM_EXCHANGE","D0_MEM_EDIT","D0_MEM_TIANDAN","D0_MEM_ZHUDAN","D0_MEM_HIDE","D0_MEM_DEL","D0_MEM_STATUS"];
$special_d0 = [
    "D0_CO","D0_SU","D0_AG","D0_MEM","D0_MESS","D0_MEM_LOG","D0_MEM_DOMAIN","D0_MEM_DOBET","D0_MEM_EXCHANGE","D0_MEM_EDIT","D0_MEM_TIANDAN","D0_MEM_ZHUDAN","D0_MEM_HIDE","D0_MEM_DEL","D0_MEM_STATUS",
    "D1_SU","D1_AG","D1_MEM","D1_MESS","D1_MEM_LOG","D1_MEM_DOMAIN","D1_MEM_DOBET","D1_MEM_EXCHANGE","D1_MEM_EDIT","D1_MEM_HIDE","D1_MEM_DEL"
    ];//权限设定 登0
$special_d0_sub = [
    "D0_CO"=>"N","D0_SU"=>"N","D0_AG"=>"N","D0_MEM"=>"N","D0_MESS"=>"N",
    "D0_MEM_LOG"=>"false","D0_MEM_DOMAIN"=>"false","D0_MEM_DOBET"=>"false",
    "D0_MEM_EXCHANGE"=>"false","D0_MEM_EDIT"=>"false","D0_MEM_TIANDAN"=>"false","D0_MEM_ZHUDAN"=>"false","D0_MEM_HIDE"=>"false","D0_MEM_DEL"=>"false","D0_MEM_STATUS"=>"false"
];

$special_co = ["D1_SU","D1_AG","D1_MEM","D1_MESS","D1_MEM_LOG","D1_MEM_DOMAIN","D1_MEM_DOBET","D1_MEM_EXCHANGE","D1_MEM_EDIT","D1_MEM_HIDE","D1_MEM_DEL"];//权限设定 登1
$special_co_sub = [
    "D1_SU"=>"N","D1_AG"=>"N","D1_MEM"=>"N","D1_MESS"=>"N",
    "D1_MEM_LOG"=>"false","D1_MEM_DOMAIN"=>"false","D1_MEM_DOBET"=>"false",
    "D1_MEM_EXCHANGE"=>"false","D1_MEM_EDIT"=>"false","D1_MEM_HIDE"=>"false","D1_MEM_DEL"=>"false"
];

$special_ad = [
    "AD_CO"=>"Y","AD_SU"=>"Y","AD_AG"=>"Y","AD_MEM"=>"Y","AD_MESS"=>"Y",
    "AD_MEM_LOG"=>"Y","AD_MEM_DOMAIN"=>"Y","AD_MEM_DOBET"=>"Y",
    "AD_MEM_EXCHANGE"=>"Y","AD_MEM_EDIT"=>"Y","AD_MEM_HIDE"=>"Y","AD_MEM_DEL"=>"Y","AD_MEM_ADD"=>"Y"
];
$special_ad_sub = [
    "AD_CO"=>"N","AD_SU"=>"N","AD_AG"=>"N","AD_MEM"=>"N","AD_MESS"=>"N",
    "AD_MEM_LOG"=>"false","AD_MEM_DOMAIN"=>"false","AD_MEM_DOBET"=>"false",
    "AD_MEM_EXCHANGE"=>"false","AD_MEM_EDIT"=>"false","AD_MEM_HIDE"=>"false","AD_MEM_DEL"=>"false","AD_MEM_ADD"=>"false"
];
$game_key = [
    "FT" => ["DT","M","RDT","RE","R"],
    "BK" => ["DT","M","RE","R"],
    "OP" => ["DT","M","RE","R"],
    "FS" => ["FS"],
];
$game_num = ["sc","so","war"];
$week=["日","一","二","三","四","五","六"]; //周
$weekAry = [
    "zh-cn" => ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
    "en-us" => ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
];

$tables = [
    Constant::ADS => [
        "name" => "超管员",
        "t" => Constant::T_ADMIN,
        "t_record" => Constant::T_ADMIN_RECORD,
        "t_login_log" => Constant::T_ADMIN_LOGIN_LOG
    ],
    Constant::AD => [
        "name" => "公司",
        "t" => Constant::T_ADMIN,
        "t_record" => Constant::T_ADMIN_RECORD,
        "t_login_log" => Constant::T_ADMIN_LOGIN_LOG
    ],
    Constant::D0 => [
        "name" => "分公司",
        "t" => Constant::T_RANK,
        "t_record" => Constant::T_RANK_RECORD,
        "t_login_log" => Constant::T_RANK_LOGIN_LOG
    ],
    Constant::CO => [
        "name" => "股东",
        "t" => Constant::T_RANK,
        "t_record" => Constant::T_RANK_RECORD,
        "t_login_log" => Constant::T_RANK_LOGIN_LOG
    ],
    Constant::SU => [
        "name" => "总代理",
        "t" => Constant::T_RANK,
        "t_record" => Constant::T_RANK_RECORD,
        "t_login_log" => Constant::T_RANK_LOGIN_LOG
    ],
    Constant::AG => [
        "name" => "代理商",
        "t" => Constant::T_RANK,
        "t_record" => Constant::T_RANK_RECORD,
        "t_login_log" => Constant::T_RANK_LOGIN_LOG
    ],
    Constant::MEM => [
        "name" => "会员",
        "t" => Constant::T_MEMBER,
        "t_record" => Constant::T_MEMBER_RECORD,
        "t_login_log" => Constant::T_MEMBER_LOGIN_LOG
    ]
];

$sport_tables = [
    "FT"=>[
        "table" => Constant::S_FT,
        "name" => "足球"
    ],
    "BK"=>[
        "table" => Constant::S_BK,
        "name" => "篮球"
    ],
    "TN"=>[
        "table" => Constant::S_TN,
        "name" => "网球"
    ],
    "VB"=>[
        "table" => Constant::S_VB,
        "name" => "羽毛球"
    ],
    "BS"=>[
        "table" => Constant::S_BS,
        "name" => "棒球"
    ],
    "OP"=>[
        "table" => Constant::S_OP,
        "name" => "其他"
    ],
    "FS"=>[
        "table" => Constant::S_SP,
        "name" => "冠军"
    ],
    "BM"=>[
        "table" => Constant::S_BM,
        "name" => "羽毛球"
    ],

    "TT"=>[
        "table" => Constant::S_TT,
        "name" => "乒乓球"
    ],
    "SK"=>[
        "table" => Constant::S_SK,
        "name" => "斯诺克"
    ],
    "ES"=>[
        "table" => Constant::S_ES,
        "name" => "电子竞技"
    ]
];

$match_ary = [
    "FT" => ["name"=>"足球","table"=>Constant::S_FT,"table_xml"=>Constant::S_FT_XML],
    "BK" => ["name"=>"篮球","table"=>Constant::S_BK,"table_xml"=>Constant::S_BK_XML],
    "BS" => ["name"=>"棒球","table"=>Constant::S_BS,"table_xml"=>Constant::S_BS_XML],
    "BM" => ["name"=>"羽毛球","table"=>Constant::S_BM,"table_xml"=>Constant::S_BM_XML],
    "VB" => ["name"=>"排球","table"=>Constant::S_VB,"table_xml"=>Constant::S_VB_XML],
    "TN" => ["name"=>"网球","table"=>Constant::S_TN,"table_xml"=>Constant::S_TN_XML],
    "TT" => ["name"=>"乒乓球","table"=>Constant::S_TT,"table_xml"=>Constant::S_TT_XML],
    "SK" => ["name"=>"斯诺克","table"=>Constant::S_SK,"table_xml"=>Constant::S_SK_XML],
    "OP" => ["name"=>"其他球","table"=>Constant::S_OP,"table_xml"=>Constant::S_OP_XML],
    "ES" => ["name"=>"电子竞技","table"=>Constant::S_ES,"table_xml"=>Constant::S_ES_XML],
];

$gtypes = [
    "FT" => "足球",
    "BK" => "篮球",
    "TN" => "网球",
    "VB" => "排球",
    "BM" => "羽毛球",
    "TT" => "乒乓球",
    "BS" => "棒球",
    "SK" => "斯诺克",
    "OP" => "其他",
    "FS" => "冠军",
    "ES" => "电子竞技"
];
$ltypes = [
    1=>"A",
    2=>"B",
    3=>"C",
    4=>"D",
];

$oddf_type_ary = ['H'=>'香港盘','M'=>'马来盘','I'=>'印尼盘','E'=>'欧洲盘'];

//对应数据库的isHR字段
$isHRAry = [
    "FT" => ["全场","上半","下半"],
    "FU" => ["全场","上半","下半"],
    "BK" => ["全场","第1节","第2节","第3节","第4节","上半","下半","加时"],
    "BU" => ["全场","第1节","第2节","第3节","第4节","上半","下半","加时"],
    "TN" => ["完赛","球员局数","让局","第一盘","第二盘"],
    "TU" => ["完赛","球员局数","让局","第一盘","第二盘"],
    "VB" => ["完赛","让分","第一局","第二局","第三局","第四局","第五局"],
    "VU" => ["完赛","让分","第一局","第二局","第三局","第四局","第五局"],
    "BS" => ["全场","第1局","第2局","第3局","第4局","第5局","第6局","第7局","第8局"],
    "BUS"=> ["全场","第1局","第2局","第3局","第4局","第5局","第6局","第7局","第8局"],
    "BM" => ["全场","上半","下半"],
    "BMFU" => ["全场","上半","下半"],
    "TT" => ["全场","上半","下半"],
    "TTFU" => ["全场","上半","下半"],
    "OP" => ["全场","上半","下半"],
    "OM" => ["全场","上半","下半"],
    "SK" => ["全场","上半","下半"],
    "SKFU" => ["全场","上半","下半"],
    "ES" => ["全场","上半","下半"],
    "ESFU" => ["全场","上半","下半"],
];

/*采集配置 -- 开始*/
/*赛事采集配置 -- 开始*/
//今日单式配置
$rAry = [
    "showtype"=>"today",
    "action"=>"clickCoupon",
    "sorttype"=>"L",
    "date"=>"",
    "rtype"=>"r"
];
//今日过关配置
$p3Ary = [
    "showtype"=>"parlay",
    "action"=>"clickCoupon",
    "sorttype"=>"L",
    "date"=>"all",
    "rtype"=>"r",
    "p3type"=> "P3"
];

//今日波胆配置
$pdAry = [
    "showtype"=>"today",
    "action"=>"clickCoupon",
    "sorttype"=>"L",
    "date"=>0,
    "rtype"=>"pd"
];

//今日滚球配置
$reAry = [
    "showtype"=>"live",
    "sorttype"=>"L",
    "rtype"=>"rb"
];

//今日滚球波胆配置
$repdAry = [
    "showtype"=>"live",
    "sorttype"=>"L",
    "rtype"=>"rpd"
];

//早盘波胆配置
$updAry = [
    "showtype"=>"early",
    "action"=>"clickCoupon",
    "sorttype"=>"L",
    "date"=>"all",
    "rtype"=>"pd"
];
//早盘单式配置
$uAry = [
    "showtype"=>"early",
    "action"=>"clickCoupon",
    "sorttype"=>"L",
    "date"=>"all",
    "rtype"=>"r"
];
$curlMatchAry = [
    "FT_R"  => ["name" => "足球单式",   "gtype"=>"FT","table"=>Constant::S_FT,"table_xml"=>Constant::S_FT_XML,"rtype"=>$rAry["rtype"],"showtype"=>$rAry["showtype"],"action"=>$rAry["action"],"sorttype"=>$rAry["sorttype"],"date"=>$rAry["date"]],
    "BK_R"  => ["name" => "篮球单式",   "gtype"=>"BK","table"=>Constant::S_BK,"table_xml"=>Constant::S_BK_XML,"rtype"=>$rAry["rtype"],"showtype"=>$rAry["showtype"],"action"=>$rAry["action"],"sorttype"=>$rAry["sorttype"],"date"=>$rAry["date"]],
    "TN_R"  => ["name" => "网球单式",   "gtype"=>"TN","table"=>Constant::S_TN,"table_xml"=>Constant::S_TN_XML,"rtype"=>$rAry["rtype"],"showtype"=>$rAry["showtype"],"action"=>$rAry["action"],"sorttype"=>$rAry["sorttype"],"date"=>$rAry["date"]],
    "TT_R"  => ["name" => "乒乓球单式", "gtype"=>"TT","table"=>Constant::S_TT,"table_xml"=>Constant::S_TT_XML,"rtype"=>$rAry["rtype"],"showtype"=>$rAry["showtype"],"action"=>$rAry["action"],"sorttype"=>$rAry["sorttype"],"date"=>$rAry["date"]],
    "BM_R"  => ["name" => "羽毛球单式", "gtype"=>"BM","table"=>Constant::S_BM,"table_xml"=>Constant::S_BM_XML,"rtype"=>$rAry["rtype"],"showtype"=>$rAry["showtype"],"action"=>$rAry["action"],"sorttype"=>$rAry["sorttype"],"date"=>$rAry["date"]],
    "BS_R"  => ["name" => "棒球单式",   "gtype"=>"BS","table"=>Constant::S_BS,"table_xml"=>Constant::S_BS_XML,"rtype"=>$rAry["rtype"],"showtype"=>$rAry["showtype"],"action"=>$rAry["action"],"sorttype"=>$rAry["sorttype"],"date"=>$rAry["date"]],
    "VB_R"  => ["name" => "排球单式",   "gtype"=>"VB","table"=>Constant::S_VB,"table_xml"=>Constant::S_VB_XML,"rtype"=>$rAry["rtype"],"showtype"=>$rAry["showtype"],"action"=>$rAry["action"],"sorttype"=>$rAry["sorttype"],"date"=>$rAry["date"]],
    "SK_R"  => ["name" => "斯诺克单式", "gtype"=>"SK","table"=>Constant::S_SK,"table_xml"=>Constant::S_SK_XML,"rtype"=>$rAry["rtype"],"showtype"=>$rAry["showtype"],"action"=>$rAry["action"],"sorttype"=>$rAry["sorttype"],"date"=>$rAry["date"]],
    "OP_R"  => ["name" => "其他单式",   "gtype"=>"OP","table"=>Constant::S_OP,"table_xml"=>Constant::S_OP_XML,"rtype"=>$rAry["rtype"],"showtype"=>$rAry["showtype"],"action"=>$rAry["action"],"sorttype"=>$rAry["sorttype"],"date"=>$rAry["date"]],
    "ES_R"  => ["name" => "电竞单式",   "gtype"=>"ES","table"=>Constant::S_ES,"table_xml"=>Constant::S_ES_XML,"rtype"=>$rAry["rtype"],"showtype"=>$rAry["showtype"],"action"=>$rAry["action"],"sorttype"=>$rAry["sorttype"],"date"=>$rAry["date"]],


    "FT_P3" => ["name" => "足球过关","gtype"=>"FT","table"=>Constant::S_FT,"table_xml"=>Constant::S_FT_XML,"rtype"=>"rb","showtype"=>$p3Ary["showtype"],"action"=>$p3Ary["action"],"sorttype"=>$p3Ary["sorttype"],"date"=>$p3Ary["date"],"p3type"=> $p3Ary["p3type"]],
    "BK_P3" => ["name" => "篮球过关","gtype"=>"BK","table"=>Constant::S_BK,"table_xml"=>Constant::S_BK_XML,"rtype"=>$p3Ary["rtype"],"showtype"=>$p3Ary["showtype"],"action"=>$p3Ary["action"],"sorttype"=>$p3Ary["sorttype"],"date"=>$p3Ary["date"],"p3type"=> $p3Ary["p3type"]],
    "TN_P3" => ["name" => "网球过关","gtype"=>"TN","table"=>Constant::S_TN,"table_xml"=>Constant::S_TN_XML,"rtype"=>$p3Ary["rtype"],"showtype"=>$p3Ary["showtype"],"action"=>$p3Ary["action"],"sorttype"=>$p3Ary["sorttype"],"date"=>$p3Ary["date"],"p3type"=> $p3Ary["p3type"]],
    "TT_P3" => ["name" => "乒乓球过关","gtype"=>"TT","table"=>Constant::S_TT,"table_xml"=>Constant::S_TT_XML,"rtype"=>$p3Ary["rtype"],"showtype"=>$p3Ary["showtype"],"action"=>$p3Ary["action"],"sorttype"=>$p3Ary["sorttype"],"date"=>$p3Ary["date"],"p3type"=> $p3Ary["p3type"]],
    "BM_P3" => ["name" => "羽毛球过关","gtype"=>"BM","table"=>Constant::S_BM,"table_xml"=>Constant::S_BM_XML,"rtype"=>$p3Ary["rtype"],"showtype"=>$p3Ary["showtype"],"action"=>$p3Ary["action"],"sorttype"=>$p3Ary["sorttype"],"date"=>$p3Ary["date"],"p3type"=> $p3Ary["p3type"]],
    "BS_P3" => ["name" => "棒球过关","gtype"=>"BS","table"=>Constant::S_BS,"table_xml"=>Constant::S_BS_XML,"rtype"=>$p3Ary["rtype"],"showtype"=>$p3Ary["showtype"],"action"=>$p3Ary["action"],"sorttype"=>$p3Ary["sorttype"],"date"=>$p3Ary["date"],"p3type"=> $p3Ary["p3type"]],
    "VB_P3" => ["name" => "排球过关","gtype"=>"VB","table"=>Constant::S_VB,"table_xml"=>Constant::S_VB_XML,"rtype"=>$p3Ary["rtype"],"showtype"=>$p3Ary["showtype"],"action"=>$p3Ary["action"],"sorttype"=>$p3Ary["sorttype"],"date"=>$p3Ary["date"],"p3type"=> $p3Ary["p3type"]],
    "SK_P3"  => ["name" => "斯诺克过关","gtype"=>"SK","table"=>Constant::S_SK,"table_xml"=>Constant::S_SK_XML,"rtype"=>$p3Ary["rtype"],"showtype"=>$p3Ary["showtype"],"action"=>$p3Ary["action"],"sorttype"=>$p3Ary["sorttype"],"date"=>$p3Ary["date"],"p3type"=> $p3Ary["p3type"]],
    "OP_P3" => ["name" => "其他过关","gtype"=>"OP","table"=>Constant::S_OP,"table_xml"=>Constant::S_OP_XML,"rtype"=>$p3Ary["rtype"],"showtype"=>$p3Ary["showtype"],"action"=>$p3Ary["action"],"sorttype"=>$p3Ary["sorttype"],"date"=>$p3Ary["date"],"p3type"=> $p3Ary["p3type"]],
    "ES_P3" => ["name" => "电竞过关","gtype"=>"ES","table"=>Constant::S_ES,"table_xml"=>Constant::S_ES_XML,"rtype"=>$p3Ary["rtype"],"showtype"=>$p3Ary["showtype"],"action"=>$p3Ary["action"],"sorttype"=>$p3Ary["sorttype"],"date"=>$p3Ary["date"],"p3type"=> $p3Ary["p3type"]],

    "FT_RE"  => ["name" => "足球滚球","gtype"=>"FT","table"=>Constant::S_FT,"table_xml"=>Constant::S_FT_XML,"rtype"=>$reAry["rtype"],"showtype"=>$reAry["showtype"],"sorttype"=>$reAry["sorttype"]],
    "BK_RE"  => ["name" => "篮球滚球","gtype"=>"BK","table"=>Constant::S_BK,"table_xml"=>Constant::S_BK_XML,"rtype"=>$reAry["rtype"],"showtype"=>$reAry["showtype"],"sorttype"=>$reAry["sorttype"]],
    "TN_RE"  => ["name" => "网球滚球","gtype"=>"TN","table"=>Constant::S_TN,"table_xml"=>Constant::S_TN_XML,"rtype"=>$reAry["rtype"],"showtype"=>$reAry["showtype"],"sorttype"=>$reAry["sorttype"]],
    "BS_RE"  => ["name" => "棒球滚球","gtype"=>"BS","table"=>Constant::S_BS,"table_xml"=>Constant::S_BS_XML,"rtype"=>$reAry["rtype"],"showtype"=>$reAry["showtype"],"sorttype"=>$reAry["sorttype"]],
    "SK_RE"  => ["name" => "斯诺克滚球","gtype"=>"SK","table"=>Constant::S_SK,"table_xml"=>Constant::S_SK_XML,"rtype"=>$reAry["rtype"],"showtype"=>$reAry["showtype"],"sorttype"=>$reAry["sorttype"]],
    "VB_RE"  => ["name" => "排球滚球","gtype"=>"VB","table"=>Constant::S_VB,"table_xml"=>Constant::S_VB_XML,"rtype"=>$reAry["rtype"],"showtype"=>$reAry["showtype"],"sorttype"=>$reAry["sorttype"]],
    "TT_RE"  => ["name" => "乒乓球滚球","gtype"=>"TT","table"=>Constant::S_TT,"table_xml"=>Constant::S_TT_XML,"rtype"=>$reAry["rtype"],"showtype"=>$reAry["showtype"],"sorttype"=>$reAry["sorttype"]],
    "BM_RE"  => ["name" => "羽毛球滚球","gtype"=>"BM","table"=>Constant::S_BM,"table_xml"=>Constant::S_BM_XML,"rtype"=>$reAry["rtype"],"showtype"=>$reAry["showtype"],"sorttype"=>$reAry["sorttype"]],
    "OP_RE"  => ["name" => "其他滚球","gtype"=>"OP","table"=>Constant::S_OP,"table_xml"=>Constant::S_OP_XML,"rtype"=>$reAry["rtype"],"showtype"=>$reAry["showtype"],"sorttype"=>$reAry["sorttype"]],
    "ES_RE"  => ["name" => "电竞滚球","gtype"=>"ES","table"=>Constant::S_ES,"table_xml"=>Constant::S_ES_XML,"rtype"=>$reAry["rtype"],"showtype"=>$reAry["showtype"],"sorttype"=>$reAry["sorttype"]],


    "FU_R" => ["name" => "足球早盘单式","gtype"=>"FT","table"=>Constant::S_FT,"table_xml"=>Constant::S_FT_XML,"rtype"=>$uAry["rtype"],"showtype"=>$uAry["showtype"],"action"=>$uAry["action"],"sorttype"=>$uAry["sorttype"],"date"=>$uAry["date"]],
    "BU_R" => ["name" => "篮球早盘单式","gtype"=>"BK","table"=>Constant::S_BK,"table_xml"=>Constant::S_BK_XML,"rtype"=>$uAry["rtype"],"showtype"=>$uAry["showtype"],"action"=>$uAry["action"],"sorttype"=>$uAry["sorttype"],"date"=>$uAry["date"]],
    "TU_R"  => ["name" => "网球早盘单式","gtype"=>"TN","table"=>Constant::S_TN,"table_xml"=>Constant::S_TN_XML,"rtype"=>$uAry["rtype"],"showtype"=>$uAry["showtype"],"action"=>$uAry["action"],"sorttype"=>$uAry["sorttype"],"date"=>$uAry["date"]],
    "VU_R"  => ["name" => "排球早盘单式","gtype"=>"VB","table"=>Constant::S_VB,"table_xml"=>Constant::S_VB_XML,"rtype"=>$uAry["rtype"],"showtype"=>$uAry["showtype"],"action"=>$uAry["action"],"sorttype"=>$uAry["sorttype"],"date"=>$uAry["date"]],
    "TTFU_R"  => ["name" => "乒乓球早盘单式","gtype"=>"TT","table"=>Constant::S_TT,"table_xml"=>Constant::S_TT_XML,"rtype"=>$uAry["rtype"],"showtype"=>$uAry["showtype"],"action"=>$uAry["action"],"sorttype"=>$uAry["sorttype"],"date"=>$uAry["date"]],
    "BMFU_R"  => ["name" => "羽毛球早盘单式","gtype"=>"BM","table"=>Constant::S_BM,"table_xml"=>Constant::S_BM_XML,"rtype"=>$uAry["rtype"],"showtype"=>$uAry["showtype"],"action"=>$uAry["action"],"sorttype"=>$uAry["sorttype"],"date"=>$uAry["date"]],
    "BUS_R" => ["name" => "棒球早盘单式","gtype"=>"BS","table"=>Constant::S_BS,"table_xml"=>Constant::S_BS_XML,"rtype"=>$uAry["rtype"],"showtype"=>$uAry["showtype"],"action"=>$uAry["action"],"sorttype"=>$uAry["sorttype"],"date"=>$uAry["date"]],
    "SKFU_R"  => ["name" => "斯诺克早盘单式","gtype"=>"SK","table"=>Constant::S_SK,"table_xml"=>Constant::S_SK_XML,"rtype"=>$uAry["rtype"],"showtype"=>$uAry["showtype"],"action"=>$uAry["action"],"sorttype"=>$uAry["sorttype"],"date"=>$uAry["date"]],
    "OM_R" => ["name" => "其他早盘单式","gtype"=>"OP","table"=>Constant::S_OP,"table_xml"=>Constant::S_OP_XML,"rtype"=>$uAry["rtype"],"showtype"=>$uAry["showtype"],"action"=>$uAry["action"],"sorttype"=>$uAry["sorttype"],"date"=>$uAry["date"]],
    "ESFU_R" => ["name" => "电竞早盘单式","gtype"=>"ES","table"=>Constant::S_ES,"table_xml"=>Constant::S_ES_XML,"rtype"=>$uAry["rtype"],"showtype"=>$uAry["showtype"],"action"=>$uAry["action"],"sorttype"=>$uAry["sorttype"],"date"=>$uAry["date"]],

    "FT_RPD"  => ["name" => "足球滚球波胆","gtype"=>"FT","table"=>Constant::S_FT,"table_xml"=>Constant::S_FT_XML,"rtype"=>$repdAry["rtype"],"showtype"=>$repdAry["showtype"],"sorttype"=>$repdAry["sorttype"]],
    "FU_PD" => ["name" => "足球早盘波胆","gtype"=>"FT","table"=>Constant::S_FT,"table_xml"=>Constant::S_FT_XML,"rtype"=>$updAry["rtype"],"showtype"=>$updAry["showtype"],"action"=>$updAry["action"],"sorttype"=>$updAry["sorttype"],"date"=>$updAry["date"]],
    "FT_PD"  => ["name" => "足球波胆",   "gtype"=>"FT","table"=>Constant::S_FT,"table_xml"=>Constant::S_FT_XML,"rtype"=>$pdAry["rtype"],"showtype"=>$pdAry["showtype"],"action"=>$pdAry["action"],"sorttype"=>$pdAry["sorttype"],"date"=>$pdAry["date"]],
];
/*赛事采集配置 -- 结束*/

/*比分采集配置 -- 开始*/
/*login_layer: su
uid: 5133e19bm1610314l95363647xw
langx: zh-cn
ver: version-12-29
p: get_result
session:
gtype: FT
date: 2021-4-8
league_id: all*/
$curlAcceptAry = [
    "ES" => ["name"=>"电子竞技比分","gtype"=>"ES","time"=>1*1*60,"table"=>Constant::S_ES],
    "FT" => ["name"=>"足球比分","gtype"=>"FT","time"=>1*1*60,"table"=>Constant::S_FT],
    "BK" => ["name"=>"篮球比分","gtype"=>"BK","time"=>1*1*60,"table"=>Constant::S_BK],
    "TN" => ["name"=>"网球比分","gtype"=>"TN","time"=>1*1*60,"table"=>Constant::S_TN],
    "BS" => ["name"=>"棒球比分","gtype"=>"BS","time"=>1*1*60,"table"=>Constant::S_BS],
    "VB" => ["name"=>"排球比分","gtype"=>"VB","time"=>1*1*60,"table"=>Constant::S_VB],
    "OP" => ["name"=>"其他比分","gtype"=>"OP","time"=>1*1*60,"table"=>Constant::S_OP],
    "BM" => ["name"=>"羽毛球比分","gtype"=>"BM","time"=>1*1*60,"table"=>Constant::S_BM],
    "TT" => ["name"=>"乒乓球比分","gtype"=>"TT","time"=>1*1*60,"table"=>Constant::S_TT],
    "SK" => ["name"=>"斯诺克比分","gtype"=>"SK","time"=>1*1*60,"table"=>Constant::S_SK],
	"ESYES" => ["name"=>"电子竞技昨日比分","gtype"=>"ES","time"=>(24+0.1)*60*60,"table"=>Constant::S_ES],
    "FTYES" => ["name"=>"足球昨日比分","gtype"=>"FT","time"=>(24+0.1)*60*60,"table"=>Constant::S_FT],
    "BKYES" => ["name"=>"篮球昨日比分","gtype"=>"BK","time"=>(24+0.1)*60*60,"table"=>Constant::S_BK],
	"TNYES" => ["name"=>"网球昨日比分","gtype"=>"TN","time"=>(24+0.1)*60*60,"table"=>Constant::S_TN],
    "BSYES" => ["name"=>"棒球昨日比分","gtype"=>"BS","time"=>(24+0.1)*60*60,"table"=>Constant::S_BS],
    "VBYES" => ["name"=>"排球昨日比分","gtype"=>"VB","time"=>(24+0.1)*60*60,"table"=>Constant::S_VB],
    "OPYES" => ["name"=>"其他昨日比分","gtype"=>"OP","time"=>(24+0.1)*60*60,"table"=>Constant::S_OP],
    "BMYES" => ["name"=>"羽毛球昨日比分","gtype"=>"BM","time"=>(24+0.1)*60*60,"table"=>Constant::S_BM],
    "TTYES" => ["name"=>"乒乓球昨日比分","gtype"=>"TT","time"=>(24+0.1)*60*60,"table"=>Constant::S_TT],
    "SKYES" => ["name"=>"斯诺克昨日比分","gtype"=>"SK","time"=>(24+0.1)*60*60,"table"=>Constant::S_SK]
	
];   
/*比分采集配置 -- 结束*/
//后端采集时间类
$curlTypes = [
    //180秒刷新类(早餐类)
    "s180" =>[
        "FU_R" => $curlMatchAry["FU_R"],
        "FT_P3" => $curlMatchAry["FT_P3"],
        "FU_PD" => $curlMatchAry["FU_PD"],

        "BU_R" => $curlMatchAry["BU_R"],
        "BK_P3" => $curlMatchAry["BK_P3"],

        "TU_R"  => $curlMatchAry["TU_R"],
        "TN_P3" => $curlMatchAry["TN_P3"],

        "VU_R"  => $curlMatchAry["VU_R"],
        "VB_P3" => $curlMatchAry["VB_P3"],

        "TTFU_R"  => $curlMatchAry["TTFU_R"],
        "TT_P3" => $curlMatchAry["TT_P3"],

        "BMFU_R"  => $curlMatchAry["BMFU_R"],
        "BM_P3" => $curlMatchAry["BM_P3"],

        "BUS_R" => $curlMatchAry["BUS_R"],
        "BS_P3" => $curlMatchAry["BS_P3"],

        "SKFU_R"  => $curlMatchAry["SKFU_R"],
        "SK_P3" => $curlMatchAry["SK_P3"],

        "OM_R" => $curlMatchAry["OM_R"],
        "OP_P3" => $curlMatchAry["OP_P3"],

        "ESFU_R" => $curlMatchAry["ESFU_R"],
        "ES_P3" => $curlMatchAry["ES_P3"],
    ],
    //60秒刷新类
    "s60" => [
        "FT_R"  => $curlMatchAry["FT_R"],
        "FT_P3" => $curlMatchAry["FT_P3"],
        "FT_PD" => $curlMatchAry["FT_PD"],

        "BK_R"  => $curlMatchAry["BK_R"],
        "BK_P3" => $curlMatchAry["BK_P3"],

        "TN_R"  => $curlMatchAry["TN_R"],
        "TN_P3" => $curlMatchAry["TN_P3"],

        "TT_R"  => $curlMatchAry["TT_R"],
        "TT_P3" => $curlMatchAry["TT_P3"],

        "BM_R"  => $curlMatchAry["BM_R"],
        "BM_P3" => $curlMatchAry["BM_P3"],

        "BS_R" => $curlMatchAry["BS_R"],
        "BS_P3" => $curlMatchAry["BS_P3"],

        "VB_R" => $curlMatchAry["VB_R"],
        "VB_P3" => $curlMatchAry["VB_P3"],

        "SK_R"  => $curlMatchAry["SK_R"],
        "SK_P3"  => $curlMatchAry["SK_P3"],

        "OP_R"  => $curlMatchAry["OP_R"],
        "OP_P3" => $curlMatchAry["OP_P3"],

        "ES_R"  => $curlMatchAry["ES_R"],
        "ES_P3" => $curlMatchAry["ES_P3"],
    ],

    //20秒刷新类
    "s20" => [
        "TN_RE"  => $curlMatchAry["TN_RE"],
        "BS_RE"  => $curlMatchAry["BS_RE"],
        "SK_RE"  => $curlMatchAry["SK_RE"],
        "VB_RE"  => $curlMatchAry["VB_RE"],
        "TT_RE"  => $curlMatchAry["TT_RE"],
        "BM_RE"  => $curlMatchAry["BM_RE"],
        "OP_RE"  => $curlMatchAry["OP_RE"],
        "ES_RE"  => $curlMatchAry["ES_RE"],
    ],
    //10秒刷新类
    "s10" => [
        "FT_RE"  => $curlMatchAry["FT_RE"],
        "FT_RPD"  => $curlMatchAry["FT_RPD"],
    ],
    //5秒刷新类
    "s5" => [
        "BK_RE"  => $curlMatchAry["BK_RE"],
    ],
    //比分类 180秒
    "a180" => [
        "FT" => $curlAcceptAry["FT"],
        "BK" => $curlAcceptAry["BK"],
        "TN" => $curlAcceptAry["TN"],
        "BS" => $curlAcceptAry["BS"],
        "VB" => $curlAcceptAry["VB"],
        "OP" => $curlAcceptAry["OP"],
        "BM" => $curlAcceptAry["BM"],
        "TT" => $curlAcceptAry["TT"],
        "SK" => $curlAcceptAry["SK"],
        "ES" => $curlAcceptAry["ES"],
    ],
    //比分类 600秒
	"a600" => [
	    "ESYES" => $curlAcceptAry["ESYES"],
        "FTYES" => $curlAcceptAry["FTYES"],
        "BKYES" => $curlAcceptAry["BKYES"],
		"TNYES" => $curlAcceptAry["TNYES"],
		"BSYES" => $curlAcceptAry["BSYES"],
		"VBYES" => $curlAcceptAry["VBYES"],
		"OPYES" => $curlAcceptAry["OPYES"],
		"BMYES" => $curlAcceptAry["BMYES"],
		"TTYES" => $curlAcceptAry["TTYES"],
		"SKYES" => $curlAcceptAry["SKYES"]
    ],   
];	
/*采集配置 --结束*/
$web_time_zone = -4;//时区

