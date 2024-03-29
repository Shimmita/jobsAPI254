const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const bodyParser = require("body-parser");
const { usersRoute } = require("./routes/UsersRoute");
const { adminRoute } = require("./routes/AdminRoute");
const { emailVerificationRoute } = require("./routes/EmailVerRoute");
const app = express();
const cors = require("cors");
require('punycode')

//comment on deployment:used for testing
 //const { testRoute } = require("./routesTest/DataRoute");
//
app.use(bodyParser.json());
app.use(cors());

//explicit PORT Number for uncertainities
const PORT = 5000;
//app running and listening to the port number
app.listen(PORT || process.env.PORT, process.env.BASE_IP_ADDRESS, () => {
  console.log(
    "server is running and listening to the port " + process.env.PORT
  );
});

//connecting to mongoDB
mongoose
  .connect(process.env.CONNECTION_STRING_LOCAL)
  .then((res) => {
    console.log("connected to mongoDB database");
  })
  .catch((err) => {
    console.log("error occured while connecting to the database:" + err);
  });

//email verification  Route
app.use(process.env.BASE_ROUTE, emailVerificationRoute);

//using the app router functionality for Users
app.use(process.env.BASE_ROUTE, usersRoute);

//using the app router functionality administration
app.use(process.env.BASE_ROUTE, adminRoute);


//ROUTE TESTING and can be removed safely. comment on  pushing /deployment git
//app.use(process.env.BASE_ROUTE, testRoute);

//handle url/ page not found error 404. the provided url didnt match any known url
app.use((req, res) => {
  const message_routeError='404 error page not found!'
  res.status(400).json({
    message: message_routeError,
  });
});
