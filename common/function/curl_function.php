<?php
$set_user_agent = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1";
/**
 * 写入采集账号文件
 * @param $arr
 */
/* 
function writefile($arr){
    $cache  = "<?php\r\n";
    $cache  .=  "unset(\$webdb);\r\n";
    $cache  .=  "\$webdb = '{$arr}';\r\n";
    $cache  .= "?>";

    if(!write_file(dirname(__FILE__)."/db.php",$cache)){ //写入缓存失败
        echo '<script>alert("缓存文件写入失败！请先设db.php文件权限为：0777!");</script>';
    }

}

function write_file($filename,$data,$method="rb+",$iflock=1){
    @touch($filename);
    $handle=@fopen($filename,$method);
    if($iflock){
        @flock($handle,LOCK_EX);
    }
    @fputs($handle,$data);
    if($method=="rb+") @ftruncate($handle,strlen($data));
    @fclose($handle);
    @chmod($filename,0777);
    if( is_writable($filename) ){
        return true;
    }else{
        return false;
    }
}
*/

/**
 * 赛事数据抓取
 * @param $url 采集地址
 * @param $uid UID
 * @param $mid
 * @param $gtype 球类
 * @param $rtype 玩法类
 * @param $mtype 盘口类
 * @param $langx 语言
 * @param $page_no 页码
 * @param string $g_date
 * @param string $league_id
 * @param string $hot_game
 * @param string $delay
 * @param string $SortType
 * @param string $isie11
 * @param string $filterType
 * @param string $showgtype
 * @return bool|string
 */
