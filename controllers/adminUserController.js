const User = require("../models/User");
const Order = require("../models/Order");


// 🔹 GET ALL USERS (ADMIN)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// 🔹 BLOCK / UNBLOCK USER (ADMIN)
const toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Toggle isActive
        user.isActive = !user.isActive;
        await user.save();

        res.json({
            message: user.isActive ? "User unblocked" : "User blocked",
            isActive: user.isActive,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// 🔹 GET USER ORDER HISTORY (ADMIN)
const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.id;

        const orders = await Order.find({ userId })
            .populate("items.productId", "name price images")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllUsers,
    toggleBlockUser,
    getUserOrders,
};
