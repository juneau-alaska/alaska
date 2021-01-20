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
  const optionsList = req.body.optionsList;

  var optionIds = [];

  for (var i = 0; i < optionsList.length; i++) {
    optionIds.push(optionsList[i]['_id']);
  }

  Option.deleteMany(
    {
      _id: {
        $in: optionIds
      }
    },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

module.exports = router;