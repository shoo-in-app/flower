const router = require("express").Router();
const { Rallies } = require("../model");

const isAuthenticated = (req, res, next) => {
  if (req.user) return next();
  res.sendStatus(401);
};

router.post("/rally/", isAuthenticated, async (req, res) => {
  try {
    await Rallies.createRally(
      req.user,
      req.body.title,
      req.body.description,
      req.body.start_datetime,
      req.body.end_datetime,
      req.body.locations
    );
    res.send("The rally is now added.");
  } catch (err) {
    console.error("Error adding new rally!", err);
    res.status(500).send("Internal server error");
  }
});

router.get("/rallies/", isAuthenticated, async (req, res) => {
  try {
    const rallies = await Rallies.getCreatedRallies(req.user);
    res.send(rallies);
  } catch (err) {
    console.error("Error getting created rallies!", err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
