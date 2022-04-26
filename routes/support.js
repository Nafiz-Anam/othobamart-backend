const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const orderSchema = require("../schemas/orderSchema");
const supportSchema = require("../schemas/supportSchema");
const Order = new mongoose.model("Order", orderSchema);
const Support = new mongoose.model("Support", supportSchema);
const { verifyTokenAndAuthorization } = require("./verifyToken");

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

//UPDATE SINGLE USER
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

module.exports = router;
