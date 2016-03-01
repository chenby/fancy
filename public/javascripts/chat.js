$(function(){
	var myName= $('#user_name').text();
	socket = io.connect('http://localhost:3000');
	socket.on('open',function(){
		 socket.send(myName);
	})
	socket.on('sym',function(json){
		if (json.text===false) {
			return;
		};
		var p = '';
		if(json.type == 'disconnect'){p = '<div class="sym"><span>sym：'+myName+'离开聊天</span></div>'}
		$('.chat_body').append(p);
	})
	socket.on('message',function(json){
		if (json.text!==''&&json.author!==myName) {
		var p = '<div class="users"><span class="img"></span><div class="neir">'+json.text+'</div><span class="name">['+json.author+']</span><span class="time">'+json.time+'</span></div> '	
		};
		if (json.text!==''&&json.author===myName) {
			var p = '<div class="users1"><span class="img1"></span><div class="neir1">'+json.text+'</div><span class="name1">['+json.author+']</span><span class="time1">'+json.time+'</span></div> '	
		};
		$('.chat_body').append(p);
	})
	$('.submit_text').click(function(){ 
		var msg = $('.input').val();
		socket.send(msg);
		$('.input').val(''); 
	 })
	$('.input').keydown(function(e){
		if (e.keyCode===13) {
			var msg = $(this).val();
			socket.send(msg);
			$(this).val('');		 
		};

	})
})