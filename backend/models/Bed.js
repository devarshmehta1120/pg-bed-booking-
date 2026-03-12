const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema(
{
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },

  bedNumber: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  // isAvailable: {
  //   type: Boolean,
  //   default: true
  // }
},
{ timestamps: true }
);

module.exports = mongoose.model("Bed", bedSchema);