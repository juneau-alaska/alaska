const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema({
  users: {
    type: Array,
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
});

module.exports = mongoose.model("conversation", ConversationSchema);