/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LocalAuth' },
  campaign_title: String,
  campaign_type: String,
  campaign_amount: String,
  campaign_duration: Number,
  campaign_status: { type: Boolean, default: true },
  following: Number,
  comments: {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'LocalAuth' },
    comment_body: String,
  },
  time: { type: Date, default: Date.now },
});

const Campaign = mongoose.model('Campaign', userSchema);
module.exports = Campaign;
