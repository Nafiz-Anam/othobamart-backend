const express = require("express");
const { default: mongoose } = require("mongoose");
const { verifyTokenAndAdminOrVendor } = require("./verifyToken");
const { cloudinary } = require("../helper/cloudinary.config");
const router = express.Router();
const productSchema = require("../schemas/productSchema");
const Product = new mongoose.model("Product", productSchema);
const shopSchema = require("../schemas/shopSchema");
const Shop = new mongoose.model("Shop", shopSchema);

// get all products
// router.get("/", async (req, res) => {
//     try {
//         await Product.find({})
//             .populate("shop", " -__v -createdAt -updatedAt -shop_products ")
//             .select(" -__v -createdAt -updatedAt")
//             .exec((err, data) => {
//                 if (err) {
//                     res.status(500).json({
//                         status: 1,
//                         error: "There was a server side error!",
//                     });
//                 } else {
//                     res.status(200).json({
//                         status: 0,
//                         result: data,
//                         message: "Products retrieve successfully!",
//                     });
//                 }
//             });
//     } catch (err) {
//         res.status(500).json({
//             status: 1,
//             error: "There was a server side error!",
//         });
//     }
// });

// get searched products
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
                        product_name: regex,
                    },
                ],
            };
        }
        // console.log(query);
        const data = await Product.find(query).sort({ _id: -1 });
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

// get paginated products
router.get("/paginated", async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.size);
    try {
        const data = await Product.find()
            .limit(limit * 1)
            .skip(page * limit)
            .sort({ _id: -1 })
            .exec();
        const count = await Product.countDocuments();
        res.status(200).json({
            status: 0,
            result: data,
            total_items: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            message: "Paginated products retrieve successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// get single product data
router.get("/:id", async (req, res) => {
    try {
        const data = await Product.findById(req.params.id);
        res.status(200).json({
            status: 0,
            result: data,
            message: "Products retrieve successfully!",
        });
    } catch (err) {
        // console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// add a product
router.post("/", verifyTokenAndAdminOrVendor, async (req, res) => {
    const file = req.files.photo;
    let product_id;
    try {
        await cloudinary.uploader.upload(file.tempFilePath, async (result) => {
            const filePath = result.secure_url;
            const newProduct = new Product({
                ...req.body,
                product_img: filePath,
                shop: req.user.shop_id,
            });
            const addProduct = await newProduct.save();
            product_id = addProduct._id;
            await Shop.updateOne(
                {
                    _id: req.user.shop_id,
                },
                {
                    $push: {
                        shop_products: addProduct._id,
                    },
                }
            );
        });
        if (req.files.gallery !== "") {
            let galleryImg = req.files?.gallery;
            // checking if multi images
            const isArr = Array.isArray(galleryImg);
            if (isArr) {
                galleryImg.map(async (item) => {
                    await cloudinary.uploader.upload(
                        item.tempFilePath,

                        async (req, res) => {
                            // await console.log(res.secure_url);
                            await Product.updateOne(
                                {
                                    _id: product_id,
                                },
                                {
                                    $push: {
                                        gallery: res.secure_url,
                                    },
                                }
                            );
                        }
                    );
                });
            } else {
                // console.log(galleryImg);
                await cloudinary.uploader.upload(
                    galleryImg.tempFilePath,
                    async (req, res) => {
                        // await console.log(res.secure_url);
                        await Product.updateOne(
                            {
                                _id: pro_id,
                            },
                            {
                                $push: {
                                    gallery: res.secure_url,
                                },
                            }
                        );
                    }
                );
            }
        }
        res.status(200).json({
            status: 0,
            message: "Product added successfully!",
        });
    } catch (err) {
        // console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// approve product
router.put("/status/:id", verifyTokenAndAdminOrVendor, async (req, res) => {
    try {
        const changeStatus = await Product.findByIdAndUpdate(
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
            message: "Product status changed successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// delete a product
router.delete("/:id", verifyTokenAndAdminOrVendor, async (req, res) => {
    const id = req.params.id;
    // console.log(id);
    const result = await Product.findOneAndDelete(id);
    res.status(200).json({
        status: 0,
        message: "Product deleted successfully!",
    });
});

module.exports = router;
