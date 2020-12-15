const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Conversation = require("../../model/conversationModel");
const auth = require('../../middleware/auth');

/**
 * @method - GET
 * @description - Get All Conversations by user id
 * @param - /conversations/:userId
 */
router.get("/:userId", auth, async (req, res) => {
    const userId = req.params.userId;

    try {
        let conversations = await Conversation.find({
            users: [userId]
        }).sort({ _id: 1 });

        res.status(200).send(conversations);

    } catch (err) {
        console.log(err.message);
        res.status(400).send("Error in fetching category");
    }
});

module.exports = router;