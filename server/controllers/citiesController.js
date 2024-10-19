const CitiesModel = require("../models/citiesModel");
const placesToVisitSchema = require("../models/placesToVisitModel");
const UsersModel = require("../models/usersModel");
const citiesModel = require("../models/citiesModel");
const adminsSchema = require("../models/adminsModel");
const adminController = require("../controllers/adminController");
const axios = require('axios');

//Our weather warning api key
const API_KEY = '836280f4bf814195bb0dc1d7b406da98';

async function getWeatherAlerts(cityName) {
    const url = `https://api.weatherbit.io/v2.0/alerts?city=${encodeURIComponent(cityName)}&key=${API_KEY}`;
    
    try {
        const response = await axios.get(url);
        return response.data.alerts || [];
    } catch (error) {
        console.error(`Error fetching weather alerts for ${cityName}:`, error.message);
        return [];
    }
}

async function getCityWeatherWarnings(req, res) {
    try {
        const cityId = req.params.id;

        const city = await CitiesModel.findById(cityId);
        if (!city) {
            return res.status(404).json({ message: "City not found." });
        }

        const weatherAlerts = await getWeatherAlerts(city.cityName);

        if (weatherAlerts.length === 0) {
            return res.status(200).json({ message: "No active weather warnings for this city." });
        }

        const uniqueAlerts = Array.from(new Set(weatherAlerts.map(alert => alert.title)));

        city.alerts = uniqueAlerts;
        await city.save();

        res.status(200).json({
            city: city.cityName,
            country: city.country,
            alerts: city.alerts
        });
    } catch (error) {
        console.error('Error getting weather warnings for city:', error);
        res.status(500).json({ error: 'An error occurred while fetching weather warnings for the city.' });
    }
}

async function createCity(req, res, next) {
    try {

        const adminCheckResponse = await adminController.checkIfAdmin(req);

        if (!adminCheckResponse.isAdmin) {
            return res.status(403).json({ message: "Access denied. Only admins can delete a city." });
        }

        if (typeof req.body.cityName !== 'string' || req.body.cityName.trim() === "") {
            return res.status(400).json({ message: "Invalid cityName: must be a non-empty string" });
        }
        if (req.body.cityName.length > 30) {
            return res.status(400).json({ message: 'cityName cannot be longer than 30 characters' });
        }
        if (typeof req.body.country !== 'string' || req.body.country.trim() === "") {
            return res.status(400).json({ message: "Invalid country: must be a non-empty string" });
        }
        if (req.body.country.length > 25) {
            return res.status(400).json({ message: 'Country name cannot be longer than 25 characters' });
        }
        if (typeof req.body.goodToKnow !== 'string' || req.body.country.trim() === "") {
            return res.status(400).json({ message: "Invalid good to know: must be a non-empty string" });
        }
        if (typeof req.body.statistics !== 'string' || req.body.statistics.trim() === "") {
            return res.status(400).json({ message: "Invalid statistics: must be a non-empty string" });
        }
        if (typeof req.body.facts !== 'string' || req.body.facts.trim() === "") {
            return res.status(400).json({ message: "Invalid facts: must be a non-empty string" });
        }
        if (!Array.isArray(req.body.tags) || req.body.tags.length === 0) {
            return res.status(400).json({ message: "Tags must be a non-empty array" });
        }

        const city = new CitiesModel(req.body);
        await city.save();
        res.status(201).json(city);
    } catch (err) {
        if (err.name === 'ValidationError' && err.errors && err.errors.tags) {
            return res.status(400).json({ message: "Invalid tag(s) provided. Please provide valid tags." });
        }
        next(err);
    }
}

