const express = require("express");
const router = express.Router();

const Notification = require("../../model/notificationModel");
const auth = require('../../middleware/auth');

/**
 * @method - POST
 * @description - Mark Notifications as Read
 * @param - /notification
 */
router.post("/", auth, async (req, res) => {
  const {
    ids,
    readerId,
  } = req.body;

  try {
    const res = await Notification.updateMany({ _id: { $in: ids }}, { read_by: { readerId: readerId }});

    res.status(200);
  } catch (err) {
    res.status(400).send({message: err.message});
  }
});

module.exports = router;