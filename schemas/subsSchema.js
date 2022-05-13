const mongoose = require("mongoose");

const subsSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = subsSchema;
