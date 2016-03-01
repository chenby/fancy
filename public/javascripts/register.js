$(function(){
	var username=$('.form>form>div>input[name=username]'),
		password=$('.form>form>div>input[name=password]'),
		repassword=$('.form>form>div>input[name=repassword]'),
		telephone=$('.form>form>div>input[type=telephone]'),
		email=$('.form>form>div>input[type=email]'),
		checkbox=$('.fuwu>input[type=checkbox]');
		var keyarr=[username,password];
		//检查数据
		 var form ={
	 		notNull:[false,false,false,false,false],
  			maxLength: 3
		 }
		 //检查方法
		 var method={
		 	checkPassword:function(password,repassord){
		 		return password!=repassord;		 		
	 		},
	 		notNull: function( value ){
			     return value !== '';		    
			},
			maxLength:function(value){
				 
				return value.length<=form.maxLength;		
			},
			checkPhone:function(value){
				return value.length!=11||!Number(value);
			},
			checkEmail:function(value){
				var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
				return !reg.test(value);
			}
		}
	function keyupFunc(todo){
		
		var todoArr=[ 
 			method.maxLength(username.val()),
 			method.maxLength(password.val()),
			method.checkPassword(repassword.val(),password.val()),
			method.checkPhone(telephone.val()),
			method.checkEmail(email.val())
 		]
		if(todoArr[todo]){
			console.log($(this));
			 	thingsArr[todo].next('span').show();
			 	thingsArr[todo].addClass('err');
		}else{
			console.log('yes');
			 	thingsArr[todo].next('span').hide();
			 	thingsArr[todo].removeClass("err");
		}
		check();
	}
 	var thingsArr=[username,password,repassword,telephone,email];
 	var todoArr=[ 0,1,2,3,4]
 	todoArr.forEach(function(value,key){
 		 thingsArr[key].keyup(function(){
 		 	 keyupFunc(value)
 		 })
 	 })	
	checkbox.click(function(){
	 	check();
	})

	function check(){
		var checkarr=[username.attr('value'),password.attr('value'),repassword.attr('value'),telephone.attr('value'),email.attr('value')];
		for (var i = 0; i < checkarr.length; i++) {
			if (method.notNull(checkarr[i])) {
				form.notNull[i]=false;
			}else{
				form.notNull[i]=true;
			}
		};	
		var notNull=true;
		//保证所有不为空
		for (var i = 0; i <  form.notNull.length; i++) {
			if (form.notNull[i]) {
				 notNull=false;
			}else{
				notNull=true;
			}
		};
		if(checkbox[0].checked&&!$('.err').length&&notNull){
	  		$('.submit').removeAttr("disabled")
	  	}else{
	  		$('.submit').attr('disabled','disabled');
	  	}
	} 

	// 	for (var i = keyarr.length - 1; i >= 0; i--) {
	// 		keyarr[i].keyup(function(){
	// 		 if($(this).attr('value').length<=3){
	// 		 	$(this).next('span').show();
	// 		 	$(this).addClass('err');
	// 		 }else{
	// 		 	$(this).next('span').hide();
	// 		 	$(this).removeClass("err");
	// 		 }
	// 		 check();
	// 		});
	// 	};
	// repassword.keyup(function(){
	// 	if ($(this).attr('value')!=password.attr('value')) {
	// 			$(this).next('span').show();
	// 		 	$(this).addClass('err');
	// 	}else{
	// 		 	$(this).next('span').hide();
	// 		 	$(this).removeClass("err");
	// 	 }
	// 	 check();
		
	// })
	// telephone.keyup(function(){
	// 	if($(this).attr('value').length!=13||isNaN($(this).attr('value'))){
	// 			$(this).next('span').show();
	// 		 	$(this).addClass('err');
	// 	}else{
	// 		 	$(this).next('span').hide();
	// 		 	$(this).removeClass("err");
	// 	 }
	// 	 check();
	// })
	// email.keyup(function(){
	// 	var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	// 	if(!reg.test($(this).attr('value'))){
	// 		$(this).next('span').show();
	// 		$(this).addClass('err');
	// 		}else{
	// 			 	$(this).next('span').hide();
	// 			 	$(this).removeClass("err");
	// 	} 
	// 	check();
	// })
	//  checkbox.click(function(){
	//  	check();
	// })

	// function check(){
	// var shuld = username.attr('value')==''||password.attr('value')==''||repassword.attr('value')==''||telephone.attr('value')==''||email.attr('value')=='';

	// 	if(checkbox[0].checked&&!username.hasClass('err')&&!password.hasClass('err')&&!repassword.hasClass('err')&&!telephone.hasClass('err')&&!email.hasClass('err')&&!shuld){
	//   		$('.submit').removeAttr("disabled")
	//   	}else{
	//   		$('.submit').attr('disabled','disabled');
	//   	}
	// } 
})
