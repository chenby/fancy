$(function(){

	$('.nav-left>ul>li').mouseover(function(){
		// hover envet
		$(this).css({
			'background-color':'rgba(242,242,242,0.9)',
			'border-right':'1px solid rgba(242,242,242,0.1)'
		})
		$(this).children('a').css({'color':'rgb(60,192,245)'});
		$(this).children('i').hide();
		// hover envet
		var className = $(this).attr('class');
		$('.'+className).show();
	}).mouseout(function(){
		$('.nav-right').hide();
			$(this).css({
				'background-color':'rgba(255,255,255,0)',
				'border-right':'none'
			})
			$(this).children('a').css({'color':'#000'});
			$(this).children('i').show();
			
	});
	$('.nav-right').mouseover(function(){
		$(this).show();
		var className =$(this).attr('class').substr(10);
		$('.'+className).css({
			'background-color':'rgba(242,242,242,0.9)',
			'border-right':'1px solid rgba(242,242,242,0.1)'
		})
		$('.'+className).children('a').css({'color':'rgb(60,192,245)'});
		$('.'+className).children('i').hide();
		

	}).mouseout(function(){
		$(this).hide();
		var className =$(this).attr('class').substr(10);
		$('.'+className).css({
				'background-color':'rgba(255,255,255,0)',
				'border-right':'none'
			})
		$('.'+className).children('a').css({'color':'#000'});
		$('.'+className).children('i').show();

	});

	// lbt
	var num = 1;
		$('#right').click(function(){
			num++;
			if (num>5) {num=1};
			cli();
		})
		$('#left').click(function(){
			num--;
			if (num<1) {num=5};
			cli();
					
		})
	
	 $('span[index=1]').click(function(){num = 1; cli()})
	 $('span[index=2]').click(function(){num = 2 ; cli()})
	 $('span[index=3]').click(function(){num = 3 ; cli()})
	 $('span[index=4]').click(function(){num = 4 ; cli()})
	 $('span[index=5]').click(function(){num = 5 ; cli()})
	 function cli( ){
	 	$('.img-'+num).css({
				'opacity': 1,
				'z-index':222
			})
			for (var i = 1; i < 6; i++) {
				if (i!==num) {
					$('.img-'+i).css({
					'opacity': 0,
					'z-index':1
					})
					$('span[index='+i+']').removeClass('on');
				};
			};	
			$('span[index='+num+']').addClass('on');
	 }
	setInterval(function(){
		num++;
		if (num>5) {num=1};
		cli();
	},4000);

	// lbt
	
})