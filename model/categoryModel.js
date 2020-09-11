const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  followers: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("category", CategorySchema);