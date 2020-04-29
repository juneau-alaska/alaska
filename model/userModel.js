const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  createdPolls: {
    type: Array,
    default: []
  },
  completedPolls: {
    type: Array,
    default: []
  },
  selectedChoices: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("user", UserSchema);
