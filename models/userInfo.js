/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserInfoSchema = new Schema({
  user: {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAuth' },
    DOB: Date,
    location: {
      state: String,
      city: String,
      zip_code: String,
    },
    occupation: String,
  },
  payment: [{
    payment_statement: String,
    payment_time: Date,
    amount: Number,
  }],
  following: [{ campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }, follow: { type: Boolean, default: false } }],
  time: { type: Date, default: Date.now },
});

const UserInfo = mongoose.model('UserInfo', UserInfoSchema);
module.exports = UserInfo;

// todo - set necessary required index
