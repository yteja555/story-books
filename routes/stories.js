const express = require("express");
const Story = require("../models/story");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

// @desc  show add page
// @route get /Login

router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// @desc Process and add form
// @route POST /stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// @desc Public Stories
// @route get/ stories

router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("stories/index", { stories });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// @desc Show eddit page
// @route GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id }).lean();
    if (!story) {
      return res.render("error/404");
    }
    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", { story });
    }
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

// @desc  Update story
// @route PUT /stories/:id

router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();
    if (!story) return res.render("error/404");
    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
    }
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

// @desc  delete story
// @route DELETE /stories/:id

router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

// @desc  show single story
// @route get /stories/:id

router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();
    if (!story) return res.render("error/404");
    res.render("stories/show", { story });
  } catch (error) {
    console.error(error);
    res.redirect("error/500");
  }
});

// @desc  user stories
// @route get /stories/user/:id

router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();
    res.render("stories/index", {
      stories,
    });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});
module.exports = router;
