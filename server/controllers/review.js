const Review = require(".../models/review");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    const review = new Review({
        id: req.body.id,
        rating: req.body.rating,
        content: req.body.content,
    });
    const result = await review.save();
    res.send(result);
});