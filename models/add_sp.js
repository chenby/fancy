var mongodb=require('./db');
function goods(goods){
	this.name = goods.name;
	this.price = goods.price;
	this.src = goods.src;
}
module.exports = goods;
goods.prototype.save=function save(callback){
	var goods = {
		name:this.name,
		price:this.price,
		src:this.src
	};
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		db.collection('goods',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.insert(goods,{safe:true},function(err,goods){
				mongodb.close();
				callback(err,goods);
			})
		})
	})

}


goods.get=function get(goodsname,callback){
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		//读取goodss集合
		db.collection('goods',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.findOne({name:goodsname},function(err,doc){
				mongodb.close();
				if (doc) {
					var goods =new goods(doc);
					callback(err,goods);
				}else{
					callback(err,null);
				}
			})
		})
	})
}

goods.getall=function getall(callback){
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		db.collection('goods',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};		 
			  collection.find({}).toArray(function (err, items) {  
                if (items) {  
                 var list = JSON.stringify(items);   
                  callback(err,list); 
                } else {  
                    callback(err,null);
                }  
            });  
			
		})
	})
}
goods.remove=function remove(goodsname,callback){
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		db.collection('goods',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};
			collection.remove({"name":goodsname},function(err,doc){
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
goods.getten=function getten(base,callback){
	mongodb.open(function(err,db){
		if (err) {return callback(err); };
		db.collection('goods',function(err,collection){
			if (err) {mongodb.close(); return callback(err);};		 
			  collection.find({},{skip:base,limit:8}).toArray(function (err, items) {  
                if (items) {  
                 var list = JSON.stringify(items);   
                  callback(err,list); 
                } else {  
                    callback(err,null);
                }  
            });  
			
		})
	})
}