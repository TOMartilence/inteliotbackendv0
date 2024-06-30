const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true
    },
    title:String,
    description: String,
    imagelink: String,
    morelink: String,
    date:String,
    category : String,
  },
  { collection: "Gallery" }
);

gallerySchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const count = await mongoose.model('Gallery').countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
