var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var sha1 = require('sha1');
var magic = require('csprng');
var secret = require('../secret');
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var host = 'https://754d9269.ngrok.io';

var auth = {
    // authenticate: function (req,res) {
    //     var collection = req.db.collection('adminDetails');
    //     collection.findOne({username:req.body.userName,password:req.body.password},function (err,data) {
    //         if(!err && data){
    //             var  token = jwt.sign({username:req.body.userName},secret.secret,{ expiresIn: 36000 });
    //             res.send({
    //                 "msg": "Authentication Succesfull",
    //                 "token": token,
    //                 "expiresAt" : Math.floor(Date.now()/1000) + 35000
    //             });
    //         }
    //         else if(data==null){
    //             res.send({
    //                 "msg": "Authentication Failed, User Not Found"
    //             });
    //         }
    //     });
    //  }
    signup : function(request , response){
    console.log(request.body);
	mongo = request.db;
	collection = mongo.collection('users');
	req = request.body;
	salt = magic(160, 36);
	hash = sha1( req.pass + salt ),
	collection.insert({
		_id : req.email,
		name : req.name,
		email : req.email,
		phoneNum : req.phoneNum,
		salt : salt,
		hash : hash
	// callback function that fiers after the batabase operations are completed
	} , function(err){
		if(!err){
			response.send({
				"status" : "Success"
			})
		}
		else{
			response.send({
				"status" : err
			})
		}
	});
	},

	signin : function(request , response){
	mongo = request.db;
	req = request.body;
	email = req.email;
	pass = req.pass;
	collection = mongo.collection('users');
	collection.findOne({ 'email' : email} , function(err , result){
		console.log(result , "\n");
		if(!err && result){
			salt = result.salt;
			hash = result.hash;
			authHash = sha1(pass + salt);
			console.log(authHash);
			if(hash == authHash){
				response.send({
					"status" : "Success",
					"data": result
				})
			}
			else{
				response.send({
					"status" : "failed",
					"data":result
				})
			}
		}
		else{
			response.send({
				"status":"error",
				"msg":err
			});
		}
	});
	},

	resetPass: function(request,response){
  mongo = request.db;
  collection = mongo.collection("users");
  var recvData = request.body;
  var data = {};
  data.email = recvData.email;
  console.log(data.email);
  // details of the mailer
  var transporter = nodemailer.createTransport({
  service: 'Gmail',
        auth: {
            user: 'linhacks007@gmail.com', // Your email id
            pass: 'ubuntu900' // Your password
        }
  })
  // base64 encoding of user email
  var encodedEmail = new Buffer(data.email).toString('base64')
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: '"Linux Hacker" <linhacks007@gmail.com>', // sender address
      to: ''+ data.email, // list of receivers
      subject: 'CHANGE PASSWORD', // Subject line
      text: 'Hello', // plaintext body
      // add url here along with encode email
      html: '<p><a href='+host+'/sendresetlink/'+encodedEmail+'>CLICK HERE TO RESET PASSWORD</a></p>' // html body
  };
  console.log(mailOptions);
  // send mail
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.error(error);
      }
      console.log('Message sent: ' + info.response);
  });

  	// recording time
	var date = new Date()
	var sentTime = date.getTime() / 1000 ;       //gives the epoch time in seconds
  console.log(sentTime);
	// add sentTime to DB
	collection.update({'email':''+data.email},{$set:{'stime':''+sentTime}},function(err,result){
			if(!err && result){
				response.send({
					"status":"success",
					"data":result
				})
			}
			else{
				if(!err && !result){
					response.send({
					"status":"failed",
					"data":"not found"
					})
				}
				else{
					response.send({
					"status":"failed",
					"data":err
					})
				}
			}
	})
	},

	validatetoresetpass : function(request,response){
    var date = new Date()
  	var recvTime = date.getTime() / 1000 ;       // gives epoch time in seconds
    //var endTime = recvTime.split(':')
    console.log(recvTime)
    validityTime = 300.000;
		mongo = request.db;
    collection = mongo.collection("users")
    // base64 to ascii
    var email = new Buffer(encodedemail,'base64').toString('ascii')
    collection.findOne({'email':email},function(err,result){
      if(!err && result){
        var startTime = result.stime
        if(recvTime - startTime <= validityTime){
          response.send({
            "status":"success",
            "data":result
          })
        }
        else{
          response.send({
            "status":"failed",
            "data":"timeout"
          })
        }
      }
    })

	}
};

module.exports = auth;
