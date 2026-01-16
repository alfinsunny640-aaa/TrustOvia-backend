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

router.post("/", upload.array("images",5), addProduct);
router.put("/:id", upload.array("images",5), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
