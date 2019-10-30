const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "all-users";
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const data = {
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        trim: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    }
}, { timestamps: true }

const userSchema = new Schema(data);
module.exports = mongoose.model('User', userSchema, collectionName);
