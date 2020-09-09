const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const authrouter = require("./routers/authrouter");


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}));

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(cors());
app.use(authrouter);
//connect mongodb with nodejs
const uri = "mongodb+srv://sd4mongo:sd4mongo@cluster0.wxjuu.mongodb.net/node-js-jwt-auth-mongodb?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true })
.then(successmessage=>{
    console.log("connected to database!", successmessage);
})
.catch(err=>{
    console.log("not connected!", err);
})

//simple route
app.get('/', (req,res)=>{
    res.json({message: "welcome to app!"});
})

//set port, listen for requests
const PORT = process.env.PORT||8080;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})