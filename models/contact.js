const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const joi = require('@hapi/joi')
joi.objectId = require('joi-objectid')(joi)

const contactSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email : {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
})
const Contact = mongoose.model('Contact', contactSchema)
exports.Contact = Contact;