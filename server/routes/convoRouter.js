const router = require("express").Router();
const convo = require("../controllers/convo");
const isAuthenticated = require("../middleware/isAuthenticated");

//New Convo
router.post("/conversation",isAuthenticated,convo.newConvo) 

//Get convo of a user
router.get("/conversation/:userId", isAuthenticated, convo.getConvo)


// Get convo between two users
router.get("/conversation/find/:firstUserId/:secondUserId", isAuthenticated,convo.getConvos)

module.exports = router;
