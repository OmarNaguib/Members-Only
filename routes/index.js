const express = require("express");

const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});
router.get("/sign-up", (req, res) =>
  res.render("signUp", { title: "Sign Up page" })
);

module.exports = router;
