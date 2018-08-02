/* eslint-disable consistent-return,no-param-reassign */
const UserAuth = require('../models/Users');

module.exports = {
  saveUser(req, res) {
    if (!req.body.email || !req.body.password) {
      res.json({ success: false, msg: 'Please pass username and password.' });
    } else {
      UserAuth.findOne(
        {
          $or: [{ 'local.email': req.body.email },
            { 'facebook.email': req.body.email }],
        }, async (err, user) => {
          if (user) return res.status(401).send({ success: false, msg: 'A User with this email already exist' });
          const newPass = new UserAuth();
          const newUser = new UserAuth({
            'local.firstName': req.body.firstName,
            'local.lastName': req.body.lastName,
            'local.email': req.body.email,
            'local.password': newPass.generateHash(req.body.password),
          });

          try {
            user = await newUser.save();
            res.send({ success: 'Successfully created an account', msg: `You are welcome ${user.local.firstName} ${user.local.lastName}!`, user });
          } catch (e) {
            res.json({ success: false, msg: 'error occurred trying to sign up' });
          }
        },
      );
    }
  },
};
