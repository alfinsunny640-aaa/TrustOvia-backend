const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");


const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

// PUBLIC
router.get("/", getProducts);
router.get("/:id", getProductById);

// ADMIN (for now no restriction)

router.post("/", upload.single("image"), addProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
