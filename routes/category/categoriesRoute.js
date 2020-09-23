const express = require("express");
const router = express.Router();

const Category = require("../../model/categoryModel");
const auth = require('../../middleware/auth');

/**
* @method - GET
* @description - Get All Categories
* @param - /categories
*/
router.get("/", auth, async (req, res) => {
    try {
        let categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving");
    }
});

/**
* @method - POST
* @description - Get Categories w/ Text
* @param - /categories
*/
router.post("/", auth, async (req, res) => {
    try {
        var partialText = req.body.partialText || "";
        var escapedPartial = escape(partialText);

        let categories = await Category.find({name: new RegExp(escapedPartial, 'i')})
            .sort({name: 1})
            .limit(10);
    
        res.status(200).send(categories);
      
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in fetching category");
    }
});

module.exports = router;