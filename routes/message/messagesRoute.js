const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Message = require("../../model/messageModel");
const auth = require('../../middleware/auth');

/**
 * @method - GET
 * @description - Get All Messages by conversation id
 * @param - /messages/:conversationId
 */
router.get("/:conversationId", auth, async (req, res) => {
    const conversationId = req.params.conversationId;

    try {
        let messages = await Message.find({
            conversationId: conversationId
        }).sort({ _id: 1 });

        res.status(200).send(messages);

    } catch (err) {
        console.log(err.message);
        res.status(400).send("Error in fetching category");
    }
});

module.exports = router;