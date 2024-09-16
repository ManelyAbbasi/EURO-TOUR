const City = require("server\models\city.js");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    const cities = await City.find();
    res.send(cities);
});

router.post("/", async (req, res) => {
    const city = new City({
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