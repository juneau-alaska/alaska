const mongoose = require("mongoose");

const PollSchema = mongoose.Schema({
  prompt: {
    type: String,
    required: true
  },
  /* Category Names */
  categories: {
    type: Array,
    default: []
  },
  /* Option IDs */
  options: {
    type: Array,
    default: [],
    required: true
  },
  /* User ID */
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("poll", PollSchema);
