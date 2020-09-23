const express = require("express");
const router = express.Router();

const Option = require("../../model/optionModel");
const auth = require('../../middleware/auth');

/**
* @method - POST
* @description - Delete Options
* @param - /options/delete
*/
router.post("/delete", auth, async (req, res) => {
    const optionIds = req.body.optionIds;

    Option.deleteMany(
        {
            _id: {
                $in: optionIds
            }
        },
        function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

module.exports = router;