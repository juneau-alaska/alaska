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
      prevId,
      pollId,
      parentCommentId,
    } = req.body;

    var batchSize = parentCommentId != null ? 10 : 50,
        comments;

    try {

        if (prevId) {
          comments = await Comment.find({ _id: { $gt: prevId }, pollId: pollId, parentCommentId: parentCommentId })
            .sort({ _id: 1 })
            .limit(batchSize);
        } else {
          comments = await Comment.find({ pollId: pollId, parentCommentId: parentCommentId })
            .sort({ _id: 1 })
            .limit(batchSize);
        }

        res.status(200).send(comments);

    } catch (err) {
        console.log(err.message);
        res.status(400).send("Failed to retrieve comments.");
    }
});

module.exports = router;