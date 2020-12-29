const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const User = require("../../model/userModel");
const auth = require('../../middleware/auth');

/**
 * @method - POST
 * @description - Fetch users using partial string
 * @param - /users
 */
router.post("/", auth, async (req, res) => {
    try {
            var partialText = req.body.partialText || "";
            var escapedPartial = escape(partialText);

            let users = await User.find({username: new RegExp(escapedPartial, 'i')})
                .sort({username: 1})
                .limit(10);

            res.status(200).send(users);

        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in fetching users");
        }
});

module.exports = router;