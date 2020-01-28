const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
dotenv.config();

const mongo = process.env.MONGODB_URI;

mongoose
  .connect(mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MoongoDB Connected successfully"))
  .catch(err => console.log(err));

const userRouter = require("./routes/user");
const hotelRouter = require("./routes/hotel");
const blogRouter = require("./routes/blog");
const roomRouter = require('./routes/room')
const adminRouter = require('./routes/admin')
const bookingRouter = require('./routes/booking')
const reviewRouter = require('./routes/review')
const contactRouter = require('./routes/contact')

app.get("/", (req, res) => res.send("Welcome to HotelOnPoint-API"));
app.use("/user", userRouter);
app.use("/hotel", hotelRouter);
app.use("/blog", blogRouter);
app.use('/room', roomRouter);
app.use('/admin', adminRouter)
app.use('/booking', bookingRouter)
app.use('/review', reviewRouter)
app.use('/contactus', contactRouter)

const port = process.env.PORT || 3400;
app.listen(port, () => console.log(`app listening on port ${port}`));
