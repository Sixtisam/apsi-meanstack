const express = require("express");
const bcrypt = require("bcrypt");
const user = require("../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const NewUser = new user({
      email: req.body.email,
      password: hash,
    });
    NewUser.save().then((result) => {
      res.status(201).json({
        message: "User Created",
        result: result,
      });
    });
  });
});

router.post("/login", (req, res, next) => {
  user
    .findOne({ email: req.body.email })
    .then((fetchedUser) => {
      if (!fetchedUser) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      return bcrypt
        .compare(req.body.password, fetchedUser.password)
        .then((result) => {
          if (!result) {
            return res.status(401).json({
              message: "Auth failed",
            });
          }
          const token = jwt.sign(
            { email: fetchedUser.email, userId: fetchedUser._id },
            "A_very_long_string_for_our_secret",
            { expiresIn: "1h" }
          );
          res.status(200).json({
            token: token,
            expiresInDuration: 3600,
            userId: fetchedUser._id,
          });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(401).json({
        message: "Auth failed",
      });
    });
});

module.exports = router;
