const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

// ===================
// PUBLIC ROUTES
// ===================
router.get("/", getProducts);
router.get("/:id", getProductById);

// ===================
// ADMIN ROUTES (PROTECTED)
// ===================

// ADD PRODUCT (ADMIN ONLY)
router.post(
    "/",
    authMiddleware,
    isAdmin,
    upload.array("images", 5),
    addProduct
);

// UPDATE PRODUCT (ADMIN ONLY)
router.put(
    "/:id",
    authMiddleware,
    isAdmin,
    upload.array("images", 5),
    updateProduct
);

// DELETE PRODUCT (ADMIN ONLY)
router.delete(
    "/:id",
    authMiddleware,
    isAdmin,
    deleteProduct
);

module.exports = router;
