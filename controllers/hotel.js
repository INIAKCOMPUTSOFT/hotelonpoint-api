const mongoose = require('mongoose')
const httpStatus = require('http-status-codes')
const { Hotel } = require('../models/hotel')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

exports.addHotel = (req, res) => {
    const {
        propName,
        starRating,
        roomNumbers,
        propWebsite,
        contact,
        conNumber,
        email,
        isChainComp,
        compName,
        country,
        state,
        city,
        address,
        zipCode,
        mapLocation,
        isBreakfastAvailable,
        repApproach,
        BreakfastCharge,
        isShuttleAvailable,
        shuttleCharge,
        hotelAmenities,
        rooms,
        freeCancellationPeriod,
        paidCancellation,
        checkIn,
        checkOut,
        accomodateChild,
        accomodatePet
    } = req.body
    Hotel.find({ "property.propName" : propName})
    .then(prop => {
        if(prop[0]){
            return res.status(httpStatus.BAD_REQUEST).json({
                status: "error",
                message: "Property already exists"
            })
        } else {
            const file = req.files.imageUrl
            cloudinary.uploader.upload(file.tempFilePath, function(err, result) {
                if(err){
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                      status: "error",
                      message: "something  went wrong"
                    });
                  }
                  const imageUrl = result.url
                  const prop = new Hotel({
                      _id: new mongoose.Types.ObjectId(),
                      imageUrl,
                      property: {
                          propName,
                          starRating,
                          roomNumbers,
                          propWebsite
                      },
                      location: { 
                          country,
                          state,
                          city,
                          address,
                          zipCode,
                          mapLocation
                      },
                      repApproach,
                      hotelAmen: {
                          isBreakfastAvailable,
                          BreakfastCharge,
                          isShuttleAvailable,
                          shuttleCharge,
                          hotelAmenities
                      },
                      cancellation: {
                          freeCancellationPeriod,
                          paidCancellation,
                          checkIn,
                          checkOut,
                          accomodateChild,
                          accomodatePet
                      }
                  })
                contact.forEach(concat => {
                    prop.contact.push(concat)
                })
                rooms.forEach(concat => {
                    prop.rooms.push(concat)
                })
    
                prop.save().then(resp => {
                    return res.status(httpStatus.OK).json({
                        status: "success",
                        data: resp
                    })
                }).catch(err => {
                    console.log(err)
                })
            })
    
        }
    }).catch(err => {
        console.log('1', err)
    })
            
}

exports.getHotels = async (req, res) => {
    try {
        const hotel = await Hotel.find()
        if (hotel) {
          return res.status(httpStatus.OK).json({
            status: "succes",
            HotelCount: hotel.length,
            data: hotel
          });
        } else {
          return res.status(httpStatus.BAD_REQUEST).json({
            message: "no user Found"
          });
        }
      } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "something  went wrong"
        });
      }
    
}

exports.getAhotel = async (req, res) => {
    try {
        const _id = req.params.id;
        const hotel = await Hotel.findOne({ _id })
        if (hotel) {
          return res.status(httpStatus.OK).json({
            status: "succes",
            data: hotel
          });
        } else {
          return res.status(httpStatus.BAD_REQUEST).json({
            message: "invalid/nonExistant id"
          });
        }
      } catch (err) {
        console.log(err)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "something  went wrong"
        });
      }
}