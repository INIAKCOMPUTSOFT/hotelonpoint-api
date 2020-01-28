const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const { Contact } = require('../models/contact')
const ccAuth = require('../util/ccAuth')
const {
  BAD_REQUEST,
  OK,
  INTERNAL_SERVER_ERROR,
  PRECONDITION_FAILED
} = require('http-status-codes')

router.get('/', (req, res) => {
  res.send('Contact Us')
})
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body
  try {
    const contact = await Contact.findOne({ subject, email })
    if (contact) {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'mail already sent', status: 'error' })
    }
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hotelonpoints@gmail.com',
        pass: 'hotelonpoint.com'
      }
    })

    let mailOptions = {
      from: email, // sender address
      to: 'hotelonpoints@gmail.com', // list of receivers
      subject: subject, // Subject line
      text: `${message} - ${email}` // plain text bodyz
      // html body
    }
    // send mail with defined transport object
    await transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent: %s', info.messageId)
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
      newContact = new Contact({
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        subject,
        message
      })
      const resp = await newContact.save()
      if (resp)
        res.status(OK).json({
          status: 'success',
          data: resp
        })
    })
  } catch (err) {
    console.log(err)
    res.status(INTERNAL_SERVER_ERROR).json({
      message: err,
      status: 'error'
    })
  }
})

module.exports = router
