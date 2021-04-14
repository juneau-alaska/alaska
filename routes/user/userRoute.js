const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const User = require("../../model/userModel");
const auth = require('../../middleware/auth');
const Token = require("../../model/tokenModel");
const sendEmail = require("../../utils/email/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

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
      let resetToken = crypto.randomBytes(32).toString("hex");
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(resetToken, salt);

      await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
      }).save();

      const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${user._id}`;
      sendEmail(user.email, "Password Reset Request", {name: user.username,link: link,}, "./template/requestResetPassword.handlebars");
      res.status(200).json({
        message: "Email sent."
      });
    }
  } catch {
    res.status(500).json({
      message: 'Error occurred while trying to send link.'
    });
  }

});
  
module.exports = router;