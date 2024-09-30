const placesToVisitModel = require("../models/placesToVisitModel");
const PlacesToVisitModel = require("../models/placesToVisitModel");
const express = require("express");
const router = express.Router();
const ReviewsModel = require("../models/reviewsModel");
const UsersModel = require("../models/usersModel");
var passport = require('passport');


async function createReviewToPlace(req, res) {
    const address = req.params.address;

    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "You need to be logged in to create a review." });
        }

        const place = await PlacesToVisitModel.findOne({ address });
        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }

        const user = await UsersModel.findOne({ username: req.user.username }); // Use req.user.username from authentication
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (typeof req.body.rating !== 'number') {
            return res.status(400).json({ message: "Invalid rating: must be a number" });
        }
        if (req.body.rating < 0.0 || req.body.rating > 5.0) {
            return res.status(400).json({ message: "Invalid rating: must be between 0.0 and 5.0" });
        }
        if (typeof req.body.content !== 'string' || req.body.content.trim() === '') {
            return res.status(400).json({ message: "Invalid content: must be a non-empty string" });
        }

        const review = new ReviewsModel({
            rating: req.body.rating,
            content: req.body.content,
            date: Date.now(),
            user: user._id,
        });

        await review.save();

        place.reviews.push(review._id);
        await place.save();

        res.status(201).json({ message: "Review added successfully", review });

    } catch (err) {
        console.error("Error adding review to place:", err);
        res.status(500).json({ message: "An error occurred while adding the review.", error: err.message });
    }
}


async function getAllPlaces(req, res) { 

    try {
        const placesToVisit = await placesToVisitModel.find();
        if (!placesToVisit || placesToVisit.length === 0) {
            return res.status(404).json({ error: 'No places found.' });
        }
        res.status(200).json({ placesToVisit });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching places.' });
    }
}


async function getOnePlace(req, res) {
    const address = req.params.address;

    try {
        const placesToVisit = await PlacesToVisitModel.findOne({ address }); 
        if (!placesToVisit) {
            return res.status(404).json({ message: "Place not found" });
        }
        res.status(200).json(placesToVisit);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the place.' })
    }
}


async function getReviewsForPlace(req, res) {
    const address = req.params.address;

    try {
        const place = await PlacesToVisitModel.findOne({ address }).populate('reviews');
        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }
        res.status(200).json(place.reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the reviews.' });
    }
}


async function updatePlace(req, res, next) {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "You need to be logged in to update a place." });
        }

        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Only admins can update places." });
        }

        const placesToVisit = await PlacesToVisitModel.findOne({ address: req.params.address });
        if (placesToVisit == null) {
            return res.status(404).json({ message: "Place not found" });
        }

        if (req.body.placeName !== undefined) {
            if (typeof req.body.placeName !== 'string' || req.body.placeName.trim() === "") {
                return res.status(400).json({ message: "Invalid placeName: must be a non-empty string" });
            }
            placesToVisit.placeName = req.body.placeName;
        }
        if (req.body.address !== undefined) {
            if (typeof req.body.address !== 'string' || req.body.address.trim() === "") {
                return res.status(400).json({ message: "Invalid address: must be a non-empty string" });
            }
            placesToVisit.address = req.body.address;
        }
        if (req.body.rating !== undefined) {
            if (req.body.rating < 0.0 || req.body.rating > 5.0) {
                return res.status(400).json({ message: "Invalid rating: must be between 0.0 and 5.0" });
            }
            placesToVisit.rating = req.body.rating;
        }
        if (req.body.content !== undefined) {
            if (typeof req.body.content !== 'string' || req.body.content.trim() === '') {
                return res.status(400).json({ message: "Invalid content: must be a non-empty string" });
            }
            placesToVisit.content = req.body.content;
        }
        if (Array.isArray(req.body.tags)) {
            if (req.body.tags.length === 0) {
                return res.status(400).json({ message: "Tags cannot be an empty array" });
            }
            placesToVisit.tags = req.body.tags;
        }

        await placesToVisit.save();
        return res.status(200).json(placesToVisit);
    } catch (err) {
        if (err.name === 'ValidationError' && err.errors && err.errors.tags) {
            return res.status(400).json({ message: "Invalid tag(s) provided. Please provide valid tags." });
        }
        return next(err);
    }
}


async function patchPlace(req, res) {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "You need to be logged in to patch a place." });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Only admins can patch places." });
        }

        const placesToVisit = await PlacesToVisitModel.findOne({ address: req.params.address });
        if (placesToVisit == null) {
            return res.status(404).json({ message: "Place not found" });
        }

        placesToVisit.content = req.body.content || placesToVisit.content;
        await placesToVisit.save();
        res.status(200).json(placesToVisit);
    } catch (err) {
        if (err.name === 'ValidationError' && err.errors && err.errors.tags) {
            return res.status(400).json({ message: "Invalid tag(s) provided. Please provide valid tags." });
        }
        return res.status(500).next(err);
    }
}

async function deleteOnePlace(req, res) {
    const address = req.params.address;

    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "You need to be logged in to delete a place." });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Only admins can delete places." });
        }

        const result = await PlacesToVisitModel.deleteOne({ address: address });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Place not found" });
        }
        
        res.status(200).json({ message: "Place deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}


async function deleteReviewsByAddress(req, res) {
    const address = req.params.address;

    try {
        const place = await PlacesToVisitModel.findOne({ address }).populate('reviews');
        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }
        if (place.reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this place' });
        }

        // Retrieve the review objects before deletion
        const reviewsToDelete = await ReviewsModel.find({ _id: { $in: place.reviews } });
        if (!reviewsToDelete || reviewsToDelete.length === 0) {
            return res.status(404).json({ message: 'No reviews found to delete' });
        }

        const result = await ReviewsModel.deleteMany({ _id: { $in: place.reviews } });
        place.reviews = [];
        await place.save();

        res.status(200).json({
            message: `Successfully deleted ${result.deletedCount} reviews for the place at address: ${address}`,
            deletedReviews: reviewsToDelete
        });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting reviews', details: error.message });
    }
}
 

module.exports = {
    createReviewToPlace,
    getReviewsForPlace,
    getAllPlaces,
    getOnePlace,
    updatePlace,
    patchPlace,
    deleteOnePlace,
    deleteReviewsByAddress,
}