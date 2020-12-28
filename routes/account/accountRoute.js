const express = require("express");
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Account = require("../../model/accountModel");
const auth = require('../../middleware/auth');

/**
 * @method - PUT
 * @param - /account/:id/password
 * @description - Change Password
 */
router.put("/:id/password", auth, async (req, res) => {
    const userId = req.params.id
    const body = req.body;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;

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

module.exports = router;