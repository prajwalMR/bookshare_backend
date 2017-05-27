
var express = require('express');
var router = express.Router();
var auth = require('./auth');
var bookDetails = require('./bookDetails');

router.post('/users/signin',auth.signin);
router.post('/users/signup',auth.signup);
router.post('/users/update',auth.UpdateDetails);
router.post('/sendresetlink',auth.sendmail);
router.post('/resetpsswd',auth.resetpass);
router.post('/authenticate' , auth.authenticate);
router.post('/books/addtolib' , bookDetails.addBooksToLib);
router.post('/verifyaccount',auth.verifyAccount);
router.get('/users/library' , bookDetails.getLibBooksById);
router.get('/users/sellbox' , bookDetails.getSellBooksById);
router.get('/users/rentbox' , bookDetails.getRentBooksById);
router.get('/getuserdetails',auth.getUserDetails);
router.post('/users/books/sell' , bookDetails.sellBook);
router.post('/users/books/rent' , bookDetails.rentBook);
router.post('/users/library/delete' , bookDetails.deleteBooks);
router.get('/books/all',bookDetails.getAllBooks);
router.post('/users/recommendedbooks' , bookDetails.recommendedBooksToBuy);
router.post('/users/books/request' , bookDetails.requestBook);
router.get('/users/books/getrequests' , bookDetails.getBookRequests);

module.exports = router;
