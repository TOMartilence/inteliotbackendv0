const mongoose = require("mongoose");

const eventschema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true 
    },
    eventTitle : String,
    poster:String,
    eventDate : String,
    description:String,
    registerLink:String,
    eventType:String,
    time:String,
  },
  { collection: "Events" }
);

eventschema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const count = await mongoose.model('Events').countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Events = mongoose.model("Events", eventschema);

module.exports = Events;
