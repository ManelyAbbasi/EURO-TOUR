const ReviewsModel = require("server/models/reviewsModel.js");
const express = require("express");
const router = express.Router();
const reviewsModel = require("../models/reviewsModel");

router.post("/", async  (req, res) => {
    const review = new ReviewsModel({
        id: req.body.id,
        rating: req.body.rating,
        content: req.body.content,
        user: req.body.user,
    });
    const result = await review.save();
    res.send(result);
});

router.get("/", async (req, res) => {
    const reviews = await ReviewsModel.find();
    res.send(reviews);
});

router.delete('/', async (req, res) => {
    try {
        // calculate the date 5 years ago
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

        // delete reviews older than 5 years
        const result = await ReviewsModel.deleteMany({ date: { $lt: fiveYearsAgo } }); 

        if (result.deletedCount === 0) {
            return res.status(404).json({ "message": "There are no reviews older than 5 years to delete" });
        }

        return res.status(200).json({ "message": "All reviews older than 5 years deleted successfully" });

    } catch (err) {
        res.status(500).json({ "message": "An error occurred while deleting reviews" });
    }
});