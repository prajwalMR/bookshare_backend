var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var sha1 = require('sha1');
var magic = require('csprng');
// var expressJWT = require('express-jwt');
// var jwt = require('jsonwebtoken');
// var secret = require('./secret');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://127.0.0.1:27017/booksdb';
MongoClient.connect(url, function(err, database) {
   if(err){
     console.log("DataBase Error : " + err);
     res.send(err);
   }
   else{
     console.log("connected")
     db = database;
   }
});

var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// app.use(expressJWT({secret:secret.secret}).unless({path:'/authenticate'}));

//make the database object accessible to router module
app.use(function (req, res, next) {
  req.db = db;
  next();
});

app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// var nodemailer = require('nodemailer')
host = 'https://754d9269.ngrok.io';
app.post('/sendresetlink',function(req,res){
// recording time
  var date = new Date()
  var sentTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

  //collection.insert({})

  // add sentTime to DB
})
module.exports = app;
