const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = {
  propName: {
    type: String,
    required: true
  },
  starRating: {
    type: String
  },
  roomNumber: {
    type: String,
    required: true
  },
  propWebsite: String
};
// const contactSchema = {
//     conNumber: {
//         type: String,
//         required: true
//     },
//     altNumber: String,
//     email: {
//         type: String,
//         required: true
//     },
//     isChainComp: {
//         type: Boolean,
//         required: true
//     },
//     compName: String
// }

const addressSchema = String;

const locationSchema = {
  _id: mongoose.Schema.Types.ObjectId,
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  mapLocation: String
};

const hotelAmenSchema = {
  _id: mongoose.Schema.Types.ObjectId,
  isBreakfastAvailable: {
    type: String,
    required: true
  },
  BreakfastCharge: String,
  isShuttleAvailable: {
    type: String,
    required: true
  },
  shuttleCharge: String,
  pool: Boolean,
  pets: Boolean,
  restaurant: Boolean,
  garden: Boolean,
  wif: Boolean,
  bar: Boolean,
  roomService: Boolean,
  fitnessCenter: Boolean,
  frontDesk: Boolean
};

// const roomSchema = {
//     _id: mongoose.Schema.Types.ObjectId,
//     roomName: {
//         type: String
//     },
//     roomType: {
//         type: String,
//     },
//     roomSize: {
//         type: String
//     },
//     roomsOfthisType: {
//         type: String
//     },
//     bedType: String,
//     bedNumber: String,
//     roomAmenities: [],
//     smokePolicy: String,
//     occupantPolicy: String,
//     pricePerNight: String
// }

const cancellationSchema = {
  _id: mongoose.Schema.Types.ObjectId,
  freeCancellationPeriod: String,
  paidCancellation: String,
  checkIn: {
    type: String,
    required: true
  },
  checkOut: {
    type: String,
    required: true
  },
  accomodateChild: {
    type: Boolean,
    required: true
  },
  accomodatePet: {
    type: Boolean,
    required: true
  }
};

const hotelSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  property: propertySchema,
  contact: {
    type: Array
  },
  imagerUrl: {
    type: Array
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  location: locationSchema,
  repApproach: {
    type: Boolean,
    required: true
  },
  repFullName: {
    type: String
  },
  roomAmenities: {
    type: Array
  },

  hotelAmen: hotelAmenSchema,
  rooms: {
    type: Array
  },
  address: {
    type: Array
  },
  cancellation: cancellationSchema
});

const Hotel = mongoose.model("Hotel", hotelSchema);
exports.Hotel = Hotel;
