const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const PORT = 8000;

// Fetching the routes and functions
const urlRoute = require('../routes/url.js');
const homeRoute = require('../routes/home-page-router.js');
const userRoute = require('../routes/user.js');
const dbConfig = require('./datasources.json')['transactional'];
const { connectMongoDB } = require('./connection.js');
const { requestToLoggedInUserOnly, checkAuthForHome, checkAuthForUser, checkforAuthentication, restrictToRoles } = require('../middlewares/auth.js');

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
connectMongoDB(dbConfig["url"], dbConfig["config"])
  .then(() => { console.log('MongoDB connected!!!'); })
  .catch((err) => console.log("MongoDB Connection Error - ", err));

// Starting the server
app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});

module.exports = app;