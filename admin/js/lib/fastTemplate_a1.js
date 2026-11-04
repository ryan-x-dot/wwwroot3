/*
* add multiple block version
*/
function fastTemplate_a1(){
	var _self=this;
	var parentClass;
	var Hashtabl=new Array();
	var dataHash=new Array();
	var keyHash=new Array();
	var SampleTable;
	var samplelayer;
	var tempTag;

	_self.init=function(obj){
		SampleTable = obj.innerHTML.replace(/<XMP>/gi,"").replace(/<\/XMP>/gi,"");
		// SampleTable = obj.innerHTML.replace("<XMP>","").replace("</XMP>","").replace("<xmp>","").replace("</xmp>","");
		// samplelayer = "";
		samplelayer = SampleTable;
		dataHash=new Array();
		keyHash=new Array();
	}

	_self.setParentclass=function(parentclass){
		parentClass=parentclass;
	}

	_self.getThis=function(varible){
		return eval(varible);
	}

	_self.setPrivate=function(varible,val){
		eval(varible+"='"+val+"'");
	}

	_self.addBlock=function(tag){
		var s_srt="<!-- START DYNAMIC BLOCK: "+tag+" -->";
		var e_srt="<!-- END DYNAMIC BLOCK: "+tag+" -->";
		var n_start =SampleTable.indexOf(s_srt,0);
		var n_end   =SampleTable.lastIndexOf(e_srt,SampleTable.length);
		var sampleTag =SampleTable.substring(n_start,n_end);

		sampleTag =sampleTag.replace(s_srt,"");

		// samplelayer = SampleTable.replace(s_srt+sampleTag+e_srt,"*TAG_"+tag+"*");
		samplelayer = samplelayer.replace(s_srt+sampleTag+e_srt,"*TAG_"+tag+"*");

		if (dataHash[tag]==undefined){
			dataHash[tag]=new Array();
			keyHash[keyHash.length]=tag;
		}
		tempTag=tag;
		dataHash[tag][dataHash[tag].length]=sampleTag;
	}

	_self.replace=function(oldTag,newTag){
		dataHash[tempTag][dataHash[tempTag].length-1]=dataHash[tempTag][dataHash[tempTag].length-1].replace(oldTag,newTag);
	}

	_self.fastPrint=function(){
		var output=samplelayer;
		for (var i=0;i<keyHash.length;i++){
			allLayer="";
			for (var j=0;j<dataHash[keyHash[i]].length;j++){
				allLayer+=dataHash[keyHash[i]][j];
			}
			output=output.replace("*TAG_"+keyHash[i]+"*",allLayer);
		}
		return output;
	}

	_self.getBlock=function(tag){
		if (dataHash[tag] == null) return "";
		var allLayer = "";
		for (var j=0; j<dataHash[tag].length; j++){
			allLayer += dataHash[tag][j];
		}
		return allLayer;
	}

}