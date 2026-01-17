const Address = require("../models/UserAddressModel");
const User = require("../models/User");

// 📥 GET ALL ADDRESSES OF A USER
exports.getAddresses = async (req, res) => {
    try {
        const { userId } = req.params;


        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const addresses = await Address.find({ userId }).sort({
            isDefault: -1,
            createdAt: -1,
        });

        res.json(addresses);
    } catch (err) {
        console.error("❌ GET ADDRESSES ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// ➕ ADD NEW ADDRESS
exports.addAddress = async (req, res) => {

    try {
        const { userId } = req.params;
        const addressData = req.body;

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const addressCount = await Address.countDocuments({ userId });

        // First address becomes default
        if (addressCount === 0) {
            addressData.isDefault = true;
        }

        const newAddress = await Address.create({
            ...addressData,
            userId,
        });

        res.status(201).json(newAddress);
    } catch (err) {
        console.error("❌ ADD ADDRESS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// ✏️ UPDATE ADDRESS
exports.updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const address = await Address.findById(id);
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        Object.assign(address, updatedData);
        await address.save();

        res.json(address);
    } catch (err) {
        console.error("❌ UPDATE ADDRESS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// ❌ DELETE ADDRESS
exports.deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;

        const address = await Address.findByIdAndDelete(id);
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        // If deleted address was default → set another as default
        if (address.isDefault) {
            const nextAddress = await Address.findOne({ userId: address.userId });
            if (nextAddress) {
                nextAddress.isDefault = true;
                await nextAddress.save();
            }
        }

        res.json({ message: "Address deleted successfully" });
    } catch (err) {
        console.error("❌ DELETE ADDRESS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// ⭐ SET DEFAULT ADDRESS
exports.setDefaultAddress = async (req, res) => {
    try {
        const { id } = req.params;

        const address = await Address.findById(id);
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Remove default from other addresses
        await Address.updateMany(
            { userId: address.userId },
            { isDefault: false }
        );

        address.isDefault = true;
        await address.save();

        res.json(address);
    } catch (err) {
        console.error("❌ SET DEFAULT ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
// controllers/addressController.js
exports.getDefaultAddress = async (req, res) => {
    try {
        const { userId } = req.params;

        const address = await Address.findOne({
            userId,
            isDefault: true,
        });

        res.json(address); // can be null if none
    } catch (err) {
        res.status(500).json({ message: "Error fetching default address" });
    }
};

