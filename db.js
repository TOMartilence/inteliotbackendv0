require("dotenv").config();
const mongoose = require("mongoose");
const dbInitialise = async () => {
  try {
    await mongoose.connect(process.env.mongodb);
    console.log("Database connected successfully");
   
    const fetchedDatazero = mongoose.connection.db.collection("Scrollimages");
    const fetchedDataone = mongoose.connection.db.collection("Projects");
    const fetchedDatatwo = mongoose.connection.db.collection("Gallery");
    const fetchedDatathree = mongoose.connection.db.collection("Events");
    const fetchedDatafour = mongoose.connection.db.collection("Members");
    const fetchedDatafive = mongoose.connection.db.collection("Admin");
    const fetchedDatasix = mongoose.connection.db.collection("Homecards");
    const fetchedDataseven = mongoose.connection.db.collection("Faq");
    const fetchedDateEight = mongoose.connection.db.collection("Timeline")
    const fetchedDateNine = mongoose.connection.db.collection("Video");
    const fetchedDataTen = mongoose.connection.db.collection("Resource");
    const fetchedDataEleven = mongoose.connection.db.collection("Students")
    const video = await fetchedDateNine.find({}).toArray();
    const imagescroll = await fetchedDatazero.find({}).toArray();
    const projects = await fetchedDataone.find({}).toArray();
    const gallery = await fetchedDatatwo.find({}).toArray();
    const events = await fetchedDatathree.find({}).toArray();
    const members = await fetchedDatafour.find({}).toArray();
    const admin = await fetchedDatafive.find({}).toArray();
    const notif = await fetchedDatasix.find({}).toArray();
    const faq = await fetchedDataseven.find({}).toArray();
    const timeline = await fetchedDateEight.find({}).toArray();
    const resource = await fetchedDataTen.find({}).toArray();
    const students = await fetchedDataEleven.find({}).toArray();
    global.imagescroll = imagescroll;
    global.projects = projects;
    global.gallery = gallery;
    global.events = events;
    global.members = members;
    global.admin = admin;
    global.notif = notif;
    global.faq = faq;
    global.video = video;
    global.timeline = timeline
    global.resource = resource
    global.students = students
    
  } catch (error) {
    console.log(`Failed to connect to database: ${error}`);
  }
};

module.exports = dbInitialise;
