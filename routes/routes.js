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

  // authenticated route with jwt auth ===================================================
  app.get('/api/user/:id', passport.authenticate('jwt', { session: false }), dashboard.allUsers);
  // User routes ================================================
  app.get('/api/users', passport.authenticate('jwt', { session: false }), userinfo.index);
  app.get('/api/user/:id', passport.authenticate('jwt', { session: false }), userinfo.singleUserInfo);
  app.post('/api/user/new', passport.authenticate('jwt', { session: false }), userinfo.createUserInfo);
  app.put('/api/user/:id', passport.authenticate('jwt', { session: false }), userinfo.updateUserInfo);
  app.delete('/api/user/:id', passport.authenticate('jwt', { session: false }), userinfo.deleteUserInfo);

  // campaign routes ================================================
  app.get('/api/user/:id/campaigns', passport.authenticate('jwt', { session: false }), campaign.index);
  app.get('/api/user/:id/campaign/:id', passport.authenticate('jwt', { session: false }), campaign.singleCampaign);
  app.post('/api/user/:id/campaign/new', passport.authenticate('jwt', { session: false }), campaign.createCampaign);
  app.put('/api/user/:id/campaign/:id', passport.authenticate('jwt', { session: false }), campaign.updateCampaign);
  app.patch('/api/campaign/:id/follow', passport.authenticate('jwt', { session: false }), campaign.campaignFollowers);
  app.delete('/api/user/:id/campaign/:id', passport.authenticate('jwt', { session: false }), campaign.deleteCampaign);

  // facebook route ===============================================================
  app.post('/api/auth/facebook', passport.authenticate('facebook-token', { session: false }), FbUser.save, generateToken, sendToken);
};

