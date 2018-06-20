const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

const mobileApi = require("./mobileApi");
const webApi = require("./webApi");
const { Creators } = require("../model");

const app = express();
const PORT = process.env.PORT || 8000;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.URL + "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      Creators.findOrCreateCreator({ googleId: profile.id });
      cb(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((userId, done) => {
  done(null, userId);
});
app.use(
  session({
    secret: "code chrysalis banzai!",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
app.use("/mobile-api", mobileApi);
app.use("/web-api", webApi);
app.use(express.static(path.join(__dirname, "../dist")));
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
