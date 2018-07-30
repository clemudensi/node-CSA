/* eslint-disable consistent-return,no-param-reassign */
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/RegisterUser');

module.exports = {
  save(req, res, next) {
    async.waterfall([
      (done) => {
        crypto.randomBytes(20, (err, buf) => {
          const token = buf.toString('hex');
          done(err, token);
        });
      },
      (token, done) => {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (!user) {
            res.status(401).send({ success: false, msg: 'No account with the email exist.' });
            return null;
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(() => {
            done(err, token, user);
          });
        });
      },
      (token, user, done) => {
        const smtpTransport = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: 'udensiclem',
            pass: 'fritzs123',
          },
        });
        const mailOptions = {
          to: user.email,
          from: 'cklemmzy@gmail.com',
          subject: 'Node.js Password Reset',
          text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
                    + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
                    + 'http://'}${req.headers.host}/reset/${token}\n\n`
                    + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        };
        smtpTransport.sendMail(mailOptions, (err) => {
          if (!err) {
            return res.status(200).send({ success: true, msg: `info has been sent to ${user.email}, check email for further instructions ` });
          }
          done(err, 'done');
        });
      },
    ], (err) => {
      if (err) return next(err);
      res.render(`/forgot-pass${req}`);
    });
  },
};
