const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const httpStatus = require("http-status-codes");
const bcrypt = require("bcryptjs");
const { User, validate, validateLogin } = require("../models/User");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const defaultImg = 'http://res.cloudinary.com/sapeled3/image/upload/v1575835409/bhaulju2fh4mn5y8yqa4.png'

exports.userSignUp = async (req, res) => {
    const {
        fullName,
        email,
        password,
        confirmPassword,
        isHotelOwner
      } = req.body;

      const { error } = validate({
        fullName,
        email,
        password,
      });
      if (error)
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: error.details[0].message });
      if (password !== confirmPassword)
        return res
          .status(httpStatus.PRECONDITION_FAILED)
          .json({ message: "password must match" });
      try {
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user)
          return res
            .status(httpStatus.CONFLICT)
            .json({ status: "error", message: "user already registered." });
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        user = new User({
            _id: new mongoose.Types.ObjectId(),
            fullName,
            email: email.toLowerCase(),
            password: hash,
            imageUrl: defaultImg,
            isHotelOwner
        });
        const userDetails = await user.save();
        const token = jwt.sign(
          {
            email: userDetails.email,
            _id: userDetails._id
          },
          process.env.JWT_KEY,
          {
            expiresIn: "2h"
          }
        
        );
        return res.status(httpStatus.OK).json({
          status: "success",
          message: token
        });
      } catch (error) {
          console.log(error)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "something  went wrong"
        });
      }
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { error } = validateLogin({ email, password });
  if (error)
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: error.details[0].message });
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      const very = await bcrypt.compare(password, user.password);
      if (very) {
        const token = jwt.sign(
          {
            email: user.email,
            _id: user._id
          },
          process.env.JWT_KEY,
          {
            expiresIn: "2h"
          }
        );
        return res.status(httpStatus.OK).json({
          status: "succes",
          message: token
        });
      } else {
        return res.status(httpStatus.BAD_REQUEST).json({
          message: "Auth Failed"
        });
      }
    }
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Auth Failed"
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "something  went wrong"
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find()
    if (users) {
      return res.status(httpStatus.OK).json({
        status: "succes",
        usersCount: users.length,
        data: users
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

exports.getAuser = async(req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findOne({ _id })
    if (user) {
      return res.status(httpStatus.OK).json({
        status: "succes",
        data: user
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

exports.updateProfilePic = (req, res) => {
  const _id = req.params.id;
  const file = req.files.profileImage
  const md5 = file.md5
  User.findOne({_id}).then(user => {
    if(user.md5 === md5){
      res.status(httpStatus.OK).json({status: "error", message: "Please do not uploaad the same image twice"})
    }else {
      cloudinary.uploader.upload(file.tempFilePath, function(err, result) {
        if(err){
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "something  went wrong"
          });
        }
        const imageUrl = result.url
        User.updateMany({ _id },{
          $set: { 
            imageUrl: imageUrl,
            md5: md5
          }
        })
        .then(result =>
          res.status(httpStatus.OK).json({status: "success", message: "Profile Image update successfully"})
        ).catch(err => {
          console.log(err)
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "something  went wrong"
          });
        }) 
      })
    }
  })
}

exports.updateDetails = (req, res) => {
  const _id = req.params.id
    const updateOps = {}

    for (const Ops of req.body){
        updateOps[Ops.propName] = Ops.value
    }
    User.updateMany({ _id },{
      $set: updateOps
    })
    .then(result =>
      res.status(httpStatus.OK).json({status: "success", message: "Details update successfully"})
    ).catch(err => {
      console.log(err)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "something  went wrong"
      });
    }) 
}

exports.getAuthUser = async(req, res) => {
  const user = await req.userData._id
    console.log('owner',req.user)
    await User.findOne({ _id : user}).exec()
    .then(user => {
        if(user){
            req.user = user
            res.status(200).json({
                message: 'User Fetch successful',
                userData: user
            })
        } else {
            res.status(404).json({error: 'Unauthorized'})
        }
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
}