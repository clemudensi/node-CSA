const jwt = require('jsonwebtoken');
const settings = require('../config/settings');


const createToken = (auth) => {
  return jwt.sign(auth.user.toJSON(), settings.secret, {
    expiresIn: 60 * 120,
  });
};

module.exports = {
  generateToken(req, res, next) {
    req.token = 'JWT ' + createToken(req.auth);
    return next();
  },

  sendToken(req, res) {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(req.user);
  },
};
