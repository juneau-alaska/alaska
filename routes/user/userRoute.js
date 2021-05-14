const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const auth = require('../../middleware/auth');
const User = require("../../model/userModel");
const Notification = require("../../model/notificationModel");
const Token = require("../../model/tokenModel");
const sendEmail = require("../../utils/email/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @method - GET
 * @description - Get User by ID
 * @param - /user/:id
 */

router.get("/:id", auth, async (req, res) => {
  const userId = req.params.id

  try {
    const user = await User.findOne({ "_id": userId });
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

/**
 * @method - GET
 * @description - Get User by Username
 * @param - /user/username/:username
 */

router.get("/username/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ "username": username });
    res.json(user);
  } catch (e) {
    return res.status(500).json({
      msg: "Error while fetching user."
    });
  }
});

/**
 * @method - GET
 * @description - Get User by Email
 * @param - /user/email/:email
 */
router.get("/email/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ "email": email });
    res.json(user);
  } catch (e) {
    return res.status(500).json({
      msg: "Error while fetching user."
    });
  }
});

/**
 * @method - PUT
 * @description - Update User
 * @param - /user/:id
 */
router.put("/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  const email = req.body.email;
  const username = req.body.username;
  let user;

  try {
    if (email) {
      user = await User.findOne({
         email: email
      });
      if (user) {
        return res.status(400).json({
          msg: "Email has already been used."
        });
      }
    }

    if (username) {
      user = await User.findOne({
         username: username
      });
      if (user) {
        return res.status(400).json({
          msg: "Username has already been used."
        });
      }
    }

    user = await User.findOne({
      _id: _id
    });

    if (user) {
      for (var key in body) {
        user[key] = body[key];
      }

      const timeElapsed = Date.now();
      const today = new Date(timeElapsed);
      const isoString = today.toISOString();

      user['updatedAt'] = isoString;

      await user.save(function(err) {
        if (err) {
          res.status(400).json({
            message: err.message
          });
        } else {
          res.status(200).json({
            message: "Updated User",
            user
          });
        }
      });
    } else {
        return res.status(400).json({
          msg: "An error occurred while updating user info."
        });
    }
  } catch (e) {
     res.status(400).json({
        message: "An error occurred while updating user info."
    });
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
      res.status(500).send("Error in Saving");
    }
  }
);

/**
 * @method - POST
 * @description - Request Password
 * @param - /user/request_password
 */
router.post('/request_password', async (req, res) => {
  const email = req.body.email

  try {
    var user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        msg: 'No user found with that email address.'
      });
    } else {
      let token = await Token.findOne({ userId: user._id });
      if (token) await token.deleteOne();
      let code = Math.floor(100000 + Math.random() * 900000).toString();

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(code, salt);

      await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
      }).save();

      sendEmail(user.email, "Password Reset Request", {username: user.username, code: code}, "./template/requestResetPassword.handlebars");
      res.status(200).json({
        userId: user._id,
        message: "Email has been sent."
      });
    }
  } catch {
    res.status(500).json({
      message: 'Error has occurred.'
    });
  }
});

/**
 * @method - POST
 * @description - Validate Password Token
 * @param - /user/validate_code
 */
router.post('/validate_code', async (req, res) => {
  const userId = req.body.userId
  const code = req.body.code;

  try {
    var resetToken = await Token.findOne({ userId });

    if (!resetToken) {
      res.status(400).json({
        message: 'Token has expired.'
      });
    }

    const isMatch = await bcrypt.compare(code, resetToken.token);
    if (isMatch) {
      await resetToken.deleteOne();
      res.status(200).json({
        message: 'Success'
      });
    } else {
      res.status(400).json({
        message: 'Incorrect code.'
      });
    }
  } catch {
    res.status(500).json({
      message: 'Error has occurred.'
    });
  }
});

/**
 * @method - GET
 * @description - Get Notifications
 * @param - /user/:id/notifications
 */
router.get('/:id/notifications', async (req, res) => {
  const userId = req.params.id

  try {
      const notifications = await Notification.find({ "receiver": userId })
        .sort({ _id: -1 })
        .limit(50);

      res.status(200).json({
        notifications
      });
    } catch (e) {
      res.send({ message: "Error occurred while fetching notifications" });
    }
});

module.exports = router;