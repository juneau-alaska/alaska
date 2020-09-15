require('dotenv').config();

const express = require("express");
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Account = require("../model/accountModel");
const User = require("../model/userModel");

/**
 * @method - POST
 * @param - /signup
 * @description - SignUp
 */

router.post(
  "/",
  [
    check("username", "Please Enter a valid username")
    .not()
    .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const {
      username,
      email,
      password
    } = req.body;

    try {
      let acct = await Account.findOne({
        email
      });
      if (acct) {
        return res.status(400).json({
          msg: "Email has already been used."
        });
      }

      acct = await Account.findOne({
        username
      });
      if (acct) {
        return res.status(400).json({
          msg: "Username has already been taken."
        });
      }

      acct = new Account({
        username,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);
      acct.password = await bcrypt.hash(password, salt);

      acct.save(function(err, doc) {
        if (err) return console.error(err);
        let user = new User({
          username,
          email
        });

        user.save(function(err, doc) {
          if (err) return console.error(err);          
          acct.userId = user.id;
          acct.save(function(err, doc) {
            if (err) return console.error(err);
            const payload = {
              acct: {
                id: acct.id
              }
            };
    
            jwt.sign(
              payload,
              process.env.ACCESS_TOKEN_SECRET, 
              (err, token) => {
                if (err) throw err;
                res.status(200).json({
                  token,
                  user
                });
              }
            );
          });
        });

      });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({
        msg: "Something went wrong, please try again"
      });
    }
  }
);

module.exports = router;