function curl_body_var_data($url,$uid,$mid,$gtype,$rtype,$mtype,$langx="zh-cn",$page_no=0,$g_date='ALL',$league_id='',$hot_game='',$delay="",$SortType="T",$isie11="'N'",$filterType="CB",$showgtype="FU"){
    global $set_user_agent;
    $str = '';
    $isRefresh = false;//是否从新调用
    if($rtype=='p3' || $rtype=='pr'){
        switch ($gtype){
            case "BK":
                $showgtype = "BU";
                break;
            case "BS":
                $showgtype = "BUS";
                break;
            case "TN":
                $showgtype = "TU";
                break;
            case "VB":
                $showgtype = "VU";
                break;
            case "SK":
                $showgtype = "SKFU";
                break;
            case "TT":
                $showgtype = "TTFU";
                break;
            case "BM":
                $showgtype = "BMFU";
                break;
            case "OP":
                $showgtype = "OM";
                break;
            default:
                $showgtype = "FU";
                break;
        }
        $str.='&showgtype='.$showgtype.'&g_date='.$g_date;
    }

    switch($gtype){
        case 'FU':
            $filename=$url."/app/member/FT_future/body_var.php?rtype=$rtype&uid=$uid&langx=$langx&mtype=$mtype&g_date=$g_date&page_no=$page_no&league_id=$league_id&hot_game=$hot_game&isie11=$isie11";
            break;
        case 'BU':
            $filename=$url."/app/member/BK_future/body_var.php?rtype=$rtype&uid=$uid&langx=$langx&mtype=$mtype&g_date=$g_date&page_no=$page_no&league_id=$league_id&hot_game=$hot_game&isie11=$isie11";
            break;
        case 'BUS':
            $filename=$url."/app/member/BS_future/body_var.php?rtype=$rtype&uid=$uid&langx=$langx&mtype=$mtype&g_date=$g_date&page_no=$page_no&league_id=$league_id&hot_game=$hot_game&isie11=$isie11";
            break;
        case 'TU':
            $filename=$url."/app/member/TN_future/body_var.php?rtype=$rtype&uid=$uid&langx=$langx&mtype=$mtype&g_date=$g_date&page_no=$page_no&league_id=$league_id&hot_game=$hot_game&delay=$delay&isie11=$isie11";
            break;
        case 'TTFU':
            $filename=$url."/app/member/TT_future/body_var.php?rtype=$rtype&uid=$uid&langx=$langx&mtype=$mtype&g_date=$g_date&page_no=$page_no&league_id=$league_id&hot_game=$hot_game&delay=$delay&isie11=$isie11";
            break;
        case 'BMFU':
            $filename=$url."/app/member/BM_future/body_var.php?rtype=$rtype&uid=$uid&langx=$langx&mtype=$mtype&g_date=$g_date&page_no=$page_no&league_id=$league_id&hot_game=$hot_game&delay=$delay&isie11=$isie11";
            break;
        case 'SKFU':
            $filename=$url."/app/member/SK_future/body_var.php?rtype=$rtype&uid=$uid&langx=$langx&mtype=$mtype&g_date=$g_date&page_no=$page_no&league_id=$league_id&hot_game=$hot_game&delay=$delay&isie11=$isie11";
            break;
        case 'VU':
            $filename=$url."/app/member/VB_future/body_var.php?rtype=$rtype&uid=$uid&langx=$langx&mtype=$mtype&g_date=$g_date&page_no=$page_no&league_id=$league_id&hot_game=$hot_game&isie11=$isie11";
            break;
        case 'OM':
            $filename=$url."/app/member/OP_future/body_var.php?rtype=$rtype&uid=$uid&langx=$langx&mtype=$mtype&g_date=$g_date&page_no=$page_no&league_id=$league_id&hot_game=$hot_game&isie11=$isie11";
            break;
        case 'FS':
            $filename=$url."/app/member/browse_FS/reloadgame_R.php?mid=3848202&uid=$uid&langx=$langx&choice=ALL&LegGame=ALL&pages=1&records=40&FStype=&area_id=&item_id=&rtype=$rtype&league_id=$league_id&hot_game=$hot_game&delay=$delay";
            break;
        case 'OU':
            $gtype_browse=$gtype."_browse";
            $filename=$url."/app/member/OP_future/body_var.php?rtype=$rtype&uid=$uid&langx=$langx&mtype=$mtype&page_no=$page_no&league_id=$league_id&hot_game=$hot_game&isie11=$isie11".$str;
            break;
        case 'BK':
            $gtype_browse=$gtype."_browse";
            $filename=$url."/app/member/".$gtype_browse."/body_var.php?rtype=$rtype&uid=$uid&langx=$langx&mtype=$mtype&page_no=$page_no&league_id=$league_id&hot_game=$hot_game&isie11=$isie11".$str;
            break;
        default:
            $gtype_browse=$gtype."_browse";
            $filename=$url."/app/member/".$gtype_browse."/body_var.php?rtype=$rtype&uid=$uid&langx=$langx&mtype=$mtype&page_no=$page_no&league_id=$league_id&hot_game=$hot_game&delay=$delay&isie11=$isie11".$str;
            break;
    }

    $curl = new Curl_HTTP_Client();
    $curl->set_user_agent($set_user_agent);

    if(empty($SortType)){$SortType='T';}

    $cookie = "gamePoint_{$mid}=".date('Y-m-d')."%2A2%2A0;SortType@{$mid}=".$SortType;

    if(empty($filterType)){$filterType='CB';}
    if($rtype=="re"||$rtype=="re_main"){
        $cookie .= ";filterTypeRE@{$mid}=".$filterType;
    }else{
        $cookie .= ";filterType@{$mid}=".$filterType;
    }
    $curl->set_cookie($cookie);
    $data=$curl->fetch_url($filename);
    $curl->close();

    //判断网址是否改变
    preg_match("/\<form id=\'newdomain\' action=\'(.*?)\' method=\'POST\' target=\'_top\'>/is",$data,$nUrl);
    if(is_array($nUrl) && count($nUrl)>0){
        $new_pcurl = $nUrl[1];
        if($url != $new_pcurl){
            $url = $new_pcurl;
            return curl_body_var_data($url,$uid,$mid,$gtype,$rtype,$mtype,$langx,$page_no,$g_date,$league_id,$hot_game,$delay,$SortType,$isie11,$filterType,$showgtype);
        }
    }


    return $data;
}

