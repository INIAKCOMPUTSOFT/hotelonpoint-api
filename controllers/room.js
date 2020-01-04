const mongoose = require("mongoose");
const { Room } = require("../models/room");
const { Hotel } = require("../models/hotel");
const fs = require("fs");
const cloudinary = require("../cloudinary");
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require("http-status-codes");

exports.getAllRooms = (req, res) => {
  const id = req.params.hotelId;
  Room.find()
    .exec()
    .then(room => {
      if (!room) {
        res.status(BAD_REQUEST).json({
          message: "Room Not Found",
          status: "error"
        });
      }
      const rooms = room.filter(hotel => hotel.hotelId == id);
      if (rooms.length >= 1) {
        res.status(OK).json({
          data: rooms,
          status: "Success"
        });
      } else {
        res.status(BAD_REQUEST).json({
          data: "No Hotel Uploaded Yet",
          status: "error"
        });
      }
    });
};

exports.AddNewRoom = (req, res) => {
  const _id = req.params.hotelId;
  const {
    roomType,
    smokingPolicy,
    roomSize,
    roomsOfThisType,
    bedType,
    bedNumber,
    weekendRate,
    standardRate,
    occupantNumber,
    roomPrice,
    roomAmenities,
    moreAmenities
  } = req.body;

  Hotel.findOne({ _id })
    .then(hotel => {
      if (!hotel) {
        return res.status(BAD_REQUEST).json({
          status: "error",
          message: "Hotel Does Not Exist. please Create Hotel"
        });
      }
      Room.find({ roomType: roomType })
        .then(async prop => {
          if (prop.length >= 1) {
            return res.status(httpStatus.BAD_REQUEST).json({
              status: "error",
              message: "Room already exists"
            });
          }
          const uploader = async path =>
            await cloudinary.uploads(path, "Images");
          if (req.method === "POST") {
            const urls = [];
            const files = req.files;

            for (const file of files) {
              const { path } = file;
              const newPath = await uploader(path);

              urls.push(newPath);
              fs.unlinkSync(path);
            }

            prop = new Room({
              _id: new mongoose.Types.ObjectId(),
              author: req.userData._id,
              roomType,
              hotelId: _id,
              smokingPolicy,
              roomSize,
              roomsOfThisType,
              bedType,
              bedNumber,
              weekendRate,
              standardRate,
              occupantNumber,
              roomPrice,
              imageUrl: urls,
              noOfOccupiedRooms: 0
            });
            if (moreAmenities !== undefined) {
              if (!Array.isArray(moreAmenities)) {
                console.log("here");
                prop.moreAmenities.push(moreAmenities);
              } else {
                console.log("got");
                moreAmenities.forEach(concat => {
                  prop.moreAmenities.push(concat);
                });
              }
            }

            if (!Array.isArray(roomAmenities)) {
              prop.roomAmenities.push(roomAmenities);
            } else {
              roomAmenities.forEach(concat => {
                prop.roomAmenities.push(concat);
              });
            }
            prop
              .save()
              .then(resp => {
                return res.status(OK).json({
                  status: "success",
                  data: resp
                });
              })
              .catch(err => {
                console.log(err);
                res.status(BAD_REQUEST).json({
                  error: "Incorrect Details. Fill Form with Correct Details"
                });
              });
          } else {
            res.status(405).json({
              err: "images not uploaded successfully"
            });
          }
        })
        .catch(err => {
          res.status(INTERNAL_SERVER_ERROR).json({ error: err });
        });
    })
    .catch(err => {
      res.status(INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Something went wrong."
      });
    });
};

exports.updateRoom = async (req, res) => {
  const _id = req.params.id;
  const updateOps = {};
  for (const Ops of req.body) {
    updateOps[Ops.propName] = Ops.value;
  }
  await Room.findOne({ _id }).then(async room => {
    if (req.userData._id == room.author) {
      await Room.update({ _id }, { $set: updateOps })
        .then(room => {
          res.status(200).json(room);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    } else {
      res.status(401).json({ message: "unAuthorized access" });
    }
  });
};

exports.getAroom = async (req, res) => {
  try {
    const _id = req.params.id;
    const hotel = await Room.findOne({ _id });
    console.log(hotel);
    if (hotel) {
      return res.status(OK).json({
        status: "succes",
        data: hotel
      });
    }
    return res.status(BAD_REQUEST).json({
      message: "invalid/nonExistant id"
    });
  } catch (err) {
    console.log(err);
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "something  went wrong"
    });
  }
};

exports.deleteRoom = (req, res) => {
  const _id = req.params.id;
  Room.deleteOne({ _id })
    .then(result => {
      res
        .status(OK)
        .json({ message: "Room Deleted Successfully", data: "success" });
    })
    .catch(err => {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        error: err
      });
    });
};
