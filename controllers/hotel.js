const mongoose = require("mongoose");
const httpStatus = require("http-status-codes");
const { Hotel } = require("../models/hotel");
const fs = require('fs')
const cloudinary = require('../cloudinary')

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
  } = req.body;
  Hotel.find({ "property.propName": propName }).then(prop => {
    if (prop.length >= 1) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        message: "Property already exists"
      });
    } else {
      const uploader = async path => await cloudinary.uploads(path, "Images");
        if (req.method === "POST") {
            const urls = [];
            const files = req.files;
            for (const file of files) {
              const { path } = file;
              const newPath = await uploader(path);
      
              urls.push(newPath);
              fs.unlinkSync(path);
            }
            
            prop = new Hotel({
              _id: new mongoose.Types.ObjectId(),
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
              author: req.userData._id,
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
              },
              image: urls
            });
            contact.forEach(concat => {
              prop.contact.push(concat);
            });
            rooms.forEach(concat => {
              prop.rooms.push(concat);
            });
      
            prop
              .save()
              .then(resp => {
                return res.status(httpStatus.OK).json({
                  status: "success",
                  data: resp
                });
              })
              .catch(err => {
                console.log(err);
              })
        } else {
          res.status(405).json({
            err: "images not uploaded successfully"
          });
        }
    }
  }).catch(err => {
      console.log(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
    })
}


exports.getHotels = async (req, res) => {
  try {
    const hotel = await Hotel.find().populate('author');
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
};

exports.getAhotel = async (req, res) => {
  try {
    const _id = req.params.id;
    const hotel = await Hotel.findOne({ _id }).populate('author')
    if (hotel) {
      return res.status(httpStatus.OK).json({
        status: "succes",
        data: hotel
      });
    }
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "invalid/nonExistant id"
    });
  } catch (err) {
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "something  went wrong"
    });
  }
};


