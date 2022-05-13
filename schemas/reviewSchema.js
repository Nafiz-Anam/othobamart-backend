const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
    {
        reviewer_name: {
            type: String,
            required: true,
        },
        reviewer_position: {
            type: String,
        },
        reviewer_email: {
            type: String,
            required: true,
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
