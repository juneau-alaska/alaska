const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Comment = require("../../model/commentModel");
const auth = require('../../middleware/auth');

/**
 * @method - GET
 * @description - Get All Comments by Parent ID
 * @param - /comments/:parentID
 */
router.get("/:parentID", auth, async (req, res) => {
    const parentID = req.params.parentID;

    try {
        let comments = await Comment.find({
            parent: parentID
        }).sort({ _id: -1 });

        res.status(200).send(comments);

    } catch (err) {
        console.log(err.message);
        res.status(400).send("Error in fetching category");
    }
});

module.exports = router;