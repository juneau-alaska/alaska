const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  // poll or comment id
  parent: {
    type: String,
    required: true
  },
  // comment ids
  replies: {
    type: Array,
    default: []
  },
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
