const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const PORT = 8000;

// Fetching the routes and functions
const urlRoute = require('./routes/url.js');
const homeRoute = require('./routes/home-page-router.js');
const userRoute = require('./routes/user.js');
const { connectMongoDB } = require('./connection');
const { requestToLoggedInUserOnly, checkAuthForHome, checkAuthForUser, checkforAuthentication, restrictToRoles } = require('./middlewares/auth.js');

// Setting middlewares and View engines
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Defining routes // Using inline middlewares
app.use('/url', restrictToRoles(['USER']), urlRoute);
app.use('/user', userRoute);
app.use('/', restrictToRoles(['USER']), homeRoute); // Implement the / route at last

// Establish DB Connection
connectMongoDB('mongodb://localhost:27017/url-shortner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => { console.log('MongoDB connected!!!'); })
  .catch((err) => console.log("MongoDB Connection Error - ", err));

// Starting the server
app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});

module.exports = app;