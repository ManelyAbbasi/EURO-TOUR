const CitiesModel = require("../models/citiesModel");
const express = require("express");
//const citiesModel = require("../models/citiesModel");
const placesToVisitSchema = require("../models/placesToVisitModel");
const router = express.Router();


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
    
    try {
        
        // Check if a city with the same postcode already exists
        const existingCity = await CitiesModel.findOne({ postcode: req.body.postcode });
        
        if (existingCity) {
            return res.status(400).send({ message: 'City with this postcode already exists' });
        }
        // Create a new city if it doesn't exist
        const cities = new CitiesModel(req.body);
        await cities.save();
        res.status(201).send(cities); 
    } catch (err) {
        next(err); // Pass the error to the next middleware
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