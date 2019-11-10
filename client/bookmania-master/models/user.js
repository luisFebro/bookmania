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
        maxlength: 32,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    about: {
        type: String,
        trim: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    },
    favoriteList: {
        type: Schema.ObjectId,
        ref: 'Product'
    }
}
const userSchema = new Schema(data, { timestamps: true });

// virtual field to set an encrypted password
userSchema
    .virtual("password") // Here 'password' is now a property on User documents.
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
};

module.exports = mongoose.model('User', userSchema, collectionName);
