const mongoose = require("mongoose");
const { Booking } = require("../models/booking");
const { Hotel } = require("../models/hotel");
const { Room } = require("../models/room");
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require("http-status-codes");

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    if (bookings.length >= 1) {
      res.status(OK).json({
        data: {
          bookingCount: bookings.length,
          bookings
        },
        status: "success"
      });
    }
    return res.status(BAD_REQUEST).json({
      message: "No Booking has been Made",
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

exports.getAllBookingInvoice = async (req, res) => {
  const hotelId = req.params.hotelId;
  const bookingReferences = [];
  const payMeth = [];
  const roomBooked = [];
  const totalbooking = [];
  const bookingMonth = {};
  const amount = [];
  try {
    const hotel = await Hotel.findOne({ _id: hotelId });
    const bookings = await Booking.find({ hotelId });
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    bookings.forEach(book => {
      bookingReferences.push(book.referenceNumber);
      if (book.cardType) {
        payMeth.push({ card: book.cardType });
      }
      roomBooked.push({
        roomType: book.roomType,
        amount: Number(book.amount) / 100,
        paidAt: book.paidAt
      });
      if (new Date(book.paidAt).getMonth() == new Date().getMonth()) {
        bookingMonth.month = months[new Date(book.paidAt).getMonth()];
        totalbooking.push(book.paidAt);
      }
      amount.push(Number(book.amount) / 100);
    });
    var totalAmount = amount.reduce(function(a, b) {
      return a + b;
    }, 0);

    if (bookings.length >= 1) {
      res.status(OK).json({
        data: {
          bookingCount: bookings.length,
          percentageValue: hotel.percentageValue,
          invoice: {
            hotelName: hotel.propertyInfo.hotelName,
            bookingReference: bookingReferences,
            paymentMethods: payMeth,
            roomBooked,
            month: bookingMonth.month,
            totalAmount,
            invoicegenerated: new Date().toISOString()
          }
        },
        status: "success"
      });
    }
    return res.status(BAD_REQUEST).json({
      message: "No Booking has been Made",
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

exports.getABooking = async (req, res) => {
  const _id = req.params.bookingId;
  try {
    const bookings = await Booking.findOne({ _id });
    if (bookings) {
      const room = await Room.findOne({ _id: bookings.Room });
      const hotel = await Hotel.findOne({ _id: room.hotelId });
      res.status(OK).json({
        data: bookings,
        hotelId: room.hotelId,
        hotelName: hotel.propertyInfo.hotelName,
        status: "success"
      });
    }
    return res.status(BAD_REQUEST).json({
      message: "No Booking has been Made",
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

exports.updateBooking = async (req, res) => {
  const _id = req.params.bookingId;
  const updateOps = {};
  for (const Ops of req.body) {
    updateOps[Ops.propName] = Ops.value;
  }
  try {
    const bookings = await Booking.findOne({ _id });
    if (bookings.author == req.userData._id) {
      const room = await Booking.update({ _id }, { $set: updateOps });
      if (room.nModified >= 1) {
        return res.status(OK).json({
          message: "Bookings update successfully",
          status: "success"
        });
      }
    }
    return res.status(BAD_REQUEST).json({
      message: "unAuthorized Access",
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

exports.deleteBooking = async (req, res) => {
  const _id = req.params.bookingId;
  try {
    const bookings = await Booking.deleteOne({ _id });
    return res
      .status(OK)
      .json({ message: "Booking Deleted Successfully", data: "success" });
  } catch (err) {
    console.log(err);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: err,
      status: "error"
    });
  }
};
