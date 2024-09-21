const ReviewsModel = require("../models/reviewsModel");
const express = require("express");
const router = express.Router();
const UsersModel = require("../models/usersModel");
//const reviewsModel = require("../models/reviewsModel");


    async function createReview(req, res) {
        try {
            // Find the user by their username from the request body
            const user = await UsersModel.findOne({ username: req.body.user });
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }

            // Create the review
            const review = new ReviewsModel({
                ...req.body,
                user: user._id, // Set user field to the found user's _id
            });

            await review.save();
            res.status(201).send(review);
        } catch (err) {
            res.status(500).send({ message: "An error occurred while creating the review" });
        }
    }      

    async function getAllReviews(req, res) {
        try {
            const reviews = await ReviewsModel.find(); // Fetch users from the database
            res.status(201).send({ reviews });
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while fetching reviews.' });
        }
    }

async function deleteOldReviews(req, res) {
    try {
        // Calculate the date 5 years ago
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

        // Delete reviews older than 5 years
        const result = await ReviewsModel.deleteMany({ date: { $lt: fiveYearsAgo } });

        if (result.deletedCount === 0) {
            return res.status(404).send({ "message": "There are no reviews older than 5 years to delete" });
        }
        res.status(200).send({ "message": `${result.deletedCount} reviews deleted successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).send({ "message": "An error occurred while deleting reviews" });
    }
}

module.exports = {
    createReview, 
    getAllReviews,
    deleteOldReviews,
} 