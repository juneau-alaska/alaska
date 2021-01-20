const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const auth = require('../../middleware/auth');

const AWS = require("aws-sdk");
const uuid = require("uuid");

AWS.config.update({ region: process.env.BUCKET_REGION });

let S3_BUCKET;
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.BUCKET_REGION,
  signatureVersion: "v4",
});

const createS3Url = (req, res) => {
  let bucket = req.body.bucket
  let fileType = req.body.fileType;
  let fileTypeLower = fileType.toLowerCase();

  if (bucket === 'poll-option') {
    S3_BUCKET = 'juneau-poll-options';
  } else if (bucket === 'user-profile') {
    S3_BUCKET = 'juneau-user-profiles';
  }

  if (
    fileTypeLower != ".jpg"
    && fileTypeLower != ".png"
    && fileTypeLower != ".jpeg"
    && fileTypeLower != ".heic"
    && fileTypeLower != ".heif"
  ) {
    return res
      .status(403)
      .json({ success: false, message: "Image format invalid" });
  }

  fileType = fileType.substring(1, fileType.length);

  const fileName = uuid.v4();
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName + "." + fileType,
    Expires: 60 * 60,
    ContentType: "image/" + fileType,
    ACL: "public-read",
  };

  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      success: true,
      message: "Url generated",
      uploadUrl: data,
      downloadUrl:
        `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}` + "." + fileType,
    };
    return res.status(200).json(returnData);
  });
};

const deleteS3Images = (req, res) => {
  let bucket = req.body.bucket
  let keys = req.body.keys;

  if (bucket === 'poll-option') {
    S3_BUCKET = 'juneau-poll-options';
  } else if (bucket === 'user-profile') {
    S3_BUCKET = 'juneau-user-profiles';
  }

  var params = {
    Bucket: S3_BUCKET,
    Delete: {
      Objects: keys,
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
 * @description - Generate AWS S3 url
 * @param - /image/create_url
 */
router.post("/create_url", auth, async (req, res) => createS3Url(req, res));

/**
 * @method - POST
 * @description - Delete from S3
 * @param - /image/delete
 */
router.post("/delete", auth, async (req, res) => deleteS3Images(req, res));

module.exports = router;