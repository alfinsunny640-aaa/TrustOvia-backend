const express = require("express");
const router = express.Router();

const {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress, // ✅ FIX 1: IMPORT IT
} = require("../controllers/addressController");

// ✅ FIX 2: SPECIFIC ROUTES FIRST
router.get("/default/:userId", getDefaultAddress);
router.put("/default/:id", setDefaultAddress);

// ✅ GENERIC ROUTES LAST
router.get("/:userId", getAddresses);
router.post("/:userId", addAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

module.exports = router;
