// traicjingid
// status 
// time date 

const mongoose = require("mongoose");

const trackingSchema = mongoose.Schema(
    {
        tracking_id: {
            type: Number,
        },
        vendor_name: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

module.exports = tagSchema;


