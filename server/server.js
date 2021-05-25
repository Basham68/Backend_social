require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require("helmet");
const morgan = require("morgan");


const app =express();

//DB Connection
const URI = process.env.MONGO_URL
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  () => {
    console.log("DB CONNECTED");
  });


//middleware
app.use(express.json());
app.use(cors())
app.use(cookieParser())
app.use(helmet());
app.use(morgan("common"));



//Routes
app.use('/api',require('./routes/authRouter'))
app.use('/api',require('./routes/postRouter'))
app.use('/api',require('./routes/userRouter'))
app.use('/api',require('./routes/convoRouter'))
app.use('/api',require('./routes/messageRouter'))


//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

