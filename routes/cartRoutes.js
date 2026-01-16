const express = require("express");
const router = express.Router();

const {
    getCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
} = require("../controllers/cartController");

router.get("/:userId", getCart);
router.post("/add", addToCart);
router.put("/update", updateQuantity);
router.delete("/remove/:userId/:productId", removeItem);
router.delete("/clear/:userId", clearCart);

module.exports = router;
