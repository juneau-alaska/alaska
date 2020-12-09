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
  description: {
    type: String,
  },
  createdPolls: {
    type: Array,
    default: []
  },
  completedPolls: {
    type: Array,
    default: []
  },
  selectedOptions: {
    type: Array,
    default: []
  },
  likedComments: {
    type: Array,
    default: []
  },
  followingUsers: {
    type: Array,
    default: []
  },
  followingCategories: {
    type: Array,
    default: []
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

module.exports = mongoose.model("user", UserSchema);
