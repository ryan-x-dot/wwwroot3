<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js","account_status.js","lib/ClassSelect.js"];
$arr_css = [
    "control/reset.css",
    "control/account_control.css",
    "control/alert.css",
    "control/main_control.css",
    "control/zidingyi/account.css"
];
$js = "";
$css = "
.acc_title{
	display: grid;
	grid-template-columns: 15% 15% 16% 10% 10% 10%  16% 8%;
	grid-template-rows: 48px;
	background: #FFF;
	border-bottom: 2px solid #E0E0E0;
	font-size: 12px;
	line-height: 14px;
	padding-right: 8px;
}

.acc_tr{
	display: grid;
	grid-template-columns: 15% 15% 16% 10% 10% 10%  16% 8%;
	grid-template-rows: 48px;
	padding-right: 8px;
	line-height: 16px;
	border-bottom: 1px solid #e0e0e0;
}
.acc_tr .number_ag {
    justify-content: flex-end;
}
/* 1023 ~ */
@media only screen and (max-width: 1023px) {
	
	.acc_tr .number,.acc_tr .number_ag{
		grid-area: number;
		padding: 0 22px 0 5px;
		color: rgba(0, 0, 0, .64);
	} 
	.acc_tr .number_ag {
		justify-content: flex-start;
	}
}
";
include_once INCLUDE_DIR."/getHtml.php";