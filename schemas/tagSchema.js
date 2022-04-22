const mongoose = require("mongoose");

const tagSchema = mongoose.Schema(
    {
        subCategory_name: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

module.exports = tagSchema;
