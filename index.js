const express = require('express');
const app = express();
const PORT = 8000;

const urlRoute = require('./routes/url.js');
const { connectMongoDB } = require('./connection');

app.use(express.urlencoded({ extended: false }));

// app.use('/url', urlRoute);

connectMongoDB('mongodb://localhost:27017/url-shortner')
  .then(() => { console.log('MongoDB connected!!!'); })
  .catch((err) => console.log("MongoDB Connection Error - ", err));



app.use('/url', urlRoute);




app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});

