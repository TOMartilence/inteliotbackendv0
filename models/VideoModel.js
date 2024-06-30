const mongoose = require("mongoose");

const videoschema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true 
    },
    link : String,
    width : String,
    height : String,
  },
  { collection: "Video" }
);

videoschema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const count = await mongoose.model('Video').countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Video = mongoose.model("Video", videoschema);

module.exports = Video;
