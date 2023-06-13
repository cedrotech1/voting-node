const express = require('express');
const app = express();
const cors = require('cors');
const conf=require('dotenv').config();

const jwt=require("jsonwebtoken");
app.use(express.json());



//routes
const adminRoute=require("./route/admin");
const studentRoute=require("./route/student");
const positionRoute=require("./route/position");
const votesRoute=require("./route/votes");
const condidateRoute=require('./route/condidate')
const decisionsRoute=require('./route/decisions')

const bodyParser =require("body-parser");
const cookieParser =require("cookie-parser");
const session =require("express-session");
//midle wares
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods:["GET","POST"],
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
  key:"userID",
  secret:"mysecrete",
  resave:false,
  saveUninitialized:false,
  cookie:{
    expires:60*60*24,
  }
}))


app.use("/admin",adminRoute);
app.use("/student",studentRoute);
app.use("/position",positionRoute);
app.use("/votes",votesRoute);
app.use("/condidate",condidateRoute);
app.use("/decision",decisionsRoute);


// Start the server
app.listen(5000, () => {
  console.log(`Server listening on port 5000`);
});
