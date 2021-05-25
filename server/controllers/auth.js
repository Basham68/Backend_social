const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')

const auth = {
    register: async (req, res) => {
        try {
            const { fullname,username, email, password } = req.body

            let newUserName = username.toLowerCase().replace(/ /g, '')
            //Validation
            const user_name = await Users.findOne({username: newUserName})
            if(user_name) return res.status(400).json({msg: "User name already exists"})

            const user_email = await Users.findOne({email})
            if(user_email) return res.status(400).json({msg: "Email already exists"})

            if(password.length < 6)
            return res.status(400).json({msg: "Password must be at least 6 characters."})
            
            //Generating new pwd
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(req.body.password, salt)
            
            //creating new users
            const newUser = new Users({
                 fullname,username: newUserName, email, password: passwordHash
            })


            const access_token = createAccessToken({id: newUser._id})
            const refresh_token = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30*24*60*60*1000 // 30days
            })

            await newUser.save()

            res.json({
                msg: 'Register Success!',
                access_token,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
               
            const {email,password}=req.body

            const user = await Users.findOne({ email })
     
            !user && res.status(404).json("user not found");
        
            const validPassword = await bcrypt.compare(password, user.password)
            !validPassword && res.status(400).json("wrong password")

            const access_token = createAccessToken({id: user._id})
            const refresh_token = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30*24*60*60*1000 // 30days
            })

            res.json({
                msg: 'Login Success!',
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/api/refresh_token'})
            return res.json({msg: "Logged out!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    generateAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg: "Please login now."})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async(err, result) => {
                if(err) return res.status(400).json({msg: "Please login now."})

                const user = await Users.findById(result.id).select("-password")
               

                if(!user) return res.status(400).json({msg: "This does not exist."})

                const access_token = createAccessToken({id: result.id})

                res.json({
                    access_token,
                    user
                })
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    forgotPassword : async (req, res, next) => {
        const user = await Users.findOne({ email: req.body.email });
      
        if (!user) {
          return res.status(403).json({msg:'There is no user with that email'});
        }
      
        // Get reset token
        const resetToken = user.getResetPasswordToken();
      
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(400).json({msg:'Email could not be sent'})
  }

    
        res.status(200).json({
            success : true,
            data : user
        })
      
    },
    resetPassword :async (req, res, next) => {
        // Get hashed token
        const resetPasswordToken = crypto
          .createHash('sha256')
          .update(req.params.resetToken)
          .digest('hex');
      
        const user = await Users.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() },
        });
      
        if (!user) {
            return res.status(403).json({msg:'Invalid Token'});
        }
      
        // Set new password
        password = req.body.password;
        if(password.length < 6)
        return res.status(400).json({msg: "Password must be at least 6 characters."})
        
        //Generating new pwd
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(req.body.password, salt)
        user.password = passwordHash
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success : true
            
        })
      
        
      }
    
}



const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'})
}

module.exports = auth