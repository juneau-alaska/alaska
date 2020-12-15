const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Conversation = require("../../model/conversationModel");
const auth = require('../../middleware/auth');

/**
* @method - POST
* @description - Create Conversation
* @param - /conversation
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
    let conversation = new Conversation({
      users,
      createdBy,
      createdAt
    });

    await conversation.save();
    res.status(200).json(conversation);
  } catch (err) {
    console.log(err.message);
    res.status(400).send("Error in creating conversation");
  }
});

/**
* @method - DELETE
* @description - Delete Conversation
* @param - /conversation/:id
*/
router.delete("/:id", auth, async (req, res) => {
  const _id = req.params.id;

  Conversation.deleteOne({ _id: _id }, function (err) {
    if (err) {
      res.status(400).send("Error in deleting conversation");
    } else {
      res.status(200).send("Successfully deleted conversation");
    }
  });
})

module.exports = router;