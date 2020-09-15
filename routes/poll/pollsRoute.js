const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Poll = require("../../model/pollModel");
const auth = require('../../middleware/auth');

/**
* @method - POST
* @description - Query Polls by Created Date
* @param - /polls
*/
router.post("/", auth, async (req, res) => {
    try {
        var timestamp = req.body.createdAtBefore,
            createdAtBefore = timestamp ? new Date(req.body.createdAtBefore) : new Date();

        let polls = await Poll.find({ createdAt: { $lte: createdAtBefore } })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).send(polls);

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in fetching category");
    }
});

/**
 * @method - GET
 * @description - Get All Polls by Category
 * @param - /polls/:category
 */
router.get("/:category", auth, async (req, res) => {
    const category = req.params.category;
    console.log(category)
    try {
        let poll = await Poll.find({
            categories: category
        });

        res.status(200).send(poll);

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in fetching category");
    }
});

module.exports = router;