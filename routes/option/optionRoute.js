const express = require("express");
const AWS = require("aws-sdk");
const uuid = require("uuid");
const { check, validationResult } = require('express-validator');
const router = express.Router();

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

const getPreAssignedUrl = (req, res) => {
  let fileType = req.body.fileType;
  let fileTypeLower = fileType.toLowerCase();
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

/**
* @method - GET
* @description - Get Option
* @param - /option/:id
*/
router.get("/:id", auth, async (req, res) => {
    const _id = req.params.id;
    
    try {
      let option = await Option.findOne({
        _id: _id
      });
  
      res.status(200).send(option);
      
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in fetching option");
    }
});
  
/**
* @method - PUT
* @description - Put Option
* @param - /option/vote/:id
*/
router.put("/vote/:id", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const _id = req.params.id;

  try {
    let option = await Option.findOne({
      _id: _id
    });

    if (option) {
      option.votes += 1;
    }

    await option.save(function(err) {
      if (err) {
        res.status(400).json({
          message: err.message
        });
      } else {
        res.status(200).json({
          message: "Counted Vote",
          option
        });
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in updating option");
  }
});

/**
 * @method - POST
 * @description - Create Options
 * @param - /option
 */
router.post("/", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    content,
    contentType
  } = req.body;

  try {
    let option = new Option({
      content,
      contentType
    });

    await option.save();
    res.status(200).json(option);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
});

/**
 * @method - POST
 * @description - Upload Image to AWS S3
 * @param - /option/generatePreAssignedUrl
 */
router.post("/generatePreAssignedUrl", auth, async (req, res) => getPreAssignedUrl(req, res));

module.exports = router;