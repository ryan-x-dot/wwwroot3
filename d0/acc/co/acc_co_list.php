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
.account_co .acc_title{
	display: grid;
	grid-template-columns: 12% 12% 14% 10% 10% 10% 10% 14% 8%;
	grid-template-rows: 48px;
	background: #FFF;
	border-bottom: 2px solid #E0E0E0;
	font-size: 12px;
	line-height: 14px;
	padding-right: 8px;
}

.account_co .acc_tr{
	display: grid;
	grid-template-columns: 12% 12% 14% 10% 10% 10% 10% 14% 8%;
	grid-template-rows: 48px;
	padding-right: 8px;
	line-height: 16px;
	border-bottom: 1px solid #e0e0e0;
}
.acc_tr .number_su,.acc_tr .number_ag {
    justify-content: flex-end;
}

/* 1023 ~ */
@media only screen and (max-width: 1023px) {
	.account_co .acc_title, .account_co .acc_tr {
        grid-template-columns: 35% 40% 25%;
    }
	.acc_tr .number,.acc_tr .number_su,.acc_tr .number_ag{
		grid-area: number;
		padding: 0 5px;
		width: 200px;
		color: rgba(0, 0, 0, .64);
	} 
	.acc_tr .number_su {
		justify-content: flex-start;
	}

	.acc_tr .number_ag {
		justify-content: center;
	}

}
";
include_once INCLUDE_DIR."/getHtml.php";