const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

/* GET home page. */
router.get("/", async (req, res, next) => {
  const posts = await Post.find().populate("author").exec();
  res.render("index", { title: "Members Only", posts });
});
router.get("/sign-up", (req, res) =>
  res.render("signUp", { title: "Sign Up page", errors: undefined })
);

const passwordsMatch = body("confirmPassword")
  .custom((value, { req }) => value === req.body.password)
  .withMessage("Passwords do not match");

router.post("/sign-up", passwordsMatch, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("signUp", {
      title: "Sigiin Up page",
      errors: errors.array(),
    });
  }
  try {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) next(err);
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        status: "user",
      });
      const result = await user.save();
    });
    return res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

router.get("/log-in", (req, res) => {
  res.render("logIn", { title: "Log In page" });
});

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    res.redirect("/");
  });
});

router.get("/member", (req, res) => {
  res.render("member", { title: "member" });
});
// become a member
router.post("/member", async (req, res) => {
  if (req.body.password === process.env.MEMBER_PASSWORD) {
    await User.findByIdAndUpdate(req.user.id, { status: "member" }, {});
    res.redirect("/");
  }
  res.render("member", { title: "member" });
});
// become an admin
router.get("/admin", (req, res) => {
  res.render("admin", { title: "admin" });
});

router.post("/admin", async (req, res) => {
  if (req.body.password === process.env.ADMIN_PASSWORD) {
    await User.findByIdAndUpdate(req.user.id, { status: "admin" }, {});
    res.redirect("/");
  }
  res.render("admin", { title: "admin" });
});

router.get("/create", (req, res) => {
  res.render("createPost", { title: "Create a post" });
});

router.post("/create", async (req, res, next) => {
  try {
    const post = new Post({
      title: req.body.title,
      postText: req.body.postText,
      author: req.user._id,
      date: new Date(),
    });
    await post.save();
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.post("/delete", async (req, res, next) => {
  try {
    const result = await Post.findByIdAndDelete(req.body.id);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
