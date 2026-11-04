function CountdownTimer(_second, _showtype){
		var _self = this;
		var parentClass;

		var frequency = 1000;	//frequency(ms)
		var second = Math.round(_second/1000);
		var showtype = _showtype;

		var runHandler;
		var finishHandler;
		var showHandler;
		var timer;
		var d = 0;	//day
		var h = 0;	//hour
		var m = 0;	//minute
		var s = 0;	//second
		//-------------------init-------------------------
		_self.init=function(){
				
		} 
		
		_self.setParentclass=function(parentclass){
				 parentClass = parentclass;
  	}
 
  	_self.getThis=function(varible){
   			return eval(varible);
  	}
  	
  	_self.setPrivate=function(varible,val){
      	eval(varible+"='"+val+"'");
    }
   	//-------------------init-------------------------
   	
   	_self.startCalcTime=function(){
				
   			timer = new Timer(frequency, second);
				timer.addEventListener("TimerEvent.TIMER", _self.run);
				timer.addEventListener("TimerEvent.TIMER_COMPLETE", _self.finish);
				timer.startTimer();
		}
		
   	_self.stopCalcTime=function(){
   			d = 0;
				h = 0;
				m = 0;
				s = 0;
				if(timer!=null){
						timer.stopTimer();
						timer.removeEventListener("TimerEvent.TIMER", _self.run);
						timer.removeEventListener("TimerEvent.TIMER_COMPLETE", _self.finish);
						timer = null;
				}
		}
		
   	_self.run=function(count){
				try{
						runHandler(_self.showDateFormat(count));
				}catch(e){
						//alert(e);
						//_self.clearObj();
				}
		}
		
		_self.setRunHandler=function(eventHandler){
				runHandler = eventHandler;
		}
		
		_self.finish=function(count){
				_self.stopCalcTime();
				
				try{
						finishHandler(_self.showDateFormat(count));
				}catch(e){
						//alert(e);
						_self.clearObj();
				}
				
		}
		
		_self.setFinishHandler=function(eventHandler){
				finishHandler = eventHandler;
		}
		
		_self.setShowHandler=function(eventHandler){
				showHandler = eventHandler;
		}
		
		_self.isRunning=function(){
				return 	(timer!=null)?timer.isRunning():false;
		}
		
		_self.showDateFormat=function(count){
				if(showHandler!=null)  return showHandler(count);
				switch(showtype){
						case 0:
								return _self.showMinute(count);
								break;
						case 1:
								return _self.showSecond(count);
								break;
						case 2:
								return _self.showAll(count);
								break;
						default:
								return _self.showAll(count);
								break;
				}
		}
		
		//hou:min:sec
		_self.showAll=function(count){
				s = count%60;
				m = ((count-s)/60)%60;
				h = (((count-s) / 60) -m ) / 60 ;
				return _self.addzero(h)+":"+_self.addzero(m)+":"+_self.addzero(s);
		}
   	
		//min:sec
		_self.showMinute=function(count){
				s = count%60;
				m = ((count-s)/60)%60;
				return _self.addzero(m)+":"+_self.addzero(s);
		}
		
		//sec
		_self.showSecond=function(count){
				return _self.addzero(count);
		}
		
		_self.addzero=function(code){
				if(code*1 < 10)	return "0"+code;
				else						return ""+code;
		}
		
		_self.clearObj=function(){
				_self.stopCalcTime();
				finishHandler = null;  
				runHandler = null;  
				d = 0;
				h = 0;
				m = 0;
				s = 0;
		}   
        
        
  
}