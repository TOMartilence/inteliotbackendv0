const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true
    },
    name: String,
    desc: String,
    linkedinlink: String,
    instagramlink: String,
    position : String,
    githublink: String,
    rollNumber : String,
    imagelink: String,
    category: String 
  },
  { collection: "Members" }
);

memberSchema.pre("save", async function(next) {
  try {
    if (this.isNew) {
      const count = await mongoose.model("Members").countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Members = mongoose.model("Members", memberSchema);

module.exports = Members;
