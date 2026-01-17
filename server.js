const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();


const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const addressRoutes = require("./routes/addressRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes);



app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

