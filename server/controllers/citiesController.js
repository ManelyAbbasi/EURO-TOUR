const CitiesModel = require("../models/citiesModel");
const express = require("express");
const placesToVisitSchema = require("../models/placesToVisitModel");
const router = express.Router();
const ReviewsModel = require("../models/reviewsModel");
const UsersModel = require("../models/usersModel");
const citiesModel = require("../models/citiesModel");


async function createCity(req, res, next) {
    
    try {    
        if (typeof req.body.cityName !== 'string' || req.body.cityName.trim() === "") {
            return res.status(400).send({ "message": "Invalid cityName: must be a non-empty string" });
        }
        if (typeof req.body.country !== 'string' || req.body.country.trim() === "") {
            return res.status(400).send({ "message": "Invalid country: must be a non-empty string" });
        }
        if (typeof req.body.statistics !== 'string' || req.body.statistics.trim() === "") {
            return res.status(400).send({ "message": "Invalid statistics: must be a non-empty string" });
        }
        if (typeof req.body.facts !== 'string' || req.body.facts.trim() === "") {
            return res.status(400).send({ "message": "Invalid facts: must be a non-empty string" });
        }
        if (req.body.tags.length === 0) {
            return res.status(400).send({ "message": "Tags cannot be an empty array" });
        }
    
        // Create a new city if it doesn't exist
        const cities = new CitiesModel(req.body);
        await cities.save();
        res.status(201).send(cities); 
    } catch (err) {
        next(err);
    }
}

async function createPlaceInCity(req, res) {
    const cityId = req.params.id;
    try {
        const city = await CitiesModel.findById(cityId);
        console.log(city);

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
        if (!Array.isArray(req.body.tags) || req.body.tags.length === 0) {
            return res.status(400).send({ "message": "Tags cannot be an empty array" });
        }

        if (!city.placesToVisit) {
            city.placesToVisit = [];
        }

        const placeToVisit = new placesToVisitSchema({
            placeName: req.body.placeName,
            address: req.body.address,
            rating: req.body.rating,
            content: req.body.content,
            tags: req.body.tags,
            reviews: req.body.reviews,
            city: city._id,
        });

        await placeToVisit.save();
        city.placesToVisit.push(placeToVisit._id);
        await city.save();
        res.status(201).send(placeToVisit);
    } catch (err) {
        console.error("Error creating the place to visit:", err);
        res.status(500).send({ message: "An error occurred while creating the place", error: err.message });
    }
} 

async function createReviewToCity(req, res) {
    const cityId = req.params.id;

    try {
        const city = await CitiesModel.findById(cityId);
        if (!city) {
            return res.status(404).send({ message: "City not found" });
        }
        if (!city.reviews) {
            city.reviews = [];
        }
        const user = await UsersModel.findOne({ username: req.body.user });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        if (typeof req.body.rating !== 'number') {
            return res.status(400).send({ message: "Invalid rating: must be a non-empty number" });
        }
        if (req.body.rating < 0.0 || req.body.rating > 5.0) {
            return res.status(400).send({ message: "Invalid rating: must be between 0.0 and 5.0" });
        }
        if (typeof req.body.content !== 'string' || req.body.content.trim() === '') {
            return res.status(400).send({ message: "Invalid content: must be a non-empty string" });
        }

        const review = new ReviewsModel({
            rating: req.body.rating,
            content: req.body.content,
            date: Date.now(),
            user: user._id,
        });

        await review.save();
        city.reviews.push(review._id);
        await city.save();
        res.status(201).send({ message: "Review added successfully", review });
    } catch (err) {
        console.error("Error adding review to city:", err);
        res.status(500).send({ message: "An error occurred while adding the review.", error: err.message });
    }
}


async function getOneCity(req, res) { 
    const cityId = req.params.id;

    // check if the cityId is in the valid format (generated by mongoose)
    if (!cityId || !cityId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ message: 'Invalid city ID format.' });
    }

    try {
        const city = await CitiesModel.findById(cityId);
        if (!city) {
            return res.status(404).send({ message: "City not found" });
        }
        res.status(200).send(city); 
    } catch (err) {
        res.status(500).send({ error: 'An error occurred while fetching the city.' }); 
    }
}

async function getAllCities(req, res) {
    
    try {
        const cities = await CitiesModel.find();
        if (!cities || cities.length === 0) { 
            return res.status(404).send({ message: 'No cities found.' });
        }
        res.status(200).send({ cities });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching cities.' });
    }
}

async function getOnePlaceFromCity(req, res){
    const cityId = req.params.cityId;
    const address = req.params.address;
    
    try{
        const city = await CitiesModel.findOne(cityId).populate('placesToVisit');
        if (!city.placesToVisit || city.placesToVisit.length === 0) {
            return res.status(404).send({ message: "No places are found in this city" });
        }

        const place = city.placesToVisit.find(place => place.address === address);
        if (!place) {
            return res.status(404).send({ message: "Place not found" });
        }
        res.status(200).send(place);
    } catch (err) {
        res.status(500).send({ error: 'An error occurred while fetching the places.' });
    }
}

