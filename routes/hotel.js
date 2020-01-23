const express = require('express')
const router = express.Router()
const hotelController = require('../controllers/hotel')
const upload = require('../multer')
const authGaurd = require('../util/authGaurd')
const paystack = require('paystack')(process.env.PAYSTACK)
const mongoose = require('mongoose')
const { Booking } = require('../models/booking')

router.post('/', authGaurd, upload.array('image'), hotelController.addHotel)
router.put(
  '/uploadhotelphoto/:id',
  upload.array('image'),
  hotelController.uploadhotelphoto
);
router.put("/percentage/:id", authGaurd, hotelController.increasePercentage);
router.get("/", hotelController.getHotels);
router.get("/me", authGaurd, hotelController.getCredUserhotel);
router.get("/myHotel", authGaurd, hotelController.getAuthUserHotel);
router.get("/:id", hotelController.getAhotel);
router.put("/:id", authGaurd, hotelController.updateHotel)
router.post("/verify", function(req, res) {
  paystack.transaction.verify(req.body.ref, function(error, body) {
    if (error) {
      res.json(error)
    } else {
      Booking.findOne({ referenceNumber: body.data.reference })
        .then(result => {
          if (!result) {
            const book = {
              _id: new mongoose.Types.ObjectId(),
              Room: req.body.BookingInfo.roomId,
              roomType: req.body.BookingInfo.roomType,
              author: req.userData._id,
              referenceNumber: body.data.reference,
              amount: body.data.amount,
              cancellationStatus: false,
              checkInStatus: false,
              checkOutStatus: false,
              // checkIn: req.body.checkIn,
              // checkOut: req.body.checkOut,
              createdAt: body.data.created_at,
              paidAt: body.data.paid_at,
              channel: body.data.channel,
              currency: body.data.currency,
              countryCode: body.data.authorization.country_code,
              cardType: body.data.authorization.card_type,
              customer: {
                customerId: body.data.customer.id,
                firstName: req.body.BookingInfo.firstname,
                lastName: req.body.BookingInfo.lastname,
                email: req.body.BookingInfo.email,
                phone: req.body.BookingInfo.phone,
                getDeals: req.body.BookingInfo.getdeals,
                title: req.body.BookingInfo.title,
                wantAirportShuttle: req.body.BookingInfo.wantairportshuttle
              }
            }

            result = new Booking(book)
            result.save().then(resp => {
              res.status(200).json({
                message: 'Booking successful',
                data: resp
              })
            })
          }
        })
        .catch(err => {
          console.log(err)
          res.status(httpStatus.BAD_REQUEST).json({
            error: "Incorrect Details. Fill Form with Correct Details"
          });
        })
    }
  })
})

module.exports = router
