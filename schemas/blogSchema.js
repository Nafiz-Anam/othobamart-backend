const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
    {
        blog_title: {
            type: String,
        },
        blog_content: {
            type: String,
        },
        blog_image: {
            type: String,
        },
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: ["pending", "published", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = blogSchema;
