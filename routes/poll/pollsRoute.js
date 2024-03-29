const express = require("express");
const router = express.Router();

const Poll = require("../../model/pollModel");
const auth = require('../../middleware/auth');

/**
* @method - POST
* @description - Popular Poll
* @param - /polls/popular
*/
//router.post("/popular", auth, async (req, res) => {
//  try {
//    var polls = await Poll.find({
//
//    });
//
//    res.status(200).send(polls);
//  } catch {
//    res.status(400).send("Failed to retrieve.");
//  }
//});

/**
* @method - POST
* @description - Query Polls by Created Date and Category
* @param - /polls
*/
router.post("/", auth, async (req, res) => {
    try {
        var limit = 15,
            prevId = req.body.prevId,
            createdBy = req.body.createdBy,
            categories = req.body.categories,
            followingUsers = req.body.followingUsers,
            polls;

        if (prevId) {
            if (createdBy) {
                polls = await Poll.find({ _id: { $lt: prevId }, createdBy: createdBy })
                    .sort({ _id: -1 })
                    .limit(limit);
            } else if (categories) {
                if (followingUsers) {
                    polls = await Poll.find({ _id: { $lt: prevId }, $or: [{ createdBy: { $in: followingUsers }}, {category: { $in: categories }}] })
                        .sort({ _id: -1 })
                        .limit(limit);
                } else {
                    polls = await Poll.find({ _id: { $lt: prevId }, category: { $in: categories } })
                        .sort({ _id: -1 })
                        .limit(limit);
                }
            } else {
                polls = await Poll.find({ _id: { $lt: prevId }})
                    .sort({ _id: -1 })
                    .limit(limit);
            }
        } else {
            if (createdBy) {
                polls = await Poll.find({ createdBy: createdBy })
                    .sort({ _id: -1 })
                    .limit(limit);
            } else if (categories) {
                if (followingUsers) {
                    polls = await Poll.find({ $or: [{ createdBy: { $in: followingUsers }}, {category: { $in: categories }}] })
                        .sort({ _id: -1 })
                        .limit(limit);
                } else {
                    polls = await Poll.find({ category: { $in: categories } })
                        .sort({ _id: -1 })
                        .limit(limit);
                }
            } else {
                polls = await Poll.find()
                    .sort({ _id: -1 })
                    .limit(limit);
            }
        }

        res.status(200).send(polls);

    } catch (err) {
        console.log(err.message);
        res.status(400).send("Error in fetching polls");
    }
});

module.exports = router;