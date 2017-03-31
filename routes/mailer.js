var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');

var mailer = {
  mail : function(id,txt,link,sub){
  var transporter = nodemailer.createTransport({
  service: 'Gmail',
        auth: {
            user: 'linhacks007@gmail.com', // Your email id
            pass: 'ubuntu900' // Your password
        }
  })
  console.log("asfjgafhgsaf");
  // base64 encoding of user email
  var encodedEmail = new Buffer(id).toString('base64')
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: '"Linux Hacker" <linhacks007@gmail.com>', // sender address
      to: ''+ id, // list of receivers
      subject: ''+sub, // Subject line
      text: 'Hello', // plaintext body
      // add url here along with encode email
      html: '<p><a href='+link+'>'+txt+'</a></p>' // html body
  };
  console.log(mailOptions);
  // send mail
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.error(error);
      }
      console.log('Message sent: ' + info.response);
  });


  }
};
module.exports = mailer;
