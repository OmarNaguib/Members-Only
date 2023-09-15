const express = require("express");
const bcrypt = require("bcryptjs");

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
    bcrypt.hash("somePassword", 10, async (err, hashedPassword) => {
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

module.exports = router;
