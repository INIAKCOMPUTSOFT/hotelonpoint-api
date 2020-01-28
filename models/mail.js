const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const joi = require('@hapi/joi')
joi.objectId = require('joi-objectid')(joi)

const mailSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email : {
        type: String,
        required: true,
        unique: true
    },
})
const Mail = mongoose.model('Mail', mailSchema)
exports.Mail = Mail;