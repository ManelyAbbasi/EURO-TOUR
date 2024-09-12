const City = require(".../models/city");
const express = require("express");
const router = express.Router();

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