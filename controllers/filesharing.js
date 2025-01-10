const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

//we have to install uuid because if we upload file with same name then it will be overwritten so uuid se unique id generate karlenge

const { v4: uuidv4 } = require('uuid');

const FileSharingModel = require('../models/filesharing');

const uploadPath = path.join(__dirname,"..","uploads" );
console.log(uuidv4())

const storage = multer.diskStorage({
    destination : (req,file,cb)=> cb(null,uploadPath),
    filename  : (req,file,cb)=>{
        const fileName = uuidv4() + path.extname(file.originalname);//it will give the extension from original name

      cb(null, fileName);
    }
  })

const upload = multer({
    storage : storage,
}).single("attachment");//only single file pe kaam karenge multiple k liye .array()

const uploadFile = (req, res) => {
    upload(req,res, async(error) => {
        if(error){
            console.log(error);
            res.status(500).json({
                success: false,
                message:"error uploading file"
            })
        }else{
            console.log("file uploaded successfully");
            console.log(req.file);
            const newFile = new FileSharingModel({
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,

            })
            const newlyInsertedFile = await newFile.save();
            res.json({
                success: true,
                message:"dummy upload file api",
                fileId: newlyInsertedFile._id,
            })
        }
    });
};
const generateLink = async (req, res) => {
    // console.log(req.params.uuid);
    const uuid = req.params.uuid;
    const file = await FileSharingModel.findOne({_id:uuid});
    if(!file){
        return res.status(404).json({
            success: false,
            message: "File not found"
        });
    }
    console.log("file",file);
    
    const downloadStr = `http://localhost:10000/files/download/${uuid}`
    res.json({
        success: true,
        message:"Dummy generate link api",
        url: downloadStr,
    })
};
const downloadFile = async (req, res) => {
    const uuid = req.params.uuid;
    const file = await FileSharingModel.findOne({_id:uuid});
    if(!file){
        return res.status(404).json({
            success: false,
            message: "File not found"
        });
    }
    console.log(file);
    res.download(file.path);
    // res.json({
    //     success: true,
    //     message:"Dummy download link api"
    // })
}
const sendFileonEmail = async (req, res) => {
    console.log(req.body);
    const uuid=req.body.uuid;
    const file = await FileSharingModel.findOne({_id:uuid});
    if(!file){
        return res.status(404).json({
            success: false,
            message: "File not found"
        });
    }
    const downloadStr = `http://localhost:10000/files/download/${uuid}`;
    //send email with downladable link
    const emailbody = `
    <html>
    <head></head>
    <body>
      <p>Download file from <a href="${downloadStr}">${downloadStr}</a></p>
    </body>
    </html>
    `;
    //setting up the transporter
    const transporter = nodemailer.createTransport({
        host: "localhost",
        port: 1025,
        secure: false, // Use `true` for port 465, `false` for all other ports
        tls:false,
        // auth: {
        //   user: "maddison53@ethereal.email",
        //   pass: "jn7jnAPss4f63QBp6D",
        // }, //beacuse we aren't sending actual email
        //so we dont need auth
      });

      await FileSharingModel.updateOne({_id:file._id},
        {$set:{ sender: req.body.emailfrom, receiver:req.body.emailto}});

      //sending mail part
      //sending email is a asynchronous process so async await
      const info = await transporter.sendMail({
        from: "do-not-reply@file-sharing.com",
        to: "rupesh12345@outlook.com",
        subject:"your friend has shared a file",
        html:emailbody,
      })
      console.log(info.messageId);//sent hone pe message id aata h
    res.json({
        success: true,
        message:"email sent successfully",
    })
};

module.exports = {
    uploadFile,
    generateLink,
    downloadFile,
    sendFileonEmail,
}