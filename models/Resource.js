const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true // Ensures uniqueness of id
  },
  title: String,
  description: String,
  fileurl: String,
  
}, { collection: 'Resource' });

ResourceSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const count = await mongoose.model('Resource').countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Resource = mongoose.model("Resource", ResourceSchema);

module.exports = Resource;
