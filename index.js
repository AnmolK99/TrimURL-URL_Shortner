const express = require('express');
const app = express();
const path = require('path');
const PORT = 8000;

// Fetching the routes and functions
const urlRoute = require('./routes/url.js');
const homeRoute = require('./routes/home-page-router.js');
const { connectMongoDB } = require('./connection');

// Setting middlewares and View engines
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Defining routes
app.use('/url', urlRoute);
app.use('/', homeRoute);

// Establish DB Connection
connectMongoDB('mongodb://localhost:27017/url-shortner')
  .then(() => { console.log('MongoDB connected!!!'); })
  .catch((err) => console.log("MongoDB Connection Error - ", err));

// Starting the server
app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});

