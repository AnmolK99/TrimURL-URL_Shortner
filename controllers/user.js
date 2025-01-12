const { v4: uuidv4 } = require('uuid');
const _ = require('underscore');
const User = require('../models/user');
const Role = require('../models/role');
const UserRoleMapping = require('../models/user-role-mapping');
const { getUser, setUser } = require('../service/auth-token');

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
  let foundUserData = await User.findOne({ email: body.email });

  if (foundUserData) {
    return res.status(400).json({ error: "User already present in system!" });
  }

  let userData = await User.create({
    name: body.name,
    email: body.email,
    password: body.password
  });
  // console.log("userData - ", userData);

  // Find the USER role
  const userRole = await Role.findOne({ name: 'USER' });
  if (!userRole) {
    return res.status(500).json({ error: "USER role not found in system" });
  }

  // Create role mapping for new user
  await UserRoleMapping.create({
    userId: userData._id,
    roleId: userRole._id
  });

  return res.redirect("/");
}

async function logoutUser(req, res) {
  // Clear the uid cookie
  res.clearCookie('uid');

  // Redirect to login page
  return res.redirect('/user/login');
}

async function loginUser(req, res) {
  let body = req.body;
  let loginResponseMessage = null;

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

  // const userToken = uuidv4();
  // console.log(`User ${userData.name} got token - ${userToken}`);

  let userRoleMappings = await UserRoleMapping.find({ userId: userData.id });

  if (!userRoleMappings || userRoleMappings.length == 0) {
    loginResponseMessage = "No Role mapped to the User, Kindly Map the role and login!";
    return res.render("login",
      { loginAttempted: true, loginSuccess: false, loginMessage: loginResponseMessage }
    );
  }

  let mappedRoles = await Role.find({ _id: { $in: _.pluck(userRoleMappings, "roleId") } });
  let rolesObject = _.map(mappedRoles, function (roleData) { return { id: roleData.id, name: roleData.name } });

  // console.log({ name: userData.name, _id: userData._id, roles: rolesObject });
  let token = setUser({ name: userData.name, _id: userData._id, roles: rolesObject });

  res.cookie("uid", token);
  // return res.json({ token: token });

  // return res.render("login",
  //   { loginAttempted: true, loginSuccess: true, loginMessage: loginResponseMessage }
  // );
  return res.redirect("/");
}

module.exports = { registerUser, loginUser, logoutUser };