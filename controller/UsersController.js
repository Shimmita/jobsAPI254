require("dotenv/config");
const JobSchema = require("../model/Job");
const UserSchema = require("../model/User");
const nodemailer = require("nodemailer");
const User = require("../model/User");
const { emailVerificationRoute } = require("../routes/EmailVerRoute");

//const nodemailer = require("nodejs-nodemailer-outlook");
//POST User registration Handler
const handleUserRegistration = async (req, res) => {
  //saving to the database
  const recipientEmail = req.body.email;
  var user = req.body;
  console.log(user);
  var imageLogoLink =
    "https://digitallearning.eletsonline.com/wp-content/uploads/2016/10/7-million-jobs-can-disappear-by-2050-Study.jpg";
  var imageLinkAlternative =
    "https://mboka.co.ke/wp-content/uploads/2023/06/edfb3f122492c75396988b1161852b0e.png";

  //URL for emal verific= PARENT_URL/BaseURl/verifyEmail/:EMAIL_ID}
  var urlVerificationLink = `${process.env.PARENT_URL}${process.env.BASE_ROUTE}/verifyEmail/${recipientEmail}`;

  var sent_message = `User registration successful
  email verification message sent to ${req.body.email} 
  click verify button to verify your account.
  Check in the email spam folder incase the email is not found in the inbox.`;

  var html = `
      <div style="display: flex;justify-content: center;align-items: center;">
        <div style="padding: 10dp; border: 1px solid white; box-shadow: 0px 0px 1px;background-color: whitesmoke;">
            <div style="display: flex; justify-content: center; align-items: center; max-height: 200px; min-height: 120px; box-shadow: 0px 0px 1px;">
                <img src="${imageLogoLink}" alt="${imageLinkAlternative}" height="150px">
            </div>
            <h3 style="text-decoration: underline;text-align: center; ">Email Verification Steps for JobsAPI254</h3>
            <ol>
                <li>Verify your account to use <span style="font-weight: bold;">JobWave</span> services.</li>
                <li>Upon verification an email containing a <span style="font-weight: bold;"> UNIQUE KEY</span> will be sent back to this email and it will contain a full documentation on how to use the <span style="font-weight: bold;">KEY for authenitication and accessing JobWave services.</span> By having the key you can also integrate our API into your Mobile Application or Web Application. </li>
                <li>For Mobile Applications integration it's Applicable on: <ul>
                    <li>Android Mobile Application</li>
                    <li>Flutter Mobile Application</li>
                    <li>React Native Mobile Application</li>
                    <li>IOS Mobile Application</li>
                </ul></li>
    
                <li>For Web Application integration it's Applicable on: <ul>
                    <li>Angular.js Web Application</li>
                    <li>React.js Web Application </li>
                    <li>Django Web Application </li>
                    <li>Vue.js Web Application </li>
                    <li>Next.js Web Application </li>
                    <li>PHP Laravel Web Application </li>
                    
                </ul></li>  <br>
                <li> <span style="font-weight: bold;">JobWave</span> is owned and regulated by <span style="font-weight: bold;">Shimmita Douglas </span> FullStack Software Developer(Mobile App and Web App)
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

  //save the user to the database using mongoDB and then triger nodemailer to send  the email to the recipient

  try {
    user = await UserSchema.create(user);
    //saving user to the database
    await res.status(200).json({
      data: user,
      message: sent_message,
    });

    console.log("user saved successfully:\n" + user);
    //triger nodemailer to send email
    await nodemailerTransport.sendMail(nodemailerOptions);
    //user email sent successfuly
    console.log("email verication has been sent to " + recipientEmail);
  } catch (error) {
    //
    var error_data = `${error.message}`;

    if (error_data.includes("nodemailer")) {
      //log eror nodemailer
      console.log("error nodemailer: " + error_data);

      await res.status(400).send({
        message: "encountered error while sending email to " + recipientEmail,
      });
    } else if (error_data.includes("email")) {
      //log eror email exist
      console.log("error email exists: " + error_data);

      await res.status(400).send({
        message: `email ${recipientEmail} already in use try onother email!`,
      });
    } else if (error_data.includes("name")) {
      //log eror name exist
      console.log("error name exists: " + error_data);

      await res.status(400).send({
        message:
          "a user with the same name already exists, use a different name!",
      });
    } else if (error_data.includes("phone")) {
      //log eror phone exist
      console.log("error phone exists: " + error_data);

      await res.status(400).send({
        message: "phone number already exists, use a different one!",
      });
    } else if (error_data.includes("github")) {
      //log eror github exist
      console.log("error github exists: " + error_data);

      await res.status(400).send({
        message: "github account already exists, use a different one!",
      });
    } else if (error_data.includes("linkedin")) {
      //log eror linkedin exist
      console.log("error linkedin exists: " + error_data);

      await res.status(400).send({
        message: "linkedin account already exists, use a different one!",
      });
    } else {
      //log eror email exist
      console.log("error general: " + error_data);

      await res.status(400).send({
        message: error_data,
      });
    }
  }
  //
};

//GET request handler retrieve whole jobs from the database
const handleGetJobs = async (req, res) => {
  //extract key value from the url
  const key = req.params.API_KEY;
  //checking the user key from the users collection if present
  const error_statement = `key is invalid please verify your email to use our services!`;

  const result = await User.findOne({ key });

  if (!result) {
    //key is invalid since result is undefined/ null by the result object
    console.log(error_statement);
    res.status(400).json({
      data: {},
      message: error_statement,
    });
  } else {
    if (result.key === key) {
      //key valid enable user viewing the data
      const data = await JobSchema.find({});
      await res.status(200).json({
        message: "ok",
        data: data,
      });
    } else {
      //the key invalid
      await res.status(400).json({
        data: {},
        message: error_statement,
      });
    }
  }
};

//exporting them
module.exports = { handleGetJobs, handleUserRegistration };
