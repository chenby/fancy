var mongodb=require('./db');

function List(list){
	this.user = list.user;
	this.name = list.name;
	this.price=list.price;
}
module.exports = List;

List.prototype.save=function save(callback){
	var list ={
		user:this.user,
		name:this.name,
		price:this.price
	}
		
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		db.collection('lists',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.insert(list,{safe:true},function(err,list){
				mongodb.close();
				callback(err,list);
			})
		})
	})

}

List.get=function get(username,callback){
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
	
		db.collection('lists',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.findOne({"name":username},function(err,doc){
				mongodb.close();
				if (doc) {
					var list =new List(doc);
					callback(err,list);
				}else{
					callback(err,null);
				}
			})
		})
	})
}
List.getall=function getall(username,callback){
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
	
		db.collection('lists',function(err,collection){
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
List.getallNo=function getallNo(callback){
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		db.collection('lists',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};		 
			  collection.find().toArray(function (err, items) {  
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
List.remove=function remove(username,sp_name,callback){
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
	
		db.collection('lists',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.remove({"user":username,"name":sp_name},function(err,doc){
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
