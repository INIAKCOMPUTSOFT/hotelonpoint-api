const mongoose = require("mongoose");
const { Booking } = require("../models/booking");
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require("http-status-codes");

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
        if(bookings.length >= 1) {
            res.status(OK).json({
                data: {
                    bookingCount: bookings.length,
                    bookings
                },
                status: 'success'
            })
        }
        return res.status(BAD_REQUEST).json({
            message: 'No Booking has been Made',
            status: 'error'
        })
    } catch (err) {
        console.log(err)
        res.status(INTERNAL_SERVER_ERROR).json({
            message: err,
            status: 'error'
        })
    }
}

exports.getABooking = async (req, res) => {
    const _id = req.params.bookingId
    try {
        const bookings = await Booking.findOne({ _id })
        if(bookings) {
            res.status(OK).json({
                data: bookings,
                status: 'success'
            })
        }
        return res.status(BAD_REQUEST).json({
            message: 'No Booking has been Made',
            status: 'error'
        })
    } catch (err) {
        console.log(err)
        res.status(INTERNAL_SERVER_ERROR).json({
            message: err,
            status: 'error'
        })
    }
}


exports.updateBooking = async (req, res) => {
    const _id = req.params.bookingId
    const updateOps = {};
  for (const Ops of req.body) {
    updateOps[Ops.propName] = Ops.value;
  }
    try {
        const bookings = await Booking.findOne({ _id })
        if(bookings.author == req.userData._id) {
            const room = await Booking.update({ _id }, { $set: updateOps })
            if(room.nModified >= 1){
                return res.status(OK).json({
                    message: 'Bookings update successfully',
                    status: 'success'
                });
            }
        }
        return res.status(BAD_REQUEST).json({
            message: 'unAuthorized Access',
            status: 'error'
        })
    } catch (err) {
        console.log(err)
        res.status(INTERNAL_SERVER_ERROR).json({
            message: err,
            status: 'error'
        })
    }
}

exports.deleteBooking = async (req, res) => {
    const _id = req.params.bookingId
    try {
        const bookings = await Booking.deleteOne({ _id })
        return res
        .status(OK)
        .json({ message: "Booking Deleted Successfully", data: "success" });
        
    } catch (err) {
        console.log(err)
        res.status(INTERNAL_SERVER_ERROR).json({
            message: err,
            status: 'error'
        })
    }
}

