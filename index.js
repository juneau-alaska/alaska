const express = require("express");
const bodyParser = require("body-parser");

const signup = require("./routes/signUpRoute");
const login = require("./routes/loginRoute");

const account = require("./routes/accountRoute");
const user = require("./routes/userRoute");

const poll = require("./routes/poll/pollRoute");
const polls = require("./routes/poll/pollsRoute");

const option = require("./routes/option/optionRoute");

const category = require("./routes/category/categoryRoute");
const categories = require("./routes/category/categoriesRoute");

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

// POLL(S) ROUTE
app.use("/poll", poll);
app.use("/polls", polls);

// OPTION(S) ROUTE
app.use("/option", option);

// CATEGOR(Y/IES) ROUTE
app.use("/category", category);
app.use("/categories", categories);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});