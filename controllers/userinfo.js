const UserInfo = require('../models/userInfo');

module.exports = {
  index(req, res) {
    UserInfo.find((err, users) => {
      if (err) return res.send({ msg: 'Error finding users' });
      return res.json(users);
    });
  },

  async createUserInfo(req, res) {
    const newUserInfo = new UserInfo({
      'user.age': req.body.age,
      'user.location': {
        state: req.body.state,
        city: req.body.city,
        zip_code: req.body.zip_code,
      },
      'user.occupation': req.body.occupation,
    });
    try {
      const userInfo = await newUserInfo.save();
      res.send({ success: 'You have successfully created a profile', userInfo });
    } catch (err) {
      res.send({ success: false, msg: 'error occurred trying to sign up' });
    }
  },

  async singleUserInfo(req, res) {
    try {
      const userInfo = await UserInfo.findById(req.params.id);
      res.send(userInfo);
    } catch (err) {
      res.send({ msg: 'A problem occurred while retrieving your information' });
    }
  },

  async updateUserInfo(req, res) {
    const userInfo = req.body;
    const updUserInfo = {};

    if (userInfo) {
      updUserInfo.user.DOB = userInfo.DOB;
      updUserInfo.user.location = {
        state: userInfo.state,
        city: userInfo.city,
        zip_code: userInfo.zip_code,
      };
      updUserInfo.user.occupation = userInfo.occupation;
      updUserInfo.campaign_duration = userInfo.campaign_duration;
    }

    if (!updUserInfo) res.send({ msg: 'information was not updated' });
    try {
      const info = await UserInfo.findByIdAndUpdate(req.params.id);
      res.send(info);
    } catch (err) {
      res.send({ msg: 'error occurred retrieving your information' });
    }
  },

  async deleteUserInfo(req, res) {
    try {
      const userInfo = await UserInfo.findByIdAndRemove(req.params.id);
      res.send({ msg: 'Successfully deleted user details', userInfo });
    } catch (err) {
      res.send({ msg: 'Could not delete the user details' });
    }
  },

  async followCampaign(req, res) {
    const toggleFollowCampaign = new UserInfo({
      follow: req.body.follow,
    });
    try {
      const likeCampaign = await toggleFollowCampaign.findByIdAndUpdate(req.params.id);
      res.send(likeCampaign);
    } catch (err) {
      res.send({ msg: 'Unable to follow or like campaign' });
    }
  },
};
