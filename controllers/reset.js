const async = require('async');
const nodemailer = require('nodemailer');
const User = require('../models/RegisterUser');
const login = require('../controllers/login');

module.exports = {
  index(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
      if (!user) {
        req.send('error', 'Password reset token is invalid or has expired.');
        return res.render('/forgot');
      }
      res.render('reset', {
        user: req.user,
      });
    });
  },

  resetPassword(req, res) {
    async.waterfall([
      function (done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
          if (!user) {
            req.send('error', 'Password reset token is invalid or has expired.');
            return res.render('back');
          }

          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          login.save(req, res);
        });
      },
      function (user, done) {
        const smtpTransport = nodemailer.createTransport('SMTP', {
          service: 'SendGrid',
          auth: {
            user: 'udensiclem',
            pass: 'fritzs123',
          },
        });
        const mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'Your password has been changed',
          text: `${'Hello,\n\n'
                    + 'This is a confirmation that the password for your account '}${user.email} has just been changed.\n`,
        };
        smtpTransport.sendMail(mailOptions, (err) => {
          req.send('success', 'Success! Your password has been changed.');
          done(err);
        });
      },
    ], (req) => {
      req.render('/');
    });
  },
};
