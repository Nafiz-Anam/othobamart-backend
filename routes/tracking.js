const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const orderSchema = require("../schemas/orderSchema");
const Order = new mongoose.model("Order", orderSchema);
const trackingSchema = require("../schemas/trackingSchema");
const Tracking = new mongoose.model("Tracking", trackingSchema);
const { verifyTokenAndAuthorization } = require("./verifyToken");

// get tracking details
router.get("/", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const data = await Tracking.find({
            tracking_id: req.body.tracking_id,
        });
        res.status(200).json({
            status: 0,
            result: data,
            message: "Tracking data retrieve successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// update status 
// approve product
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const changeStatus = await Tracking.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status: req.body.status,
                },
            },
            { new: true }
        );
        res.status(200).json({
            status: 0,
            message: "Tracking status changed successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

module.exports = router;
