const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true // Ensures uniqueness of id
  },
  title: String,
  imagelink: String,
  person: String,
  rollnumber: String,
  morelink: String,
}, { collection: 'Projects' });

projectSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const count = await mongoose.model('Projects').countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Projects = mongoose.model("Projects", projectSchema);

module.exports = Projects;
