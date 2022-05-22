const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
    {
        reviewer_name: {
            type: String,
            required: true,
        },
        reviewer_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        review: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = reviewSchema;
