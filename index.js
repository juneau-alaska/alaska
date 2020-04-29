const express = require("express");
const bodyParser = require("body-parser");
const signup = require("./routes/signUpRoute");
const login = require("./routes/loginRoute");
const account = require("./routes/accountRoute");
const user = require("./routes/userRoute");
// const poll = require("./routes/pollRoute");
// const option = require("./routes/optionRoute");
const InitiateMongoServer = require("./config/db");

// Initiate Mongo Server
InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

// SIGNUP ROUTE
app.use("/signup", signup);

// LOGIN ROUTE
app.use("/login", login);

// ACCOUNT ROUTE
app.use("/account", account);

// USER ROUTE
app.use("/user", user);

// POLL ROUTE
// app.use("/poll", poll);

// OPTION ROUTE
// app.use("/option", option);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});