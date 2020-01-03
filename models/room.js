const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  imageUrl: {
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
    type: Number,
    required: true
  },
  standardRate: {
    type: Number,
    required: true
  },
  occupantNumber: {
    type: String,
    required: true
  },
  roomPrice: {
    type: Number,
    required: true
  },
  roomAmenities: {
    type: Array
  },
  moreAmenities: {
    type: Array
  },
  noOfOccupiedRooms: {
    type: String,
    required: true
  }
});

const Room = mongoose.model("Room", roomSchema);
exports.Room = Room;
