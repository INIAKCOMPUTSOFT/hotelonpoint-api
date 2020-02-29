const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const { mail1 }  = require('./template/welcomeMail')
const app = express()
var moment = require('moment-timezone');



//for mailing and text with conditional texting
const nodemailer = require('nodemailer')
const Nexmo = require('nexmo')
const cron = require('node-cron');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))
dotenv.config()

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET
})

const mongo = process.env.MONGODB_URI

mongoose
  .connect(mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MoongoDB Connected successfully'))
  .catch(err => console.log(err))

const userRouter = require('./routes/user')
const hotelRouter = require('./routes/hotel')
const blogRouter = require('./routes/blog')
const roomRouter = require('./routes/room')
const adminRouter = require('./routes/admin')
const bookingRouter = require('./routes/booking')
const reviewRouter = require('./routes/review')
const contactRouter = require('./routes/contact')
const commentRouter = require('./routes/comment')


app.get('/', (req, res) => res.send('Welcome to HotelOnPoint-API'))
app.use('/user', userRouter)
app.use('/hotel', hotelRouter)
app.use('/blog', blogRouter)
app.use('/room', roomRouter)
app.use('/admin', adminRouter)
app.use('/booking', bookingRouter)
app.use('/review', reviewRouter)
app.use('/contactus', contactRouter)
app.use('/comment', commentRouter)
app.get('/mail/text', async (req, res) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hotelonpoints@gmail.com',
        pass: 'hotelonpoint.com'
      }
    })

    let mailOptions = {
      from: '"HotelonPoints.com" <support@hotelonpoint>', // sender address
      to: 'oyinkuromosesvictor@gmail.com', // list of receivers
      subject: 'Welcome to Hotel on Points', // Subject line
      text: 'Hello world?', // plain text body
      html: mail1('sapele'),
      attachments: [{
        filename: 'logo',
        path: 'https://www.hotelonpoints.com/static/media/HOP.0b1ab4c8.svg',
        cid: 'logo' //same cid value as in the html img src
    }]
      // html body
    }
    // send mail with defined transport object
    await transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent: %s', info.messageId)
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
      return res.status(200).json({
        status: 'success',
        message: 'Mail sent successfully'
      })
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Something went wrong'
    })
  }
})

const time = new Date()

var add_minutes =  function (dt, minutes) {
  if(minutes == 0) {
    return dt;
  }
  return new Date(dt.getTime() + minutes*60000);
}

const date = add_minutes(time, 1)
console.log(date);

var task = cron.schedule('06 02 * * *', () =>  {
  console.log('cron-time', time)
  console.log(new Date >= date)
  console.log('will execute every minute until stopped');
  // if(new Date >= date) {
  //   console.log('it stopped')
  //   return task.stop();
  // }
});

const port = process.env.PORT || 3400
app.listen(port, () => console.log(`app listening on port ${port}`))
