const express = require("express");
const router = express.Router();

const Notification = require("../../model/notificationModel");
const auth = require('../../middleware/auth');

/**
 * @method - POST
 * @description - Create Notification
 * @param - /notification
 */
router.post("/", auth, async (req, res) => {
  const {
    sender,
    receiver,
    message,
    pollId,
    commentId,
  } = req.body;

  try {
    let notification = new Notification({
      sender,
      receiver,
      message,
      pollId,
      commentId,
    });

    await notification.save();
    res.status(200);
  } catch (err) {
    res.status(400).send({message: err.message});
  }
});

module.exports = router;