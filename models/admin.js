const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const joi = require('@hapi/joi')
joi.objectId = require('joi-objectid')(joi)

const adminSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    isCC: {
        type: Boolean,
        required: true
    },
})

function validateUser(user) {
    const schema = joi.object({
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

const Admin = mongoose.model('Admin', adminSchema)
exports.Admin = Admin;
exports.validate = validateUser;
exports.validateLogin = validateLogin