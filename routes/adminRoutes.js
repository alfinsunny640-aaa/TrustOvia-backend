const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

// 📊 ADMIN DASHBOARD
const { getAdminStats } = require("../controllers/adminController");

// 👥 USER MANAGEMENT
const {
    getAllUsers,
    toggleBlockUser,
    getUserOrders,
} = require("../controllers/adminUserController");

// 📦 ORDER MANAGEMENT
const {
    getAdminOrders,
    updateOrderStatus,
} = require("../controllers/adminOrderController");


// ===================== DASHBOARD =====================
router.get("/stats", authMiddleware, isAdmin, getAdminStats);


// ===================== ORDERS =====================

// View all orders
router.get("/orders", authMiddleware, isAdmin, getAdminOrders);

// Update order status
router.put("/orders/:id", authMiddleware, isAdmin, updateOrderStatus);


// ===================== USERS =====================

// View all users
router.get("/users", authMiddleware, isAdmin, getAllUsers);

// Block / unblock user
router.put("/users/:id/block", authMiddleware, isAdmin, toggleBlockUser);

// View user order history
router.get("/users/:id/orders", authMiddleware, isAdmin, getUserOrders);


module.exports = router;
