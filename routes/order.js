const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const orderSchema = require("../schemas/orderSchema");
const Order = new mongoose.model("Order", orderSchema);
const trackingSchema = require("../schemas/trackingSchema");
const Tracking = new mongoose.model("Tracking", trackingSchema);
const {
    verifyTokenAndAuthorization,
    verifyTokenAndSuperAdminOrVendor,
    verifyTokenAndAdmin,
    verifyTokenAndAdminOrVendor,
    verifyTokenAndSuperAdminOrVendororCustomer,
} = require("./verifyToken");

router.post("/place", verifyTokenAndAuthorization, async (req, res) => {
    // console.log(req.body);
    try {
        const uniqueId = Date.now();
        // console.log(uniqueId);
        const newOrder = new Order({ ...req.body, tracking_id: uniqueId });
        const addedOrder = await newOrder.save();
        const newTracking = new Tracking({
            tracking_id: addedOrder.tracking_id,
            user_id: req.body.user_id,
            user_email: req.body.email,
            user_address: req.body_address,
            user_name: req.body.user_name,
            status: "placed",
        });
        await newTracking.save();
        res.status(200).json({
            status: 0,
            data: addedOrder,
            message: "Order placed successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// get all orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.find()
            .sort({ _id: -1 })
            .select(" -__v -updatedAt")
            .exec((err, data) => {
                if (err) {
                    res.status(500).json({
                        status: 1,
                        error: "There was a server side error!",
                    });
                } else {
                    res.status(200).json({
                        status: 0,
                        result: data,
                        message: "Order retrieve successfully!",
                    });
                }
            });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// change order status
router.put("/:id", verifyTokenAndAdminOrVendor, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status: req.body.status,
                },
            },
            { new: true }
        );
        // console.log(updatedOrder);
        // const updatedTracking = await Tracking.find({
        //     tracking_id: updatedOrder.tracking_id,
        // });

        await Tracking.updateOne(
            {
                tracking_id: updatedOrder.tracking_id,
            },
            {
                $set: {
                    status: req.body.status,
                },
            }
        );
        res.status(200).json({
            status: 0,
            message: "Order status updated successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// find a user's orders
router.get("/userid", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const data = await Order.find({
            $or: [
                {
                    user_id: req.query.id,
                },
            ],
        }).sort({ _id: -1 });
        res.status(200).json({
            status: 0,
            result: data,
            message: "User Order retrieve successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// get single order data
router.get(
    "/:id",
    verifyTokenAndSuperAdminOrVendororCustomer,
    async (req, res) => {
        try {
            const data = await Order.findById(req.params.id);
            res.status(200).json({
                status: 0,
                result: data,
                message: "Order retrieve successfully!",
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: 1,
                error: "There was a server side error!",
            });
        }
    }
);

module.exports = router;
