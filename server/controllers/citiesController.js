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

async function createCity(req, res, next) {
    const validationErrors = validateCityData(req.body);
    if (validationErrors.length>0){
        res.status(400).send({errors: validationErrors});
    }

    const cities = new CitiesModel(req.body);

    try {
        await cities.save();
        res.status(201).send(cities); 
    } catch (err) {
        res.status(500).json({ error: 'An internal server error occurred while creating the city.' }); 
    }
}
    
async function getOneCity(req, res) {
    const postcode = req.params.postcode;
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
        city.cityName = req.body.cityName;
        city.country = req.body.country;
        city.statistics = req.body.statistics;
        city.facts = req.body.facts;
        city.tags = req.body.tags;
        city.placesToVisit = null;
        city.reviews = null;
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
        city.statistics = req.body.statistics || city.statistics;
        city.facts = req.body.facts || city.facts;
        city.tags = req.body.tags || city.tags;
        await city.save();
        res.status(201).send(city);
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