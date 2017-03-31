
var express = require('express');
var router = express.Router();
var auth = require('./auth');

router.post('/users/signin',auth.signin);
router.post('/users/signup',auth.signup);
router.post('/users/update',auth.UpdateDetails);
router.post('/sendresetlink',auth.sendmail);
router.post('/resetpsswd',auth.resetpass);
router.post('/authenticate' , auth.authenticate);
router.post('/verifyaccount',auth.verifyAccount);
router.get('/getuserdetails',auth.getUserDetails);
module.exports = router;