async function createPlaceInCity(req, res) {
    const cityId = req.params.id;
    try {
        const adminCheckResponse = await adminController.checkIfAdmin(req);

        if (!adminCheckResponse.isAdmin) {
            return res.status(403).json({ message: "Access denied. Only admins can delete a city." });
        }
        const city = await CitiesModel.findById(cityId);
        if (!city) {
            return res.status(404).json({ error: "City not found" });
        }
        if (typeof req.body.placeName !== 'string' || req.body.placeName.trim() === '') {
            return res.status(400).json({ message: "Invalid placeName: must be a non-empty string" });
        }
        if (req.body.placeName.length > 30) {
            return res.status(400).json({ message: 'placeName cannot be longer than 30 characters' });
        }
        if (typeof req.body.address !== 'string' || req.body.address.trim() === '') {
            return res.status(400).json({ message: "Invalid address: must be a non-empty string" });
        }
        if (req.body.address.length > 60) {
            return res.status(400).json({ message: 'address cannot be longer than 60 characters' });
        }
        if (typeof req.body.rating !== 'number' || req.body.rating < 0.0 || req.body.rating > 5.0) {
            return res.status(400).json({ message: "Invalid rating: must be a number between 0.0 and 5.0" });
        }
        if (typeof req.body.content !== 'string' || req.body.content.trim() === '') {
            return res.status(400).json({ message: "Invalid content: must be a non-empty string" });
        }
        if (!Array.isArray(req.body.tags) || req.body.tags.length === 0) {
            return res.status(400).json({ message: "Tags cannot be an empty array" });
        }
        const existingPlace = await placesToVisitSchema.findOne({ address: req.body.address, city: city._id });
        if (existingPlace) {
            return res.status(409).json({ message: "A place with this address already exists in the city." });
        }
        const placeToVisit = new placesToVisitSchema({
            placeName: req.body.placeName,
            address: req.body.address,
            rating: req.body.rating,
            content: req.body.content,
            tags: req.body.tags,
            city: city._id,
        });

        await placeToVisit.save();
        city.placesToVisit.push(placeToVisit._id);
        await city.save();
        res.status(201).json(placeToVisit);
    } catch (err) {
        if (err.name === 'ValidationError' && err.errors && err.errors.tags) {
            return res.status(400).json({ message: "Invalid tag(s) provided. Please provide valid tags." });
        }
        console.error("Error creating the place to visit:", err);
        res.status(500).json({ message: "An error occurred while creating the place", error: err.message });
    }
}

async function getOneCity(req, res) { 
    const cityId = req.params.id;

    if (!cityId || !cityId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid city ID format.' });
    }

    try {
        const city = await CitiesModel.findById(cityId);
        if (!city) {
            return res.status(404).json({ message: "City not found" });
        }

        const links = {
            placesToVisit: `/api/cities/${cityId}/placesToVisit`,
        };

        res.status(200).json({
            city,
            links
        }); 
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the city.' }); 
    }
}

async function getAllCities(req, res) {
    try {
        const { tags, minRating, maxRating, sortByRating } = req.query;

        let filter = {};

        if (tags) {
            const tagsArray = tags.split(',');
            filter.tags = { $all: tagsArray };
        }

        if (minRating || maxRating) {
            filter.rating = {};
            if (minRating) {
                const minRatingValue = parseFloat(minRating);
                if (minRatingValue < 0 || minRatingValue > 5) {
                    return res.status(400).json({ message: 'Invalid minRating: Rating must be between 0.0 and 5.0.' });
                }
                filter.rating.$gte = minRatingValue;
            }
            if (maxRating) {
                const maxRatingValue = parseFloat(maxRating);
                if (maxRatingValue < 0 || maxRatingValue > 5) {
                    return res.status(400).json({ message: 'Invalid maxRating: Rating must be between 0.0 and 5.0.' });
                }
                filter.rating.$lte = maxRatingValue;
            }
        }

        let sortOption = {};
        if (sortByRating) {
            sortOption.rating = sortByRating === 'asc' ? 1 : -1;
        }

        const cities = await CitiesModel.find(filter)
            .sort(sortOption)
            .populate({
                path: 'placesToVisit',
                select: 'placeName'
            });

        if (!cities || cities.length === 0) {
            return res.status(404).json({ message: 'No cities found.' });
        }
        res.status(200).json({ cities });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching cities.' });
    }
}

async function getPlacesFromCity(req, res){
    const cityId = req.params.id;
    try{
        const city = await CitiesModel.findOne({ _id: cityId }).populate('placesToVisit');
        if (!city){
            return res.status(404).json({ message: "City not found" });
        }
        if (!city.placesToVisit || city.placesToVisit.length === 0){
            return res.status(404).json({ message: "No places are found" });
        }
        res.status(200).json(city.placesToVisit);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the places.' });
    }
}

