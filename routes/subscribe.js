const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();

const subsSchema = require("../schemas/subsSchema");
const Subscribe = new mongoose.model("Subscribe", subsSchema);
const { verifyTokenAndAuthorization } = require("./verifyToken");

router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    // console.log(req.body);
    const newSubs = new Subscribe(req.body);
    try {
        const addedSubs = await newSubs.save();
        res.status(200).json({
            status: 0,
            message: "Subs added successfully!",
        });
    } catch (err) {
        // console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// get all tags
router.get("/", verifyTokenAndAuthorization, async (req, res) => {
    await Subscribe.find()
        .sort({ _id: -1 })
        .select(" -updatedAt")
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
                    message: "All subs retrieve successfully!",
                });
            }
        });
});

module.exports = router;
