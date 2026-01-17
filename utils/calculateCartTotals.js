module.exports = function calculateCartTotals(cart) {
    cart.totalItems = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    cart.subtotal = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
};
