const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../../models/userSchema');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

// const User = mongoose.model('authUser', User);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback', 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePhoto: profile.photos[0].value,
          }).save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
