const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const categorySchema = require("../schemas/categorySchema");
const Category = new mongoose.model("Category", categorySchema);
const tagSchema = require("../schemas/tagSchema");
const Tag = new mongoose.model("Tag", tagSchema);
const { verifyTokenAndAdminOrVendor } = require("./verifyToken");

router.post("/", verifyTokenAndAdminOrVendor, async (req, res) => {
    // console.log(req.body);
    const newTag = new Tag(req.body);
    try {
        const addTag = await newTag.save();
        await Category.updateOne(
            {
                _id: req.body.category_id,
            },
            {
                $push: {
                    tags: addTag._id,
                },
            }
        );
        res.status(200).json({
            status: 0,
            message: "Sub-Category added successfully!",
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
router.get("/", verifyTokenAndAdminOrVendor, async (req, res) => {
    await Tag.find()
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
                    message: "All tags retrieve successfully!",
                });
            }
        });
});

module.exports = router;
