/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user: {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LocalAuth' },
    DOB: Date,
    location: {
      state: String,
      city: String,
      zip_code: String,
    },
    occupation: String,
  },
  payment: {
    payment_log: String,
  },
  following: [{ campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }, follow: { type: Boolean, default: false } }],
  time: { type: Date, default: Date.now },
});

const UserInfo = mongoose.model('Userinfo', userSchema);
module.exports = UserInfo;
