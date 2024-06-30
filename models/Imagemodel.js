const mongoose = require("mongoose");

const imageschema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true 
    },
    imagelink:String,
  },
  { collection: "Scrollimages" }
);

imageschema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const count = await mongoose.model('Scrollimages').countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Scrollimages = mongoose.model("Scrollimages", imageschema);

module.exports = Scrollimages;
