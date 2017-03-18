var express = require('express');
var router = express.Router();
var auth = require('./auth');
// var mailer = require('./mailer');

router.post('/users/signin',auth.signin);
router.post('/users/signup',auth.signup);
router.post('/sendresetlink',auth.resetPass);
router.post('/sendresetlink/:encodedemail',auth.validatetoresetpass);

module.exports = router;
