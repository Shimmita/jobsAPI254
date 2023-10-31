const mongoose = require("mongoose");

//creating a usr schema  firstname,lastname,email,key
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  email: {
    type: String,
    required: true,
    unique:true,
    validate:[ emailVailidator, 'Email format provided is not valid, please enter a correct email address']
  },
  password:{
    type:String,
    required:true
  },
  key: {
    type: String,
    default:'0'
  },
  token: {
    type: String,
    default:'0'
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  isVerified:{
    type:Boolean,
    default:false
  },

  createdAt:{
    type:Date,
    default:Date.now
  }
});


//return a formatted date
UserSchema.virtual('createdAtt').get(function () {
   return this.createdAt.toDateString(); 
});

//check email if is valid
 function emailVailidator(email) {
  // Regular expression for a valid email address
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
  return  emailRegex.test(email);
}


module.exports=mongoose.model('users',UserSchema)