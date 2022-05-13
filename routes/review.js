const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();

const reviewSchema = require("../schemas/reviewSchema");
const Review = new mongoose.model("Review", reviewSchema);
const { verifyTokenAndAuthorization } = require("./verifyToken");

router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    // console.log(req.body);
    const newReview = new Review(req.body);
    try {
        const addedReview = await newReview.save();
        res.status(200).json({
            status: 0,
            message: "Review added successfully!",
        });
    } catch (err) {
        console.log(err);
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
