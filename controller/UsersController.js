require("dotenv/config");
const JobSchema = require("../model/Job");
const UserSchema = require("../model/User");
const nodemailer = require("nodemailer");
const User = require("../model/User");

//const nodemailer = require("nodejs-nodemailer-outlook");
//POST User registration Handler
const handleUserRegistration = async (req, res) => {
  //saving to the database
  var recipientEmail = req.body.email;

  console.log(recipientEmail)

  var imageLogoLink =
    "https://digitallearning.eletsonline.com/wp-content/uploads/2016/10/7-million-jobs-can-disappear-by-2050-Study.jpg";
  var imageLinkAlternative =
    "https://mboka.co.ke/wp-content/uploads/2023/06/edfb3f122492c75396988b1161852b0e.png";

    //URL for emal verific= PARENT_URL/BaseURl/verifyEmail/:EMAIL_ID}
  var urlVerificationLink = `${process.env.PARENT_URL}${process.env.BASE_ROUTE}/verifyEmail/${recipientEmail}`;
  
  var sent_message = `user has been registered successfully,
  an email verification message has been sent to your email ${req.body.email} 
  click the link provided to verify your account. Email reception time is within 5 minutes.
  Check in the email spam folder incase the email is not found in the inbox. YOU MUST VERIFY THE EMAIL IN ORDER TO USE THE API`;

  var html = `
      <div style="display: flex;justify-content: center;align-items: center;">
        <div style="padding: 10dp; border: 1px solid white; box-shadow: 0px 0px 1px;background-color: whitesmoke;">
            <div style="display: flex; justify-content: center; align-items: center; max-height: 200px; min-height: 120px; box-shadow: 0px 0px 1px;">
                <img src="${imageLogoLink}" alt="${imageLinkAlternative}" height="150px">
            </div>
            <h3 style="text-decoration: underline;text-align: center; ">Email Verification Steps for JobsAPI254</h3>
            <ol>
                <li>Verify your account to use <span style="font-weight: bold;">JobsAPI254</span> services.</li>
                <li>Upon verification an email containing API_KEY will be sent back to this email and it will contain a full documentation on how to use the <span style="font-weight: bold;">jobsAPI254</span> or integrating it within your Mobile Application or Web Application. </li>
                <li>Check in the spam folder incase the email was not received in the inbox after 5 minutes.</li>
                <li>For Mobile Applications it's Applicable on: <ul>
                    <li>Android Mobile Application</li>
                    <li>Flutter Mobile Application</li>
                    <li>React Native Mobile Application</li>
                    <li>IOS Mobile Application</li>
                </ul></li>
    
                <li>For Web Application it's Applicable on: <ul>
                    <li>Angular.js Web Application</li>
                    <li>React.js Web Application </li>
                    <li>Django Web Application </li>
                    <li>Vue.js Web Application </li>
                    <li>Next.js Web Application </li>
                    <li>PHP Laravel Web Application </li>
                    <li>Vanilla Web Application </li>
                    <li>Java Spring Web Application </li>
                    
                </ul></li>  <br>
                <li> <span style="font-weight: bold;">JobsAPI254</span> is owned and regulated by <span style="font-weight: bold;">Shimmita Douglas </span> Full Stack Mobile (Android JetpakCompose, ReactNative,Flutter) and Web Application developer (MERN Stack).
                     <ul>
                    <li><a href="tel:+254757450727" style="text-decoration: none; color: blue;font-weight: bold;">Phone Number</a></li>   
                    <li><a href="mailto:shimitadouglas@gmail.com,shimmiandev@outlook.com,douglasshimita3@gmail.com" style="text-decoration: none; color: blue; font-weight: bold;"">Email Me</a></li> 
                    <li><a href="https://shimmitadouglas.vercel.app/" style="text-decoration: none; color: blue;font-weight: bold;"">PortFolio Profile</a></li>
                    <li><a href="https://www.linkedin.com/in/douglas-oundo-aa1b35255" style="text-decoration: none; color: blue;font-weight: bold;"">Linkedin Profile</a></li>
                    <li><a href="https://github.com/Shimmita" style="text-decoration: none; color: blue;font-weight: bold;"">Github Profile</a></li>
                </ul>
            </li>
            </ol>

            <div style="width: 100%;  text-align: center;margin-bottom: 15px">
            <div style="display: inline; text-align: left;">
            <a href="${urlVerificationLink}" style="text-decoration: none; border: 1px solid lightgrey; padding: 10px;font-weight: bold; color: darkblue;font-size: large; border-radius: 1rem; box-shadow: 0px 0px 1px;">click here to verify account</a>
            </div>
        </div>

            
            
        </div>
    </div>
    `;

  var nodemailerTransport = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: process.env.DEV_EMAIL,
      pass: process.env.DEV_PASS,
    },
  });

  var nodemailerOptions = {
    from: `'"Shimmita CEO @JobsAPI254 " <${process.env.DEV_EMAIL}>'`,
    to: recipientEmail,
    subject: "jobsAPI254 Account Verification",
    text: "Verify Your Account",
    html: html,
  };

  //sending the email verification message to the recipient
  nodemailerTransport.sendMail(nodemailerOptions, async (error, info) => {
    if (error) {
      console.log("error nodemailer " + error.message);
      res.status(400).json({
        message: `error occured ${error.message}`,
      }
  
      );
      return;
    } else {
      //log success status from nodemailer
      console.log(`email sent ${info.response}`);
      //saving user to the database
      await UserSchema.create(req.body)
        .then((user) => {
          //log response
          console.log("user saved successfully " + user);
          console.log(sent_message);
          res.status(200).json({
            data: user,
            message: sent_message,
          });
        })
        .catch((error) => {
          const error_data = `${error.message}`;
          if (error_data.includes("email")) {
            res.status(400).json({
              message: "email already taken, use a different email address!",
            });
          } else if (error_data.includes("name")) {
            res.status(400).json({
              message:
                "a user with the same name already exists, use a different name!",
            });
          } else
            res.status(400).json({
              message: error.message,
            });
        });

        return;
      //
    }
  });
};

//GET request handler retrieve whole jobs from the database
const handleGetJobs = async (req, res) => {
  //extract key value from the url
  const key = req.params.API_KEY;
  //checking the user key from the users collection if present
  const error_statement = `key is invalid please verify your email  in order
      to own an API_KEY and make use of jobAPI254 services`;

  const result = await User.findOne({ key });

  if (!result) {
    //key is invalid since result is undefined/ null by the result object
    console.log(error_statement);
    res.status(400).json({
      message: error_statement,
    });
  } else {
    if (result.key === key) {
      //key valid enable user viewing the data
      console.log("data fetched successfully");
      const data = await JobSchema.find({});
      res.status(200).json({
        message: "ok",
        data: data,
      });
    } else {
      //the key invalid

      console.log(error_statement);
      res.status(400).json({
        message: error_statement,
      });
    }
  }
};

//exporting them
module.exports = { handleGetJobs, handleUserRegistration };
