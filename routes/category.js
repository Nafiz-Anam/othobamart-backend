const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const categorySchema = require("../schemas/categorySchema");
const Category = new mongoose.model("Category", categorySchema);
const { verifyTokenAndAdminOrVendor } = require("./verifyToken");

// add category
router.post("/", verifyTokenAndAdminOrVendor, async (req, res) => {
    // console.log(req.body);
    const newCategory = new Category(req.body);
    await newCategory.save((err) => {
        if (err) {
            // console.log(err);
            res.status(500).json({
                status: 1,
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                status: 0,
                message: "Category added successfully!",
            });
        }
    });
});

// get all categories
// router.get("/", async (req, res) => {
//     await Category.find()
//         .sort({ _id: -1 })
//         .select(" -updatedAt -__v")
//         .exec((err, data) => {
//             if (err) {
//                 res.status(500).json({
//                     status: 1,
//                     error: "There was a server side error!",
//                 });
//             } else {
//                 res.status(200).json({
//                     status: 0,
//                     result: data,
//                     message: "All category data retrieve successfully!",
//                 });
//             }
//         });
// });

router.get("/", async (req, res) => {
    // console.log(req.query.key);
    try {
        let query = {};
        let regex;
        if (req.query.key) {
            regex = new RegExp(req.query.key, "i");
            query = {
                $or: [
                    {
                        category_name: regex,
                    },
                ],
            };
        }
        // console.log(query);
        const data = await Category.find(query).sort({ _id: -1 });
        res.status(200).json({
            status: 0,
            result: data,
            message: "Search data retrieve successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

module.exports = router;
