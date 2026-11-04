<?PHP  
function getparm(){
	$parm='';
	
	$arrs=$_POST?$_POST:$_GET;
	if(isset($_GET['uid'])){
		$arrs=$_GET;
	}
	foreach($arrs as $k=>$v){
		if($k!='PHPSESSID' && $k!='blackbox'){
			$parm.='&'.$k.'='.$v."&";
		}
	}
	$parm = preg_replace('/&uid=(.*?)&/s','',$parm);
	$parm = preg_replace('/&lid=(.*?)&/s','',$parm);
	$parm = preg_replace('/&ts=(.*?)&/s','',$parm);
	$parm = preg_replace('/&ver=(.*?)&/s','',$parm);
    $parm = ltrim($parm,'&');
    $parm = rtrim($parm,'&');
    $parm = str_replace('&&','&',$parm);
	return $parm;
}

?>