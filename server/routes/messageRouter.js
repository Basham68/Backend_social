const router = require("express").Router();
const message = require("../controllers/message");
const isAuthenticated = require("../middleware/isAuthenticated");

//send a message
router.post("/message", isAuthenticated,message.newMsg);

//Get conversations
router.get("/message/:conversationId",isAuthenticated,message.getMsg )
 


module.exports = router;
