const { generateToken, sendToken } = require('../config/token.utils');
const User = require('../controllers/login');
const FbUser = require('../controllers/fbLogin');
const forgot = require('../controllers/forgot-pass');
const dashboard = require('../controllers/dashboard');
const reset = require('../controllers/reset');
const signup = require('../controllers/signup');
const campaign = require('../controllers/campaign');
const userinfo = require('../controllers/userinfo');

module.exports = (app, passport) => {
// local routes ===============================================================

  app.post('/api/login', User.login);
  app.get('/reset/:token', reset.index);
  app.post('/reset/:token', reset.resetPassword);
  app.post('/api/signup', signup.saveUser);
  app.post('/api/forgot-pass', forgot.save);
  app.get('/api/campaigns', campaign.index);

  // authenticated route with jwt auth ===================================================
  app.get('/api/dashboard', passport.authenticate('jwt', { session: false }), dashboard.allUsers);
  // campaign routes ================================================
  app.get('/api/campaign/:id', passport.authenticate('jwt', { session: false }), campaign.singleCampaign);
  app.get('/api/campaign/new', passport.authenticate('jwt', { session: false }), campaign.createCampaign);
  app.get('/api/campaign/:id', passport.authenticate('jwt', { session: false }), campaign.updateCampaign);
  app.get('/api/campaign/:id', passport.authenticate('jwt', { session: false }), campaign.deleteCampaign);

  // User routes ================================================
  app.get('/api/users', passport.authenticate('jwt', { session: false }), userinfo.index);
  app.get('/api/user/:id', passport.authenticate('jwt', { session: false }), userinfo.singleUserInfo);
  app.get('/api/user/new', passport.authenticate('jwt', { session: false }), userinfo.createUserInfo);
  app.get('/api/user/:id', passport.authenticate('jwt', { session: false }), userinfo.updateUserInfo);
  app.get('/api/user/:id', passport.authenticate('jwt', { session: false }), userinfo.deleteUserInfo);

  // facebook route ===============================================================
  app.post('/api/auth/facebook', passport.authenticate('facebook-token', { session: false }), FbUser.save, generateToken, sendToken);
};
