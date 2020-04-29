const mongoose = require("mongoose");

const PollSchema = mongoose.Schema({
  prompt: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true,
    default: []
  },
  numTimesAnswered: {
    type, Number, 
    default: 0
  },
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
