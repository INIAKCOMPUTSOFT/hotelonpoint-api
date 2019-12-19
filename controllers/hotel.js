const mongoose = require("mongoose");
const httpStatus = require("http-status-codes");
const { Hotel } = require("../models/hotel");
const fs = require("fs");
const cloudinary = require("../cloudinary");

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
    checkIn,
    checkOut,
    freeBooking,
    paidBooking,
    otherPaymentMethod,
    moreHotelAmenities
  } = req.body;

  Hotel.find({ "property.hotelName": hotelName })
    .then(async prop => {
      if (prop.length >= 1) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Property already exists"
        });
      }
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
            smokingPolicy,
            paymentMethod,
            hotelAmenities,
            checkIn,
            checkOut,
            freeBooking,
            paidBooking,
            otherPaymentMethod,
            moreHotelAmenities
          },
          approved: false
        });
        if (!Array.isArray(moreHotelPolicies)) {
          prop.hotelPolicy.moreHotelPolicies.push(moreHotelPolicies);
        } else {
          moreHotelPolicies.forEach(concat => {
            prop.hotelPolicy.moreHotelPolicies.push(concat);
          });
        }
        if (!Array.isArray(rooms)) {
          prop.rooms.push(rooms);
        } else {
          rooms.forEach(concat => {
            prop.rooms.push(concat);
          });
        }
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
          });
      } else {
        res.status(405).json({
          err: "images not uploaded successfully"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
    });
};

exports.getHotels = async (req, res) => {
  try {
    const hotel = await Hotel.find().populate("author");
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
    const hotel = await Hotel.findOne({ _id }).populate("author");
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
