const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = { 
    propName: {
        type: String,
        required: true
    },
    starRating: {
        type: String,
    },
    roomNumbers: {
        type: String,
        required: true
    },
    propWebsite: String
};
const contactSchema = {
    conNumber: {
        type: String,
        required: true
    },
    altNumber: String,
    email: {
        type: String,
        required: true
    },
    isChainComp: {
        type: Boolean,
        required: true
    },
    compName: String
}

const addressSchema = String

const locationSchema = {
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
    address: [addressSchema],
    zipCode: {
        type: String,
        required: true
    },
    mapLocation: String
}

const hotelAmenSchema = {
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
    hotelAmenities: []
}

const roomSchema = {
    roomName: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
    },
    roomSize: {
        type: String
    },
    roomsOfthisType: {
        type: String
    },
    bedType: String,
    bedNumber: String,
    roomAmenities: [],
    smokePolicy: String,
    occupantPolicy: String,
    pricePerNight: String
}

const cancellationSchema = {
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
}

const hotelSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,property: propertySchema,
    contact: [contactSchema],
    imagerUrl: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    location: locationSchema,
    repApproach: {
        type: Boolean,
        required: true
    },
    repFullName: {
        type: String
    },
    hotelAmen: hotelAmenSchema,
    rooms: [roomSchema],
    cancellation: cancellationSchema
})

const Hotel = mongoose.model('Hotel', hotelSchema)
exports.Hotel = Hotel;