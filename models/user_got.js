var mongodb=require('./db');

function Havegot(list){
	this.user = list.user;
	this.sp = list.sp;
	this.price=list.price;
	this.num = list.num;
	
	
}
module.exports = Havegot;

Havegot.prototype.save=function save(callback){
	var have_got ={
		user:this.user,
		sp:this.sp,
		price:this.price,
		num:this.num		
	}
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		db.collection('haveGot',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.insert(have_got,{safe:true},function(err,list){
				mongodb.close();
				callback(err,list);
			})
		})
	})

}

Havegot.get=function get(username,callback){
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
	
		db.collection('haveGot',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.findOne({"sp":username},function(err,doc){
				mongodb.close();
				if (doc) {
					var list =new Havegot(doc);
					callback(err,list);
				}else{
					callback(err,null);
				}
			})
		})
	})
}
Havegot.getall=function getall(username,callback){
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
	
		db.collection('haveGot',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};		 
			  collection.find({"user":username}).toArray(function (err, items) {  
                if (items ) {  
                 var list = JSON.stringify(items);   
                  callback(err,list); 
                } else {  
                    callback(err,null);
                }  
            });  
			
		})
	})
}
Havegot.remove=function remove(username,sp_name,callback){
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
	
		db.collection('haveGot',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			console.log(username);console.log(sp_name);
			collection.remove({"user":username,"sp":sp_name},function(err,doc){
				mongodb.close();
				if (doc) {		
					callback(err,doc);
				}else{
					callback(err,null);
				}
			})
		})
	})
}