async function updateCity(req, res, next) {
    const cityId = req.params.id;

    try {
        const adminCheckResponse = await adminController.checkIfAdmin(req);

        if (!adminCheckResponse.isAdmin) {
            return res.status(403).json({ message: "Access denied. Only admins can delete a city." });
        }

        const city = await CitiesModel.findById(cityId);
        if (!city) {
            return res.status(404).json({ message: "City not found" });
        }
        if (req.body.cityName !== undefined) {
            if (typeof req.body.cityName !== 'string' || req.body.cityName.trim() === "") {
                return res.status(400).json({ message: "Invalid cityName: must be a non-empty string" });
            }
            if (req.body.cityName.length > 20) {
                return res.status(400).json({ message: "cityName cannot be longer than 20 characters" });
            }
            city.cityName = req.body.cityName;
        }
        if (req.body.country !== undefined) {
            if (typeof req.body.country !== 'string' || req.body.country.trim() === "") {
                return res.status(400).json({ message: "Invalid country: must be a non-empty string" });
            }
            if (req.body.country.length > 25) {
                return res.status(400).json({ message: "country cannot be longer than 25 characters" });
            }
            city.country = req.body.country;
        }
        if (req.body.goodToKnow !== undefined) {
            if (typeof req.body.goodToKnow !== 'string' || req.body.goodToKnow.trim() === "") {
                return res.status(400).json({ message: "Invalid goodToKnow: must be a non-empty string" });
            }
            city.goodToKnow = req.body.goodToKnow;
        }
        if (req.body.statistics !== undefined) {
            if (typeof req.body.statistics !== 'string' || req.body.statistics.trim() === "") {
                return res.status(400).json({ message: "Invalid statistics: must be a non-empty string" });
            }
            city.statistics = req.body.statistics;
        }
        if (req.body.rating !== undefined) {
            if (typeof req.body.rating !== 'number' || req.body.rating < 0 || req.body.rating > 5) {
                return res.status(400).json({ message: "Invalid rating: must be a number between 0 and 5" });
            }
            city.rating = req.body.rating;
        }
        if (req.body.facts !== undefined) {
            if (typeof req.body.facts !== 'string' || req.body.facts.trim() === "") {
                return res.status(400).json({ message: "Invalid facts: must be a non-empty string" });
            }
            city.facts = req.body.facts;
        }
        if (Array.isArray(req.body.tags)) {
            if (req.body.tags.length === 0) {
                return res.status(400).json({ message: "Tags cannot be an empty array" });
            }
            city.tags = req.body.tags;
        }
        await city.save();
        res.status(200).json(city);
    } catch (err) {
        if (err.name === 'ValidationError' && err.errors && err.errors.tags) {
            return res.status(400).json({ message: "Invalid tag(s) provided. Please provide valid tags." });
        }
        next(err);
    }
}

async function deleteOnePlaceFromCity(req, res) {
    const cityId = req.params.id;
    const address = req.params.address;

    try {
        const adminCheckResponse = await adminController.checkIfAdmin(req);

        if (!adminCheckResponse.isAdmin) {
            return res.status(403).json({ message: "Access denied. Only admins can delete a city." });
        }
        
        const city = await CitiesModel.findOne({ _id: cityId }).populate('placesToVisit');
        if (!city) {
            return res.status(404).json({ message: "City not found" });
        }
        if (!city.placesToVisit || city.placesToVisit.length === 0) {
            return res.status(404).json({ message: "No places are found" });
        }

        const specificPlace = await placesToVisitSchema.findOne({ address: address });
        if (!specificPlace) {
            return res.status(404).json({ message: "Place not found" });
        }

        city.placesToVisit = city.placesToVisit.filter(place => place._id.toString() !== specificPlace._id.toString());

        await city.save();

        res.status(200).json({ message: "Place deleted successfully", deletedPlace: specificPlace });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'An error occurred while deleting the place.' });
    }
}


module.exports = {
    createCity,
    createPlaceInCity,
    getAllCities,
    getOneCity,
    getPlacesFromCity,
    updateCity,
    deleteOnePlaceFromCity,
    getCityWeatherWarnings
}