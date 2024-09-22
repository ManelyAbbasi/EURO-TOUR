const placesToVisitModel = require("../models/placesToVisitModel");
const PlacesToVisitModel = require("../models/placesToVisitModel");
const express = require("express");
//const placesToVisitModell = require("../models/placesToVisitModel");
const router = express.Router();
const CitiesSchema = require("../models/citiesModel");
const ReviewsModel = require("../models/reviewsModel");
const UsersModel = require("../models/usersModel");

    
async function getAllPlaces(req, res) {
    try {
        const placesToVisit = await placesToVisitModel.find();
        res.status(201).send({ placesToVisit });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching places.' });
    }
}

async function createPlace(req, res) {
    try {
        // Find the city by their postcode from the request body
        const city = await CitiesSchema.findOne({ postcode: req.body.city });
        console.log(city); // Add this line   
    
        if (!city) {
            return res.status(404).send({ error: "City not found" });
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

        placesToVisit.placeName = req.body.placeName;
        placesToVisit.address = req.body.address;
        placesToVisit.rating = req.body.rating;
        placesToVisit.content = req.body.content;
        placesToVisit.tags = req.body.tags;
        placesToVisit.reviews = null;

        await placesToVisit.save();

        return res.status(201).send(placesToVisit);
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
        res.status(201).send(placesToVisit);
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