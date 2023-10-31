const express = require("express");
const emailVerificationRoute = express.Router();
const { handleEmailVerification } = require("../controller/EmailVerController");

emailVerificationRoute.post("/verifyEmail/:EMAIL_ID", handleEmailVerification);

//exporting the route
module.exports = { emailVerificationRoute };
