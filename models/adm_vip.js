var mongodb=require('./db');
function admUser(user){
	this.name = user.name;
	this.password = user.password;
}
module.exports = admUser;
admUser.prototype.save=function save(callback){
	var admUser = {
		name:this.name,
		password:this.password
	};
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		db.collection('vips',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.insert(admUser,{safe:true},function(err,admUser){
				mongodb.close();
				callback(err,admUser);
			})
		})
	})

}

admUser.get=function get(username,callback){
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		//读取users集合
		db.collection('vips',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.findOne({name:username},function(err,doc){
				mongodb.close();
				if (doc) {
					var user =new admUser(doc);
					callback(err,user);
				}else{
					callback(err,null);
				}
			})
		})
	})
}
