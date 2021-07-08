const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Comment = require("../../model/commentModel");
const auth = require('../../middleware/auth');

/**
 * @method - POST
 * @description - Get All Comments by Poll ID
 * @param - /comments
 */
router.post("/", auth, async (req, res) => {
    const {
      pollId,
      parentCommentId,
    } = req.body;

    var batchSize = parentCommentId != null ? 10 : 50;

    try {
        let comments = await Comment.find({
            pollId: pollId,
            parentCommentId: parentCommentId,
        })
        .limit(batchSize)
        .sort({ _id: 1 });

        res.status(200).send(comments);

    } catch (err) {
        console.log(err.message);
        res.status(400).send("Failed to retrieve comments.");
    }
});

module.exports = router;