const express = require("express");
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Account = require("../../model/accountModel");
const User = require("../../model/userModel");
const Token = require("../../model/tokenModel");
const auth = require('../../middleware/auth');

/**
 * @method - PUT
 * @param - /account/:id/password
 * @description - Change Password
 */
router.put("/:id/password", auth, async (req, res) => {
    const userId = req.params.id
    const body = req.body;
    const currentPassword = body.currentPassword;
    const newPassword = body.newPassword;

    try {
        const acct = await Account.findOne({ "userId": userId });

        const isMatch = await bcrypt.compare(currentPassword, acct.password);
          if (!isMatch) {
            return res.status(400).json({
              message: "Current password is incorrect."
            });
          }

        const salt = await bcrypt.genSalt(10);
        var password = await bcrypt.hash(newPassword, salt);

        acct.password = password;

        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        const isoString = today.toISOString();

        acct['updatedAt'] = isoString;

        await acct.save(function(err) {
            if (err) {
              res.status(400).json({
                message: err.message
              });
            } else {
              res.status(200).json({
                message: "Updated password."
              });
            }
          });
      } catch (e) {
        res.send({ message: "Error occurred while changing password." });
      }
});

/**
 * @method - POST
 * @param - /account/reset_password
 * @description - Reset Password
 */
router.put("/reset_password", async (req, res) => {
    const body = req.body;
    const userId = body.userId
    const token = body.token;
    const password = body.password;

    try {
      let passwordResetToken = await Token.findOne({ userId });
      if (!passwordResetToken) {
        throw new Error("Invalid or expired password reset token");
      }

      const isValid = await bcrypt.compare(token, passwordResetToken.token);
      if (!isValid) {
        throw new Error("Invalid or expired password reset token");
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await Account.updateOne(
        { userId: userId },
        { $set: { password: hash } },
        { new: true }
      );

      const user = await User.findById({ _id: userId });
      sendEmail(
        user.email,
        "Password Reset Successfully",
        {
          name: user.username,
        },
        "./template/resetPassword.handlebars"
      );
      await passwordResetToken.deleteOne();
      res.status(200).json({
        message: "Password successfully updated."
      });
    } catch (e) {
      res.status(400).json({
        message: "Error occurred while resetting password."
      });
    }
});

module.exports = router;