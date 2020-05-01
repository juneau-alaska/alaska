const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Category = require("../../model/categoryModel");
const auth = require('../../middleware/auth');

/**
* @method - GET
* @description - Get All Categories
* @param - /categories
*/
router.get("/", /*auth,*/ async (req, res) => {
    try {
        let categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving");
    }
});

module.exports = router;