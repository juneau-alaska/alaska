const express = require("express");
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Account = require("../model/accountModel");
const auth = require('../middleware/auth');

/**
 * @method - PUT
 * @param - /account
 * @description - Update Account
 */

router.put(
  "/",
  auth,
  [
    check("email", "Please enter a valid email").isEmail(),
    check("userId", "Please enter a userId")
    .not()
    .isEmpty()
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
      userId
    } = req.body;
    
    try {
      let acct;

      acct = await Account.findOne({
        email
      });
      
      if (!acct) {
        return res.status(400).json({
          message: "Account does not exist"
        });
      }

      acct.userId = userId;

      await acct.save(function(err) {
        if (err) {
          res.status(400).json({
            message: err.message
          });
        } else {
          res.status(200).json({
            message: "Updated Account"
          });
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

module.exports = router;