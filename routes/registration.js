const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../db/user");
var passwordValidator = require('password-validator');
 
// Create a schema
var schema = new passwordValidator();

schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().symbols()
.has().not().spaces();                        // Should not have spaces
const validateFields = (req, password) => {
    
  // Field validation
  req.checkBody("username_input", "Username cannot be empty").notEmpty();
  req.checkBody("password_input", "Password cannot be empty").notEmpty();
  req.checkBody(schema.validate(password),schema.validate(password)).not().equals(true);
  req
    .checkBody("password_verify", "Password verify cannot be empty")
    .notEmpty();
  req.checkBody("password_verify", "Passwords do not match").equals(password);
  

  return req.validationErrors();
};

router.get("/", function(req, res, next) {
  res.render("registration");
});
// router.get('*', function (req, res, next) {
//   res.locals.csrfToken = req.csrfToken()
//   next()
// })
router.post("/", (req, res) => {
  const { username_input: username, password_input: password } = req.body;
 const errors = validateFields(req, password);
 
 
 

  if (errors) {
    res.render("registration", { errors: errors });
  } else {
    bcrypt.hash(password, 10).then(hash => {
      User.createUser(username, hash)
        .then(() => {
          res.render("login");
        })
        .catch(error => {
          const { detail } = error;
          res.render("registration", {
            errors: [
              {
                msg: detail

              }
            ]
          });
        });
    });
  }
});

module.exports = router;
