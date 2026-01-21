const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        contact: {
            email: String,
            phone: String,
        },

        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: String,
                image: String,
                price: Number,
                quantity: Number,
            },
        ],

        shippingAddress: {
            fullName: String,
            addressLine: String,
            city: String,
            state: String,
            pincode: String,
            country: { type: String, default: "India" },
            phone: String,
        },

        shippingMethod: {
            type: String,
            default: "Standard Shipping",
        },

        deliveryFee: {
            type: Number,
            default: 50,
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED"],
            default: "PENDING",
        },

        orderStatus: {
            type: String,
            enum: ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
            default: "PLACED",
        },

        subtotal: Number,
        tax: Number,
        totalAmount: Number,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
