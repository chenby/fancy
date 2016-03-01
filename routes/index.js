var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user1');
var List = require('../models/user2');
var Havegot = require('../models/user_got');
var mongodb=require('../models/db');
var admUser = require('../models/adm_vip');
var goods=require('../models/add_sp.js')
/* GET home page. */
router.get('/', function(req, res, next) {
	var deviceAgent = req.headers["user-agent"].toLowerCase();
	var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
	console.log(deviceAgent);
	if(agentID){
		goods.getten(0,function(err,list){
		var str = JSON.parse(list); 
		 res.render('mobile/index', { res:str});
		})
	}else{
		 if (req.session.user) {
			 function get_cart_name(){
			 	return new Promise(function(resolve){
			 	 List.getall(req.session.user.name,function(err,list){
					var str = JSON.parse(list); 
					console.log(str.length);
						resolve(str.length);
					})
				})
			 }
		 	get_cart_name().then(function(data){
				req.session.user.cartNum = data;
				res.render('index', { title: 'Express' });
			})
		 }else{
		 	res.render('index', { title: 'Express' });
		 }
	 }
});
router.get("/register",checkNotLogin);
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});
router.post('/register',function(req,res){
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	var newUser = new User({
		name:req.body.username,
		password:password,
		money:1,
		cartNum:0
	});
	User.get(newUser.name,function(err,user){
		if (user) {
			err = "username already exists"
		};
		if (err) {
			console.log(err);
			return res.redirect('/register');
		};
		newUser.save(function(err){
			if (err) {
				console.log(err);
				console.log('save出错');
				return res.redirect('/register');
			};
			req.session.user=newUser;
			console.log('注册成功');
			res.redirect('/');
		})
	})
})
router.get("/login",checkNotLogin);
router.get('/login', function(req, res, next) {
	var deviceAgent = req.headers["user-agent"].toLowerCase();
	var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
	console.log(deviceAgent);
	if(agentID){
		res.render('mobile/login', { title: 'Express' });
	}else{
	 res.render('login', { });
	}
});
router.post('/login', function(req, res) {
 	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
		User.get(req.body.username,function(err,user){
		if (!user) {console.log('用户不存在'); return res.redirect('/login')};
		if (user.password != password) { console.log('密码错误');return res.redirect('/login')};
		req.session.user = user;
		res.redirect('/');
	})
});
// router.post('/data_sp',function(req,res,next){
// 	goods.getall(function(err,list){
// 		var str = JSON.parse(list); 
// 		console.log(list);
// 	})
// 	// var data = 
// 	//       	[{
// 	//       		'src':'/images/cloth/4.jpg',
// 	//       		'cloth_Name':'数据可1asdwar恤+气质阔腿裤套装',
// 	//       		'price':20,
// 	//       		'zan':11
// 	//       	},{

// 	//       		'src':'/images/cloth/5.jpg',
// 	//       		'cloth_Name':'数据可2asdw1恤+气质阔腿裤套装',
// 	//       		'price':20,
// 	//       		'zan':11
// 	//       	},{

// 	//       		'src':'/images/cloth/6.jpg',
// 	//       		'cloth_Name':'数据可3asdwrsad恤+气质阔腿裤套装',
// 	//       		'price':20,
// 	//       		'zan':11
// 	//       	}];
// 	//  res.send(data);
// })
router.get("/shoppingCart",checkLogin);
router.get('/shoppingCart', function(req, res, next) {
 if (req.session.user) {
	 List.getall(req.session.user.name,function(err,list){
		var str = JSON.parse(list); 
		if (str) {
			req.session.user.cartNum=str.length;
		}else{
		 req.session.user.cartNum=0;
		}
		res.render('shoppingCart', { result:str });
	});
	
}
});
router.get('/success',checkLogin);
router.get('/success', function(req, res, next) {
	var deviceAgent = req.headers["user-agent"].toLowerCase();
	var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
	console.log(deviceAgent);
	if(agentID){
		res.render('mobile/success', { title: 'Express' });
	}else{
		res.render('success', {  });
	}
 });
