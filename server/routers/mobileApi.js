const router = require("express").Router();
const { Users, Rallies } = require("../model");

router.post("/user/", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await Users.findOrCreateUser(email);
    res.send({
      userId: user.hash,
      username: user.username,
      email: user.email,
      exp: user.exp,
    });
  } catch (err) {
    console.error("Error adding user!", err);
    res.status(500).send(`Internal server error: ${err}`);
  }
});

router.delete("/user/:userId", async (req, res) => {
  try {
    await Users.deleteUser(req.params.userId);
    res.send(`USER:${req.params.userId} was correctly deleted`);
  } catch (err) {
    console.error("Error deleting user!", err);
    res.status(500).send(`Internal server error: ${err}`);
  }
});

router.patch("/exp/:userId", async (req, res) => {
  try {
    const userId = await Users.getUserId(req.params.userId);
    const exp = await Users.incrementExp(userId, req.body.exp);
    res.send(`current exp is ${exp}.`);
  } catch (err) {
    console.error("Error adding user!", err);
    res.status(500).send(`Internal server error: ${err}`);
  }
});

router.get("/rallies", async (req, res) => {
  try {
    const rallies = await Rallies.getAllRallies();
    res.send(Object.values(rallies));
  } catch (err) {
    console.error("Error loading rallies!", err);
    res.status(500).send(`Internal server error: ${err}`);
  }
});

router.get("/rallies/:userId", async (req, res) => {
  try {
    const userId = await Users.getUserId(req.params.userId);
    const chosenRallies = await Rallies.getChoosenRallies(userId);
    const notChosenRallies = await Rallies.getNotChosenRallies(userId);
    res.send({
      chosen: chosenRallies,
      notChosen: notChosenRallies,
    });
  } catch (err) {
    console.error("Error loading locations!", err);
    res.status(500).send(`Internal server error: ${err}`);
  }
});

router.patch("/rally/:userId/:rallyId", async (req, res) => {
  try {
    const userId = await Users.getUserId(req.params.userId);
    const rallyId = req.params.rallyId;
    const chosen = req.body.chosen;
    await Rallies.toggleRally(userId, rallyId, chosen);
    if (chosen === true) {
      res.send("The rally is now chosen.");
    } else if (chosen === false) {
      res.send("The rally is now cancelled.");
    } else {
      res.send("Failed. Boolean key 'chosen' should be in body.");
    }
  } catch (err) {
    console.error("Error updating user history!", err);
    res.status(500).send(`Internal server error: ${err}`);
  }
});

router.patch("/location/:userId/:locationId", async (req, res) => {
  try {
    const visited = req.body.visited;
    const userId = await Users.getUserId(req.params.userId);
    await Rallies.toggleLocation(userId, req.params.locationId, visited);
    if (visited) {
      res.send("The location is now visited.");
    } else {
      res.send("The location is now unvisited.");
    }
  } catch (err) {
    console.error("Error updating user history!", err);
    res.status(500).send(`Internal server error: ${err}`);
  }
});

module.exports = router;
