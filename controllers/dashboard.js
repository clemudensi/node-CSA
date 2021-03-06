/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const UserAuth = require('../models/Users');
const settings = require('../config/settings');

const getToken = (headers) => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    }
    return null;
  }
  return null;
};

module.exports = {
  allUsers(req, res) {
    const token = getToken(req.headers);
    if (token) {
      const decoded = jwt.verify(token, settings.secret);

      // decode facebook user using token
      if (decoded.facebook) {
        return UserAuth.findOne({ 'facebook.email': decoded.facebook.email }, (err, user) => {
          if (err) return 'invalid login details';
          if (!user) {
            return res.status(403).send({ success: false, msg: 'Authentication failed user not found' });
          }
          return res.json({ success: true, msg: `You are welcome ${user.facebook.first_name} ${user.facebook.last_name}!`, user: user._id });
        });
      }

      // decode local-user using token
      if (decoded.local) {
        return UserAuth.findOne({ 'local.email': decoded.local.email }, (err, user) => {
          if (err) return 'invalid login details';
          if (!user) {
            return res.status(403).send({ success: false, msg: 'Authentication failed user not found' });
          }
          return res.json({ success: true, msg: `You are welcome ${user.local.firstName} ${user.local.lastName}!`, user: user._id });
        });
      }
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized User failed to login.' });
    }
  },

};
