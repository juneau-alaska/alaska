const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const User = require("../model/userModel");
const auth = require('../middleware/auth');

/**
 * @method - GET
 * @description - Get User
 * @param - /user/:username
 */

router.get("/:username", auth, async (req, res) => {
  const username = req.params.username
  
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.find({ "username": req.user.username });
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

/**
 * @method - POST
 * @description - Create User
 * @param - /user
 */
router.post("/", [
    check("username", "Please Enter a valid username")
    .not()
    .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const {
      username,
      email
    } = req.body;

    try {
      let user = await User.findOne({
        email
      });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists"
        });
      }

      user = await User.findOne({
        username
      });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists"
        });
      }

      user = new User({
        username,
        email
      });

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      res.status(200).json({
        id: user.id
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);
  
module.exports = router;