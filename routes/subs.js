const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();

const subsSchema = require("../schemas/subsSchema");
const Subscriber = new mongoose.model("Subscriber", subsSchema);
const { verifyTokenAndAuthorization } = require("./verifyToken");

router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    // console.log(req.body);
    const newSubscriber = new Subscriber(req.body);
    try {
        const addedData = await newSubscriber.save();
        res.status(200).json({
            status: 0,
            message: "subscriber added successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// get all tags
router.get("/", verifyTokenAndAuthorization, async (req, res) => {
    await Subscriber.find()
        .sort({ _id: -1 })
        .select("-__v -updatedAt")
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
                    message: "All subscriber retrieve successfully!",
                });
            }
        });
});

module.exports = router;
