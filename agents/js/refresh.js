function init() {
    refreshData();
    refreshPage()
}
function refreshData(msg) {
    var mt_time = document.getElementById("MaintainTime");
    if (msg != undefined && msg != "") {
        var msg_arr = msg.split(",");
        if (msg_arr[1] == "N") {
            var Util = new util(window,document);
            Util.goToIndex()
        } else {
            var date = msg_arr[0];
            if (mt_time != null)
                mt_time.innerHTML = date
        }
    }
}
function refreshPage() {
    setTimeout("refreshPage()", 6E4);
    var req;
    req = new HttpRequest;
    req.addEventListener("LoadComplete", refreshData);
    req.loadURL("/app/showMaintain.php", "GET", "")
}
;