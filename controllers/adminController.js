const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const getAdminStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();

        const revenueData = await Order.aggregate([
            { $match: { isPaid: true } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                },
            },
        ]);

        const totalRevenue =
            revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        res.json({
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// 🔹 GET ALL ORDERS (ADMIN)
const getAdminOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.productId", "name price images")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔹 UPDATE ORDER STATUS (ADMIN)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAdminStats,
    getAdminOrders,
    updateOrderStatus,
};
