const Review = require("server/models/review.js");
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

router.get("/", async (req, res) => {
    const reviews = await Review.find();
    res.send(reviews);
});