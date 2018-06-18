const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const PORT = process.env.PORT || 8000;
const mobileApi = require("./mobileApi");
const webApi = require("./webApi");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const app = express();
const { Creators } = require("../model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      Creators.findOrCreateCreator({ googleId: profile.id })
        .then((user) => cb(null, user))
        .catch((err) => cb(err, null));
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  done(null, userId);
});

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/mobile-api/", mobileApi);
app.use("/web-api/", webApi);
app.use(express.static(path.join(__dirname, "../dist")));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