router.post('/shoppingCart', function(req, res) {
var deviceAgent = req.headers["user-agent"].toLowerCase();
var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
 var  money = parseFloat(req.session.user.money) - parseFloat(req.body.allmon);
  var mon =money.toFixed(2);
if (req.body.allmon>0 ) {
	 if ( money>0&&req.body.allmon) {
	 	mongodb.open(function(err,db){
			if (err) {console.log(err); };
			db.collection('users',function(err,collection){
				if (err) {mongodb.close(); console.log(err);};	
				collection.update({'name':req.session.user.name},{$set:{"money":mon}},{safe:true},function(err,user){
					mongodb.close();
					 req.session.user.money = mon;
				 	res.redirect('/success');
				})
			})
		})
	 }else{
	 	console.log('钱不够不能购买');	
		if(agentID){
			res.redirect('/mobile/shopping');
		}else{
	 		res.redirect('/shoppingCart');
	 	}
	 }
};
})
//加入购物车
router.post('/add_to_cart', function(req, res) {
	function add_to_cart(){
		  var newlist = new List({
		  	user:req.session.user.name,
		  	name:req.body.sp,
		  	price:req.body.price
  		});
		 	return new Promise(function(resolve){
		 		 if (req.body.sp) {
					List.get(newlist.name,function(err,list){
							if (list&&list.user ==req.session.user.name) {
								err = "username already exists"
								console.log(err);
								return;
							};
							if (err) {
								req.flash('error',err);
								console.log(err);
							};
							newlist.save(function(err){
								if (err) {
										console.log(err);
										console.log('LISTsave出错');
										return res.redirect('/');
									};
									resolve()
								console.log('加入购物车成功');	
								res.send('success')
							})		
					})
  				};	
		 	})
	} 
add_to_cart().then(function(){
	User.get(req.session.user.name,function(err,user){	
 			user.cart_num_add(function(err){
				if (err) {
					console.log(err);
					console.log('cart_num_add出错');
				};
				console.log(req.session.user.cartNum);
				console.log('添加数量成功');
			})
 		
 	})
})	
});
router.post('/remove_shop', function(req, res) {
	List.remove(req.session.user.name,req.body.remove_name,function(err,list){
		if (!list) {console.log('不存在的用户，不可能的触发remove_shop');return;};
		res.send('success');
		console.log('删除成功');	
	})
});
router.post('/text', function(req, res) {
	console.log(req.body);
})
router.post('/submit', function(req, res) {
	var obj = JSON.parse(req.body.obj);console.log(req.body);
	var end = function(i) {
	  	return new Promise(function(resolve){
	  		var sad = new Havegot({
		    	user:req.session.user.name,
	   			sp:obj[i].sp,
				price:obj[i].price,
				num:obj[i].num
	  		});
			Havegot.get(sad.sp,function(err,list){
					if (list&&list.user ==req.session.user.name) {
						err = "商品 already exists"
						console.log(err);
						resolve();
						return;
					};
					
					if (err) {
						req.flash('error',err);
						console.log(err+'get err');
					
					};	
					sad.save(function(err){
						if (err) {
								console.log(err);
								console.log('sad save出错');
							};
						console.log('已加入购买');
						resolve();
						
					})	
			})//got 
	
  	});//return
 };
 if (  parseFloat(req.body.allmon) < parseFloat(req.session.user.money)) {
	var num = 0;
			function callback(){
				num++;
				if (num<req.body.lengtha) {
					end(num).then(callback);
				};
			}
	end(0).then(callback);
 }

})
//结算路由
router.all("/favourite",checkLogin);
router.get('/favourite', function(req, res, next) {
	Havegot.getall(req.session.user.name,function(err,list){	
		var str = JSON.parse(list); 
		res.render('favourite', { result:str });
				 
	});
});
router.post('/fav_remove', function(req, res) {
	 Havegot.remove(req.session.user.name,req.body.remove_name,function(err,list){
		if (!list) {console.log('不存在的用户，不可能的触发_fav');};
		console.log('删除成功');
	})
});
router.get('/voucher', function(req, res, next) {
   if (!req.session.user) {
		console.log('未登入');
		return res.redirect('/login');
	}else{
		res.render('voucher', { title: 'Express' });
	}
});
router.post('/voucher', function(req, res) {
 		User.get(req.session.user.name,function(err,user){	
 			user.money = parseInt(user.money)+parseInt(req.body.got_money);
 			user.chongzhi(function(err){
				if (err) {
					console.log(err);
					console.log('chonzhisave出错');
					return res.redirect('/chongzhi');
				};
				req.session.user = user;
				console.log('充值成功');
				res.redirect('/');
			})
 		
 		})

});
router.all("/chat",checkLogin);
router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Express' });
});

