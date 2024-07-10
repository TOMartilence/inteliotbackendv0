require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer")
const fs = require('fs');
const path = require('path'); 
const bodyParser = require("body-parser");
const Projects = require('./models/projectModel')
const Gallery = require("./models/GalleryModel")
const Events = require("./models/EventModel")
const Members = require("./models/MemberModel")
const Admin = require("./models/Adminmodel")
const Image = require("./models/Imagemodel")
const Notifblock = require("./models/Homecard");
const Faq = require("./models/Faqmodel")
const Video = require("./models/VideoModel");
const Resource = require("./models/Resource")
const Timeline = require("./models/Timelinemodel")
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const secretKey = process.env.secretKey;
let OTP; 
const dbInitialise = require("./db");
const initialiseDatabase = async () => {
  try {
    await dbInitialise();
  } catch (error) {}
};
initialiseDatabase();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });

app.get("/api/", async (req, res) => {
  try {
    dbInitialise();
    const data =global.imagescroll ;
    const notif = global.notif;
    const video = global.video
    res.status(200).json({success:true,data:data,notif:notif,video : video});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/api/gallery", async (req, res) => {
  try {
    const galleryData = global.gallery;
    res.json({success:true,galleryData:galleryData})
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    res.json({ success: true, projects: global.projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/api/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Projects.deleteOne({id:id});
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const data = global.events;
    res.json({success:true,data:data})
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/api/members", async (req, res) => {
  try {
    const data = global.members;
    res.json({data:data,success:true});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.post("/api/adminlogin", async (req, res) => {
  try {
    const { name, password } = req.body;
    const count = await Admin.countDocuments({ email: name });
    if (count!=0) {
      const admin = await Admin.findOne({email:name});
      if (await bcrypt.compare(password,admin.password)) { 
        const token = jwt.sign({ username: name }, secretKey, {
          expiresIn: "1h",
        });
        res.json({ success: true, message: "Login successful", token });
      } else {
        res.json({ success: false, message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



app.post("/api/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;
    const count = await Admin.countDocuments({ email: email }); 
    if(count!=0){
      OTP = Math.floor(Math.random() * 1000000);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${OTP}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res
          .status(500)
          .json({ success: false, message: "Error sending email" });
      } else {
        res.json({ success: true, message: "OTP sent successfully" });
      }
    });
    }

    else{
      res.json({ success: false, message: "User not authorised" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/api/verifyotp", async (req, res) => {
  try {
    const { enteredotp } = req.body;

    if (OTP && enteredotp == OTP) {
      const token = jwt.sign({ username: OTP }, secretKey, {
        expiresIn: "1h",
      });
      res.json({ success: true, message: "OTP verification successful",token });
    } else {
      res.status(401).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/api/addProject", async (req, res) => {
  try {
    const { title, imagelink, person, rollnumber, morelink } = req.body;
    const newProject = new Projects({
      title,
      imagelink,
      person,
      rollnumber,
      morelink,
    });

    await newProject.save();

    res.status(200).json({success:true, message: "Project added successfully" });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ success:false,message: "Failed to add project" });
  }
});

app.post("/api/addGallery",async(req,res)=>{
  try {
    const {title,description,imagelink,morelink,category,date} = req.body;
    const newGallery = new Gallery({
      title,
      description,
      imagelink,
      morelink,
      category,
      date
    });
    await newGallery.save()
    res.status(200).json({ success:true,message: "Image added to gallery" });

  } catch (error) {
    console.error("Error adding Image to gallery:", error);
    res.status(500).json({ success:false,message: "Failed to add Image" });
  }
})

app.post("/api/addEvent",async(req,res)=>{
  try {
    const {eventTitle,poster,eventDate,description,registerLink,eventType,time} = req.body.formData
    const newEvent = new Events({
      eventTitle,
      poster,
      eventDate,
      description,
      registerLink,
      eventType,
      time
    });
   await newEvent.save();
   res.json({success:true,message:"Event added succesfully"});
  } catch (error) {
    res.json({success:false,message:"Error check again later"})
  }
})

app.post("/api/deleteEvent/:id",async(req,res)=>{
  try {
    const id = req.params.id;
    await Events.deleteOne({id:id});
    res.status(200).json({success:true,message:"Event deleted succesfully"})
  } catch (error) {
    res.status(500).json({success:false,message:"Failed to delete the message"})
  }
})


app.post("/api/deletePicture/:id",async(req,res)=>{
  try {
    const id = req.params.id;
    await Gallery.deleteOne({id:id});
    res.status(200).json({success:true,message:"Item deleted succesfully"})

  } catch (error) {
    res.status(500).json({success:false,message:"Internal server error try again later"})
  }
})

app.post("/api/addMember", async (req, res) => {
  try {
    const { name, desc, linkedinlink, instagramlink, githublink,rollNumber, position,imagelink, category } = req.body;
    const newMember = new Members({
      name,
      desc,
      linkedinlink,
      instagramlink,
      githublink,
      rollNumber,
      position,
      imagelink,
      category 
    });

    await newMember.save();
    res.json({ success: true, message: "Member added successfully" });
  } catch (error) {
    console.error("Error adding member:", error);
    res.json({ success: false, message: "Some internal error" });
  }
});


app.post("/api/deleteMember/:id",async(req,res)=>{
  try {
    const id = req.params.id;
    await Members.deleteOne({id : id});
    res.status(200).json({success:true,message:"Member deleted succesfully"})
  } catch (error) {
    
  }
})

app.post("/api/addHomeImage",async(req,res)=>{ 
  try {
    const imagelink = req.body.scrollImage;
    const  scrollImage =new Image({
      imagelink
    })
    await scrollImage.save();
    res.json({success:true,message:"Image added succesfully"})
    
  } catch (error) {
    res.json({success:false,message:"Unsuccesful attempt"})
  }
})

app.post("/api/addNotification", async (req, res) => {
  try {
    const { title, description, alignment, bgColor, textColor, submissionDate, submissionTime } = req.body;
    const newnotif = new Notifblock({
      title,
      description,
      alignment,
      bgColor,
      textColor,
      submissionDate,
      submissionTime 
    });

    await newnotif.save();
    res.status(200).json({ success: true, message: "Added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Couldn't add notification" });
  }
});

app.post("/api/deleteHomeCard/:id",async(req,res)=>{
  try {
    const id = req.params.id
    await Notifblock.deleteOne({id:id})
    res.status(200).json({success:true,message:"Succesfully deleted"})
  } catch (error) {
    res.status(500).json({success:false,message:"Couldnt delete"})

  }
})

app.post("/api/deleteHomeImage/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Image.deleteOne({ _id: id });
    res.status(200).json({ success: true, message: "Successfully deleted the image" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ success: false, message: "Error deleting the image" });
  }
});

app.post("/api/checkSixteen", async (req, res) => {
  try {
    const { passkey } = req.body;
    if (passkey === process.env.passkeyadmin) {
      res.status(200).json({ success: true, message: "Verified" });
    } else {
      res.status(401).json({ success: false, message: "Unverified user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.post("/api/addAdmin",async(req,res)=>{
  try {
    const {email,passwordOne} = req.body;
    const password = await bcrypt.hash(passwordOne, 10);
    const newAdmin = new Admin({
      email,
      password
    })

    await newAdmin.save();
    res.status(200).json({success:true,message:"Admin added succesfully"})
  } catch (error) {
    res.status(500).json({success:false,message:"Internal server error"})

  }
})

app.post("/api/addFaq",async(req,res)=>{
  try {
    const {question,answer} = req.body;
    const newFaq = new Faq({
      question,
      answer
    })

    await newFaq.save();
    res.status(200).json({success:true,message:"Faq added succesfully"})

  } catch (error) {
    res.status(500).json({success:false,message:"Server error"})

  }
})

app.get("/api/getFaq",async(req,res)=>{
  try {
    res.json({ success: true, faq: global.faq });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
})

app.post("/api/deletefaq/:id",async(req,res)=>{
  try {
    const id = req.params.id;
    console.log(id);
    await Faq.deleteOne({id:id+1})
    res.send({message:"Succesfully Deleted"})
  } catch (error) {
    res.send({message : "Internal server error"})
  }
})

app.post("/api/addTimeline",async(req,res)=>{
  try {
    const {title,description,startDate,endDate} = req.body;
    const newTimeLine = new Timeline ({
      title,description,startDate,endDate
    })
    await newTimeLine.save();
    res.send({message:"Timeline data stored succesfully"})
  } catch (error) {
    res.send({message:"Internal server error"})
  }
})

app.get("/api/gettimelinedata",async(req,res)=>{
  try {
    const timelinedata = global.timeline
    res.send({data : timelinedata , message : "Data retrieved succesfully"})
  } catch (error) {
    
  }
})

app.post("/api/addYtvideo",async(req,res)=>{
  try {
    const {link,width,height} = req.body;
    const video = new Video({
      link,width,height
    })
    await video.save();
    res.send({message:"New video added succesfully"})
  } catch (error) {
    res.send({message : "Couldnt do it"})
  }
})
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    // Access uploaded file details through req.file
    const fileurl ="/opt/render/project/src/" + req.file.path;
    console.log('File stored at:', fileurl);
    const { title, description } = req.body;
    console.log('Title:', title);
    console.log('Description:', description);
    const newResource = new Resource({
      title,
      description,
      fileurl
    });
    await newResource.save()
    res.status(200).json({ message: 'File uploaded successfully', fileurl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/api/getResource",async(req,res)=>{
  try {
    const resource = global.resource
    res.status(200).json({success:true,data : resource});
  } catch (error) {
    res.send({message: "Failed to load resource"})
  }
})
app.post('/api/findpdf', async (req, res) => {
  try {
      let fileName = req.body.fileName;
      console.log("Requested file:", fileName);
      if (fileName.startsWith('uploads/')) {
          fileName = fileName.slice('uploads/'.length);
      }

      const filePath = path.join(__dirname, fileName);
      console.log("Full file path:", fileName);
      console.log('Current working directory:', process.cwd());

      if (fs.existsSync(fileName)) {
          const fileContent = fs.readFileSync(fileName);

          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline; filename=file.pdf');

          res.send(fileContent);
      } else {
          console.error('File not found:', fileName);
          res.status(404).json({ error: 'File not found' });
      }
  } catch (error) {
      console.error('Error finding PDF:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log("The backend is live");
});