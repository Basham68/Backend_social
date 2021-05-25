const router = require('express').Router();
const auth = require('../controllers/auth')

router.post('/register', auth.register)
router.post('/login', auth.login)
router.post('/logout', auth.logout)

router.post('/refresh_token', auth.generateAccessToken)
router.post('/forgotpassword', auth.forgotPassword)
router.put('/resetpassword/:resetToken',auth.resetPassword);




module.exports = router