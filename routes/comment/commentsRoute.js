const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Comment = require("../../model/commentModel");
const auth = require('../../middleware/auth');

/**
 * @method - POST
 * @description - Get All Comments
 * @param - /comments
 */
router.post("/", auth, async (req, res) => {
    const {
      prevId,
      pollId,
      parentCommentId,
    } = req.body;

    var batchSize = parentCommentId != null ? 10 : 50,
        query = { 'pollId': pollId, 'parentCommentId': parentCommentId },
        comments;

    if (prevId) {
      console.log(prevId);
      query._id = { '$gt': prevId };
    }

    try {
        comments = await Comment.find(query)
          .sort({ _id: 1 })
          .limit(batchSize);
        res.status(200).send(comments);

    } catch (err) {
        console.log(err.message);
        res.status(400).send("Failed to retrieve comments.");
    }
});

module.exports = router;