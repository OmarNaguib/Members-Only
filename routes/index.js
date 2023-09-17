const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const router = express.Router();
const User = require("../models/User");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});
router.get("/sign-up", (req, res) =>
  res.render("signUp", { title: "Sign Up page" })
);

router.post("/sign-up", async (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) next(err);
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        status: "normal",
      });
      const result = await user.save();
    });
    res.redirect("/");
  } catch (err) {
    next(err);
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

router.post("/create", (req, res) => {
  res.render("createPost", { title: "Create a post" });
});

module.exports = router;