async function getPlacesFromCity(req, res){
    const cityId = req.params.cityId;
    try{
        const city = await CitiesModel.findOne(cityId).populate('placesToVisit');
        if (!city){
            return res.status(404).send({ message: "City not found" });
        }
        if (!city.placesToVisit || city.placesToVisit.length === 0){
            return res.status(404).send({ message: "No places are found" });
        }
        res.status(200).send(city.placesToVisit);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'An error occurred while fetching the places.' });
    }
}

async function getReviewsForCity(req, res) {
    const cityId = req.params.id; 

    try {
        const city = await CitiesModel.findById(cityId).populate('reviews');
        if (!city) {
            return res.status(404).send({ message: "City not found" });
        }

        const reviews = await ReviewsModel.find({ _id: { $in: city.reviews } }).populate('user', 'username');
        
        if (!reviews || reviews.length === 0) {
            return res.status(404).send({ message: "No reviews found for this city" });
        }
 
        res.status(200).send({ reviews });

    } catch (err) {
        console.error("Error retrieving reviews for city:", err);
        res.status(500).send({ message: "An error occurred while retrieving reviews.", error: err.message });
    }
}

async function updateCity(req, res, next) {
    const cityId = req.params.id;
    try {
        const city = await CitiesModel.findById(cityId);
        if (!city) {
            return res.status(404).send({ "message": "City not found" });
        }
        if (req.body.cityName !== undefined) {
            if (typeof req.body.cityName !== 'string' || req.body.cityName.trim() === "") {
                return res.status(400).send({ "message": "Invalid cityName: must be a non-empty string" });
            }
            city.cityName = req.body.cityName;
        }
        if (req.body.country !== undefined) {
            if (typeof req.body.country !== 'string' || req.body.country.trim() === "") {
                return res.status(400).send({ "message": "Invalid country: must be a non-empty string" });
            }
            city.country = req.body.country;
        }
        if (req.body.statistics !== undefined) {
            if (typeof req.body.statistics !== 'string' || req.body.statistics.trim() === "") {
                return res.status(400).send({ "message": "Invalid statistics: must be a non-empty string" });
            }
            city.statistics = req.body.statistics;
        }
        if (req.body.facts !== undefined) {
            if (typeof req.body.facts !== 'string' || req.body.facts.trim() === "") {
                return res.status(400).send({ "message": "Invalid facts: must be a non-empty string" });
            }
            city.facts = req.body.facts;
        }
        if (Array.isArray(req.body.tags)) {
            if (req.body.tags.length === 0) {
                return res.status(400).send({ "message": "Tags cannot be an empty array" });
            }
            city.tags = req.body.tags;
        }
        await city.save();
        res.status(200).send(city);
    } catch (err) {
        next(err);
    }
}


async function patchCity(req, res, next){
    try{
        const city = await CitiesModel.findById(req.params.cityId);
        if (city == null){
            return res.status(404).send({"message": "City not found"});
        }
        city.statistics = req.body.statistics || city.statistics;
        city.facts = req.body.facts || city.facts;
        city.tags = req.body.tags || city.tags;
        await city.save();
        res.status(201).send(city);
    } catch (err) {
        next(err);
    }
};

async function deleteReviewsById(req, res) { 
    const cityId = req.params.id;

    try {
        const city = await citiesModel.findOne({ _id: cityId }).populate('reviews');
        if (!city) {
            return res.status(404).send({ error: 'City not found' });
        }

        if (city.reviews.length === 0) {
            return res.status(404).send({ message: 'No reviews found for this city' });
        }

        // Retrieve the review objects before deletion
        const reviewsToDelete = await ReviewsModel.find({ _id: { $in: city.reviews } });
        if (!reviewsToDelete || reviewsToDelete.length === 0) {
            return res.status(404).send({ message: 'No reviews found to delete' });
        }

        await ReviewsModel.deleteMany({ _id: { $in: city.reviews } });
        city.reviews = [];
        await city.save();
        res.status(200).send({
            message: `Successfully deleted ${reviewsToDelete.length} reviews for the city.`,
            deletedReviews: reviewsToDelete
        });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while deleting reviews', details: error.message });
    }
}
 

async function deleteOneCity(req, res) {
    const cityId = req.params.id;
    try {
        const city = await CitiesModel.findByIdAndDelete(cityId);
        if (!city) {
            return res.status(404).send({ "message": "City not found" });
        }
        res.status(200).send({ "message": "City deleted successfully", city });
    } catch (err) {
        console.error(err);
        res.status(500).send({ "message": "Internal server error" });
    }
}


module.exports = {
    createCity,
    createPlaceInCity,
    createReviewToCity,
    getAllCities,
    getOneCity,
    getPlacesFromCity,
    getOnePlaceFromCity,
    getReviewsForCity,
    patchCity,
    updateCity,
    deleteOneCity,
    deleteReviewsById
}