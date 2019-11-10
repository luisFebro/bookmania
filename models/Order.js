const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// cart item
const dataCart = {
    product: { type: Schema.ObjectId, ref: "Product" },
    name: String,
    price: Number,
    count: Number
}
const CartItemSchema = new Schema(dataCart, { timestamps: true });

const collectionNameCart = "cart-item";
const CartItem = mongoose.model("CartItem", CartItemSchema, collectionNameCart);
// end cart item

// order
const dataOrder = {
    products: [CartItemSchema], // Array of Objects
    transaction_id: {},
    amount: { type: Number },
    address: String,
    status: {
        type: String,
        default: "Not processed",
        enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"] // enum means string objects
    },
    updated: Date,
    user: { type: Schema.ObjectId, ref: "User" }
}
const OrderSchema = new Schema(dataOrder, { timestamps: true });

const collectionNameOrder = "orders";
const Order = mongoose.model("Order", OrderSchema, collectionNameOrder);
// end order

module.exports = { Order, CartItem };