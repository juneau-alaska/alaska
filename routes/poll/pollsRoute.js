const express = require("express");
const router = express.Router();

const Poll = require("../../model/pollModel");
const auth = require('../../middleware/auth');

/**
* @method - POST
* @description - Query Polls by Created Date and Category
* @param - /polls
*/
router.post("/", auth, async (req, res) => {
    try {
        var prevId = req.body.prevId,
            categories = req.body.categories,
            polls;

        if (prevId !== null) {
            if (categories !== null) {
                polls = await Poll.find({ _id: { $lt: prevId }, category: { $in: categories } })
                    .sort({ _id: -1 })
                    .limit(10);
            } else {
                polls = await Poll.find({ _id: { $lt: prevId }})
                    .sort({ _id: -1 })
                    .limit(10);
            }
        } else {
            if (categories !== null) {
                polls = await Poll.find({ category: { $in: categories } })
                    .sort({ _id: -1 })
                    .limit(10);
            } else {
                polls = await Poll.find()
                    .sort({ _id: -1 })
                    .limit(10);
            }
        }

        res.status(200).send(polls);

    } catch (err) {
        console.log(err.message);
        res.status(400).send("Error in fetching polls");
    }
});

module.exports = router;