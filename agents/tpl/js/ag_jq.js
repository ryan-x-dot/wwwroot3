
$(function(){
	//伸縮選項
	$(".winLi div").hide();
	$(".winLi h1").click(function(){
		var C=$(this).attr("class")
		$(".winLi div").slideUp(500);
		$(".winLi h1").removeClass();
		if(C!="On"){
			$(this).toggleClass("On").siblings("div").slideToggle(500);
		}
	})
	//回到TOP按鈕
	$(".backTopBTN").hide();
	$(window).scroll(function(){
		var N=$(window).scrollTop();
		if(N>50){
			$(".backTopBTN").fadeIn(100)
		}
		else{
			$(".backTopBTN").fadeOut(100)
		}
	})
	$(".backTopBTN").click(function(){
		$("html,body").animate({scrollTop:0},500)
	})
	
})







