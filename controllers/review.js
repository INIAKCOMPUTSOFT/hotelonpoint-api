const mongoose = require("mongoose");
const { Review } = require("../models/review");
const { Comment } = require("../models/comments");
const { Hotel } = require("../models/hotel");
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require("http-status-codes");

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    if (reviews.length >= 1) {
      res.status(OK).json({
        data: {
          reviewCount: reviews.length,
          reviews
        },
        status: "success"
      });
    }
    return res.status(BAD_REQUEST).json({
      message: "No Reviews has been Made",
      status: "error"
    });
  } catch (err) {
    console.log(err);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: err,
      status: "error"
    });
  }
};

exports.addReviews = async (req, res) => {
  const _id = req.params.hotelId;
  const { comment, customerName, starRating } = req.body;
  try {
    const hotel = await Hotel.findOne({ _id });
    if (hotel) {
      review = new Review({
        _id: new mongoose.Types.ObjectId(),
        hotelId: hotel._id,
        hotelName: hotel.propertyInfo.hotelName,
        comment,
        customerName,
        starRating,
        approved: false,
        date: new Date().toISOString()
      });
      const resp = await review.save();
      if (resp)
        res.status(OK).json({
          status: "success",
          data: resp
        });
    }
    return res.status(BAD_REQUEST).json({
      message: "Cannot Review Hotel not Registered with Hotel on Points",
      status: "error"
    });
  } catch (err) {
    console.log(err);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: err,
      status: "error"
    });
  }
};

exports.getReviewsForHotel = async (req, res) => {
  const { hotelId } = req.params;
  try {
    const reviews = await Review.find({ hotelId });
    if (reviews.length >= 1) {
      res.status(OK).json({
        data: {
          reviewCount: reviews.length,
          reviews
        },
        status: "success"
      });
    }
    return res.status(BAD_REQUEST).json({
      message: "No Reviews has been Made for this hotel",
      status: "error"
    });
  } catch (err) {
    console.log(err);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: err,
      status: "error"
    });
  }
};

exports.approveReviews = async (req, res) => {
  const _id = req.params.reviewId;
  try {
    const reviews = await Review.findOne({ _id });
    if (reviews) {
      const review = await Review.updateOne(
        { _id },
        { $set: { approved: true } }
      );
      if (review.nModified >= 1) {
        res.status(OK).json({
          data: "Review Approved successfully",
          status: "success"
        });
      } else {
        return res.status(BAD_REQUEST).json({
          message: "Room has already Been Approved",
          status: "error"
        });
      }
    }
    return res.status(BAD_REQUEST).json({
      message: "No Reviews has been Made",
      status: "error"
    });
  } catch (err) {
    console.log(err);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: err,
      status: "error"
    });
  }
};

exports.deleteReview = (req, res) => {
  const _id = req.params.reviewId;
  Review.deleteOne({ _id })
    .then(result => {
      res
        .status(OK)
        .json({ message: "review Deleted Successfully", data: "success" });
    })
    .catch(err => {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        error: err
      });
    });
};
