const mongoose = require("mongoose");
const { Admin } = require("../models/admin");
const { User } = require("../models/User");
const { Hotel } = require("../models/hotel");
const { Room } = require("../models/room");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  BAD_REQUEST,
  OK,
  INTERNAL_SERVER_ERROR,
  PRECONDITION_FAILED
} = require("http-status-codes");

exports.createAdmin = (req, res) => {
  const { email, password, isAdmin, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res
      .status(PRECONDITION_FAILED)
      .json({ message: "password must match" });
  Admin.find({ email })
    .exec()
    .then(admin => {
      if (admin.length >= 1) {
        res.status(BAD_REQUEST).json({
          message: "Admin Already exists",
          status: "error"
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              error: err
            });
          } else {
            const newAdmin = new Admin({
              _id: new mongoose.Types.ObjectId(),
              email,
              password: hash,
              isAdmin
            });
            newAdmin.save().then(resp => {
              const token = jwt.sign(
                {
                  email: resp.email,
                  _id: resp._id,
                  isAdmin: resp.isAdmin
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "2h"
                }
              );
              res.status(OK).json({
                data: token,
                status: "success"
              });
            });
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong Creating Admin user",
        data: "error"
      });
    });
};

exports.createCC = (req, res) => {
  const { email, password, isCC, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res
      .status(PRECONDITION_FAILED)
      .json({ message: "password must match" });
  Admin.find({ email })
    .exec()
    .then(admin => {
      if (admin.length >= 1) {
        res.status(BAD_REQUEST).json({
          message: "customer Care Already exists",
          status: "error"
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              error: err
            });
          } else {
            const newAdmin = new Admin({
              _id: new mongoose.Types.ObjectId(),
              email,
              password: hash,
              isAdmin: false,
              isCC
            });
            newAdmin.save().then(resp => {
              const token = jwt.sign(
                {
                  email: resp.email,
                  _id: resp._id,
                  isAdmin: resp.isCC
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "2h"
                }
              );
              res.status(OK).json({
                data: token,
                status: "success"
              });
            });
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong Creating Admin user",
        data: "error"
      });
    });
};

exports.ccLogin = (req, res) => {
  const { email, password } = req.body;
  Admin.findOne({ email })
    .exec()
    .then(admin => {
      if (!admin) {
        res.status(BAD_REQUEST).json({
          message: "No user Found Please Register",
          status: "error"
        });
      }

      bcrypt.compare(password, admin.password).then(isAdmin => {
        if (isAdmin) {
          const token = jwt.sign(
            {
              email: admin.email,
              _id: admin._id,
              isCC: admin.isCC
            },
            process.env.JWT_KEY,
            {
              expiresIn: "2h"
            }
          );
          res.status(OK).json({
            data: token,
            status: "success"
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong Creating custommer care user",
        data: "error"
      });
    });
};

exports.adminLogin = (req, res) => {
  const { email, password } = req.body;
  Admin.findOne({ email })
    .exec()
    .then(admin => {
      if (!admin) {
        res.status(BAD_REQUEST).json({
          message: "No user Found Please Register",
          status: "error"
        });
      }

      bcrypt.compare(password, admin.password).then(isAdmin => {
        if (isAdmin) {
          const token = jwt.sign(
            {
              email: admin.email,
              _id: admin._id,
              isAdmin: admin.isAdmin
            },
            process.env.JWT_KEY,
            {
              expiresIn: "2h"
            }
          );
          res.status(OK).json({
            data: token,
            status: "success"
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong Creating Admin user",
        data: "error"
      });
    });
};

exports.getAllUsers = (req, res) => {
  User.find()
    .exec()
    .then(resp => {
      res.status(OK).json({
        data: resp,
        userCount: resp.length,
        status: "success"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        message: err,
        status: "error"
      });
    });
};

exports.deleteUser = (req, res) => {
  const _id = req.params.id;
  User.deleteOne({ _id })
    .then(result => {
      if (result) {
        res
          .status(OK)
          .json({ message: "User Deleted Successfully", data: "success" });
      } else {
        throw Error;
      }
    })
    .catch(err => {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        error: err
      });
    });
};

exports.getAllHotel = async (req, res) => {
  try {
    const hotel = await Hotel.find().exec();
    if (hotel) {
      res.status(OK).json({
        data: hotel,
        hotelCount: hotel.length,
        status: "success"
      });
    }
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json({
      message: err,
      status: "error"
    });
  }
};

exports.getAHotel = async (req, res) => {
  const _id = req.params.id;
  try {
    const hotel = await Hotel.findOne({ _id }).exec();
    if (hotel) {
      const rooms = await Room.find({ hotelId: hotel._id });
      res.status(OK).json({
        Hotel: hotel,
        Room: rooms,
        RoomCount: rooms.length,
        status: "success"
      });
    }
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json({
      message: err,
      status: "error"
    });
  }
};

exports.deleteHotel = (req, res) => {
  const _id = req.params.id;
  Hotel.deleteOne({ _id })
    .then(result => {
      if (result) {
        res
          .status(OK)
          .json({ message: "Hotel Deleted Successfully", data: "success" });
      } else {
        throw Error;
      }
    })
    .catch(err => {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        error: err
      });
    });
};

exports.ApproveHotel = (req, res) => {
  const _id = req.params.id;
  Hotel.findOne({ _id })
    .then(resp => {
      if (resp.approved) {
        res.status(BAD_REQUEST).json({
          message: "Hotel Has already Been approved",
          status: "error"
        });
      }
      Hotel.updateOne({ _id }, { approved: req.body.approved }).then(result => {
        res
          .status(OK)
          .json({ message: "Hotel approved successfully", status: "success" });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        error: err
      });
    });
};

exports.suspendHotel = (req, res) => {
  const _id = req.params.id;
  Hotel.findOne({ _id })
    .then(resp => {
      if (!resp.approved) {
        res.status(BAD_REQUEST).json({
          message: "Hotel Has already Been Suspended",
          status: "error"
        });
      }
      if (req.body.approved == true || req.body.approved === true) {
        res.status(BAD_REQUEST).json({
          message: "To suspend Hotel approve must be false",
          status: "error"
        });
      }
      Hotel.updateOne({ _id }, { approved: req.body.approved }).then(result => {
        res
          .status(OK)
          .json({ message: "Hotel suspended successfully", status: "success" });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        error: err
      });
    });
};

exports.addvrtour = (req, res) => {
  const _id = req.params.id;
  Hotel.findOne({ _id })
    .then(resp => {
      if (!resp.approved) {
        res.status(BAD_REQUEST).json({
          message: "Hotel must Approved to add VR Tour",
          status: "error"
        });
      }
      Hotel.updateOne({ _id }, { vrTour: req.body.vrtour }).then(result => {
        res
          .status(OK)
          .json({ message: "Tour added successfully", status: "success" });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        error: err
      });
    });
};

exports.getAuthCCUser = async (req, res) => {
  const _id = await req.userData._id;
  try {
    const user = await Admin.findOne({ _id });
    if (user) {
      req.user = user;
      const cred = {
        _id: user._id,
        email: user.email,
        isCC: user.isCC
      };
      res.status(200).json({
        message: "User Fetch successful",
        userData: cred
      });
    } else {
      res.status(404).json({ error: "Unauthorized" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.getAuthUser = async (req, res) => {
  const _id = await req.userData._id;
  try {
    const user = await Admin.findOne({ _id });
    if (user) {
      req.user = user;
      const cred = {
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      };
      res.status(200).json({
        message: "User Fetch successful",
        userData: cred
      });
    } else {
      res.status(404).json({ error: "Unauthorized" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
