// const Cart = require("../models/Cart");
// const Product = require("../models/Product");

// /* =========================
//    📥 GET USER CART
//    ========================= */
// exports.getCart = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     let cart = await Cart.findOne({ userId }).populate("items.productId");

//     if (!cart) {
//       return res.json({
//         items: [],
//         totalItems: 0,
//         subtotal: 0,
//         totalAmount: 0,
//       });
//     }

//     let totalItems = 0;
//     let subtotal = 0;

//     const items = cart.items
//       .map((item) => {
//         const product = item.productId;

//         // 🔴 VERY IMPORTANT SAFETY CHECK
//         if (!product) return null;

//         const itemTotal = product.price * item.quantity;

//         totalItems += item.quantity;
//         subtotal += itemTotal;

//         return {
//           productId: product._id,
//           name: product.name,
//           image:
//             product.images?.find(
//               (img) => img && img.startsWith("http")
//             ) ||
//             product.image ||
//             "",
//           price: product.price,
//           quantity: item.quantity,
//           itemTotal,
//         };
//       })
//       .filter(Boolean); // 🔥 removes null items

//     res.json({
//       items,
//       totalItems,
//       subtotal,
//       totalAmount: subtotal,
//     });
//   } catch (err) {
//     console.error("GET CART ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };


// /* =========================
//    ➕ ADD ITEM TO CART
//    ========================= */
// exports.addToCart = async (req, res) => {
//   try {
//     const { userId, productId, quantity = 1 } = req.body;

//     let cart = await Cart.findOne({ userId });
//     if (!cart) {
//       cart = await Cart.create({ userId, items: [] });
//     }

//     const productExists = await Product.findById(productId);
//     if (!productExists) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const itemIndex = cart.items.findIndex(
//       (item) => item.productId.toString() === productId
//     );

//     if (itemIndex > -1) {
//       cart.items[itemIndex].quantity += quantity;
//     } else {
//       cart.items.push({
//         productId,
//         quantity,
//       });
//     }

//     await cart.save();

//     // return updated cart with totals
//     req.params.userId = userId;
//     return exports.getCart(req, res);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================
//    🔄 UPDATE ITEM QUANTITY
//    ========================= */
// exports.updateQuantity = async (req, res) => {
//   try {
//     const { userId, productId, quantity } = req.body;

//     if (quantity < 1) {
//       return res.status(400).json({ message: "Quantity must be at least 1" });
//     }

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     const item = cart.items.find(
//       (item) => item.productId.toString() === productId
//     );

//     if (!item) {
//       return res.status(404).json({ message: "Item not in cart" });
//     }

//     item.quantity = quantity;
//     await cart.save();

//     req.params.userId = userId;
//     return exports.getCart(req, res);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================
//    ❌ REMOVE ITEM
//    ========================= */
// exports.removeItem = async (req, res) => {
//   try {
//     const { userId, productId } = req.params;

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     cart.items = cart.items.filter(
//       (item) => item.productId.toString() !== productId
//     );

//     await cart.save();

//     req.params.userId = userId;
//     return exports.getCart(req, res);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================
//    🧹 CLEAR CART
//    ========================= */
// exports.clearCart = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     cart.items = [];
//     await cart.save();

//     res.json({
//       items: [],
//       totalItems: 0,
//       subtotal: 0,
//       totalAmount: 0,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


const Cart = require("../models/Cart");
const Product = require("../models/Product");
const calculateCartTotals = require("../utils/calculateCartTotals");

/* =========================
   📥 GET USER CART
   ========================= */
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({
        items: [],
        totalItems: 0,
        subtotal: 0,
        totalAmount: 0,
      });
    }

    res.json({
      items: cart.items,
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      totalAmount: cart.subtotal,
    });
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   ➕ ADD ITEM TO CART
   ========================= */
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
        subtotal: 0,
        totalItems: 0,
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // ✅ increase quantity only
      cart.items[itemIndex].quantity += quantity;
    } else {
      // ✅ store full snapshot
      cart.items.push({
        productId: product._id,
        name: product.name,
        image:
          product.images?.find((img) => img?.startsWith("http")) ||
          product.image ||
          "",
        price: product.price,
        quantity,
      });
    }

    calculateCartTotals(cart);
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   🔄 UPDATE ITEM QUANTITY
   ========================= */
exports.updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    item.quantity = quantity;

    calculateCartTotals(cart);
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error("UPDATE QUANTITY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   ❌ REMOVE ITEM
   ========================= */
exports.removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    calculateCartTotals(cart);
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error("REMOVE ITEM ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   🧹 CLEAR CART
   ========================= */
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.subtotal = 0;
    cart.totalItems = 0;

    await cart.save();

    res.json({
      items: [],
      totalItems: 0,
      subtotal: 0,
      totalAmount: 0,
    });
  } catch (err) {
    console.error("CLEAR CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