// 登出路由
router.get("/logout",checkLogin);
router.get('/logout', function(req, res) {
	   req.session.user=null;
	  return res.redirect('/');
});

function checkLogin(req, res, next) {
	if (!req.session.user) {
		console.log('未登入');
		return res.redirect('/login');
	}
	next();
}
function checkNotLogin(req, res, next) {
	if (req.session.user) {
	
		console.log('已登录');
		return res.redirect('/');
	}
	next();
}


//后台
router.get('/logoutvip', function(req, res) {
	   req.session.vip=null;
	  return res.redirect('/adm_login');
});
router.get('/admin', function(req, res, next) {
   if (!req.session.vip) {
		console.log('未登入');
		return res.redirect('/adm_login');
	}
	next();
});
router.get('/admin', function(req, res, next) {
  res.render('admin', { title: 'Express' });
});

router.get('/adm_login', function(req, res, next) {
   if (req.session.vip) {
		console.log('已登陆');
		return res.redirect('/adm_login');
	}
	next();
});
router.get('/adm_login', function(req, res, next) {
   res.render('adm_login', { title: 'Express' });
});
router.post('/adm_login', function(req, res, next) {
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
		admUser.get(req.body.admname,function(err,user){
		if (!user) {console.log('用户不存在'); return res.redirect('/adm_login')};
		if (user.password != password) { console.log('密码错误');return res.redirect('/adm_login')};
		req.session.vip = user;
		console.log(req.session.vip );
		res.redirect('/admin');
	})
})

//angular template
router.get('/views/firstPage', function(req, res, next) {
  res.render('ng-template/firstPage', { title: 'Express' });
});
router.get('/views/addsp', function(req, res, next) {
  res.render('ng-template/addsp', { title: 'Express' });
});
router.get('/views/goods', function(req, res, next) {
  res.render('ng-template/goods', { title: 'Express' });
});

