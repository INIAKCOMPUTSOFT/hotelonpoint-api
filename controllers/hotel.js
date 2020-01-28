const mongoose = require('mongoose')
const httpStatus = require('http-status-codes')
const { Hotel } = require('../models/hotel')
const { Room } = require('../models/room')
const fs = require('fs')
const cloudinary = require('../cloudinary')

exports.addHotel = (req, res) => {
  const {
    hotelName,
    hotelWebsite,
    starRating,
    country,
    state,
    rooms,
    city,
    zipCode,
    isPropertyGroup,
    compName,
    hotelDescription,
    moreHotelPolicies,
    propertyOwner,
    propertyOwnerPhoneOne,
    propertyOwnerPhoneTwo,
    propOwnerEmail,
    frontDesk,
    frontDeskPhoneOne,
    frontDeskPhoneTwo,
    frontDeskOwnerEmail,
    headOfReservationOne,
    headOfReservationPhoneOne,
    headOfReservationPhoneTwo,
    headOfReservationOneEmail,
    headOfReservationTwo,
    headOfReservationTwoPhoneOne,
    headOfReservationTwoPhoneTwo,
    headOfReservationTwoEmail,
    headOfOperationOne,
    headOfOperationPhoneOne,
    headOfOperationPhoneTwo,
    headOfOperationOneEmail,
    headOfOperationTwo,
    headOfOperationTwoPhoneOne,
    headOfOperationTwoPhoneTwo,
    headOfOperationTwoEmail,
    smokingPolicy,
    repApproach,
    paymentMethod,
    hotelAmenities,
    isBreakfastAvailable,
    breakfastPrice,
    contractName,
    confirmRecipientAddress,
    recipientCountry,
    recipientState,
    recipientCity,
    recipientZipCode,
    confirmAgreement,
    isShuttleAvailable,
    shuttlePrice,
    checkIn,
    checkOut,
    freeBooking,
    paidBooking,
    otherPaymentMethod,
    moreHotelAmenities,
    registerName,
    registerPhone,
    registerAddress
  } = req.body

  Hotel.find({ 'property.hotelName': hotelName })
    .then(async prop => {
      if (prop.length >= 1) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: 'error',
          message: 'Property already exists'
        })
      }
      const uploader = async path => await cloudinary.uploads(path, 'Images')
      if (req.method === 'POST') {
        const urls = []
        const files = req.files

        for (const file of files) {
          const { path } = file
          const newPath = await uploader(path)

          urls.push(newPath)
          fs.unlinkSync(path)
        }

        prop = new Hotel({
          _id: new mongoose.Types.ObjectId(),
          propertyInfo: {
            hotelName,
            hotelWebsite,
            starRating,
            country,
            state,
            city,
            zipCode,
            isPropertyGroup,
            compName,
            hotelDescription
          },
          author: req.userData._id,
          imagerUrl: urls,
          managementDetails: {
            propertyOwner,
            propertyOwnerPhoneOne,
            propertyOwnerPhoneTwo,
            propOwnerEmail,
            frontDesk,
            frontDeskPhoneOne,
            frontDeskPhoneTwo,
            frontDeskOwnerEmail,
            headOfReservationOne,
            headOfReservationPhoneOne,
            headOfReservationPhoneTwo,
            headOfReservationOneEmail,
            headOfReservationTwo,
            headOfReservationTwoPhoneOne,
            headOfReservationTwoPhoneTwo,
            headOfReservationTwoEmail,
            headOfOperationOne,
            headOfOperationPhoneOne,
            headOfOperationPhoneTwo,
            headOfOperationOneEmail,
            headOfOperationTwo,
            headOfOperationTwoPhoneOne,
            headOfOperationTwoPhoneTwo,
            headOfOperationTwoEmail
          },
          repApproach,
          hotelPolicy: {
            isBreakfastAvailable,
            breakfastPrice,
            paymentMethod,
            hotelAmenities,
            checkIn,
            checkOut,
            freeBooking,
            paidBooking,
            otherPaymentMethod,
            moreHotelAmenities,
            isShuttleAvailable,
            shuttlePrice
          },
          termsAndConditions: {
            contractName,
            confirmRecipientAddress,
            recipientCountry,
            recipientState,
            recipientCity,
            recipientZipCode,
            confirmAgreement
          },
          registerName,
          registerPhone,
          registerAddress,
          percentageValue: 10,
          approved: false
        })
        if (!Array.isArray(moreHotelPolicies)) {
          prop.hotelPolicy.moreHotelPolicies.push(moreHotelPolicies)
        } else {
          moreHotelPolicies.forEach(concat => {
            prop.hotelPolicy.moreHotelPolicies.push(concat)
          })
        }
        prop
          .save()
          .then(resp => {
            return res.status(httpStatus.OK).json({
              status: 'success',
              data: resp
            })
          })
          .catch(err => {
            console.log(err)
            res.status(httpStatus.BAD_REQUEST).json({
              error: 'Incorrect Details. Fill Form with Correct Details'
            })
          })
      } else {
        res.status(405).json({
          err: 'images not uploaded successfully'
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err })
    })
}

