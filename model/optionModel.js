const mongoose = require("mongoose");

const OptionSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    min: 0,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("option", OptionSchema);