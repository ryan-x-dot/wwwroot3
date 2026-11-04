function Timer(_frequency, _count){
	var _self = this;
	var parentClass;
	
	var frequency = _frequency;	//frequency(ms)
	var init_count = _count;
	var count;
	var timerObj;
	var eventArr = new Array();
	var running = false;
	var isClear = false; //clear timer
	var dont_clear = false; // 
	var tmpTimer;
	
	//-------------------init-------------------------
	_self.init=function(){
		if(frequency==undefined){
			//alert("init error!!");
			return;
		}
		_self.addEventListener("TimerEvent.TIMER", _self.TIMER);
		_self.addEventListener("TimerEvent.TIMER_COMPLETE", _self.TIMER_COMPLETE);
	} 
	
	_self.setParentclass=function(_parentClass){
		parentClass = _parentClass;
  	}
 
  	_self.getThis=function(varible){
		return eval(varible);
  	}
  	
  	_self.setPrivate=function(varible,val){
      	eval(varible+"='"+val+"'");
    }
   	//-------------------init-------------------------
   	
   	
   	//add EventListener
	_self.addEventListener=function(funName, eventHandler){
		eventArr[funName] = eventHandler;
	}
	
	//remove EventListener
	_self.removeEventListener=function(funName){
		eventArr[funName] = null;
	}
	
	//start timer
	_self.startTimer=function(){
		if(!running){
			running=true;
			count = init_count;
			tmpTimer = setTimeout(_self.run, frequency);
		}
	}
	
	//stop timer
	_self.stopTimer=function(){
		if(running){
			clearTimeout(timerObj);
			clearTimeout(tmpTimer);
			running=false;
		}
	}		
	
	
	//run
	_self.run=function(){
		//console.log(count);
		//alert(count);
		if(isClear) return;
		
		if(count!=null) count--;
		
		if(count>0||count==null){
				eventArr["TimerEvent.TIMER"](count);
				timerObj = setTimeout(_self.run, frequency);
		}else{
				eventArr["TimerEvent.TIMER_COMPLETE"](count);
				_self.stopTimer();
		}  
	}
	
	
	_self.isRunning=function(){
		return running;
	}
	
	
	//run event
	_self.TIMER=function(){
		alert("run");
	}
	
	//finish event
	_self.TIMER_COMPLETE=function(){
		alert("finish");
	}
	
	
	_self.clearObj=function(){
		isClear = true;
		_self.stopTimer();
		_self.removeEventListener("TimerEvent.TIMER");
		_self.removeEventListener("TimerEvent.TIMER_COMPLETE");
		timerObj = null;
		frequency = 0;
		count = 0;
	}
  
  	_self.init();
}
