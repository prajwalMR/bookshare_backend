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
		lib.gener = request.body.genre;
		//console.log(lib);
		var collection = db.collection("users");

		collection.findOne({_id : usrId} , function(err , data){
			if(!err && data){
				if(!data.bookInfo){
					console.log(!data.booksInfo);
					library = [];
					library.push(lib);
					collection.update(
	  				{_id : usrId},
	  				{$set : {'bookInfo.library' : library }}
	  			);
				}
				else{
	  			collection.update(
	  				{_id : usrId},
	  				{$push : { 'bookInfo.library' : lib } }
	  			);
				}
				response.send({
				"status" : "Success",
				"msg" : "Book has been Succesfully added"
			});
			}
			else{
				response.send({
					"status" : "Failed",
					"msg" : err
				});
			}
		})

	},

	getLibBooksById : function(request , response){
		id = request.query.email;
		console.log("EMAIL : " + id);
		var collection = db.collection('users');
		collection.findOne({_id : id} , function(err , data){
			//console.log(data);
			if(!err && data){
				if(data.bookInfo != undefined || data.bookInfo.library != undefined){
	  			myLibrary = data.bookInfo.library;
	  			response.send({
	  				"status" : "Success",
	  				"data" : myLibrary
	  			});  				
				}
				else{
				response.send({
	  				"status" : "Success",
	  				"msg" : "No books in library"
	  			});  				
				}
			}
			else{
				response.send({
					"status" : "Failed",
					"msg" : err
				});
			}
		});
	}
};

module.exports = bookDetails;