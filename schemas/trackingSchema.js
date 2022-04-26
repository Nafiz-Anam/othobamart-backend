// traicjingid
// status
// time date

const mongoose = require("mongoose");

const trackingSchema = mongoose.Schema(
    {
        tracking_id: {
            type: Number,
        },
        user_name: {
            type: String,
        },
        user_id: {
            type: String,
        },
        user_email: {
            type: String,
        },
        user_address: {
            type: String,
        },
        status: {
            type: String,
            enum: [
                "placed",
                "pending",
                "cancelled",
                "packaging",
                "shipped",
                "delivered",
            ],
            default: "placed",
        },
    },
    { timestamps: true }
);

module.exports = trackingSchema;
