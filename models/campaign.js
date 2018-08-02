/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CampaignSchema = new Schema({
  campaignUser_id: { type: Schema.Types.ObjectId, ref: 'UserAuth' },
  campaign_title: String,
  campaign_type: String,
  campaign_amount: Number,
  campaign_duration: Number,
  campaign_status: { type: Boolean, default: true },
  campaign_followers: Array,
  comments: {
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAuth' },
    comment_body: String,
  },
  time: { type: Date, default: Date.now },
});

const Campaign = mongoose.model('Campaign', CampaignSchema);
module.exports = Campaign;

// todo - set necessary required index