/**
 * 比分接收
 * @param $url
 * @param $uid
 * @param $mid
 * @param $gtype
 * @return bool|string
 */
function curl_accept_data($url,$uid,$mid,$gtype,$list_date=""){
    global $set_user_agent;
    if(empty($list_date)) $list_date = date("Y-m-d");
    $filename = "{$url}/app/member/account/result/result.php?uid={$uid}&langx=zh-cn&game_type={$gtype}&list_date={$list_date}";
    $curl = new Curl_HTTP_Client();
    $curl->set_user_agent($set_user_agent);
    if(empty($SortType)){$SortType='T';}

    $cookie = "gamePoint_{$mid}=".date('Y-m-d')."%2A2%2A0;";
    $curl->set_cookie($cookie);
    $data=$curl->fetch_url($filename);
    $curl->close();
    return $data;
}

/**
 * 比分接收 - 所有赛事
 * @param $url
 * @param $uid
 * @param $mid
 * @param $gtype
 * @param $game_id
 * @return bool|string
 */
function curl_result_new($url,$uid,$mid,$gtype,$game_id){
    global $set_user_agent;
    $filename = "{$url}/app/member/account/result/{$gtype}_result_new.php?uid={$uid}&gtype={$gtype}&game_id={$game_id}&langx=zh-cn";
    $curl = new Curl_HTTP_Client();
    $curl->set_user_agent($set_user_agent);
    if(empty($SortType)){$SortType='T';}

    $cookie = "gamePoint_{$mid}=".date('Y-m-d')."%2A2%2A0;";
    $curl->set_cookie($cookie);
    $data=$curl->fetch_url($filename);
    $curl->close();
    return $data;
}
/**
 * 登陆采集UID
 * @param $url
 * @param $user
 * @param $pwd
 * @param $langx
 * @return bool|string
 */
function curl_login($url,$user,$pwd,$langx="zh-cn"){
    global $set_user_agent;
    $curl = new Curl_HTTP_Client();
    $curl->set_user_agent($set_user_agent);
    $login=array();
    $login['username']=$user;
    $login['passwords']=$pwd;
    $login['langx']=$langx;
    $curl->set_referrer($url);
    //$html_date=$curl->fetch_url($url."/app/member/","",5);
    $html_date=$curl->send_post_data($url."/app/member/new_login.php",$login,"",5);
    $curl->close();

    return $html_date;
}

/**
 * 获取新的URL
 * @param $url
 * @param $uid
 * @param $langx
 * @return bool|string
 */
function curl_new_url($url,$uid,$langx="zh-cn"){
    global $set_user_agent;
    $curl = new Curl_HTTP_Client();
    $curl->set_user_agent($set_user_agent);
    $filename = $url."/app/member/live/live.php?uid={$uid}&langx={$langx}&liveid=&autoOddCheck=false";
    $data=$curl->fetch_url($filename);
    $curl->close();
    return $data;
}

/**
 * 随机选取可用的采集账号
 * @param $webdb
 * @param $type after:后端采集账号组,front:前端采集账号组
 * @return false|mixed
 */
function curl_rand_user($webdb,$type="after"){
    if(isset($webdb) && !empty($webdb)){
        $webdb = unserialize($webdb);
        if(isset($webdb[$type]) && !empty($webdb[$type])){
            $curlAry = $webdb[$type];
            $statusAry = array_column($curlAry,"status");
            $first = array_search("ok",$statusAry);

            $more = array_diff_assoc($statusAry,array_unique($statusAry));
            $more[$first] = $statusAry[$first];
            $keys = array_keys($more);
            if(count($keys)>0) {
                $key = rand(0, count($keys)-1);
                return isset($curlAry[$key]) && !empty($curlAry[$key]) ? $curlAry[$key] : false;
            }else{
                return false;
            }
        }else{
            return false;
        }

    }else{
        return false;
    }
}




