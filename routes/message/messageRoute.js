const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Message = require("../../model/messageModel");
const auth = require('../../middleware/auth');

/**
* @method - POST
* @description - Create Message
* @param - /message
*/
router.post("/", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    users,
    createdBy,
    createdAt
  } = req.body;

  try {
    let message = new Message({
      content,
      conversationId,
      createdBy,
      createdAt,
      updatedAt
    });

    await message.save();
    res.status(200).json(message);
  } catch (err) {
    console.log(err.message);
    res.status(400).send("Error in creating message");
  }
});

/**
* @method - DELETE
* @description - Delete Message
* @param - /message/:id
*/
router.delete("/:id", auth, async (req, res) => {
  const _id = req.params.id;

  Message.deleteOne({ _id: _id }, function (err) {
    if (err) {
      res.status(400).send("Error in deleting message");
    } else {
      res.status(200).send("Successfully deleted message");
    }
  });
})

module.exports = router;