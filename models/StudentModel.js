const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true
    },
    name: String,
    roll : String,
    year : String,
    dept : String,
    team : String,
    phone : String
  },
  { collection: "Students" }
);

studentSchema.pre("save", async function(next) {
  try {
    if (this.isNew) {
      const count = await mongoose.model("Students").countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Students = mongoose.model("Students", studentSchema);

module.exports = Students;
