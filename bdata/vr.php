<?php
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header('Content-type: text/html;charset=utf-8');
ini_set("display_errors","On");
set_time_limit(0);
include_once 'include/config.php';

function get_caipan(){
    global $db_c;
    $bet_table = Constant::T_BET;
    $mem_table = Constant::T_MEMBER;

    $tf = new Transform();
    $tf->getUserCurl(1);
    if(count($tf->web) == 0){
        print_r("前端无可用采集账号\r\n");
        return;
    }
    $messages = $tf->messageget("zh-cn");
    $tf->close();

    $sum = 0;
    $sum0 = 0;
    $sumchang = 0;

    foreach ($messages as $item) {
        $str = $item['msg'];
        if(strpos($str,'助理裁判')===false){continue;}

        preg_match('/\d+月\d+日/u',$str,$datearr);
        $vdate = date('Y年').$datearr[0].' ';
        $vdate = str_replace(['年', '月', '日'], ['-', '-', ''], $vdate);

        preg_match('/\d日 (.*?) \(/u',$str,$leaguearr);
        $league = $leaguearr[1];

        preg_match('/\((.*?) VS/u',$str,$mbteamarr);
        $mbteam = $mbteamarr[1];

        preg_match('/VS (.*?)\) /u',$str,$tgteamarr);
        $tgteam = $tgteamarr[1];

        preg_match('/所有投注在(.*?)~/u',$str,$startarr);
        $start = $vdate.$startarr[1];

        preg_match('/~(.*?)的注单/u',$str,$endarr);
        $end = $vdate.$endarr[1];

        $mbteam = str_replace(' -','',$mbteam);
        $tgteam = str_replace(' -','',$tgteam);
        if(!$start || !$end || !$mbteam || !$tgteam){continue;}

        // bet_time 是 unix 时间戳，需要转换
        $start_ts = strtotime($start);
        $end_ts   = strtotime($end);

        // 标记裁判相关注单
        $sql0 = "UPDATE {$bet_table} SET caipan=1 WHERE `bet_time` >= {$start_ts} AND `bet_time` <= {$end_ts} AND `team_h` LIKE '%{$mbteam}%' AND `team_c` LIKE '%{$tgteam}%' AND `wtype`<>'PR' AND `isResult`=0";
        $sum0 += $db_c->execSql($sql0);

        // 查询匹配的未结算注单
        $sql = "SELECT * FROM {$bet_table} WHERE `bet_time` >= {$start_ts} AND `bet_time` <= {$end_ts} AND `team_h` LIKE '%{$mbteam}%' AND `team_c` LIKE '%{$tgteam}%' AND `wtype`<>'PR' AND `isResult`=0";
        $rows = $db_c->select($sql,'All');

        if($rows){
            foreach($rows as $rs){
                if($rs['pay_type']==1 && $rs['hidden']==0){
                    if($rs['isResult']!=0){
                        $m_result = $rs['mem_result'] ? $rs['mem_result'] : 0;
                        $chgmoney = 0 - $m_result;
                        $minmoney = $m_result - $rs['bet_golds'];
                    }else{
                        $chgmoney = $rs['bet_golds'];
                        $minmoney = 0;
                    }
                    // 现金会员退还额度
                    $sql0 = "SELECT * FROM {$mem_table} WHERE `name`='".$rs['m_name']."' AND balance_credit >= {$minmoney}";
                    $vmrows = $db_c->select($sql0,'All');
                    if($vmrows && count($vmrows)>0){
                        $db_c->beginTransaction();
                        try{
                            $sql11 = "UPDATE {$mem_table} SET `balance_credit`=(`balance_credit`+{$chgmoney}),`credit`=(`credit`+{$chgmoney}) WHERE `name`='".$rs['m_name']."'";
                            $db_c->execSql($sql11);
                            $sql22 = "UPDATE {$bet_table} SET `mem_result`=0,`agent_result`=0,`ag_result`=0,`su_result`=0,`co_result`=0,`d0_result`=0,`valid_gold`=0,`cancel`=1,`status`=13,`danger`=0,`isResult`=1,`result`='T' WHERE `ID`={$rs['ID']}";
                            $db_c->execSql($sql22);
                            $db_c->commit();
                            $sum++;
                        }catch (Exception $e){
                            $db_c->rollback();
                        }
                    }
                }else{
                    $sql22 = "UPDATE {$bet_table} SET `mem_result`=0,`agent_result`=0,`ag_result`=0,`su_result`=0,`co_result`=0,`d0_result`=0,`valid_gold`=0,`cancel`=1,`status`=13,`danger`=0,`isResult`=1,`result`='T' WHERE `ID`={$rs['ID']}";
                    $affected = $db_c->execSql($sql22);
                    if($affected > 0){
                        $sum++;
                    }
                }
            }
        }
        $sumchang++;
    }
    print_r("共发现".$sumchang."场视频助理裁判，标记".$sum0."个注单，处理".$sum."个注单\r\n");
}

function go(){
    $refreshTime = 5;
    $refreshTime_err = 3;
    try{
        get_caipan();
        sleep($refreshTime);
    }catch (Exception $ex){
        sleep($refreshTime_err);
    }
    go();
}
go();
?>
