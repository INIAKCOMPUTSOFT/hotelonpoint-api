const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const httpStatus = require("http-status-codes");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { User, validate, validateLogin } = require("../models/User");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
const { validateLoginData, validateSignUpData } = require("../util/validators");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const defaultImg =
  "https://res.cloudinary.com/sapeled3/image/upload/v1575835409/bhaulju2fh4mn5y8yqa4.png";

const welcomeMessage = `<div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6rem;">
<section>
  <header
    style="min-height: 30px; background-color: #a59e83; color:#fff; padding: 1rem;"
  >
    <img
      src="https://res.cloudinary.com/sapeled3/image/upload/v1578239773/HOP_wowhhl.svg"
      alt="HotelOnPoints"
    />
  </header>
  <div style="width: 80%; margin: 0 auto;">
    <h1 style="font-weight: 500;">Welcome to HotelOnPoints.com!</h1>
    <p>
      You are now part of our prestigous hotel booking platform, and we are
      glad to have you here, We know you probably have some questions, so
      here are few resources to help you get started
    </p>

    <h2 style="font-weight: 500;">Getting Started</h2>

    <div style="background-color: #a59e83; color: #fff; padding:  8px;">
      <p>
        Your account is where you can continue registering your property,
        add new properties or make changes like bookable dates, price per
        night and more.
      </p>
      <div style=" padding: 10px 20px; border: 0px; margin-bottom: 10px;">
        <a
          href="http://hotelonpoints.com/login"
          target="_blank"
          style="background-color:  #fff; color: #7c765f; padding: 10px 20px; text-decoration: none; border: 0px; font-weight: 600; "
        >
          My Account
        </a>
      </div>
    </div>
    <br />
    <br />
    <hr />
    <div style="background-color: #ffffff; color: #7c765f; padding:  8px;">
      <p style="text-align: center;">
        <strong> HotelOnPoints </strong>
      </p>
      <address style="text-align: center;">
        Hobs Tourism, Ebony Road, Rumokuta, Port Harcourt Rivers State,
        Nigeria
      </address>
    </div>
  </div>
</section>
</div>`

exports.userSignUp = async (req, res) => {
  const { fullName, email, password, confirmPassword, isHotelOwner } = req.body;

  const data = {
    fullName,
    email,
    password,
    confirmPassword,
    isHotelOwner
  };
  const { valid, errors } = validateSignUpData(data);
  if (!valid) return res.status(400).json(errors);
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

    if (!user) {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "hotelonpoints@gmail.com",
          pass: "hotelonpoint.com"
        }
      });

      let mailOptions = {
        from: '"HotelonPoints.com" <support@hotelonpoint>', // sender address
        to: email, // list of receivers
        subject: "Welcome to Hotel on Points", // Subject line
        text: "Hello world?", // plain text body
        html: welcomeMessage
        // html body
      };
      // send mail with defined transport object
      await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
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
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "something  went wrong"
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const data = { email, password };

  const { valid, errors } = validateLoginData(data);
  if (!valid) return res.status(400).json(errors);
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
          message: "Auth Failed 1"
        });
      }
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "user does not Exist. Click the SignUp to Register"
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "something  went wrong"
    });
  }
};

exports.getAuser = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findOne({ _id }).select("-password -__v");
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
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "something  went wrong"
    });
  }
};

exports.updateProfilePic = (req, res) => {
  const _id = req.params.id;
  const file = req.files.profileImage;
  const md5 = file.md5;
  User.findOne({ _id }).then(user => {
    if (user.md5 === md5) {
      res.status(httpStatus.OK).json({
        status: "error",
        message: "Please do not uploaad the same image twice"
      });
    } else {
      cloudinary.uploader.upload(file.tempFilePath, function(err, result) {
        if (err) {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "something  went wrong"
          });
        }
        const imageUrl = result.url;
        User.updateMany(
          { _id },
          {
            $set: {
              imageUrl: imageUrl,
              md5: md5
            }
          }
        )
          .then(result =>
            res.status(httpStatus.OK).json({
              status: "success",
              message: "Profile Image update successfully"
            })
          )
          .catch(err => {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
              status: "error",
              message: "something  went wrong"
            });
          });
      });
    }
  });
};

exports.updateDetails = (req, res) => {
  const _id = req.userData._id;
  const updateOps = {};

  for (const Ops of req.body) {
    updateOps[Ops.propName] = Ops.value;
  }
  User.updateOne(
    { _id },
    {
      $set: updateOps
    }
  )
    .then(result =>
      res
        .status(httpStatus.OK)
        .json({ status: "success", message: "Details update successfully" })
    )
    .catch(err => {
      console.log(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "something  went wrong"
      });
    });
};

exports.getAuthUser = async (req, res) => {
  const user = await req.userData._id;
  await User.findOne({ _id: user })
    .exec()
    .then(user => {
      if (user) {
        const cred = {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          imageUrl: user.imageUrl
        };
        req.user = user;
        res.status(200).json({
          message: "User Fetch successful",
          userData: cred
        });
      } else {
        res.status(404).json({ error: "Unauthorized" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.checkValidUser = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(httpStatus.BAD_REQUEST).json({
        message:
          "Email not Recognized, check the email and try again.. / Register",
        status: "error"
      });
    } else {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "hotelonpoints@gmail.com",
          pass: "hotelonpoint.com"
        }
      });
      let mailOptions = {
        from: '"HotelonPoint.com" <support@hotelonpoint>', // sender address
        to: email, // list of receivers
        subject: "Reset Password Request", // Subject line
        text: "Hello world?", // plain text body
        html: `
          <h1>HotelOnPoints.com</h1> <br />
          <p>Reset your Password with this Link</p> <br />
          <a href='https://www.hotelonpoints.com/passverification/${user._id}'>Reset Password</a>
          `
        // html body
      };
      // send mail with defined transport object
      await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return res.status(httpStatus.OK).json({
          data: "A Link to Reset Password has Been sent to this email",
          status: "success"
        });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ error: err });
  }
};

exports.changePassword = async (req, res) => {
  const _id = req.params.id;
  const { password, confirmPassword } = req.body;
  try {
    const user = await User.findOne({ _id });
    if (!user) {
      res.status(httpStatus.BAD_REQUEST).json({
        message: "Resend password Reset Link.. to get a valid link",
        status: "error"
      });
    } else {
      if (password !== confirmPassword) {
        res.status(httpStatus.BAD_REQUEST).json({
          message: "Passwords Must match",
          status: "error"
        });
      }
      const very = await bcrypt.compare(password, user.password);
      if (very) {
        res.status(httpStatus.BAD_REQUEST).json({
          message: "You Cannot use your Old Password",
          status: "error"
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await User.updateOne({ _id }, { password: hash });
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "hotelonpoints@gmail.com",
            pass: "hotelonpoint.com"
          }
        });
        let mailOptions = {
          from: '"HotelonPoint.com" <support@hotelonpoint>', // sender address
          to: user.email, // list of receivers
          subject: "Passsword Reset Successful", // Subject line
          text: "Hello world?", // plain text body
          html: `
          <h1>HotelOnPoints.com</h1> <br />
          <p>Password Reset was successful</p>
          <a href='https://www.hotelonpoints.com/login'>Login</a> <br />
          <p>To access all our awesome services</p>
          `
          // html body
        };
        // send mail with defined transport object
        await transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

          return res.status(httpStatus.OK).json({
            data: "Password Reset Successful",
            status: "success"
          });
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ error: err });
  }
};
