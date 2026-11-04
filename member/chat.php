<?php
include_once "./include/config.php";
global $db_s,$db_c;
$uid = isset($_REQUEST['uid']) ? $_REQUEST['uid'] : '';
$memTable = Constant::T_MEMBER;
$memRow = $db_c->selectNew("SELECT `id`,`name` FROM {$memTable} WHERE `uid` = :uid AND `status` > 0 ", [':uid' => $uid], "Row");

if(!$memRow){
    return '';
}
$chatTable = Constant::T_CHAT; //public function update($table, $arrayDataValue, $where = '', $debug = false)  execSql
//T_MEMBER T_CHAT
$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : "";
$chatid = isset($_REQUEST['chatid']) ? intval($_REQUEST['chatid']) : 0;
$message = isset($_REQUEST['message']) ? str_replace(array('<','>'),array('&lt;','&gt;'),$_REQUEST['message']) : "";

$onlocal="thisClose();";

if($action=='send'){
    
	$db_c->update($chatTable, ['state' => 1], "`id` = " . intval($chatid));

	$chatRow2 = $db_c->selectNew("SELECT `id`,`nid`, `level`,`from_id`,`to_id`,`from_name`,`to_name` FROM {$chatTable} WHERE `id` = :id", [':id' => $chatid], "Row");

    if($message!='isread' && $message!=''){
        
    	$level = $chatRow2['level'];
        $to_id = $chatRow2['from_id'];
        $to_name = $chatRow2['from_name'];
        $from_id = $chatRow2['to_id'];
        $from_name = $chatRow2['to_name'];
        $nid = $chatRow2['nid'];
        $time = time();
        $insertData = [
            'level' => $level,
            'nid' => $nid,
            'from_id' => $from_id,
            'to_id' => $to_id,
            'from_name' => $from_name,
            'to_name' => $to_name,
            'message' => $message,
            'state' => '1',
            'time' => $time
        ];
        $db_c->insert($chatTable, $insertData);
        $message = "send ok";
    }
}else{
	$id = intval($memRow['id']);
	$chatRow = $db_c->selectNew("SELECT `id`,`message`,`state`,`time` FROM {$chatTable} WHERE `to_id` = :id AND `state` = '0'", [':id' => $id], "Row");
    // print_r("SELECT `id`,`message`,`state`,`time` FROM {$chatTable} WHERE `to_id`='{$id}' and `state`='0'");exit;
    if(!isset($chatRow['message'])){
        $message = "not msg";
    }else{
        //mysql_query("UPDATE web_chat SET state='1' WHERE id='$rt[id]'");
        $chatid = $chatRow['id'];
        $message = $chatRow["message"];
        $onlocal = "thisOpen();";
    }
}
?>
<html>
<head>
<title>会话</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style type="text/css">
body,div,td {FONT-SIZE: 12px; word-break:break-all;}
.closeimg{cursor:hand;}
.close{
    cursor:hand;
    padding: 3px;
    color:#0000FF;
    onmouseover:expression(
        onmouseover=function(){
            this.style.color='#FFFFFF';
            this.style.backgroundColor='#CC0000';
        }
    );
    onmouseout:expression(
        onmouseout=function(){
            this.style.color='#0000FF';
            this.style.backgroundColor='';
        }
    );
}
</style>

<script>

function thisClose(){
    parent.refresh='yes';
    var divChat = parent.document.getElementById('chat');
    divChat.style.display="none";
}
function thisOpen(){
    parent.refresh='no';
    var divChat = parent.document.getElementById('chat');
    divChat.style.display="";
}
function isread(){
    if(form1.message.value==''){
        form1.message.value='isread';
    }
    form1.submit();
}
function send_chk(){
    if(form1.message.value==''){
        form1.message.focus();
        alert('内容不要为空');
        return false;
    }
    thisClose();
}
</script>
</head>

<body bgcolor="#FFFFFF" text="#000000" leftmargin="0" topmargin="0" vlink="#0000FF" alink="#0000FF" >
<table width="99%" border="0" cellpadding="3" cellspacing="0">
 <form id="form1" name="form1" method="post" action="" onSubmit="return send_chk();">
 <INPUT TYPE="hidden" NAME="action" value="send">
 <INPUT TYPE="hidden" NAME="chatid" value="<?=$chatid?>">
  <tr>
    <td width="100%" style="height:100px;line-height:30px;"><?=$message?></td>
    <td width="42" align="right" valign="top"><img class="closeimg" onClick="isread();" src="/images/close.jpg" width="16" height="16" alt="关闭"></td>
  </tr>
  <tr>
    <td height="25"  bgcolor="#EEDC9E">回复内容：<input name="message" type="text"  style="border: 1px solid #333333;">    </td>
    <td height="25"  bgcolor="#EEDC9E"><input type="submit" name="Submit" value="发送"></td>
  </tr>
  </form>
</table>
</body></html>
<script> <?=$onlocal?> </script>