exports.updateHotel = async (req, res) => {
  const _id = req.params.id
  const updateOps = {}
  for (const Ops of req.body) {
    updateOps[Ops.propName] = Ops.value
  }
  await Hotel.findOne({ _id }).then(async room => {
    if (req.userData._id == room.author) {
      await Room.update({ _id }, { $set: updateOps })
        .then(room => {
          res.status(200).json(room)
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({ error: err })
        })
    } else {
      res.status(401).json({ message: 'unAuthorized access' })
    }
  })
}

exports.getHotels = async (req, res) => {
  const casa = []
  try {
    const hotel = await Hotel.find().populate(
      'author',
      'fullName imageUrl email -_id'
    )
    if (hotel) {
      hotel.forEach(async hot => {
        const roomsPrice = []
        const rooms = await Room.find({ hotelId: hot._id })
        rooms.forEach(ro => {
          roomsPrice.push(ro.roomPrice)
        })
        var totalSum = 0
        for (var i in roomsPrice) {
          totalSum += roomsPrice[i]
        }
        var numsCnt = roomsPrice.length

        //Finally, get the average.
        var average = totalSum / numsCnt
        await Hotel.updateOne({ _id : hot._id }, { averagePrice: average })
      })
      const hotelss = await Hotel.find().populate(
        'author',
        'fullName imageUrl email -_id'
      )
      return res.status(httpStatus.OK).json({
        status: 'succes',
        HotelCount: hotel.length,
        data: hotelss
      })
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'no user Found'
      })
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'something  went wrong'
    })
  }
}

exports.getCredUserhotel = async (req, res) => {
  try {
    const hotel = await Hotel.find().populate(
      'author',
      'fullName imageUrl email -_id'
    )
    const approved = []
    const unApproved = []
    hotel.forEach(res => {
      if (res.author.email === req.userData.email) {
        if (res.approved) {
          approved.push(res)
        } else {
          unApproved.push(res)
        }
      }
    })

    res.status(200).json({
      status: 'success',
      approved: {
        approvedCount: approved.length,
        approved
      },
      unApproved: {
        unApprovedCount: unApproved.length,
        unApproved
      }
    })
  } catch (err) {
    console.log(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'something  went wrong'
    })
  }
}

exports.getAhotel = async (req, res) => {
  try {
    const _id = req.params.id
    const hotel = await Hotel.findOne({ _id }).populate(
      'author',
      'fullName imageUrl email -_id'
    )
    const room = await Room.find({ hotelId: _id })
    console.log(room)
    if (hotel) {
      return res.status(httpStatus.OK).json({
        status: 'succes',
        data: {
          hotel,
          roomCount: room.length,
          room
        }
      })
    }
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'invalid/nonExistant id'
    })
  } catch (err) {
    console.log(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'something  went wrong'
    })
  }
}

exports.getAuthUserHotel = async (req, res) => {
  const user = await req.userData._id
  try {
    const hotel = await Hotel.find()
    const hotels = []
    hotel.map(hot => {
      if (hot.author == user) {
        hotels.push(hot)
      }
    })
    if (hotels.length >= 1) {
      res.json({ hotels })
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'user is yet to upload a Hotel'
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'something  went wrong'
    })
  }
}

exports.uploadhotelphoto = (req, res) => {
  const _id = req.params.id
  Hotel.findOne({ _id })
    .then(async prop => {
      if (!prop) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: 'error',
          message: 'Property doesnt exists'
        })
      }
      const uploader = async path => await cloudinary.uploads(path, 'Images')
      if (req.method === 'PUT') {
        const urls = []
        const files = req.files

        for (const file of files) {
          const { path } = file
          const newPath = await uploader(path)

          urls.push(newPath)
          fs.unlinkSync(path)
        }

        Hotel.updateOne({ _id }, { imagerUrl: urls })
          .then(resul => {
            console.log(resul)
            return res.status({
              message: 'image uploaded successfully'
            })
          })
          .catch(err => {
            console.log(err)
            res.status(httpStatus.BAD_REQUEST).json({
              error: 'Incorrect Details. Fill Form with Correct Details'
            })
          })
      } else {
        res.status(405).json({
          err: 'images not uploaded successfully'
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err })
    })
}

exports.increasePercentage = (req, res) => {
  const _id = req.params.id
  Hotel.findOne({ _id })
    .then(resp => {
      if (!resp) {
        res.status(httpStatus.BAD_REQUEST).json({
          message: 'Hotel Does not exist',
          status: 'error'
        })
      }
      Hotel.updateOne(
        { _id },
        { percentageValue: req.body.percentageValue }
      ).then(result => {
        res.status(httpStatus.OK).json({
          message: 'Percentage increased successfully successfully',
          status: 'success'
        })
      })
    })
    .catch(err => {
      console.log(err)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: err
      })
    })
}
