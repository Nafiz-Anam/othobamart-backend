const mongoose = require("mongoose");

const subsSchema = mongoose.Schema(
    {
        subs_email: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = subsSchema;
