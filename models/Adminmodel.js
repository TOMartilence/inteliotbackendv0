const mongoose = require("mongoose");

const adminschema = new mongoose.Schema(
  {
    
   name:String,
   email:String,
   password:String,
  },
  { collection: "Admin" }
);



const Admin = mongoose.model("Admin", adminschema);

module.exports = Admin;
