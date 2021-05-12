const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
    // Notification creator
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    // Ids of the receivers of the notification
    receiver: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    }],
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'poll'
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment'
    },
    message: {
      type: String,
      required: true
    },
    read_by: [{
     readerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
     },
     read_at: {
        type: Date,
        default: Date.now
     }
    }],
    created_at: {
      type: Date,
      default: Date.now
    },
});

module.exports = mongoose.model("notification", NotificationSchema);
