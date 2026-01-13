const User = require("../models/User");
const bcrypt = require("bcryptjs");

// SIGNUP
const signup = async (req, res) => {
    try {
        console.log(req.body);

        const { name, email, password } = req.body;

        // ✅ 1. Check missing fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }

        // ✅ 2. Password length validation
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

        // ✅ 3. Check existing user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // ✅ 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ 5. Create user
        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "Signup successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during signup",
        });
    }
};

// LOGIN (NO TOKEN)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error during login",
        });
    }
};

module.exports = { signup, login };
