const express = require('express');
const app = express();
const path = require('path');
const PORT = 8000;

const urlRoute = require('./routes/url.js');
const staticRoute = require('./routes/static-router.js');
const { connectMongoDB } = require('./connection');

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectMongoDB('mongodb://localhost:27017/url-shortner')
  .then(() => { console.log('MongoDB connected!!!'); })
  .catch((err) => console.log("MongoDB Connection Error - ", err));

app.use('/url', urlRoute);

app.use('/', staticRoute);

app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});

