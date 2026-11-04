function parseHTML(html) {
	var _self = this;
	var divObj = document.createElement("div");
	divObj.innerHTML = "<body>" + html + "</body>";
	_self.getTag = function(tagID, divobj) {
		if (divobj == undefined)
			divobj = divObj;
		var retobj = new Array;
		var children = divobj.getElementsByTagName("*");
		for (var i = 0; i < children.length; i++)
			if (children[i].tagName.toUpperCase() == tagID.toUpperCase())
				retobj.push(children[i]);
		return retobj
	};
	_self.getChildren = function() {
		return divobj.getElementsByTagName("*")
	};
	_self.getObj = function(tagID, divobj) {
		if (divobj == undefined)
			divobj = divObj;
		var obj = null;
		try {
			obj = divobj.getElementsByTagName("*")[tagID]
		} catch (e) {
			obj = null
		}
		return obj
	};
	_self.remove = function() {
		divObj = null
	};
	_self.removeMC = function() {}
};
