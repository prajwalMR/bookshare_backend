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

  // getAllBooks : function(request , response){
  //  var collection = db.collection("books");
  //    collection.find({}).toArray(function (err,items) {
  //    if (!err && items) {
  //       response.send({
  //         "status" : "Success",
  //         "data" : items
  //       });
  //    } else {
  //      response.send({
  //        "status" : "Success",
  //        "msg" : err
  //      })
  //    }
  //  });
  // },

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
  getRentBooksById : function(request , response){
    id = request.query.email;

    var collection = db.collection("users");


    collection.aggregate(

          { $match : {_id : id}},
          {$unwind : "$bookInfo"},
          { $match : {"bookInfo.inRentBox" : true}}

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
      book = request.body.book;
      bookISBN = book.id;
      bookTitle = book.title;

      console.log(book);
      var addedBy = [];
      var bookToSell;
      var collection = db.collection('users');
      var bookCollection = db.collection('books');

      collection.update({_id:email,"bookInfo.id":bookISBN},{$set:{"bookInfo.$.inLib":false,"bookInfo.$.inSellBox":true}},function(err,data){
        if(!err && data){
          // {$and:[{_id:bookISBN},{status:"sell"}]} add this condition for the main case.
          bookCollection.findOne({$and:[{_id:bookISBN},{status:"sell"}]},function(error , data1){
            console.log(data1);
            if(!error && !data1){
              addedBy.push(email);
              bookCollection.insert({"_id":bookISBN,"title":bookTitle,"author":book.author,"genre":book.genre,"status":"sell","addedBy":addedBy},function(err1){
                if(!err1){
                  console.log("----------INSERTED---------");
                  // console.log(request);
                  response.send({
                    "status":"Success"
                  });
                }
                else{
                  response.send({
                    "status":"error",
                    "msg": err1
                  });
                }
              });
            }
            else {
              if(!error && data1){
                addedBy = data1.addedBy;
                addedBy[addedBy.length] = email;
                console.log("-------------------DATA FOUND-----------");
                bookCollection.update({_id:bookISBN},{$set:{"addedBy":addedBy}},function(err2 , data2){
                  if(!err2 && data2){
                    response.send({
                      "status":"Success"
                    });
                  }
                  else{
                    response.send({
                      "status":"error",
                      "msg": err2
                    });
                  }
                });

              }
              else{
                response.send({
                  "status":"error",
                  "msg": error
                });
              }
            }

          })
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
      book = request.body.book;
      bookISBN = book.id;
      bookTitle = book.title;
      var bookToSell;
      console.log(book);
       var addedBy = [];
      var collection = db.collection('users');
       var bookCollection = db.collection('books');

      collection.update({_id:email,"bookInfo.id":bookISBN},{$set:{"bookInfo.$.inLib":false,"bookInfo.$.inRentBox":true}},function(err,data){
        if(!err && data){
          // response.send({
          //   "status":"Success",
          //   "data": data
          // });

          bookCollection.findOne({$and : [{"_id":bookISBN},{"status":"rent"}]},function(error , data1){
            console.log(data1);
            if(!error && !data1){
              addedBy.push(email);
              bookCollection.insert({"_id":bookISBN,"title":bookTitle,"author":book.author,"genre":book.genre,"status":"rent","addedBy":addedBy},function(err1){
                if(!err1){
                  console.log("----------INSERTED---------");
                  // console.log(request);
                  response.send({
                   "status":"Success"
                 });
                }
                else{
                  response.send({
                   "status":"error",
                   "msg": err1
                 });
                }
              });
        }
       else{
          if(!error && data1){
            addedBy = data1.addedBy;
            addedBy[addedBy.length] = email;
            console.log("-------------------DATA FOUND-----------");
            bookCollection.update({_id:bookISBN},{$set:{"addedBy":addedBy}},function(err2 , data2){
              if(!err2 && data2){
                response.send({
                  "status":"Success"
                });
              }
              else{
                response.send({
                  "status":"error",
                  "msg": err2
                });
              }
            });

          }
          else{
            response.send({
              "status":"error",
              "msg": error
            });
          }
       }
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
  },

  getAllBooks : function(request,response){
  var collection = db.collection("books");
  collection.find({}).toArray(function(err,data){
    if(!err && data){
      console.log(data);
      response.send({
        "status" : "Success",
        "data" : data
      });
    }
    else{
      response.send({
        "status" : "Failed"
      });
    }
  });
  },

  recommendedBooksToBuy : function(request , response){
  	//email = request.body.email;
  	interests = request.body.interests;
  	console.log(interests[0]);
  	//usersCollection = db.collection('users');
  	booksCollection = db.collection('books');

  	booksCollection.find({'genre' : {$in : interests }} , function(error , cursor){
  		if(!error && cursor){
  			cursor.toArray(function(err , data){
  				if(!err && data){
  					console.log("DATA : ");
  					console.log(data);
  					response.send({
  						"status" : "Success",
  						"data" : data
  					});
  				}
  				else{
  					console.log(err);
  					response.send({
  						"status" : "Failed",
  						"msg" : err
  					});
  				}
  			})
  		}
  		else{
  			console.log(error);
  			response.send({
  				"status" : "Failed",
  				"msg" : error
  			});
  		}
  	});
  },

  requestBook : function(request , response){
    title = request.body.title;
    author = request.body.author;
    genre = request.body.genre;
    id = request.body.email;

    collection = db.collection('bookrequests');

    collection.insert({"_id":id+"-"+title , "title" : title , "author" : author , "genre" : genre} , function(err){
      if(!err){
        response.send({
          'status' : 'Success',
          'msg' : 'book requested'
        })
      }
      else{
        response.send({
          'status' : 'Failed',
          'msg' : 'Failed to request book'
        })
      }
    })
  },

  getBookRequests : function(request , response){
    collection = db.collection('bookrequests');
    collection.find({} , function(error , cursor){
      if(!error && cursor){
        cursor.toArray(function(err , data){
          if(!err && data){
            response.send({
              'status' : 'Success',
              'data' : data
            });
          }
          else{
            response.send({
              'status' : 'Failed',
              'msg' : 'Failed to fetch book requests'
            });
          }
        })
      }
    });
  },

  getByCategory : function(request,response){
   category = request.body;
   console.log(category);

  booksCollection = db.collection('books');
  booksCollection.find({'genre' : {$in : category}} , function(err,cursor){
    if(!err && cursor){
      cursor.toArray(function(err1,data){
        if(!err1 && data){
          console.log("DATA:",data);
          response.send({
            "status" : "Success",
            "data": data
          });
        }
        else{
          console.log(err1);
          response.send({
            "status" : "Failed",
            "msg" : err1
          });
        }
      });
    }
    else{
      console.log(err);
      response.send({
        "status" : "Failed",
        "msg" : err1
      });
    }
  });
 }

};
module.exports = bookDetails;
