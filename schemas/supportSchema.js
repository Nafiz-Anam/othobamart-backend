const mongoose = require("mongoose");

const supportSchema = mongoose.Schema(
    {
        support_id: {
            type: Number,
        },
        user_name: {
            type: String,
        },
        support_title: {
            type: String,
        },
        reason: {
            type: String,
            enum: ["product", "price", "order", "delivery", "service"],
        },
        chat: [
            {
                user_name: {
                    type: String,
                },
                message: {
                    type: String,
                },
            },
        ],
        status: {
            type: String,
            enum: ["pending", "accepted", "completed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = supportSchema;
