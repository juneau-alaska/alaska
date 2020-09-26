const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  /* User ID */
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
