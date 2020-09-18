const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Poll = require("../../model/pollModel");
const auth = require('../../middleware/auth');

/**
 * @method - GET
 * @description - Get a Single Poll
 * @param - /poll/:id
 */
router.get("/:id", auth, async (req, res) => {
  const _id = req.params.id;
  
  try {
      let poll = await Poll.find({
        _id: _id
      });

      res.status(200).send(poll);
      
  } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in fetching category");
  }
});

/**
* @method - POST
* @description - Create Poll
* @param - /poll
*/
router.post("/", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    prompt,
    categories,
    options,
    createdBy
  } = req.body;

  try {
    let poll = new Poll({
      prompt,
      categories,
      options,
      createdBy
    });

    await poll.save();
    res.status(200).json(poll);
  } catch (err) {
    console.log(err.message);
    res.status(400).send("Error in Saving");
  }
});

/**
* @method - DELETE
* @description - Delete Poll
* @param - /poll/:id
*/
router.delete("/:id", auth, async (req, res) => {
  const _id = req.params.id;
  
  try {
      let poll = await Poll.find({
        _id: _id
      });

      await poll.delete();
      res.status(200).send("Successfully deleted poll");
  } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in deleting poll");
  }
})

module.exports = router;