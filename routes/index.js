var express = require('express');
var router = express.Router();
var auth = require('./auth');
// var mailer = require('./mailer');

router.post('/users/signin',auth.signin);
router.post('/users/signup',auth.signup);
router.post('/sendresetlink',auth.sendmail);
router.post('/resetpsswd',auth.resetpass);

module.exports = router;
