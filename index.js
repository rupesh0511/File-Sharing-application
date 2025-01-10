// console.log("file sharing app");

const express = require('express');

const mongoose = require('mongoose');
// const multer = require('multer');
const fileSharingRoutes = require('./routes/filesharing');

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/file_sharing")
.then(()=>console.log("database connected successfullly"))
.catch((err)=>console.log("error connecting db",err));

app.use(fileSharingRoutes); 

app.listen(10000,() => {
    console.log("server is up and running");  
});