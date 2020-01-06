const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertyInfoSchema = {
  hotelName: {
    type: String,
    required: true
  },
  hotelWebsite: {
    type: String
  },
  starRating: {
    type: String,
    required: true
  },
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
    type: String
  },
  isPropertyGroup: {
    type: String,
    required: true
  },
  compName: {
    type: String
  },
  hotelDescription: {
    type: String,
    required: true
  }
};

const managementDetailsSchema = {
  propertyOwner: {
    type: String,
    required: true
  },
  propertyOwnerPhoneOne: {
    type: String,
    required: true
  },
  propertyOwnerPhoneTwo: {
    type: String
  },
  propOwnerEmail: {
    type: String,
    required: true
  },
  frontDesk: {
    type: String
  },
  frontDeskPhoneOne: {
    type: String
  },
  frontDeskPhoneTwo: {
    type: String
  },
  frontDeskOwnerEmail: {
    type: String
  },
  headOfReservationOne: {
    type: String
  },
  headOfReservationPhoneOne: {
    type: String
  },
  headOfReservationPhoneTwo: {
    type: String
  },
  headOfReservationOneEmail: {
    type: String
  },
  headOfReservationTwo: {
    type: String
  },
  headOfReservationTwoPhoneOne: {
    type: String
  },
  headOfReservationTwoPhoneTwo: {
    type: String
  },
  headOfReservationTwoEmail: {
    type: String
  },
  headOfOperationOne: {
    type: String
  },
  headOfOperationPhoneOne: {
    type: String
  },
  headOfOperationPhoneTwo: {
    type: String
  },
  headOfOperationOneEmail: {
    type: String
  },
  headOfOperationTwo: {
    type: String
  },
  headOfOperationTwoPhoneOne: {
    type: String
  },
  headOfOperationTwoPhoneTwo: {
    type: String
  },
  headOfOperationTwoEmail: {
    type: String
  }
};

const hotelPolicySchema = {
  smokingPolicy: {
    type: String
  },
  paymentMethod: {
    type: Array
  },
  hotelAmenities: {
    type: Array
  },
  isBreakfastAvailable: {
    type: String
  },
  breakfastPrice: {
    type: String
  },
  isShuttleAvailable: String,
  shuttlePrice: String,
  checkIn: String,
  checkOut: String,
  freeBooking: String,
  paidBooking: String,
  otherPaymentMethod: String,
  moreHotelAmenities: Array,
  moreHotelPolicies: Array
};

const termsAndConditionsSchema = {
  contractName: String,
  confirmRecipientAddress: String,
  recipientCountry: String,
  recipientState: String,
  recipientCity: String,
  recipientZipCode: String,
  confirmAgreement: String
};

const hotelSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  imagerUrl: {
    type: Array,
    required: true
  },
  propertyInfo: propertyInfoSchema,
  managementDetails: managementDetailsSchema,
  hotelPolicy: hotelPolicySchema,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  repApproach: {
    type: String
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  approved: {
    type: Boolean,
    required: true
  },
  termsAndConditions: termsAndConditionsSchema,
  vrTour: String,
  registerName: String,
  registerPhone: String,
  registerAddress: String,
  percentageValue: Number
});

const Hotel = mongoose.model("Hotel", hotelSchema);
exports.Hotel = Hotel;
