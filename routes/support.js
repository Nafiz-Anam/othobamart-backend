const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const orderSchema = require("../schemas/orderSchema");
const supportSchema = require("../schemas/supportSchema");
const Order = new mongoose.model("Order", orderSchema);
const Support = new mongoose.model("Support", supportSchema);
const { verifyTokenAndAuthorization } = require("./verifyToken");

// add a support
router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    // console.log(req.body);
    const uniqueId = Date.now();
    console.log(uniqueId);
    try {
        const newSupport = new Support({
            ...req.body,
            support_id: uniqueId,
        });
        await newSupport.save();
        res.status(200).json({
            status: 0,
            message: "Support added successfully!",
        });
    } catch (err) {
        // console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

//add replies
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    // console.log(req.body);
    try {
        const updatedUser = await Support.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    chat: req.body,
                },
            },
            { new: true }
        );
        res.status(200).json({
            status: 0,
            message: "Support replied successfully!",
        });
    } catch (err) {
        // console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// get all supports
router.get("/", verifyTokenAndAuthorization, async (req, res) => {
    await Support.find()
        .sort({ _id: -1 })
        .select(" -updatedAt -__v")
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
                    message: "All supports retrieve successfully!",
                });
            }
        });
});

// get single product data
router.get("/:id", async (req, res) => {
    try {
        const data = await Support.findById(req.params.id);
        res.status(200).json({
            status: 0,
            result: data,
            message: "Support retrieve successfully!",
        });
    } catch (err) {
        // console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

module.exports = router;
