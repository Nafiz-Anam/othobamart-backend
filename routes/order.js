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

router.post("/place", verifyTokenAndAuthorization, async (req, res) => {
    // console.log(req.body);
    const newOrder = new Order(req.body);
    await newOrder.save((err) => {
        if (err) {
            // console.log(err);
            res.status(500).json({
                status: 1,
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                status: 0,
                message: "Order placed successfully!",
            });
        }
    });
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
