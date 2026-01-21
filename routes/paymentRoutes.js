const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/Order");
const Cart = require("../models/Cart");

/* =========================
   RAZORPAY INSTANCE
   ========================= */
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =========================
   CREATE RAZORPAY ORDER
   ========================= */
router.post("/create-order", async (req, res) => {
    try {
        const amount = Number(req.body.amount); // paise

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        });

        res.json(order);
    } catch (err) {
        console.error("CREATE ORDER ERROR:", err);
        res.status(500).json({ message: "Razorpay order failed" });
    }
});

/* =========================
   VERIFY PAYMENT + SAVE ORDER
   ========================= */
router.post("/verify", async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            shippingAddress,
        } = req.body;

        // 🔴 Validation
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
            return res.status(400).json({ message: "Missing payment data" });
        }

        // 🔐 Signature verification
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed" });
        }

        /* =========================
           PAYMENT VERIFIED ✅
           ========================= */
        const cart = await Cart.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart empty" });
        }

        const subtotal = Number(cart.subtotal) || 0;
        const deliveryFee = 50;
        const tax = +(subtotal * 0.18).toFixed(2);
        const totalAmount = subtotal + deliveryFee + tax;

        const orderItems = cart.items.map(item => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
        }));

        const order = await Order.create({
            userId,
            contact: {
                phone: shippingAddress.phone || "",
            },
            items: orderItems,
            shippingAddress,
            paymentMethod: "ONLINE",
            paymentStatus: "PAID",
            orderStatus: "PLACED",
            subtotal,
            deliveryFee,
            tax,
            totalAmount,
            razorpay: {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
            },
        });

        // 🧹 Clear cart
        cart.items = [];
        cart.subtotal = 0;
        cart.totalItems = 0;
        await cart.save();

        res.json({
            success: true,
            orderId: order._id,
        });

    } catch (err) {
        console.error("VERIFY ERROR:", err);
        res.status(500).json({ message: "Payment verification failed" });
    }
});

module.exports = router;
