const mongoose = require("mongoose");

// const MONGOURI = "mongodb+srv://admin:emaFECiuk20hqXvv@alaska-wx0sk.mongodb.net/test?retryWrites=true&w=majority";
const MONGOURI = "mongodb://localhost:27017/juneau";

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to Database!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;