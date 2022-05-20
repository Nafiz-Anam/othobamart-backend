const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const {
    verifyTokenAndAdminOrVendor,
    verifyTokenAndAuthorization,
} = require("./verifyToken");
const { cloudinary } = require("../helper/cloudinary.config");
const storeSchema = require("../schemas/storeSchema");
const Store = new mongoose.model("Store", storeSchema);
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);

// add a shop
router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    const file = req.files?.shop_logo;
    // console.log(req.body);
    // console.log(req.user);
    // console.log(file);
    // console.log(file?.tempFilePath);
    try {
        const uploadedRes = await cloudinary.uploader.upload(file.tempFilePath);
        // await cloudinary.uploader.upload(file.tempFilePath, (result) => {
        // console.log(result);
        const filePath = uploadedRes.secure_url;
        const newShop = new Store({
            ...req.body,
            vendor: req.user.id,
            shop_logo: filePath,
        });
        // console.log("newShop", newShop);
        const addShop = await newShop.save();
        // console.log("addShop", addShop);
        await User.updateOne(
            {
                _id: req.user.id,
            },
            {
                $set: {
                    shop: addShop._id,
                    shop_apply: "true",
                },
            }
        );
        // });
        res.status(200).json({
            status: 0,
            message: "Shop data added successfully!",
        });
    } catch (err) {
        console.log("err", err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// get all shops data
router.get("/", async (req, res) => {
    await Store.find()
        .populate("vendor shop_products", "-password -__v  -updatedAt")
        .sort({ _id: -1 })
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
                    message: "All shops data retrieve successfully!",
                });
            }
        });
});

// get a single shop data
router.get("/:id", async (req, res) => {
    try {
        const shop = await Store.findById(req.params.id).populate(
            "vendor shop_products",
            "-password -__v  -updatedAt"
        );
        res.status(200).json({
            status: 0,
            result: shop,
            message: "Shop data retrieve successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// update a shop
router.put("/:id", verifyTokenAndAdminOrVendor, async (req, res) => {
    try {
        const updatedShop = await Store.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({
            status: 0,
            result: updatedShop,
            message: "Shop data updated successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// approve shop
router.put("/status/:id", verifyTokenAndAdminOrVendor, async (req, res) => {
    // console.log(req.params.id);
    try {
        const changeStatus = await Store.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    shop_status: req.body.status,
                },
            },
            { new: true }
        );
        // console.log(changeStatus);
        const vendorId = changeStatus?.vendor.valueOf();
        // console.log(vendorId);
        if (req.body.status === "approved") {
            const userUpdate = await User.findByIdAndUpdate(
                vendorId,
                {
                    $set: {
                        vendor_status: "approved",
                    },
                },
                { new: true }
            );
        }
        res.status(200).json({
            status: 0,
            message: "Shop status changed successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

module.exports = router;
