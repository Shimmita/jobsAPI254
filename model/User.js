const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isURL } = require("validator");

//creating a usr schema  firstname,lastname,email,key
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "full name required!"],
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "phone number required!"],
    },

    github: {
      type: String,
      unique: true,
      required: [true, "github profile link required!"],
      validate: [isURL, "enter a valid github profile link!"],
      lowercase: true,
    },
    linkedin: {
      type: String,
      unique: true,
      required: [true, "linkedin profile link required!"],
      validate: [isURL, "enter a valid linkedin profile link!"],
      lowercase: true,
    },

    email: {
      type: String,
      lowercase: true,
      required: [true, "email required!"],
      unique: [true, "email already used!"],
      validate: [
        emailVailidator,
        "Email format provided is not valid, please enter a correct email address",
      ],
    },
    password: {
      type: String,
      required: [true, "password  required!"],
    
    },

    key: {
      type: String,
      default: "0",
    },
    token: {
      type: String,
      default: "0",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//hash the password before saving the user details
UserSchema.pre("save", async function (next) {
  try {
    const existingUser = await this.constructor.findOne({ email: this.email });
    if (existingUser) {
      //user exists thus reject saving
      const err = new Error("Email already exists");
      return next(err);
    } else {
      //save user does not exist
      //salt value the will be used in hashing the passord
      const salt = await bcrypt.genSalt(10);
      //hashing the password
      this.password = await bcrypt.hash(this.password, salt);
      next();
    }
  } catch (error) {
    next(error);
  }
});

//check email if is valid
function emailVailidator(email) {
  // Regular expression for a valid email address
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return emailRegex.test(email);
}

module.exports = mongoose.model("users", UserSchema);
