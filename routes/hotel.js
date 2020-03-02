const express = require('express')
const router = express.Router()
const hotelController = require('../controllers/hotel')
const upload = require('../multer')
const { Room } = require('../models/room')
const { Hotel } = require('../models/hotel')
const { User } = require('../models/User')
const authGaurd = require('../util/authGaurd')
const paystack = require('paystack')(process.env.PAYSTACK)
const mongoose = require('mongoose')
const { Booking } = require('../models/booking')


const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const { bookingMail, bookingMail2 } = require('../template/welcomeMail')

router.post('/', authGaurd, upload.array('image'), hotelController.addHotel)
router.put(
  '/uploadhotelphoto/:id',
  upload.array('image'),
  hotelController.uploadhotelphoto
)
router.put('/percentage/:id', authGaurd, hotelController.increasePercentage)
router.get('/', hotelController.getHotels)
router.get('/me', authGaurd, hotelController.getCredUserhotel)
router.get('/myHotel', authGaurd, hotelController.getAuthUserHotel)
router.get('/:id', hotelController.getAhotel)
router.put('/:id', authGaurd, hotelController.updateHotel)
router.post('/verify', function (req, res) {
  const defaultImg =
  "https://res.cloudinary.com/sapeled3/image/upload/v1575835409/bhaulju2fh4mn5y8yqa4.png";
  paystack.transaction.verify(req.body.ref, async function (error, body) {
    if (body === null) {
      res.status(500).json({
        message: 'failed paystack gateway'
      })
    }
    if (error) {
      res.json(error)
    } else {
      const room = await Room.findOne({ _id: req.body.BookingInfo.roomId })
      const hotel = await Hotel.findOne({ _id: room.hotelId })
      Booking.findOne({ referenceNumber: body.data.reference })
        .then(async result => {
          const user = await User.findOne({ email: req.body.BookingInfo.email })
          if (!user) {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash('123456', salt)
            newUser = new User({
              _id: new mongoose.Types.ObjectId(),
              fullName: `${req.body.BookingInfo.firstname} ${req.body.BookingInfo.lastname}`,
              email: req.body.BookingInfo.email,
              password: hash,
              imageUrl: defaultImg,
              isHotelOwner: false
            })
            await newUser.save()
            const book = {
              _id: new mongoose.Types.ObjectId(),
              Room: req.body.BookingInfo.roomId,
              hotelId: room.hotelId,
              hotelName: hotel.propertyInfo.hotelName,
              roomType: req.body.BookingInfo.roomType,
              author: req.body.userId,
              referenceNumber: body.data.reference,
              amount: body.data.amount,
              cancellationStatus: false,
              checkInStatus: false,
              checkOutStatus: false,
              checkIn: req.body.BookingInfo.checkin,
              checkOut: req.body.BookingInfo.checkout,
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
              },
              currentPercentage: hotel.percentageValue,
              paymentMethod: req.body.BookingInfo.paymentMethod,
              paymentStatus: true,
              confirmBooking: false,
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
                  to: req.body.BookingInfo.email, // list of receivers
                  subject: 'Booking on Hotel-on-points', // Subject line
                  text: 'Hello?', // plain text body
                  html: bookingMail2(
                    req.body.BookingInfo.email,
                    body.data.reference,
                    req.body.BookingInfo.firstname,
                    req.body.BookingInfo.lastname,
                    req.body.BookingInfo.checkin,
                    req.body.BookingInfo.checkout,
                    req.body.BookingInfo.paymentMethod,
                    body.data.paid_at,
                    hotel.propertyInfo.hotelName,
                    hotel.managementDetails.frontDeskPhoneOne,
                    req.body.BookingInfo.roomType,
                    body.data.amount
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
                  console.log(
                    'Preview URL: %s',
                    nodemailer.getTestMessageUrl(info)
                  )
                  return res.status(200).json({
                    status: 'success',
                    message: resp
                  })
                })
              }
            })
          }
          if (!result) {
            const book = {
              _id: new mongoose.Types.ObjectId(),
              Room: req.body.BookingInfo.roomId,
              hotelId: room.hotelId,
              hotelName: hotel.propertyInfo.hotelName,
              roomType: req.body.BookingInfo.roomType,
              author: req.body.userId,
              referenceNumber: body.data.reference,
              amount: body.data.amount,
              cancellationStatus: false,
              checkInStatus: false,
              checkOutStatus: false,
              checkIn: req.body.BookingInfo.checkin,
              checkOut: req.body.BookingInfo.checkout,
              createdAt: body.data.created_at,
              paidAt: body.data.paid_at,
              channel: body.data.channel,
              currency: body.data.currency,
              countryCode: body.data.authorization.country_code,
              cardType: body.data.authorization.card_type,
              customer: {
                firstName: req.body.BookingInfo.firstname,
                lastName: req.body.BookingInfo.lastname,
                email: req.body.BookingInfo.email,
                phone: req.body.BookingInfo.phone,
                getDeals: req.body.BookingInfo.getdeals,
                title: req.body.BookingInfo.title,
                wantAirportShuttle: req.body.BookingInfo.wantairportshuttle
              },
              currentPercentage: hotel.percentageValue,
              paymentMethod: req.body.BookingInfo.paymentMethod,
              paymentStatus: true,
              confirmBooking: false,
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
                  to: req.body.BookingInfo.email, // list of receivers
                  subject: 'Booking on Hotel-on-points', // Subject line
                  text: 'Hello?', // plain text body
                  html: bookingMail(
                    req.body.BookingInfo.email,
                    body.data.reference,
                    req.body.BookingInfo.firstname,
                    req.body.BookingInfo.lastname,
                    req.body.BookingInfo.checkin,
                    req.body.BookingInfo.checkout,
                    req.body.BookingInfo.paymentMethod,
                    body.data.paid_at,
                    hotel.propertyInfo.hotelName,
                    hotel.managementDetails.frontDeskPhoneOne,
                    req.body.BookingInfo.roomType,
                    body.data.amount
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
                  console.log(
                    'Preview URL: %s',
                    nodemailer.getTestMessageUrl(info)
                  )
                  return res.status(200).json({
                    status: 'success',
                    message: resp
                  })
                })
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
          res.status(httpStatus.BAD_REQUEST).json({
            error: 'Incorrect Details. Fill Form with Correct Details'
          })
        })
    }
  })
})

module.exports = router
