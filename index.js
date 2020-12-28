const express = require("express");
const bodyParser = require("body-parser");

const signup = require("./routes/auth/signUpRoute");
const login = require("./routes/auth/loginRoute");

const account = require("./routes/account/accountRoute");

const user = require("./routes/user/userRoute");
const users = require("./routes/user/usersRoute");

const poll = require("./routes/poll/pollRoute");
const polls = require("./routes/poll/pollsRoute");

const option = require("./routes/option/optionRoute");
const options = require("./routes/option/optionsRoute");

const comment = require("./routes/comment/commentRoute");
const comments = require("./routes/comment/commentsRoute");

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
app.use("/users", users);
app.use("/user", user);

// POLL(S) ROUTE
app.use("/poll", poll);
app.use("/polls", polls);

// OPTION(S) ROUTE
app.use("/option", option);
app.use("/options", options);

// COMMENTS(S) ROUTE
app.use("/comment", comment);
app.use("/comments", comments);

// CATEGOR(Y/IES) ROUTE
app.use("/category", category);
app.use("/categories", categories);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});