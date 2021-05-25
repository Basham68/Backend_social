const router = require('express').Router()
const isAuthenticated = require("../middleware/isAuthenticated")
const upload = require('../middleware/upload');
const user = require("../controllers/user")



router.patch('/user', isAuthenticated,upload, user.updateUser)
router.put('/user/:id/follow', isAuthenticated, user.follow)
router.put('/user/:id/unfollow', isAuthenticated, user.unfollow)




module.exports = router;