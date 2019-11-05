const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "product-categories";

const data = {
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    }
}

const categorySchema = new Schema(data, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema, collectionName);
