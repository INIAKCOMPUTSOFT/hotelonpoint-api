const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  hotelName: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  tripPurpose: {
    type: String,
    required: true
  },
  travellerType: {
    type: String,
    required: true
  },
  travelPet: {
    type: String,
    required: true
  },
  Staff: {
    type: String,
    required: true
  },
  facilities: {
    type: String,
    required: true
  },
  cleanliness: {
    type: String,
    required: true
  },
  comfort: {
    type: String,
    required: true
  },
  valueForMoney: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  likes: {
    type: String,
    required: true
  },
  disLikes: {
    type: String,
    required: true
  },
  reviewerCountry: String,
  totalRating: {
    type: String,
    required: true
  },
  review: {
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
const Review = mongoose.model('Review', reviewSchema)
exports.Review = Review
