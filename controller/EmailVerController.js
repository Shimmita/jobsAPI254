const UserSchema = require("../model/User");
//POST request for verify the email address
const handleEmailVerification = async (req, res) => {
  //extracting the email embedded in the request
  const email = req.params.EMAIL_ID;
  console.log(email);
  //check if the email conforms to the email standards
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const status = emailRegex.test(email);

  try {
    //check if the email conforms to the email standards
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
          //deny API KEY genearation since user already have one
          res
            .status(200)
            .send(
              "Dear user, you already have an API_KEY. An email containing your API KEY has been sent kindly check your mail inbox or spam folder to locate it."
            );

          //trigger nodemailer1 for email sending containing ApI_KEY

          return;
        } else {
          //user exists and thus thus lets provide an API Key for the user and save it back to the database and send an email back to the user with
          //with documentation on hdow to use the API
          //generate API_KEY length of the key is length of the Email of the user
          //set also acknowledge user is verified
          const lengthAPI = email.length;
          const API_KEY = generateRandomAlphanumeric(lengthAPI);

          const userAPI = await UserSchema.updateOne(
            { email: email },
            {
              $set: {
                key: API_KEY,
                isVerified: true,
              },
            }
          );

          console.log("email verified. API_KEY=>"+API_KEY)
          await res.status(200).send('email has been verified API_KEY=>'+API_KEY)

          //triger node mailer2  containing the documentation of e API
          

          //

          return;
        }
      } else {
        res.status(400).send("user of the email provided does not exist!");
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
