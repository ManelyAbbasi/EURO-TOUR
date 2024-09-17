const City = require("server\models\city.js");
const express = require("express");
const city = require("../models/city");
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
    });
    const result = await city.save();
    res.send(result);
});

router.get("/city/:postcode", async function(req, res, next){
    const postcode = req.params.postcode;
    try{
        const city = await Camel.findById(city);
        if (city == null){
            return res.status(404).send({"message": "City not found"});
        }
        res.send(city);
    } catch (err) {
        return next(err);
    }
});

router.put("/city/:postcode", async function(req, res, next){
    try{
        const city = await City.findById(postcode);
        if (city == null){
            return res.status(404).send({"message": "City not found"});
        }
        city.cityName = (req.body.cityName || city.cityName);
        city.country = (req.body.country || city.country);
        city.statistics = (req.body.statistics || city.statistics);
        city.facts = (req.body.facts || city.facts);
        city.tags = (req.body.tags || city.tags);
        await city.save(city);
        res.send(city);
    } catch (err) {
        return next(err);
    }
});