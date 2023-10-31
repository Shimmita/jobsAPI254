const express = require("express");
const usersRoute = express.Router();

const {
  handleGetJobs,
  handleUserRegistration,
} = require("../controller/UsersController");

// POST handle user registration
usersRoute.post("/createUser", handleUserRegistration);
//GET request for all jobs available which will be displayed to the end user as result
usersRoute.get("/getJobs/:API_KEY", handleGetJobs);

//exporting the module of router for external use
module.exports = { usersRoute };
