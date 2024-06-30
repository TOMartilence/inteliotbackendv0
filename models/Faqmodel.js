const mongoose = require("mongoose");

const faqschema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true 
    },
    question:String,
    answer:String
  },
  { collection: "Faq" }
);

faqschema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const count = await mongoose.model('Faq').countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Faq = mongoose.model("Faq", faqschema);

module.exports = Faq;
