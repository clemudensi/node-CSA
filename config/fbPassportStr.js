// let passport = require('passport');
const FacebookStrategy = require('passport-facebook-token');
const passport = require('passport');
const config = require('./config');
const FbUser = require('../models/localLogin');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    FbUser.findById('facebook.id', (err, user) => {
      done(err, user);
    });
  });

  passport.use('facebook-token', new FacebookStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
  },
  (accessToken, refreshToken, profile, done) => {
    FbUser.upsertFbUser(accessToken, refreshToken, profile, (err, user) => {
      return done(err, user);
    });
  }));
};
