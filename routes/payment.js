const express = require("express");
const { default: mongoose } = require("mongoose");
const { verifyTokenAndAdminOrVendor } = require("./verifyToken");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const productSchema = require("../schemas/productSchema");
const Product = new mongoose.model("Product", productSchema);

// const allItems = await Product.find();
// const storeItems = new Map([
//     [1, { priceInCents: 10000, name: "Learn React Today" }],
//     [2, { priceInCents: 20000, name: "Learn CSS Today" }],
// ]);
// const storeItem = await Product.findById(item.id);
// console.log(storeItem);
// const price = storeItem.product_price * 100;
// console.log(price);
// console.log(item.quantity);

router.post("/", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: req.body.cart.map((item) => {
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.item_name,
                        },
                        unit_amount: item.item_price * 100,
                    },
                    quantity: item.item_qty,
                };
            }),
            success_url: `${process.env.CLIENT_URL}/thanksYou`,
            cancel_url: `${process.env.CLIENT_URL}/home`,
        });
        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
