const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
// router.get('/', function (req, res, next) {
//   res.locals.csrfToken = req.csrfToken()
//   next()
// })
router.get("/", (req, res) => {
  res.locals.csrfToken = req.csrfToken();
   if (req.isAuthenticated()) {
    res.redirect("/lobby");
   } else {
     res.render("login");
   }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/lobby",
    failureRedirect: "/"
  })
);

module.exports = router;
