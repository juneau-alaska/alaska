const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Comment = require("../../model/commentModel");
const auth = require('../../middleware/auth');

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
    content,
    parent,
    createdBy
  } = req.body;

  try {
    var comment = new Comment({
      content,
      parent,
      createdBy
    });
    await comment.save();

    res.status(200).json(comment);

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

module.exports = router;