const placesToVisitModel = require("../models/placesToVisitModel");
const PlacesToVisitModel = require("../models/placesToVisitModel");
const express = require("express");
const router = express.Router();
const CitiesSchema = require("../models/citiesModel");
const ReviewsModel = require("../models/reviewsModel");
const UsersModel = require("../models/usersModel");

    
async function getAllPlaces(req, res) {
    try {
        const placesToVisit = await placesToVisitModel.find();
        if (!placesToVisit || placesToVisit.length === 0) {
            return res.status(404).send({ error: 'No places found.' });
        }
        res.status(200).send({ placesToVisit });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching places.' });
    }
}

async function getOnePlace(req, res) {
    const address = req.params.address;
    try {

        const placesToVisit = await PlacesToVisitModel.findOne({ address }); 

        if (!placesToVisit) {
            return res.status(404).send({ message: "Place not found" });
        }

        res.status(200).send(placesToVisit);
    } catch (err) {
        res.status(500).send({ error: 'An error occurred while fetching the place.' })
    }
}

//Method may not work, but have mo create reviews based on place to test
async function getReviewsForPlace(req, res) {
    const address = req.params.address;
    
    try {
        const place = await PlacesToVisitModel.findOne({ address }).populate('reviews');

        if (!place) {
            return res.status(404).send({ message: "Place not found" });
        }

        res.status(200).send(place.reviews);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'An error occurred while fetching the reviews.' });
    }
}

async function updatePlace(req, res, next) {
    try {
        const placesToVisit = await PlacesToVisitModel.findOne({ address: req.params.address });
        if (placesToVisit == null) {
            return res.status(404).send({ "message": "Place not found" });
        }

        if (req.body.placeName !== undefined) {
            if (typeof req.body.placeName !== 'string' || req.body.placeName.trim() === "") {
                return res.status(400).send({ "message": "Invalid placeName: must be a non-empty string" });
            }
            placesToVisit.placeName = req.body.placeName;
        }
        if (req.body.address !== undefined) {
            if (typeof req.body.address !== 'string' || req.body.address.trim() === "") {
                return res.status(400).send({ "message": "Invalid address: must be a non-empty string" });
            }
            placesToVisit.address = req.body.address;
        }
        if (req.body.rating !== undefined) {
            if (req.body.rating < 0.0 || req.body.rating > 5.0) {
                return res.status(400).send({ message: "Invalid rating: must be between 0.0 and 5.0" });
            }
            placesToVisit.rating = req.body.rating;
        }
        if (req.body.content !== undefined) {
            if (typeof req.body.content !== 'string' || req.body.content.trim() === '') {
                return res.status(400).send({ "message": "Invalid content: must be a non-empty string" });
            }
            placesToVisit.content = req.body.content;
        }
        if (Array.isArray(req.body.tags)) {
            if (req.body.tags.length === 0) {
                return res.status(400).send({ "message": "Tags cannot be an empty array" });
            }
            placesToVisit.tags = req.body.tags;
        }

        await placesToVisit.save();

        return res.status(200).send(placesToVisit);
    } catch (err) {
        return next(err); 
    }
}

async function patchPlace(req, res){
    try{
        const placesToVisit = await PlacesToVisitModel.findOne({ address: req.params.address });
        if (placesToVisit == null){
            return res.status(404).send({"message": "Place not found"});
        }

        placesToVisit.content = (req.body.content || placesToVisit.content);
        await placesToVisit.save();
        res.status(200).send(placesToVisit);
    } catch (err) {
        return res.status(500).next(err);
    }
};

async function deleteOnePlace(req, res) {
    const address = req.params.address;
    try {
        const result = await PlacesToVisitModel.deleteOne({ address: address });
        
        if (result.deletedCount === 0) {
            return res.status(404).send({ "message": "Place not found" });
        }
        res.status(200).send({ "message": "Place deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ "message": "Internal server error" });
    }
}

async function addReviewToPlace(req, res) {
    const address = req.params.address;

    try {
        const place = await PlacesToVisitModel.findOne({ address });
        const user = await UsersModel.findOne({ username: req.body.user });
        console.log(user); // Add this line
        if (!place) {
            return res.status(404).send({ message: "Place not found" });
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

        const review = new ReviewsModel({
            rating: req.body.rating,
            content: req.body.content,
            date: Date.now(),
            user: user._id, // Set user field to the found user's _id
        });
        
        await review.save();
        
        place.reviews.push(review._id);
        await place.save(); 
        
        res.status(201).send({ message: "Review added successfully", review });

    } catch (err) {
        console.error("Error adding review to place:", err);
        res.status(500).send({ message: "An error occurred while adding the review.", error: err.message });
    }
}


const deleteReviewsByAddress = async (req, res) => {
    const address = req.params.address;

    try {
        // Find the place by its address
        const place = await PlacesToVisitModel.findOne({ address }).populate('reviews');
        if (!place) {
            return res.status(404).send({ error: 'Place not found' });
        }

        // Check if there are any reviews to delete
        if (place.reviews.length === 0) {
            return res.status(404).send({ message: 'No reviews found for this place' });
        }

        // Delete all reviews associated with the place
        const result = await ReviewsModel.deleteMany({ _id: { $in: place.reviews } });

        // Clear the reviews array in the place document
        place.reviews = [];
        await place.save();

        // Success response
        res.status(200).send({
            message: `Successfully deleted ${result.deletedCount} reviews for the place at address: ${address}`
        });

    } catch (error) {
        // Catch any errors that occur during the database operations
        res.status(500).send({ error: 'An error occurred while deleting reviews', details: error.message });
    }
};






module.exports = {
    getAllPlaces,
    getOnePlace,
    updatePlace,
    patchPlace,
    deleteOnePlace,
    getReviewsForPlace,
    addReviewToPlace,
    deleteReviewsByAddress,
}