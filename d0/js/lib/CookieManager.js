function CookieManager(){
	var _self = this;
	var _domain = document.domain.split(".");
	var MainDomain = "";
	if(_domain.length!=4){
		MainDomain = "domain=.";
		for(var i=1; i < _domain.length; i++){
			if(i == _domain.length-1){
				MainDomain += _domain[i];
			}else{
				MainDomain += _domain[i]+".";
			}
		}
	}else{
		MainDomain = document.domain;
	}

	_self.set = function(cname, cvalue, exdays , path){
			exdays = exdays || 30;
			path = path || "/";

			var d = new Date();
			d.setTime(d.getTime() + (exdays*24*60*60*1000));
			var expires = "expires="+d.toUTCString();
			var paths = "path="+path;

			document.cookie = cname + "=" + cvalue + "; " + expires+"; "+paths+"; "+MainDomain;
			//console.log(cname + "=" + cvalue + "; " + expires+"; "+paths+"; "+MainDomain);
	}

	_self.get = function(cname){
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
			}

			return undefined;
    }

    _self.del = function(cname){
			var d = new Date();
			d.setTime(d.getTime() - 1);
			var cookieVal = _self.get(cname);
			if(cookieVal != null) document.cookie= cname + "="+cookieVal+";expires="+d.toGMTString()+"; "+MainDomain;
    }

}