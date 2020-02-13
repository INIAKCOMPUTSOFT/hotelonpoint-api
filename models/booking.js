const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = {
  customerId: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  getDeals: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  wantAirportShuttle: {
    type: Boolean,
    required: true
  }
};

const bookingSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  Room: {
    type: Schema.Types.ObjectId,
    ref: "Room"
  },
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: "Hotel"
  },
  hotelName: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  checkOutStatus: {
    type: Boolean,
    required: true
  },
  checkInStatus: {
    type: Boolean,
    required: true
  },
  checkIn: {
    type: String,
    required: true
  },
  checkOut: {
    type: String,
    required: true
  },
  referenceNumber: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  cancellationStatus: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  },
  paidAt: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true
  },
  cardType: {
    type: String,
    required: true
  },
  customer: customerSchema
});
const Booking = mongoose.model("Booking", bookingSchema);
exports.Booking = Booking;
