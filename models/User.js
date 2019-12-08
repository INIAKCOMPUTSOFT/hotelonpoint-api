const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const joi = require('@hapi/joi')
joi.objectId = require('joi-objectid')(joi)

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    md5: {
        type: String,
    },
    isHotelOwner: {
        type: Boolean,
        required: false,
    },
    birthday: {
        type: String
    },
    country: {
        type: String
    },
    title: {
        type: String
    },
    phone: {
        type: String
    }
})

function validateUser(user) {
    const schema = joi.object({
        fullName: joi.string().min(3).max(70).required(),
        email: joi.string().min(5).max(255).required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: joi.string().min(6).max(255).required(),
    })
    return schema.validate(user)
}
const validateLogin = (user) => {
    const schema = joi.object({
        email: joi.string().min(5).max(255).required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: joi.string().min(6).max(255).required()
    })
    return schema.validate(user)
}

const user = mongoose.model('User', userSchema)
exports.User = user;
exports.validate = validateUser;
exports.validateLogin = validateLogin