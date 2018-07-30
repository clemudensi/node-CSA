const Campaign = require('../models/campaign');

module.exports = {
  index(req, res) {
    Campaign.find((err, campaign) => {
      if (err) return res.send({ msg: 'Error finding campaigns' });
      return res.json(campaign);
    });
  },

  async createCampaign(req, res) {
    const newCampaign = new Campaign({
      campaign_title: req.body.campaign_title,
      campaign_type: req.body.campaign_type,
      campaign_amount: req.body.campaign_amount,
      campaign_duration: req.body.campaign_duration,
    });
    try {
      const campaign = await newCampaign.save();
      res.send({ success: 'YOu have successfully launched a campaign', campaign: campaign.campaign_title });
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

    if (campaign.campaign_title) {
      updCampaign.campaign_title = campaign.campaign_title;
      updCampaign.campaign_type = campaign.campaign_type;
      updCampaign.campaign_amount = campaign.campaign_amount;
      updCampaign.campaign_duration = campaign.campaign_duration;
    }

    if (!updCampaign) res.send({ msg: 'Could not update the campaign' });
    try {
      const campaignRes = await Campaign.findByIdAndUpdate(req.params.id);
      res.send(campaignRes);
    } catch (err) {
      res.send({ msg: 'Could not find the campaign' });
    }
  },

  async deleteCampaign(req, res) {
    try {
      const campaign = await Campaign.findByIdAndRemove(req.params.id);
      res.send({ msg: `Successfully deleted Campaign${campaign.campaign_title}` });
    } catch (err) {
      res.send({ msg: 'Could not delete the campaign' });
    }
  },
};
