
function init(){

}
function showDiv(d){
	var div = document.getElementById(d);
	div.style.display = "";

}
function hideDiv(d){
	var div = document.getElementById(d);
	div.style.display = "none";
}

function showOn(div){
	div.className = div.className+" On";
}

function showOut(div){
		div.className = div.className.replace(" On","");
}

function changeLangx(langx){
	var tmp = "";
	if(location.href.indexOf("zh-tw")>-1){
		tmp = location.href.replace("zh-tw",langx);
		console.log(tmp);
		location.href = tmp;
		return;
	}
	if(location.href.indexOf("zh-cn")>-1){
		tmp = location.href.replace("zh-cn",langx);
		location.href = tmp;
		return;
	}
	if(location.href.indexOf("en-us")>-1){
		tmp = location.href.replace("en-us",langx);
		location.href = tmp;
		return;
	}
}