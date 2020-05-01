const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Poll = require("../model/pollModel");
const Option = require("../model/optionModel");
const Category = require("../model/categoryModel");
const auth = require('../middleware/auth');

/**
* @method - GET
* @description - Get All Categories
* @param - /poll/categories
*/
router.get("/categories", /*auth,*/ async (req, res) => {
  try {
    let categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
});

/**
* @method - GET
* @description - Get Category
* @param - /poll/category/:name
*/
router.get("/category/:name", /*auth,*/ async (req, res) => {
  const name = req.params.name;
  let _nameUC = name.toUpperCase();
  try {
    let category = await Category.findOne({
      _nameUC: _nameUC
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
* @param - /poll/category
*/
router.post("/category", /*auth,*/ async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    name,
    _nameUC
  } = req.body;

  try {
    let category = await Category.findOne({
      _nameUC
    });
    if (category) {
      return res.status(400).json({
        msg: "Category Already Exists"
      });
    }

    category = new Category({
      name,
      _nameUC
    });
    await category.save();
    
    res.status(200).json(category);

  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
});

/**
* @method - GET
* @description - Get Option
* @param - /poll/option/:id
*/
router.get("/option/:id", /*auth,*/ async (req, res) => {
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
* @method - POST
* @description - Create Poll Options
* @param - /poll/option
*/
router.post("/option", /*auth,*/ async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    content
  } = req.body;

  try {
    let option = new Option({
      content
    });

    await option.save();
    res.status(200).json(option);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
});

module.exports = router;