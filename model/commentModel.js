const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'poll',
    required: true,
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment',
  },
  /* Comment IDs */
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment'
  }],
  likes: {
    type: Number,
    min: 0,
    default: 0
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("comment", CommentSchema);
