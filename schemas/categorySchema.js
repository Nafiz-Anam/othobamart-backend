const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
    {
        category_name: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

module.exports = categorySchema;
