const UserSchema = require("../model/User");
const nodemailer = require("nodemailer");
require("dotenv/config");
//POST request for verify the email address
const handleEmailVerification = async (req, res) => {
  //extracting the email embedded in the request
  const email = req.params.EMAIL_ID;
  //check if the email conforms to the email standards
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const status = emailRegex.test(email);
  const recipientEmail = email;

  var imageLogoLink =
    "https://digitallearning.eletsonline.com/wp-content/uploads/2016/10/7-million-jobs-can-disappear-by-2050-Study.jpg";
  var imageLinkAlternative =
    "https://mboka.co.ke/wp-content/uploads/2023/06/edfb3f122492c75396988b1161852b0e.png";

  try {
    //check if the email conforms to the genereal email standards
    if (!status) {
      //invalid email address
      await res
        .status(400)
        .send(
          "email provided is invalid, please provide a valid email address"
        );
      return;
    } else {
      //email is valid thus checking in the database if email matches any
      const user = await UserSchema.findOne({ email });

      if (user) {
        //before validating the API key, check if User is verified since all verified users have an API key
        if (user.isVerified) {
          //deny API KEY generation since user already have one
          const api_key_sent_message =
            "You already have an API_KEY. An email with your API KEY has been sent kindly check your inbox or spam folder within 5 minutes";

          const keyExistsHTML = `
  <div style="padding: 10dp; border: 1px solid white; box-shadow: 0px 0px 1px;background-color: whitesmoke;">
        <div><div style="display: flex; justify-content: center; align-items: center; max-height: 200px; min-height: 120px; box-shadow: 0px 0px 1px;">
          <img src="${imageLogoLink}" alt="${imageLinkAlternative}" height="150px">
      </div></div>
      <h3 style="text-decoration: underline;text-align: center; ">YOUR API_KEY= <span style="color: blue;">${user.key}</span></h3>

      </div>
  
  `;
          //trigger nodemailer1 for email sending containing ApI_KEY not a new key but rather key stored in the database
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
            subject: "jobsAPI254 API_KEY EXISTS",
            text: "API_KEY exists. Its value is " + user.key,
            html: keyExistsHTML,
          };

          nodemailerTransport.sendMail(
            nodemailerOptions,
            async (error, info) => {
              if (error) {
                //error occured
                const emailAPI_not_sent_msg = `an error occured while trying to send your API_KEY to the email address ${recipientEmail}.Error info:\n${error.message}`;

                res.status(400).json({
                  message: emailAPI_not_sent_msg,
                });
              } else {
                //successfully sent the email message containing the API_KEY

                console.log(`${info}\n ${api_key_sent_message}`);

                res.status(200).json({
                  message: api_key_sent_message,
                });
              }
            }
          );

          return;
        } else {
          //user exists and thus thus lets provide an API Key for the user and save it back to the database and send an email back to the user with
          //with documentation on how to use the API

          const lengthAPI = email.length;
          //generation of the API
          const API_KEY = generateRandomAlphanumeric(lengthAPI);

          const mainGetUrlJobs = `${process.env.PARENT_URL}${process.env.BASE_ROUTE}/getJobs/${API_KEY}`;

          const htmlContainingAPI_KEY = `<div style="padding: 10dp; border: 1px solid white; box-shadow: 0px 0px 1px;background-color: whitesmoke;">
      <div><div style="display: flex; justify-content: center; align-items: center; max-height: 200px; min-height: 120px; box-shadow: 0px 0px 1px;">
        <img src="${imageLogoLink}" alt="${imageLinkAlternative}" height="150px">
    </div></div>
    <h3 style="text-decoration: underline;text-align: center; ">YOUR API_KEY= <span style="color: blue;">${API_KEY}</span></h3>
    <ul>
       <li>Congratulations <span style="font-weight: bold;"> ${user.name}</span> your emall <span style="font-weight: bold;">${user.email}</span> has been verified succesfully. <span style="font-weight: bold;">Your API_KEY is <span style="text-decoration: underline;">${API_KEY}</span> </span> <br>Follow the documentation provided 
           below in order to use it in making requests from the server.   
       </li> <br>
       <li style="font-weight: bold;" >WEBSITE INTEGRATION: <ol>
           <li style="color: green;">React.js /Next.js /Vue.js Documentation <ul > <br>
               <li style="text-decoration: none;">GET data using fetch Library (Traditional way) <br> <br>
                   <ol style="list-style: none; padding-right: 30px;">
                   <li style="color: black;">
                    fetch(${mainGetUrlJobs}) <br>
                    .then(response => { <br>
                      //converting the response to json readable format     <br>   
                      response.json() <br>
                    })  <br>
                    .then(data => { <br>
                      //handle data which is in json format <br>
                      const message=data.message // contains congratulation message  <br> <br>
                      const data=data.data //contains a massive array of jobs <br> <br>

                      console.log(data); //an array use array methods like map/ forEach <br> <br>
                      // to loop through individual job object
                      console.log(message); //displays a congrats or a success message <br> <br>
                    }) <br>
                    .catch(error => {
                      //handle error

                      const error_msg=error.message <br>

                      //displays the error message incase an error occurred  <br>
                      //while trying to fetch jobs data  <br>
                    }); 
                    <br>
                   </li>
               </ol></li>
               <br>
               <br>
               <li style="text-decoration: none;">GET data using the Axios javascript library  (Recommended) <br> <br>
                   <ol style="list-style: none;padding-right: 30px;">
                   <li style="color: black;">

                    1.First, ensure that Node.js is installed in your system before proceeding. <br> You can install it <br>
                       via this link <span><a href="https://nodejs.org/en/download">click here to install Node.js</a></span> <br> <br>

                       2.Install Axios library using npm command or yarn <br> <br>
                       //using npm commad <br> <br>
                       npm init -y <br> <br>

                       npm install axios <br><br>

                       //using yarn 
                       npm init -y <br><br>

                       yarn add axios <br><br>

                       3. Using the axios <br>
                       //import the axios
                       const axios = require('axios'); <br><br>

                       //make a GET request to the JobsAPI254 <br><br>
                       axios.get(${mainGetUrlJobs}).then(resp => { <br>

                           const data=resp.data //<br><br>

                           console.log(data); //displays all jobs in array use array methods like map/ forEach  <br><br>
                           // to loop through individual job object <br>
                       });

                       <br>
                   </li>
               </ol></li>
           </ul>
           <br> <br>
       <li style="color: green;">Angular.js Documentation <ul>
           <li>follow the guide below <ul style="color: black;padding-right: 30px;"> <br> <br>
            angular.module('myApp', []) <br> <br>
            .controller('MyController', function($http) { <br> <br>
              $http.get(${mainGetUrlJobs})<br>
                .then(function(response) {<br>
                  console.log(response.data);  //An array you can use looping to get individual job item <br><br>

                })
                .catch(function(error) { <br> <br>
                  console.error(error);<br>
                });
            }); <br> 
            
           </ul></li>
           
       </ul></li> <br> <br>
       <li style="color: green;">Python Django Documentation <ul style="color: black;"> <br><br>
           <li style="padding-right: 30px;">follow the guide below <ul> <br>
            from django.http import JsonResponse<br>
            import requests <br><br>
            
            def fetch_data(request):<br>
            # Define the URL of the external API <br>
            api_url = ${mainGetUrlJobs} <br><br>
            
            try:<br>
            # Send a GET request to the API <br>
            response = requests.get(${mainGetUrlJobs})<br>
            
            # Check if the request was successful (status code 200) <br>
            if response.status_code == 200: <br>
            # Parse the JSON response<br>
            data = response.json()  /An array you can use looping to get individual job item <br><br>
            
            # You can now process the data as needed <br>
            # For example, return it as a JSON response <br>
            return JsonResponse(data)<br>
            else:<br>
            # Handle error cases, e.g., return an error response <br>
            return JsonResponse({'error': 'Failed to fetch data from the API'}, status=400) <br>
            
            except requests.exceptions.RequestException as e: <br>
            # Handle exceptions, e.g., connection error <br>
            return JsonResponse({'error': 'Request to the API failed: ' + str(e)}, status=400) <br>
           </ul></li>

       </ul></li>
       
       </li>

       </ol></li>
       <br>
       <li> <span style="font-weight: bold;">JobsAPI254</span> was developed and owned by <span style="font-weight: bold;">Shimmita Douglas.</span> A Full Stack Mobile (Android JetpakCompose, ReactNative,Flutter) and Web Application developer (MERN Stack).
           <ul>
          <li><a href="tel:+254757450727" style="text-decoration: none; color: blue;font-weight: bold;">Phone Number</a></li>   
          <li><a href="mailto:shimitadouglas@gmail.com,shimmiandev@outlook.com,douglasshimita3@gmail.com" style="text-decoration: none; color: blue; font-weight: bold;"">Email Me</a></li> 
          <li><a href="https://shimmitadouglas.vercel.app/" style="text-decoration: none; color: blue;font-weight: bold;"">PortFolio Profile</a></li>
          <li><a href="https://www.linkedin.com/in/douglas-oundo-aa1b35255" style="text-decoration: none; color: blue;font-weight: bold;"">Linkedin Profile</a></li>
          <li><a href="https://github.com/Shimmita" style="text-decoration: none; color: blue;font-weight: bold;"">Github Profile</a></li>
      </ul>
  </li>
    </ul>
    </div> `;

          //triger node mailer2  containing the documentation of e API
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
            subject: "jobsAPI254 API_KEY Documentation",
            text: "API_KEY and Its Documentation",
            html: htmlContainingAPI_KEY,
          };

          nodemailerTransport.sendMail(
            nodemailerOptions,
            async (error, info) => {
              if (error) {
                //error encountered while trying to send email with API_KEY
                const emailAPI_not_sent_msg = `an error occured while trying to send an API_KEY with its documentation to the email address ${recipientEmail}.Error info:\n${error.message}`;
                //log error to the console
                console.log(emailAPI_not_sent_msg);

                await res.status(400).json({
                  message: emailAPI_not_sent_msg,
                });
                return;
              } else {
                // mail containing API_KEY and its documentaion sent successfully
                const message_mail_documentation = `an email documentation sent successfully to this email ${recipientEmail}.check your inbox or spam folder within a period of 5 minutes.`;

                //updating value of key and isVerified status of the uer
                const userAPIVer = await UserSchema.updateOne(
                  { email: email },
                  {
                    $set: {
                      key: API_KEY,
                      isVerified: true,
                    },
                  }
                );

                //log to the console success msg, info nodemailer, userUpdate object
                console.log(
                  `${message_mail_documentation}\n ${info}\n${userAPIVer}`
                );

                await res.status(200).json({
                  message: message_mail_documentation,
                });
                return;
              }
            }
          );

          //

          return;
        }
      } else {
        const error_user_no_exist =
          "user of the email provided does not exist!";
        res.status(400).json({
          message: error_user_no_exist,
        });
        return;
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//function to generate API_KEY
function generateRandomAlphanumeric(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }

  return result;
}
//exporting the controller
module.exports = { handleEmailVerification };
