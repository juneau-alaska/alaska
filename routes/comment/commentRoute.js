const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Comment = require("../../model/commentModel");
const auth = require('../../middleware/auth');

/**
 * @method - GET
 * @description - Get a Single Comment
 * @param - /comment/:id
 */
router.get("/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
      let comment = await Comment.findOne({
        _id: _id
      });

      res.status(200).send(comment);

  } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in fetching category");
  }
});

/**
* @method - POST
* @description - Create Comment
* @param - /comment
*/
router.post("/", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    comment,
    pollId,
    parentCommentId,
    createdBy
  } = req.body;

  try {
    var commentModel = new Comment({
      comment,
      pollId,
      parentCommentId,
      createdBy
    });

    await commentModel.save();
    res.status(200).json(commentModel);

  } catch (err) {
    console.log(err.message);
    res.status(400).send("Error in Creating Comment");
  }
});

/**
 * @method - PUT
 * @description - Update Comment
 * @param - /comment/:id
 */
router.put("/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const body = req.body;

  try {
    let comment = await Comment.findOne({
      _id: _id
    });

    for (var key in body) {
      comment[key] = body[key];
    }

    await comment.save(function(err) {
      if (err) {
        res.status(400).json({
          message: err.message
        });
      } else {
        res.status(200).json({
          message: "Updated Comment",
          comment
        });
      }
    });
  } catch (e) {
    res.status(400).json({
        message: "Error in Updating comment"
    });
  }
});

/**
* @method - PUT
* @description - Like Comment
* @param - /comment/like/:id
*/
router.put("/like/:id", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const _id = req.params.id;
  const liked = req.body.liked;

  try {
    let comment = await Comment.findOne({
      _id: _id
    });

    if (comment) {
      if (liked) {
        comment.likes -= 1;
      } else {
        comment.likes += 1;
      }
    }

    await comment.save(function(err) {
      if (err) {
        res.status(400).json({
          message: err.message
        });
      } else {
        res.status(200).json({
          message: "Comment liked",
          comment
        });
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in updating comment");
  }
});

module.exports = router;