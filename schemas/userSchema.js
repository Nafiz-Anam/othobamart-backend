const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        user_name: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isSuperAdmin: {
            type: Boolean,
            default: false,
        },
        isCustomer: {
            type: Boolean,
            default: true,
        },
        isVendor: {
            type: Boolean,
            default: false,
        },
        shop_name: {
            type: String,
            unique: true,
        },
        shop: {
            type: mongoose.Types.ObjectId,
            ref: "Shop",
        },
        vendor_status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = userSchema;
