const ReviewsModel = require("../models/reviewsModel");
const express = require("express");
const router = express.Router();
const UsersModel = require("../models/usersModel");


async function createReview(req, res) {
    try {
        // Find the user by their username from the request body
        const user = await UsersModel.findOne({ username: req.body.user });
        console.log(user); // Add this line
        
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        if (typeof req.body.rating !== 'number') {
            return res.status(400).send({ "message": "Invalid rating: must be a non-empty number" });
        }
        if (req.body.rating < 0.0 || req.body.rating > 5.0) {
            return res.status(400).send({ message: "Invalid rating: must be between 0.0 and 5.0" });
        }
        if (typeof req.body.content !== 'string' || req.body.content.trim() === '') {
            return res.status(400).send({ "message": "Invalid content: must be a non-empty string" });
        }

        // Create the review
        const review = new ReviewsModel({
            rating: req.body.rating,
            content: req.body.content,
            date: Date.now(),
            user: user._id, // Set user field to the found user's _id
        });
        console.log(review); // Add this line
        
        // Save the review to the database  
        await review.save();
        
        // Send the created review as the response
        res.status(201).send(review);
    } catch (err) {
        // Log the error for better debugging
        console.error("Error creating review:", err);
        res.status(500).send({ message: "An error occurred while creating the review", error: err.message });
    }
}        

async function getAllReviews(req, res) {
    try {
        const reviews = await ReviewsModel.find(); // Fetch users from the database
        if (!reviews || reviews.length === 0) {
            return res.status(404).send({ error: 'No reviews found.' });
        }
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