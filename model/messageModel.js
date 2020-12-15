const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  conversationId: {
    type: String,
    required: true
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

module.exports = mongoose.model("message", MessageSchema);
