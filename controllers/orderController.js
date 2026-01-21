const Order = require("../models/Order");
const Cart = require("../models/Cart");

/* =========================
   🧾 PLACE ORDER
   ========================= */
exports.placeOrder = async (req, res) => {
    try {
        const {
            userId,
            shippingAddress,
            paymentMethod,
        } = req.body;

        // 🔒 Basic validation
        if (!userId || !shippingAddress || !paymentMethod) {
            return res.status(400).json({
                message: "userId, shippingAddress and paymentMethod are required",
            });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // ✅ SAFE CALCULATIONS (NO NaN)
        const subtotal = Number(cart.subtotal) || 0;
        const deliveryFee = 50;
        const tax = +(subtotal * 0.18).toFixed(2);
        const totalAmount = subtotal + deliveryFee + tax;

        // ✅ IMPORTANT: MAP CART ITEMS → ORDER ITEMS
        const orderItems = cart.items.map((item) => ({
            productId: item.productId,
            name: item.name,        // ✅ product name snapshot
            image: item.image,      // ✅ product image snapshot
            price: item.price,      // ✅ price at time of order
            quantity: item.quantity,
        }));

        const order = await Order.create({
            userId,

            items: orderItems,

            shippingAddress: {
                ...shippingAddress,
                phone: shippingAddress.phone || "", // ✅ PHONE SAVED HERE
            },

            paymentMethod,
            subtotal,
            deliveryFee,
            tax,
            totalAmount,
            paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
            orderStatus: "PLACED",
        });



        // ✅ Clear cart after order
        cart.items = [];
        cart.totalItems = 0;
        cart.subtotal = 0;
        await cart.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId: order._id,
        });
    } catch (error) {
        console.error("PLACE ORDER ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   📦 GET USER ORDERS
   ========================= */
exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error("GET USER ORDERS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   📄 GET ORDER BY ID
   ========================= */
exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        console.error("GET ORDER BY ID ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};
