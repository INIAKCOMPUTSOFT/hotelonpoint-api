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
      res.status(OK).json({
        data: room,
        status: "Success"
      });
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

            prop = new Hotel({
              _id: new mongoose.Types.ObjectId(),
            //   author: req.userData._id,
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
              imageUrl: urls
            });

            console.log('123', JSON.parse(moreAmenities))
            moreAmenities.map(res => console.log('1', res))
            if (!Array.isArray(moreAmenities)) {
                console.log('here')
              prop.moreAmenities.push(moreAmenities);
            } else {
                console.log('got')
              moreAmenities.forEach(concat => {
                prop.moreAmenities.push(concat);
              });
            }
            console.log('456', roomAmenities)
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
          console.log(err);
          res.status(INTERNAL_SERVER_ERROR).json({ error: err });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Something went wrong."
      });
    });
};

exports.updateRoom = async (req, res) => {
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
    const _id = req.params.id
    await Room.findOne({ _id }).then(room => {
        if(req.userData._id === room.author){
            console.log('got here')
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


            room.save().then(stor => {
                res.status(200).json(stor)
            })
        } else {
            res.status(401).json({message : 'unAuthorized access'}) 
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
}

exports.getAroom = async (req, res) => {
    try {
      const _id = req.params.id;
      const hotel = await Room.findOne({ _id })
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