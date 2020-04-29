require('dotenv').config();

const express = require("express");
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Account = require("../model/accountModel");

/**
 * @method - POST
 * @param - /signup
 * @description - SignUp
 */

router.post(
  "/signup",
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
          msg: "User Already Exists"
        });
      }

      acct = await Account.findOne({
        username
      });
      if (acct) {
        return res.status(400).json({
          msg: "User Already Exists"
        });
      }

      acct = new Account({
        username,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);
      console.log(salt)
      acct.password = await bcrypt.hash(password, salt);

      await acct.save();

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
            token
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

/**
 * @method - POST
 * @param - /login
 * @description - Login
 */

router.post(
  "/login",
  [
    check("username", "Please enter a valid email or username")
    .not()
    .isEmpty(),
    check("email", "Please enter a valid email or username")
    .not()
    .isEmpty(),
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
      email, 
      username, 
      password 
    } = req.body;
    
    try {
      let acct, acct1, acct2;

      acct1 = await Account.findOne({
        email
      });

      acct2 = await Account.findOne({
        username
      });
      
      if (!acct1 && !acct2) {
        return res.status(400).json({
          message: "Incorrect Email/Username or Password!"
        });
      }

      acct = acct1 || acct2;
      
      const isMatch = await bcrypt.compare(password, acct.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Email/Username or Password!"
        });

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
            token
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