require('dotenv').config();

const express = require("express");
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Account = require("../../model/accountModel");
const User = require("../../model/userModel");

/**
 * @method - POST
 * @param - /login
 * @description - Login
 */

router.post("/", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { 
      email, 
      username, 
      password 
    } = req.body;

    try {
      let user, acct;

      if (email) {
          console.log('email');
          user = await User.findOne({
            email: email
          });
      }

      if (username) {
          console.log('username');
          user = await User.findOne({
            username: username
          });
      }

      if (!user) {
        return res.status(400).json({
          message: "Incorrect Email, Username or Password!"
        });
      }

      acct = await Account.findOne({
        userId: user._id
      });

      const isMatch = await bcrypt.compare(password, acct.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Email, Username or Password!"
        });

      const payload = {
        acct: {
          id: acct._id
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
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

module.exports = router;