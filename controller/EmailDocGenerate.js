const generateEmailDocumenation=async()=>{
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
              <li>Check in the spam folder incase the email was not received in the inbox after one minute.</li>
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
          <div  style="display: flex; justify-content: center;">
              <a href="${urlVerificationLink}" style="text-decoration: none; border: 1px solid lightgrey; padding: 10px;margin-bottom: 5px;font-weight: bold; color: darkblue;font-size: large; border-radius: 1rem; box-shadow: 0px 0px 1px;">click here to verify account</a>
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



}


module.exports={generateEmailDocumenation}