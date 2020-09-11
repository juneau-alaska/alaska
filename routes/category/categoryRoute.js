const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Category = require("../../model/categoryModel");
const auth = require('../../middleware/auth');

/**
* @method - GET
* @description - Get Category
* @param - /category/:name
*/
router.get("/category/:name", auth, async (req, res) => {
  const name = req.params.name;
  try {
    let category = await Category.findOne({
      name: name
    });

    res.status(200).send(category);

  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in fetching category");
  }
});

/**
* @method - POST
* @description - Create Category
* @param - /category
*/
router.post("/", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    name
  } = req.body;

  try {
    let category = await Category.findOne({
      name
    });
    if (category) {
      return res.status(200).json(category);
    }

    category = new Category({
      name
    });
    await category.save();

    res.status(200).json(category);

  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
});

module.exports = router;