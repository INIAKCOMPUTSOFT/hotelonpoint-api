const mongoose = require('mongoose')
const { Booking } = require('../models/booking')
const { Hotel } = require('../models/hotel')
const { Room } = require('../models/room')
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes')
const { bookingMail2 } = require('../template/welcomeMail')
const nodemailer = require('nodemailer')

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
    if (bookings.length >= 1) {
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

exports.getAllUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ author: req.userData._id })
    if (bookings.length >= 1) {
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

exports.getAllHotelBookings = async (req, res) => {
  const hotelId = req.params.hotelId

  try {
    const bookings = await Booking.find({ hotelId: hotelId })
    if (bookings.length >= 1) {
      return res.status(OK).json({
        data: {
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

exports.getAllBookingInvoice = async (req, res) => {
  const hotelId = req.params.hotelId
  const bookingReferences = []
  const payMeth = []
  const roomBooked = []
  const totalbooking = []
  const bookingMonth = {}
  const amount = []
  try {
    const hotel = await Hotel.findOne({ _id: hotelId })
    const bookings = await Booking.find({ hotelId })
    var months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    bookings.forEach(book => {
      bookingReferences.push(book.referenceNumber)
      if (book.cardType) {
        payMeth.push({ card: book.cardType })
      }
      roomBooked.push({
        roomType: book.roomType,
        amount: Number(book.amount) / 100,
        paidAt: book.paidAt
      })
      if (new Date(book.paidAt).getMonth() == new Date().getMonth()) {
        bookingMonth.month = months[new Date(book.paidAt).getMonth()]
        totalbooking.push(book.paidAt)
      }
      amount.push(Number(book.amount) / 100)
    })
    var totalAmount = amount.reduce(function (a, b) {
      return a + b
    }, 0)

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
    if (bookings) {
      const room = await Room.findOne({ _id: bookings.Room })
      const hotel = await Hotel.findOne({ _id: room.hotelId })
      res.status(OK).json({
        data: bookings,
        hotelId: room.hotelId,
        hotelName: hotel.propertyInfo.hotelName,
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
  const updateOps = {}
  for (const Ops of req.body) {
    updateOps[Ops.propName] = Ops.value
  }
  try {
    const bookings = await Booking.findOne({ _id })
    const hotel = await Hotel.findOne({ _id: bookings.hotelId })
    if (
      bookings.author == req.userData._id ||
      req.userData.isCC ||
      hotel.author
    ) {
      const room = await Booking.update({ _id }, { $set: updateOps })
      if (room.nModified >= 1) {
        return res.status(OK).json({
          message: 'Bookings update successfully',
          status: 'success'
        })
      } else {
        return res.status(BAD_REQUEST).json({
          message: 'Booking already Modified',
          status: 'error'
        })
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
      .json({ message: 'Booking Deleted Successfully', data: 'success' })
  } catch (err) {
    console.log(err)
    res.status(INTERNAL_SERVER_ERROR).json({
      message: err,
      status: 'error'
    })
  }
}

exports.payLater = async (req, res) => {
  const {
    email,
    phone,
    firstname,
    lastname,
    getdeals,
    otherrequest,
    title,
    wantairportshuttle,
    roomId,
    roomType,
    checkin,
    checkout,
    paymentMethod,
    paymentstatus,
    confirmbooking,
    amount,
    referenceNumber,
    acctNo,
    acctName,
    BankName
  } = req.body
  try {
    const room = await Room.findOne({ _id: roomId })
    const hotel = await Hotel.findOne({ _id: room.hotelId })
    const booking = await Booking.findOne({
      referenceNumber: req.body.referenceNumber
    })
    if (!booking) {
      const book = {
        _id: new mongoose.Types.ObjectId(),
        Room: roomId,
        hotelId: room.hotelId,
        hotelName: hotel.propertyInfo.hotelName,
        roomType: roomType,
        author: req.body.userId,
        referenceNumber: referenceNumber,
        amount: amount,
        cancellationStatus: false,
        otherRequest: otherrequest,
        checkInStatus: false,
        checkOutStatus: false,
        checkIn: checkin,
        checkOut: checkout,
        createdAt: new Date().toISOString(),
        currency: 'NGN',
        customer: {
          firstName: firstname,
          lastName: lastname,
          email: email,
          phone: phone,
          getDeals: getdeals,
          title: title,
          wantAirportShuttle: wantairportshuttle
        },
        currentPercentage: hotel.percentageValue,
        paymentMethod: paymentMethod,
        paymentStatus: paymentstatus,
        confirmBooking: confirmbooking,
        acctNo,
        acctName,
        BankName
      }
      result = new Booking(book)
      result.save().then(async resp => {
        if (resp) {
          let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'hotelonpoints@gmail.com',
              pass: 'hotelonpoint.com'
            }
          })

          let mailOptions = {
            from: '"HotelonPoints.com" <support@hotelonpoint>', // sender address
            to: email, // list of receivers
            subject: 'Booking on Hotel-on-points', // Subject line
            text: 'Hello?', // plain text body
            html: bookingMail2(
              email,
              referenceNumber,
              firstname,
              lastname,
              checkin,
              checkout,
              paymentMethod,
              resp.createdAt,
              hotel.propertyInfo.hotelName,
              hotel.managementDetails.frontDeskPhoneOne,
              roomType,
              amount,
              acctNo,
              acctName,
              BankName
            ),
            attachments: [
              {
                filename: 'logo',
                path:
                  'https://res.cloudinary.com/sapeled3/image/upload/v1582959008/new/HOP_wowhhl_l6uihv_vnukz9.png',
                cid: 'logo' //same cid value as in the html img src
              },
              {
                filename: 'facebook',
                path:
                  'https://res.cloudinary.com/sapeled3/image/upload/v1582914214/new/Facebook3_bdmwch.png',
                cid: 'facebook' //same cid value as in the html img src
              },
              {
                filename: 'instagram',
                path:
                  'https://res.cloudinary.com/sapeled3/image/upload/v1582914214/new/Instagram2_yvusie.png',
                cid: 'instagram' //same cid value as in the html img src
              },
              {
                filename: 'twitter',
                path:
                  'https://res.cloudinary.com/sapeled3/image/upload/v1582914215/new/Twitter2_e2mse5.png',
                cid: 'twitter' //same cid value as in the html img src
              },
              {
                filename: 'linkedin',
                path:
                  'https://res.cloudinary.com/sapeled3/image/upload/v1582914215/new/LinkedIn2_z20k0w.png',
                cid: 'linkedin' //same cid value as in the html img src
              },
              {
                filename: 'youtube',
                path:
                  'https://res.cloudinary.com/sapeled3/image/upload/v1582914216/new/YouTube1_g84t0d.png',
                cid: 'youtube' //same cid value as in the html img src
              },
              {
                filename: 'hotelImage',
                path: room.imageUrl.url,
                cid: 'hotelImage' //same cid value as in the html img src
              }
            ]
            // html body
          }
          // send mail with defined transport object
          await transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
              return console.log(error)
            }
            console.log('Message sent: %s', info.messageId)
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
            return res.status(200).json({
              status: 'success',
              message: resp
            })
          })
        }
      })
    }
  } catch (err) {
    console.log(err)
    res.status(INTERNAL_SERVER_ERROR).json({
      message: err,
      status: 'error'
    })
  }
}

exports.payOnArrival = async (req, res) => {
  const {
    email,
    phone,
    firstname,
    lastname,
    getdeals,
    otherrequest,
    title,
    wantairportshuttle,
    roomId,
    roomType,
    checkin,
    checkout,
    paymentMethod,
    paymentstatus,
    confirmbooking,
    amount,
    referenceNumber
  } = req.body
  try {
    const room = await Room.findOne({ _id: roomId })
    const hotel = await Hotel.findOne({ _id: room.hotelId })
    const booking = await Booking.findOne({
      referenceNumber: req.body.referenceNumber
    })
    if (!booking) {
      const book = {
        _id: new mongoose.Types.ObjectId(),
        Room: roomId,
        hotelId: room.hotelId,
        hotelName: hotel.propertyInfo.hotelName,
        roomType: roomType,
        author: req.body.userId,
        referenceNumber: referenceNumber,
        amount: amount,
        cancellationStatus: false,
        otherRequest: otherrequest,
        checkInStatus: false,
        checkOutStatus: false,
        checkIn: checkin,
        checkOut: checkout,
        createdAt: new Date().toISOString(),
        currency: 'NGN',
        customer: {
          firstName: firstname,
          lastName: lastname,
          email: email,
          phone: phone,
          getDeals: getdeals,
          title: title,
          wantAirportShuttle: wantairportshuttle
        },
        currentPercentage: hotel.percentageValue,
        paymentMethod: paymentMethod,
        paymentStatus: paymentstatus,
        confirmBooking: confirmbooking
      }
      result = new Booking(book)
      result.save().then(async resp => {
        if (resp) {
          let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'hotelonpoints@gmail.com',
              pass: 'hotelonpoint.com'
            }
          })

          let mailOptions = {
            from: '"HotelonPoints.com" <support@hotelonpoint>', // sender address
            to: email, // list of receivers
            subject: 'Booking on Hotel-on-points', // Subject line
            text: 'Hello?', // plain text body
            html: bookingMail2(
              email,
              referenceNumber,
              firstname,
              lastname,
              checkin,
              checkout,
              paymentMethod,
              resp.createdAt,
              hotel.propertyInfo.hotelName,
              hotel.managementDetails.frontDeskPhoneOne,
              roomType,
              amount
            ),
            attachments: [
              {
                filename: 'logo',
                path:
                  'https://res.cloudinary.com/sapeled3/image/upload/v1582959008/new/HOP_wowhhl_l6uihv_vnukz9.png',
                cid: 'logo' //same cid value as in the html img src
              },
              {
                filename: 'facebook',
                path:
                  'https://res.cloudinary.com/sapeled3/image/upload/v1582914214/new/Facebook3_bdmwch.png',
                cid: 'facebook' //same cid value as in the html img src
              },
              {
                filename: 'instagram',
                path:
                  'https://res.cloudinary.com/sapeled3/image/upload/v1582914214/new/Instagram2_yvusie.png',
                cid: 'instagram' //same cid value as in the html img src
              },
              {
                filename: 'twitter',
                path:
                  'https://res.cloudinary.com/sapeled3/image/upload/v1582914215/new/Twitter2_e2mse5.png',
                cid: 'twitter' //same cid value as in the html img src
              },
              {
                filename: 'linkedin',
                path:
                  'https://res.cloudinary.com/sapeled3/image/upload/v1582914215/new/LinkedIn2_z20k0w.png',
                cid: 'linkedin' //same cid value as in the html img src
              },
              {
                filename: 'youtube',
                path:
                  'https://res.cloudinary.com/sapeled3/image/upload/v1582914216/new/YouTube1_g84t0d.png',
                cid: 'youtube' //same cid value as in the html img src
              },
              {
                filename: 'hotelImage',
                path: room.imageUrl.url,
                cid: 'hotelImage' //same cid value as in the html img src
              }
            ]
            // html body
          }
          // send mail with defined transport object
          await transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
              return console.log(error)
            }
            console.log('Message sent: %s', info.messageId)
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
            return res.status(200).json({
              status: 'success',
              message: resp
            })
          })
        }
      })
    }
  } catch (err) {
    console.log(err)
    res.status(INTERNAL_SERVER_ERROR).json({
      message: err,
      status: 'error'
    })
  }
}
