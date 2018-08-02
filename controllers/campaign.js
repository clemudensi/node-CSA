/* eslint-disable no-underscore-dangle,prefer-destructuring */
const mongo = require('mongodb');
const Campaign = require('../models/campaign');

const ObjectId = mongo.ObjectId;

module.exports = {
  index(req, res) {
    Campaign.find((err, campaign) => {
      if (err) return res.send({ msg: 'Error finding campaigns' });
      return res.json(campaign);
    });
  },

  async createCampaign(req, res) {
    const cmpgn = req.body;
    const newCampaign = new Campaign({
      campaignUser_id: ObjectId(cmpgn.campaignUser_id),
      campaign_title: cmpgn.campaign_title,
      campaign_type: cmpgn.campaign_type,
      campaign_amount: cmpgn.campaign_amount,
      campaign_duration: cmpgn.campaign_duration,
    });
    try {
      const campaign = await newCampaign.save();
      res.send({ success: 'You have successfully launched a campaign', campaign: campaign.campaign_title });
    } catch (err) {
      res.send({ success: false, msg: 'error occurred trying to sign up' });
    }
  },

  async singleCampaign(req, res) {
    try {
      const campaign = await Campaign.findById(req.params.id);
      res.send(campaign);
    } catch (err) {
      res.send({ msg: 'Could not find the campaign' });
    }
  },

  async updateCampaign(req, res) {
    const campaign = req.body;
    const updCampaign = {};

    const updateCampaign = {
      campaignUser_id: ObjectId(campaign.campaignUser_id),
      campaign_title: campaign.campaign_title,
      campaign_type: campaign.campaign_type,
      campaign_amount: campaign.campaign_amount,
      campaign_duration: campaign.campaign_duration,
    };

    if (!updCampaign) res.send({ msg: 'Could not update the campaign please endeavour to fill in all form requirement' });
    try {
      const campaignRes = await Campaign.findByIdAndUpdate(
        req.params.id, updateCampaign, { new: true },
      );
      res.send(campaignRes);
    } catch (err) {
      res.send({ msg: 'Could not find the campaign' });
    }
  },

  async campaignFollowers(req, res) {
    const campaign = req.body;
    try {
      const campaignRes = await Campaign.findByIdAndUpdate(
        req.params.id, {
          $push: {
            campaign_followers: ObjectId(campaign.campaign_followers),
          },
        }, { upsert: true, new: true },
      );
      res.send(campaignRes);
    } catch (e) {
      res.send({ msg: e });
    }
  },

  async deleteCampaign(req, res) {
    try {
      const campaign = await Campaign.findByIdAndRemove(req.params.id);
      res.send({ msg: `Successfully deleted Campaign ${campaign.campaign_title}` });
    } catch (err) {
      res.send({ msg: 'Could not delete the campaign' });
    }
  },
};
