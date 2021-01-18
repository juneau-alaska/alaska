const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Option = require("../../model/optionModel");
const auth = require('../../middleware/auth');

/**
* @method - GET
* @description - Get Option
* @param - /option/:id
*/
router.get("/:id", auth, async (req, res) => {
    const _id = req.params.id;
    
    try {
      let option = await Option.findOne({
        _id: _id
      });
  
      res.status(200).send(option);
      
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in fetching option");
    }
});
  
/**
* @method - PUT
* @description - Vote Option
* @param - /option/vote/:id
*/
router.put("/vote/:id", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const _id = req.params.id;

  try {
    let option = await Option.findOne({
      _id: _id
    });

    if (option) {
      option.votes += 1;
    }

    await option.save(function(err) {
      if (err) {
        res.status(400).json({
          message: err.message
        });
      } else {
        res.status(200).json({
          message: "Counted Vote",
          option
        });
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in updating option");
  }
});

/**
 * @method - POST
 * @description - Create Options
 * @param - /option
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
    contentType
  } = req.body;

  try {
    let option = new Option({
      content,
      contentType
    });

    await option.save();
    res.status(200).json(option);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
});

module.exports = router;