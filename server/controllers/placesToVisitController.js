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

async function createPlace(req, res) {
    try {
        // Find the city by their postcode from the request body
        const city = await CitiesSchema.findById(req.params.cityId);
        console.log(city); // Add this line   
    
        if (!city) {
            return res.status(404).send({ error: "City not found" });
        }

        if (typeof req.body.placeName !== 'string' || req.body.placeName.trim() === '') {
            return res.status(400).send({ "message": "Invalid placeName: must be a non-empty string" });
        }
        if (typeof req.body.address !== 'string' || req.body.address.trim() === '') {
            return res.status(400).send({ "message": "Invalid address: must be a non-empty string" });
        }
        if (req.body.rating < 0.0 || req.body.rating > 5.0) {
            return res.status(400).send({ message: "Invalid rating: must be between 0.0 and 5.0" });
        }
        if (typeof req.body.content !== 'string' || req.body.content.trim() === '') {
            return res.status(400).send({ "message": "Invalid content: must be a non-empty string" });
        }
        if (req.body.tags.length === 0) {
            return res.status(400).send({ "message": "Tags cannot be an empty array" });
        }

        // Create the city
        const placesToVisit = new placesToVisitModel({
            placeName: req.body.placeName,
            address: req.body.address,
            rating: req.body.rating,
            content: req.body.content,
            tags: req.body.tags,
            reviews: req.body.reviews,
            city: city._id, // Set user field to the found user's _id
        });
        console.log(placesToVisit); // Add this line

        await placesToVisit.save();
        res.status(201).send(placesToVisit);
    } catch (err) {
        console.error("Error creating the place to visit:", err);
        res.status(500).send({ message: "An error occurred while creating the place", error: err.message });
    }
};

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
        console.log(review); // Add this line

        await review.save();

        res.status(201).send({ message: "Review added successfully", review });
    } catch (err) {
        console.error("Error adding review to place:", err);
        res.status(500).send({ message: "An error occurred while adding the review.", error: err.message });
    }
}



module.exports = {
    getAllPlaces,
    createPlace,
    getOnePlace,
    updatePlace,
    patchPlace,
    deleteOnePlace,
    getReviewsForPlace,
    addReviewToPlace,
}