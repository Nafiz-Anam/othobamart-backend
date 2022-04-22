const express = require("express");
const { default: mongoose } = require("mongoose");
const { verifyTokenAndAdminOrVendor } = require("./verifyToken");
const router = express.Router();
const productSchema = require("../schemas/productSchema");
const Product = new mongoose.model("Product", productSchema);

// get searched products
router.get("/", async (req, res) => {
    console.log(req.query.key);
    try {
        let query = {};
        let regex;
        if (req.query.key) {
            regex = new RegExp(req.query.key, "i");
            query = req.query.key;
        }
        console.log(query);
        const data = await Product.find({
            $or: [
                {
                    product_name: regex,
                },
            ],
        });
        res.status(200).json({
            status: 0,
            result: data,
            message: "Search data retrieve successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

module.exports = router;
