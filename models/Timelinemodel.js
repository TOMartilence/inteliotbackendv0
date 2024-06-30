const mongoose = require("mongoose");

const timelineschema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true 
    },
    title : String,
    description : String,
    startDate : String,
    endDate : String
  },
  { collection: "Timeline" }
);

timelineschema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const count = await mongoose.model('Timeline').countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Timeline = mongoose.model("Timeline", timelineschema);

module.exports = Timeline;
