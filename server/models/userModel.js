const mongoose = require("mongoose");
const crypto = require("crypto")

const userSchema = new mongoose.Schema(
  {
    fullname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 25
    },
    username: {
      type: String,
      require: true,
      min: 4,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default : ''
    
    },
  
    followers: {
      type : Array,
      default : []
    }
      ,
    
    following: {
    type : Array,
    default : []
    },
   
    isAdmin: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      default: 'male'
          },
    resetPasswordToken: String,
    resetPasswordExpire: Date  ,   
   
    address: {
       type: String,
       default: ''}

  },
  { timestamps: true }
);

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


module.exports = mongoose.model("user", userSchema);