router.get('/views/charge', function(req, res, next) {
  res.render('ng-template/charge', { title: 'Express' });
});
router.get('/views/shopping', function(req, res, next) {
  res.render('ng-template/shopping', { title: 'Express' });
});
router.get('/views/yonghu', function(req, res, next) {
  res.render('ng-template/yonghu', { title: 'Express' });
});
//添加商品
router.post('/addsp', function(req, res, next) {
  var newgoods = new goods({
		name:req.body.name,
		price:req.body.price,
		src:req.body.data
	});
	goods.get(newgoods.name,function(err,goods){
		if (goods) {
			err = "goods already exists"
		};
		if (err) {
			console.log(err);	 
		};
		console.log('aaaa');
		newgoods.save(function(err){
			if (err) {
				console.log(err);
				console.log('goods save出错');
				return res.redirect('/admin');
			};
			console.log('添加成功');
			res.redirect('/admin');
		})
	})
});
//得到商品展示页
router.post('/goods_get', function(req, res, next) {
 	goods.getall(function(err,list){
		var str = JSON.parse(list); 
		res.send(list);
	})
})
//商品分页路由
router.post('/goods_getten', function(req, res, next) {
 	goods.getten(req.body.base,function(err,list){
		var str = JSON.parse(list); 
		res.send(list);
	})
})
router.post('/goods_remove', function(req, res, next) {
	goods.remove(req.body.name,function(err,list){
		if (!list) {console.log('不存在的用户，不可能的触发remove_goods');return;};
		console.log('删除成功');
		res.send('sucess');
	})
})
//get订单
router.post('/shopping_get', function(req, res, next) {
	List.getallNo(function(err,list){
		var str = JSON.parse(list); 
		res.send(list);
	});
})
router.post('/shopping_remove', function(req, res, next) {
	console.log(req.body);
	List.remove(req.body.user,req.body.name,function(err,list){
		if (!list) {console.log('不存在的用户，不可能的触发remove_shop');return;};
		res.send('success');
		console.log('删除成功');	
	})
})
//get用户
router.post('/user_get', function(req, res, next) {
	mongodb.open(function(err,db){
		if (err) { console.log(err); };
		db.collection('users',function(err,collection){
			if (err) {mongodb.close();  console.log(err);;};		 
			  collection.find().toArray(function (err, items) {  
                if (items) {  
                 var list = JSON.stringify(items);
                 	res.send(list);
                } else {  
                    console.log(err);
                }  
            });  
			
		})
	})
})
router.post('/user_remove', function(req, res, next) {
	mongodb.open(function(err,db){
		if (err) { console.log(err); };
		db.collection('users',function(err,collection){
			if (err) {mongodb.close();console.log(err);};
			collection.remove({"name":req.body.name},function(err,doc){
				mongodb.close();
				if (doc) {		
					 res.send('success');
				}else{
					console.log(err);
				}
			})
		})
	})
})
//注册vip用户，外部不可见
// router.get('/vip', function(req, res, next) {
//   res.render('vip', { title: 'Express' });
// });
// router.post('/vip',function(req,res){
// 	var md5 = crypto.createHash('md5');
// 	var password = md5.update('vip').digest('base64');
// 	var newVip = new admUser({
// 		name:'vip',
// 		password:password
// 	});
// 		newVip.save(function(err){
// 			if (err) {
// 				console.log(err);
// 				console.log('save出错');
// 				return res.redirect('/vip');
// 			};
// 			console.log('注册成功');
// 			res.redirect('/admin');
// 		})
// })
router.get('/mobile/index', function(req, res, next) {
	goods.getten(0,function(err,list){
		var str = JSON.parse(list); 
		 res.render('mobile/index', { res:str});
	})
});
router.all("/mobile/shopping",checkLogin);
router.get('/mobile/shopping', function(req, res, next) {
	List.getall(req.session.user.name,function(err,list){
		var str = JSON.parse(list); 
		if (str) {
			req.session.user.cartNum=str.length;
		}else{
		 req.session.user.cartNum=0;
		}
		res.render('mobile/shopping', { result:str });
	});
});
router.all("/mobile/myshop",checkLogin);
router.get('/mobile/myshop', function(req, res, next) {
  res.render('mobile/myshop', { title: 'Express' });
});
router.get('/mobile/search', function(req, res, next) {
  res.render('mobile/search', { title: 'Express' });
});
router.all('/mobile/success',checkLogin);
router.get('/mobile/success', function(req, res, next) {
	res.render('mobile/success', {  });
 });
router.all("/mobile/login",checkNotLogin);
router.get('/mobile/login', function(req, res, next) {
  res.render('mobile/login', { title: 'Express' });
});
router.post('/mobile/login', function(req, res) {
 	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
		User.get(req.body.username,function(err,user){
		if (!user) {console.log('用户不存在');return res.redirect('login')};
		if (user.password != password) { console.log('密码错误');return res.redirect('login')};
		req.session.user = user;
		res.redirect('/mobile/index');
	})
});
router.get('/mobile/chong', function(req, res, next) {
   if (!req.session.user) {
		console.log('未登入');
		return res.redirect('/mobile/login');
	}else{
		 res.render('mobile/chong', { title: 'Express' });
	}
});
// router.post('/mobile/chong', function(req, res) {
//  		User.get(req.session.user.name,function(err,user){	
//  			user.money = parseInt(user.money)+parseInt(req.body.got_money);
//  			user.chongzhi(function(err){
// 				if (err) {
// 					console.log(err);
// 					console.log('chonzhisave出错');
// 					return res.redirect('mobile/chong');
// 				};
// 				req.session.user = user;
// 				console.log('充值成功');
// 				res.redirect('/');
// 			})
 		
//  		})

// });
module.exports = router;