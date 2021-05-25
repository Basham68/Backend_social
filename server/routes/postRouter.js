
const router = require('express').Router()
const isAuthenticated = require('../middleware/isAuthenticated');
const upload = require('../middleware/upload');
const postCtrl = require('../controllers/postCtrl')


router.post('/posts',isAuthenticated,upload ,postCtrl.createPost)
router.delete('/posts/:id',isAuthenticated,postCtrl.deletePost)
   






module.exports = router

