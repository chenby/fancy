var mongodb=require('./db');
function User(user){
	this.name = user.name;
	this.password = user.password;
	this.money = user.money;
	this.cartNum=user.cartNum;
}
module.exports = User;
User.prototype.save=function save(callback){
	var user = {
		name:this.name,
		password:this.password,
		money : this.money,
		cartNum:this.cartNum
	};
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		db.collection('users',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.ensureIndex('name',{unique:true});
			collection.insert(user,{safe:true},function(err,user){
				mongodb.close();
				callback(err,user);
			})
		})
	})

}

User.get=function get(username,callback){
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		//读取users集合
		db.collection('users',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.findOne({name:username},function(err,doc){
				mongodb.close();
				if (doc) {
					var user =new User(doc);
					callback(err,user);
				}else{
					callback(err,null);
				}
			})
		})
	})
}

User.prototype.chongzhi=function chongzhi(callback){
	var user = {
		name:this.name,
		money : this.money
	};
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		db.collection('users',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.update({'name':user.name},{$set:{"money":user.money}},{safe:true},function(err,user){
				mongodb.close();
				callback(err,user);
			})
		})
	})

}


User.prototype.cart_num_add=function cart_num_add(callback){
	var user = {
		name:this.name,
		cartNum:this.cartNum+1
	};
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		db.collection('users',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.update({'name':user.name},{$set:{"cartNum":user.cartNum}},{safe:true},function(err,user){
				mongodb.close();
				callback(err,user);
			})
		})
	})

}


User.prototype.cart_num_pa=function cart_num_pa(callback){
	var user = {
		name:this.name,
		cartNum:this.cartNum-1
	};
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		db.collection('users',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.update({'name':user.name},{$set:{"cartNum":user.cartNum}},{safe:true},function(err,user){
				mongodb.close();
				callback(err,user);
			})
		})
	})

}

User.prototype.cart_num_re=function cart_num_re(num,callback){
	var user = {
		name:this.name,
		cartNum:this.cartNum-num
	};
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		db.collection('users',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.update({'name':user.name},{$set:{"cartNum":user.cartNum}},{safe:true},function(err,user){
				mongodb.close();
				callback(err,user);
			})
		})
	})

}