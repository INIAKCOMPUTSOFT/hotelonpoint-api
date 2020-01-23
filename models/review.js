const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: "Hotel"
  },
  hotelName: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  starRating: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    required: true
  }
})
const Review = mongoose.model("Review", reviewSchema);
exports.Review = Review;
