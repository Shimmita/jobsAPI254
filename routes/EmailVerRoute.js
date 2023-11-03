const express = require("express");
const emailVerificationRoute = express.Router();
const { handleEmailVerification } = require("../controller/EmailVerController");

emailVerificationRoute.get("/verifyEmail/:EMAIL_ID", handleEmailVerification);

//exporting the route
module.exports = { emailVerificationRoute };
