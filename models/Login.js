// load the things we need
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

// define the schema for our user model
const userSchema = new Schema({
  local: {
    email: {
      type: String,
      // trim: true, unique: true,
      match: /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/,
    },
    password: String,
    firstName: String,
    lastName: String,
  },
  facebook: {
    id: String,
    displayName: String,
    first_name: String,
    last_name: String,
    email: String,
    image: String,
    facebookProvider: {
      type: {
        id: String,
        token: String,
      },
      select: false,
    },
  },
  time: { type: Date, default: Date.now() },
});

// generating a hash
userSchema.methods.generateHash = password => bcrypt.hashSync(
  password, bcrypt.genSaltSync(8), null,
);

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.local.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// facebook authenticate
userSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
  const That = this;
  return this.findOne({
    'facebookProvider.id': profile.id,
  }, (err, user) => {
    if (!user) {
      const newUser = new That({
        'facebook.first_name': profile.name.givenName,
        'facebook.last_name': profile.name.familyName,
        'facebook.displayName': profile.displayName,
        'facebook.email': profile.emails[0].value,
        'facebook.image': profile.photos[0].value,
        'facebook.facebookProvider': {
          id: profile.id,
          token: accessToken,
        },
      });

      newUser.save(function(error, savedUser) {
        if (error) {
          return error;
        }
        return cb(error, savedUser);
      });
    } else {
      return cb(err, user);
    }
  });
};

// create the model for users and expose it to our app
const LocalAuth = mongoose.model('LocalAuth', userSchema);
module.exports = LocalAuth;
