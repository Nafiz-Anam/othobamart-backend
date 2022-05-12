const express = require("express");
const { default: mongoose } = require("mongoose");
const { verifyTokenAndSuperAdminOrVendorAdmin } = require("./verifyToken");
const { cloudinary } = require("../helper/cloudinary.config");
const router = express.Router();

const blogSchema = require("../schemas/blogSchema");
const Blog = new mongoose.model("Blog", blogSchema);

const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);

router.post("/", verifyTokenAndSuperAdminOrVendorAdmin, async (req, res) => {
    // console.log("user : ", req.user);
    const file = req.files.blog_image;
    let blog_id;
    try {
        const uploadedRes = await cloudinary.uploader.upload(
            file.tempFilePath,
            {
                upload_preset: "othobamart_blogs",
            }
        );
        // console.log("uploadedRes", uploadedRes);
        const filePath = uploadedRes.secure_url;
        // make a new blog
        const newBlog = new Blog({
            ...req.body,
            blog_image: filePath,
            user_id: req.user.id,
        });
        // console.log("newBlog", newBlog);
        const addedBlog = await newBlog.save();
        blog_id = addedBlog._id;
        await User.updateOne(
            {
                _id: req.user.id,
            },
            {
                $push: {
                    blogs: blog_id,
                },
            }
        );
        res.status(200).json({
            status: 0,
            message: "Blog added successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// get searched blogs
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
                        blog_title: regex,
                    },
                ],
            };
        }
        // console.log(query);
        const data = await Blog.find(query)
            .populate("user_id", "-password -__v  -updatedAt")
            .sort({ _id: -1 });
        res.status(200).json({
            status: 0,
            result: data,
            message: "Search data retrieve successfully!",
        });
    } catch (err) {
        // console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// get single blog data
router.get("/:id", async (req, res) => {
    try {
        const data = await Blog.findById(req.params.id);
        res.status(200).json({
            status: 0,
            result: data,
            message: "Blog retrieve successfully!",
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
router.put(
    "/status/:id",
    verifyTokenAndSuperAdminOrVendorAdmin,
    async (req, res) => {
        try {
            const changeStatus = await Blog.findByIdAndUpdate(
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
                message: "Blog status changed successfully!",
            });
        } catch (err) {
            res.status(500).json({
                status: 1,
                error: "There was a server side error!",
            });
        }
    }
);

// delete a product
router.delete(
    "/:id",
    verifyTokenAndSuperAdminOrVendorAdmin,
    async (req, res) => {
        const id = req.params.id;
        // console.log(id);
        const result = await Blog.findOneAndDelete(id);
        res.status(200).json({
            status: 0,
            message: "Blog deleted successfully!",
        });
    }
);

module.exports = router;
