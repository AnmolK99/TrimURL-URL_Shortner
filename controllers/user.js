const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const { getUser, setUser } = require('../service/auth');

async function registerUser(req, res) {

  let body = req.body;
  // console.log('Data recieved on Signup - ', body);
  if (!body) {
    return res.status(400).json({ error: "Data not recieved!" });
  }
  if (!body.name) {
    return res.status(400).json({ error: "User Name is required!" });
  }
  if (!body.email) {
    return res.status(400).json({ error: "User Email is required!" });
  }
  if (!body.password) {
    return res.status(400).json({ error: "User Password is required!" });
  }

  let userData = await User.create({
    name: body.name,
    email: body.email,
    password: body.password
  });
  console.log("userData - ", userData);

  return res.redirect("/");
}

async function loginUser(req, res) {
  let body = req.body;
  let loginResponseMessage = null;

  // console.log('Data recieved on Signup - ', body);
  if (!body) {
    return res.status(400).json({ error: "Data not recieved!" });
  }
  if (!body.email) {
    return res.status(400).json({ error: "Email is required!" });
  }
  if (!body.password) {
    return res.status(400).json({ error: "Password is required!" });
  }

  let userData = await User.findOne({ email: body.email })

  if (!userData) {
    loginResponseMessage = "No user found with given Email!";
    return res.render("login",
      { loginAttempted: true, loginSuccess: false, loginMessage: loginResponseMessage }
    );
  }
  if (userData.password != body.password) {
    loginResponseMessage = "Incorrect Password entered for the user!";
    return res.render("login",
      { loginAttempted: true, loginSuccess: false, loginMessage: loginResponseMessage }
    );
  }

  console.log(`User ${userData.name} logged in correctly`);

  const userToken = uuidv4();
  console.log(`User ${userData.name} got token - ${userToken}`);

  setUser(userToken, userData.id);

  res.cookie("uid", userToken);

  // return res.render("login",
  //   { loginAttempted: true, loginSuccess: true, loginMessage: loginResponseMessage }
  // );
  return res.redirect("/");
}

module.exports = { registerUser, loginUser };