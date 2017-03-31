
var express = require('express');
var router = express.Router();
var auth = require('./auth');
var bookDetails = require('./bookDetails');

router.post('/users/signin',auth.signin);
router.post('/users/signup',auth.signup);
router.post('/sendresetlink',auth.sendmail);
router.post('/resetpsswd',auth.resetpass);
router.post('/authenticate' , auth.authenticate);
router.get('/books/getall' , bookDetails.getAllBooks);
router.post('/books/addtolib' , bookDetails.addBooksToLib);
router.post('/verifyaccount',auth.verifyAccount);

module.exports = router;
