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

router.delete('/', async (req, res) => {
    try {
        const review = await Review.deleteMany();  // Removes all reviews

        if (review.deletedCount === 0) {
            return res.status(404).json({ "message": "There are no reviews to delete" });
        }

        return res.status(200).json({ "message": "All reviews deleted successfully" });

    } catch (err) {
        res.status(500).json({ "message": "An error occurred while deleting reviews" });
    }
});








