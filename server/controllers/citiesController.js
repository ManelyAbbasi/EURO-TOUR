const CitiesModel = require("../models/citiesModel");
const express = require("express");
//const citiesModel = require("../models/citiesModel");
const placesToVisitSchema = require("../models/placesToVisitModel");
const router = express.Router();

function validateCityData(data){
    const errors = [];
    
    if (!postcode || typeof data.postcode !== 'string'){
        errors.push("Postcode is required and must be a string.");
    }

    if (!data.cityName || typeof data.cityName !== 'string') {
        errors.push('City name is required and must be a string.');
    }

    if (!data.country || typeof data.country !== 'string') {
        errors.push('Country is required and must be a string.');
    }

    if (!data.statistics || typeof data.statistics !== 'string') {
        errors.push('Statistics are required and must be a string.');
    }

    if (!data.facts || typeof data.facts !== 'string') {
        errors.push('Facts are required and must be a string.');
    }

    if (!Array.isArray(data.tags)) {
        errors.push('Tags are required and must be an array.');
    } else {
        // Optional: Validate that each tag is a string
        data.tags.forEach((tag, index) => {
            if (typeof tag !== 'string') {
                errors.push(`Tag at index ${index} must be a string.`);
            }
        });
    }

    if (data.placesToVisit && !Array.isArray(data.placesToVisit)) {
        errors.push('Places to visit must be an array.');
    }

    if (data.reviews && !Array.isArray(data.reviews)) {
        errors.push('Reviews must be an array.');
    }

    return errors;
}


async function getAllCities(req, res) {
    try {
        const cities = await CitiesModel.find(); // Fetch users from the database
        if (!cities || cities.length === 0) {   // When there's no cities to be found
            return res.status(404).send({ message: 'No cities found.' });
        }
        res.status(200).send({ cities });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching cities.' });
    }
}

async function createCity(req, res) {
    const validationErrors = validateCityData(req.body);
    if (validationErrors.length>0){
        res.status(400).send({errors: validationErrors});
    }

    const { postcode } = req.body;
    try {

        const existingCity = await CitiesModel.findOne({ postcode });

        if (existingCity) { // to check if a city already exists with that postcode
            return res.status(400).send({ message: 'City with this postcode already exists' });
        }

        const newCity = new CitiesModel(req.body);


        await newCity.save();
        res.status(201).send(newCity); 
    } catch (err) {
        res.status(500).json({ error: 'An internal server error occurred while creating the city.' }); 
    }
}
    
async function getOneCity(req, res) {
    const postcode = req.params.postcode;

    if (!postcode || typeof postcode !== 'string') {
        return res.status(400).send({ message: 'Invalid postcode format.' });
    }

    try {

        const city = await CitiesModel.findOne({ postcode }); 

        if (!city) {
            return res.status(404).send({ message: "City not found" });
        }

        res.status(200).send(city); 
    } catch (err) {

        res.status(500).send({ error: 'An error occurred while fetching the city.' }); 
    }
}

async function updateCity(req, res, next){
    try{
        const city = await CitiesModel.findOne({postcode: req.params.postcode});
        if (city == null){
            return res.status(404).send({"message": "City not found"});
        }
        if (req.body.cityName !== undefined) {  // checks if there are values to be updated then proceeds with update
            city.cityName = req.body.cityName;
        }
        if (req.body.country !== undefined) {
            city.country = req.body.country;
        }
        if (req.body.statistics !== undefined) {
            city.statistics = req.body.statistics;
        }
        if (req.body.facts !== undefined) {
            city.facts = req.body.facts;
        }
        if (Array.isArray(req.body.tags)) {
            city.tags = req.body.tags;
        }
        if (Array.isArray(req.body.placesToVisit)) {    // to ensure attribute values aren't changed to null if empty
            city.placesToVisit = req.body.placesToVisit;
        }
        if (Array.isArray(req.body.reviews)) {
            city.reviews = req.body.reviews;
        }

        await city.save();
        res.status(200).send(city);

    } catch (err) {
        return res.status(500).next(err);
    }
};

async function patchCity(req, res, next){
    try{
        const city = await CitiesModel.findOne({postcode: req.params.postcode});
        if (city == null){
            return res.status(404).send({"message": "City not found"});
        }
        city.statistics = req.body.statistics !== undefined ? req.body.statistics : city.statistics;
        city.facts = req.body.facts !== undefined ? req.body.facts : city.facts;
        if (Array.isArray(req.body.tags)) {
            city.tags = req.body.tags;
        }

        await city.save();
        res.status(200).send(city);
    } catch (err) {
        res.status(500).next(err);
    }
};

async function deleteOneCity(req, res) {
    const postcode = req.params.postcode;
    try {
        const city = await CitiesModel.findOneAndDelete({ postcode: postcode });
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
    getAllCities,
    createCity,
    getOneCity,
    updateCity,
    patchCity,
    deleteOneCity,
}