module.exports = {
  save(req, res, next) {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated or allowed to login');
    }
    req.auth = {
      user: req.user,
    };

    next();
  },
};
