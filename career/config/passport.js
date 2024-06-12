const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");
const User = require("../model/loginModel");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});

// Google OAuth Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID:
//         "1068328525330-h0k2686kvvdi2h8bi92gq771vhmfkgme.apps.googleusercontent.com",
//       clientSecret: "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",
//       callbackURL: "http://localhost:6060/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       const existingUser = await User.findOne({ googleId: profile.id });
//       if (existingUser) {
//         return done(null, existingUser);
//       }
//          console.log(profile);
//       const user = await new User({
//         googleId: profile.id,
//         email: profile.emails[0].value,      
//       }).save();
//       done(null, user);
//     }
//   )
// );

passport.use(new GoogleStrategy({
    clientID: "1068328525330-h0k2686kvvdi2h8bi92gq771vhmfkgme.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: 'http://localhost:6060/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google profile:', profile); // Debugging log
  
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        console.log('User already exists:', existingUser); // Debugging log
        return done(null, existingUser);
      }
  
      const user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value
      });
  
      await user.save();
      console.log('New user created:', user); // Debugging log
  
      done(null, user);
    } catch (err) {
      console.error('Error in Google Strategy:', err); // Error log
      done(err, null);
    }
  }));

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: "YOUR_FACEBOOK_APP_ID",
      clientSecret: "YOUR_FACEBOOK_APP_SECRET",
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ facebookId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({
        facebookId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
      }).save();
      done(null, user);
    }
  )
);
