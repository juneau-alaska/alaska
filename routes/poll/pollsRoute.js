const express = require("express");
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
        var prevId = req.body.prevId,
            polls;

        if (prevId !== null) {
            polls = await Poll.find({ _id: { $lt: prevId } })
                .sort({ _id: -1 })
                .limit(10);
        } else {
            polls = await Poll.find()
            .sort({ _id: -1 })
            .limit(10);
        }

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