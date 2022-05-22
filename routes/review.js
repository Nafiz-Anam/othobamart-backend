const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();

const reviewSchema = require("../schemas/reviewSchema");
const Review = new mongoose.model("Review", reviewSchema);
const productSchema = require("../schemas/productSchema");
const Product = new mongoose.model("Product", productSchema);
const { verifyTokenAndAuthorization } = require("./verifyToken");

router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    // console.log(req);
    const newReview = new Review(req.body);
    const product_id = req.headers?.product_id;
    console.log(product_id);

    try {
        const addedReview = await newReview.save();
        review_id = addedReview._id;
        const addedToPtoductReview = await Product.updateOne(
            {
                _id: product_id,
            },
            {
                $push: {
                    reviews: review_id,
                },
            }
        );
        console.log(addedToPtoductReview);
        res.status(200).json({
            status: 0,
            message: "Review added successfully!",
        });
    } catch (err) {
        // console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// get all tags
router.get("/", verifyTokenAndAuthorization, async (req, res) => {
    await Review.find()
        .sort({ _id: -1 })
        .select("-__v -updatedAt")
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    status: 1,
                    error: "There was a server side error!",
                });
            } else {
                res.status(200).json({
                    status: 0,
                    result: data,
                    message: "All review retrieve successfully!",
                });
            }
        });
});

module.exports = router;
