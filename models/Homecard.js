const mongoose = require("mongoose");

const homecardsSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true 
    },
    title: String,
    description: String,
    alignment: String,
    bgColor: String,
    textColor: String,
    submissionDate: String, // New field for submission date
    submissionTime: String // New field for submission time
  },
  { collection: "Homecards" }
);

homecardsSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const count = await mongoose.model('Homecards').countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Homecards = mongoose.model("Homecards", homecardsSchema);

module.exports = Homecards;
