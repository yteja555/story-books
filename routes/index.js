const express = require("express");
const Story = require("../models/story");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
// @desc login/landing page
// @route get /Login

router.get("/", ensureGuest, (req, res) => {
  res.render("login", { layout: "login" });
});

// @desc DashBoard
// @route get/ Dashboard

router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      stories,
    });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

module.exports = router;
