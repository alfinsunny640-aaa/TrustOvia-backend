const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "",
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1,
        },
    },
    { _id: false }
);

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: {
            type: [cartItemSchema],
            default: [],
        },
        subtotal: {
            type: Number,
            default: 0,
        },
        totalItems: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
