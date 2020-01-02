const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  imagerUrl: {
    type: Array
  },
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: "Hotel"
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  roomType: {
    type: String,
    required: true
  },
  smokingPolicy: {
    type: String,
    required: true
  },
  roomSize: {
    type: String,
    required: true
  },
  roomsOfThisType: {
    type: String,
    required: true
  },
  bedType: {
    type: String,
    required: true
  },
  bedNumber: {
    type: String,
    required: true
  },
  weekendRate: {
    type: String,
    required: true
  },
  standardRate: {
    type: String,
    required: true
  },
  occupantNumber: {
    type: String,
    required: true
  },
  roomPrice: {
    type: String,
    required: true
  },
  roomAmenities: {
    type: Array
  },
  moreAmenities: {
    type: Array
  }
});

const Room = mongoose.model("Room", roomSchema);
exports.Room = Room;
