var bookDetails = {
	authenticate: function (req,res) {

    	usrname = new Buffer(req.body.userName , 'base64').toString('ascii') ;
    	passwd = new Buffer(req.body.password , 'base64').toString('ascii');

      	var collection = req.db.collection('adminDetails');
      	collection.findOne({username:usrname , password:passwd },function (err,data) {
          if(!err && data){
              var  token = jwt.sign({username:req.body.userName},secret.secret,{ expiresIn: 36000 });
              res.send({
                  "msg": "Authentication Succesfull",
                  "token": token,
                  "expiresAt" : Math.floor(Date.now()/1000) + 35000
              });
          }
          else if(data==null){
              res.send({
                  "msg": "Authentication Failed, User Not Found"
              });
          }
      });
   },

	getAllBooks : function(request , response){
		var collection = db.collection("books");
			collection.find({}).toArray(function (err,items) {
			if (!err && items) {
			   response.send({
			     "status" : "Success",
			     "data" : items
			   });
			} else {
				response.send({
					"status" : "Success",
					"msg" : err
				})
			}
		});
	},

	addBooksToLib : function(request , response){
		lib = {}
		usrId = request.body.email;
		lib.id = request.body.isbn;
		lib.title = request.body.title;
		lib.author = request.body.author;
		lib.genre = request.body.genre;
		lib.inLib = true;
		lib.inSellBox = false;
		lib.inRentBox = false;
		//console.log(lib);
		var collection = db.collection("users");

		collection.findOne({_id : usrId} , function(err , data){
			if(!err && data){
	  			collection.update(
	  				{_id : usrId},
	  				{$push : { 'bookInfo' : lib } }
	  			);
				response.send({
				'status' : 'Success',
				'msg' : 'Book has been Succesfully added',
				});
			}
			else{
				response.send({
					'status' : 'Failed',
					'msg' : err
				});
			}
		});

	},

	getLibBooksById : function(request , response){
		id = request.query.email;

		var collection = db.collection("users");


		collection.aggregate(
				
					{ $match : {_id : id}},
					{$unwind : "$bookInfo"},
					{ $match : {"bookInfo.inLib" : true}}
				
			 , function(error , data){

			 	if(!error && data){
			 		console.log("SUCCESS")
			 		response.send({
			 			'status' : 'Success',
			 			'data' : data
			 		});
			 	}
		});
		
	},

	getSellBooksById : function(request , response){
		id = request.query.email;

		var collection = db.collection("users");


		collection.aggregate(
				
					{ $match : {_id : id}},
					{$unwind : "$bookInfo"},
					{ $match : {"bookInfo.inSellBox" : true}}
				
			 , function(error , data){

			 	if(!error && data){
			 		console.log("SUCCESS")
			 		response.send({
			 			'status' : 'Success',
			 			'data' : data
			 		});
			 	}
		});
		
	},


		
	sellBook : function(request , response){
		//console.log(request.body);
		email = request.body.email;
		bookISBN = request.body.isbn;
		bookTitle = request.body.title;
		var bookToSell;
		var collection = db.collection('users');

		collection.update({_id:email,"bookInfo.id":bookISBN},{$set:{"bookInfo.$.inLib":false,"bookInfo.$.inSellBox":true}},function(err,data){
			if(!err && data){
				response.send({
					"status":"Success",
					"data": data
				});
			}
			else{
				response.send({
					"status":"error",
					"msg": err
				});
			}
		});
	},

	rentBook : function(request , response){
		//console.log(request.body);
		email = request.body.email;
		bookISBN = request.body.isbn;
		bookTitle = request.body.title;
		var bookToSell;
		var collection = db.collection('users');

		collection.update({_id:email,"bookInfo.id":bookISBN},{$set:{"bookInfo.$.inLib":false,"bookInfo.$.inRentBox":true}},function(err,data){
			if(!err && data){
				response.send({
					"status":"Success",
					"data": data
				});
			}
			else{
				response.send({
					"status":"error",
					"msg": err
				});
			}
		});
	},

	deleteBooks : function(request , response){
	   var recvData = request.body;
	   var email = recvData.email;
	   var list = recvData.books;
	   console.log(list);
	   var collection = db.collection('users');

	 collection.update({_id:email},{$pull:{"bookInfo":{id:{$in:list}}}},{multi:true},function(err,data){
	   if(!err){
	     response.send({
	       "status":"Success"
	     });
	   }
	   else{
	     response.send({
	       "status":"Failed"
	     });
	   }
	 });
 }

};
module.exports = bookDetails;
