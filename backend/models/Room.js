const mongoose = require("mongoose");
const Bed = require("./Bed");

const roomSchema = new mongoose.Schema(
{
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },

  totalBeds: {
    type: Number,
    required: true
  },

  pricePerBed: {
    type: Number,
    required: true
  },

  images: [
    {
      type: String
    }
  ]

},
{ timestamps: true }
);

// Delete all beds when a room is deleted
roomSchema.pre("findOneAndDelete", async function (next) {
  try {

    const room = await this.model.findOne(this.getQuery());

    if (room) {
      await Bed.deleteMany({ room: room._id });
    }

    

  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Room", roomSchema);