const CitiesModel = require("../models/citiesModel");
const express = require("express");
//const citiesModel = require("../models/citiesModel");
const placesToVisitSchema = require("../models/placesToVisitModel");
const router = express.Router();

    async function getAllCities(req, res) {
        try {
            const cities = await CitiesModel.find(); // Fetch users from the database
            res.status(201).send({ cities });
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while fetching cities.' });
        }
    }

async function createCity(req, res, next) {
    const cities = new CitiesModel(req.body);
    try {
    await cities.save();
    } catch (err) {
    return res.status(500).next(err);
    }
    res.status(201).send(cities);
    };

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
        const city = await CitiesModel.findById(req.params.postcode);
        if (city == null){
            return res.status(404).send({"message": "City not found"});
        }
        city.cityName = req.body.cityName;
        city.country = req.body.country;
        city.statistics = req.body.statistics;
        city.facts = req.body.facts;
        city.tags = req.body.tags;
        city.placesToVisit = null;
        city.reviews = nulls;
        await city.save();
        res.status(201).send(city);
    } catch (err) {
        return res.status(500).next(err);
    }
};

async function patchCity(req, res, next){
    try{
        const city = await CitiesModel.findById(req.params.postcode);
        if (city == null){
            return res.status(404).send({"message": "City not found"});
        }
        city.statistics = (req.body.statistics || city.statistics);
        city.facts = (req.body.facts || city.facts);
        city.tags = (req.body.tags || city.tags);
        await city.save();
        res.status(201).send(city);
    } catch (err) {
        return res.status(500).next(err);
    }
};

async function deleteOneCity(req, res, next) {
    const postcode = req.params.postcode;
    try{
        const city = await CitiesModel.findByIdAndDelete(postcode);
        if (city==null){
            return res.status(404).send({"message": "City not found"});
        }
        res.status(201).send(city);
    } catch (err) {
        return res.status(500).next(err);
    } 
};

module.exports = {
    getAllCities,
    createCity,
    getOneCity,
    updateCity,
    patchCity,
    deleteOneCity,
}