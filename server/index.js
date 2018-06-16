const app = require("./app");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const PORT = process.env.PORT || 8000;
const api = require("./api");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/google/return",
    },
    (accessToken, refreshToken, profile, done) => {
      const payload = [
        {
          topic: "users",
          messages: JSON.stringify(profile),
        },
      ];
      kafkaProducer.send(payload, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("User profile send to kafka");
      });
      done(null, profile);
    }
  )
);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/", api);
app.use(express.static(path.join(__dirname, "../dist")));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
