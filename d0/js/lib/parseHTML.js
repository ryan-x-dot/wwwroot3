function parseHTML(html){
	var _self=this;

	var divObj=document.createElement("div");

	divObj.innerHTML="<body>"+html+"</body>";
	//divObj.innerHTML = html;

	_self.getTag=function(tagID,divobj){

		if (divobj==undefined) divobj=divObj;
		var retobj=new Array();
		var children = divobj.getElementsByTagName("*");
		for (var i = 0; i < children.length;i++){
			if (children[i].tagName.toUpperCase()==tagID.toUpperCase()){
				retobj.push(children[i]);
			}
		}
		return retobj;

		}
	_self.getChildren=function(){
		return divobj.getElementsByTagName("*");
	}

 	_self.getObj=function(tagID,divobj){
 		if (divobj==undefined) divobj=divObj;
        var obj=null;
        try{
			obj = divobj.getElementsByTagName("*")[tagID];
        }catch(e){
            obj=null;
        }

        return obj;
    }

     _self.remove=function(){
	   	//自己實作移除每一個div下面的物件
	   	//實作完丟一份回來給我
	   	divObj=null;

   	}
    _self.removeMC=function(){}
 }