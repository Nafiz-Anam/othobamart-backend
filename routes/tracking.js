const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const orderSchema = require("../schemas/orderSchema");
const Order = new mongoose.model("Order", orderSchema);
const {
    verifyTokenAndAuthorization,
    verifyTokenAndSuperAdminOrVendor,
    verifyTokenAndAdmin,
    verifyTokenAndAdminOrVendor,
    verifyTokenAndSuperAdminOrVendororCustomer,
} = require("./verifyToken");




module.exports = router;