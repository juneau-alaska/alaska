const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const Option = require("../../model/optionModel");
const auth = require('../../middleware/auth');

AWS.config.update({ region: process.env.BUCKET_REGION });

const S3_BUCKET = process.env.BUCKET_NAME;
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.BUCKET_REGION,
    signatureVersion: "v4",
});

const deleteS3Images = (optionKeys) => {
    console.log(optionKeys);
    var params = {
        Bucket: S3_BUCKET,
        Delete: {
            Objects: optionKeys,
        },
    };
    s3.deleteObjects(params, function (err, data) {
        if (err) {
            console.log(err, err.stack); 
        }
        else {
            console.log(data);
        }
    });
}

/**
* @method - POST
* @description - Delete Options
* @param - /options/delete
*/
router.post("/delete", auth, async (req, res) => {
    const optionsList = req.body.optionsList;

    var optionIds = [],
    optionKeys = [];

    for (var i = 0; i < optionsList.length; i++) {
        optionIds.push(optionsList[i]['_id']);

        var url = optionsList[i]['content'],
            split = url.split('/'),
            key = split[split.length - 1];

        optionKeys.push({
            Key: key
        });
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

    deleteS3Images(optionKeys);
});

module.exports = router;