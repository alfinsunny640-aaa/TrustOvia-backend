const express = require("express");
const router = express.Router();

const {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} = require("../controllers/addressController");

router.get("/:userId", getAddresses);   // ✅ ADD THIS
router.post("/:userId", addAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);
router.put("/default/:id", setDefaultAddress);

module.exports = router;
