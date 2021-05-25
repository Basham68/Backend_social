var express = require('express');
var multer = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');


var router = express.Router();


router.use(express.static(__dirname+"./public/"));


var Storage= multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
  storage:Storage
}).single('file');





module.exports = upload;