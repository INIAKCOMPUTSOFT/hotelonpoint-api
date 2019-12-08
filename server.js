const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload')

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'))
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

dotenv.config();

const mongo = process.env.MONGODB_URI;

mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MoongoDB Connected successfully'))
.catch(err => console.log(err))

const userRouter = require('./routes/user')

app.get('/', (req, res) => res.send('Welcome to HotelOnPoint-API'))
app.use('/user', userRouter)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`app listening on port ${port}`))