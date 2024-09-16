const City = require("server\models\city.js");
const express = require("express");
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

router.get("/:postcode", async (req, res) =>{
    const city = await City.find({ postcode: req.params.postcode });
    res.send(city);
})

router.put("/:postcode", async (req, res) =>{
    const postcode = req.params.postcode;
    const updatedCity = {
        "postcode": postcode,
        "cityName": req.body.cityName,
        "country": req.body.country,
        "statistics": req.body.statistics,
        "facts": req.body.facts,
        "tags": req.body.tags,
    }
    const cities = await City.find();
    cities[postcode] = updatedCity;
    res.send(updatedCity);
})