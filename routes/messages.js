const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const messageSchema = require("../schemas/messageSchema");
const Message = new mongoose.model("Message", messageSchema);

//add

router.post("/", async (req, res) => {
    const newMessage = new Message(req.body);
    // console.log(req.body);
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        // console.log(err);
        res.status(500).json(err);
    }
});

//get

router.get("/:conversationId", async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json({
            status: 0,
            data: messages,
            message: "All messages retrieve",
        });
        // res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
