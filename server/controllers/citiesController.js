const CitiesController = require("server\models\citiesModel.js");
const express = require("express");
const citiesController = require("../models/citiesModel");
const placesToVisitSchema = require("../models/placesToVisitModel");
const router = express.Router();

router.get("/", async (req, res) => {
    const cities = await City.find();
    res.send(cities);
});

router.post("/", async (req, res) => {
    const city = new City({
        postcode: req.body.postcode,
        cityName: req.body.cityName,
        country: req.body.country,
        statistics: req.body.statistics,
        facts: req.body.facts,
        tags: req.body.tags,
        placesToVisit: null,
        reviews: null,
    });
    const result = await city.save();
    res.send(result);
});

router.get("/citiesController/:postcode", async function(req, res, next){
    const postcode = req.params.postcode;
    try{
        const city = await city.findById(postcode);
        if (city == null){
            return res.status(404).send({"message": "City not found"});
        }
        res.send(city);
    } catch (err) {
        return next(err);
    }
});

router.put("/citiesController/:postcode", async function(req, res, next){
    try{
        const city = await City.findById(req.params.postcode);
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
        res.send(city);
    } catch (err) {
        return next(err);
    }
});

router.patch("/citiesController/:postcode", async function(req, res, next){
    try{
        const city = await City.findById(req.params.postcode);
        if (city == null){
            return res.status(404).send({"message": "City not found"});
        }
        city.statistics = (req.body.statistics || city.statistics);
        city.facts = (req.body.facts || city.facts);
        city.tags = (req.body.tags || city.tags);
        await city.save();
        res.send(city);
    } catch (err) {
        return next(err);
    }
});

router.delete("/citiesController/:postcode", async function(req, res, next) {
    const postcode = req.params.postcode;
    try{
        const city = await City.findByIdAndDelete(postcode);
        if (city==null){
            return res.status(404).send({"message": "City not found"});
        }
        res.send(city);
    } catch (err) {
        return next(err);
    } 
});