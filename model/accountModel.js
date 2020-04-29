const mongoose = require("mongoose");

const AccountSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("account", AccountSchema);
