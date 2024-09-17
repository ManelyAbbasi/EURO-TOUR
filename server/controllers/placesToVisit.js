const PlacesToVisit = require("server\models\placesToVisit.js");
const express = require("express");
const placesToVisit = require("../models/placesToVisit");
const router = express.Router();

router.get("/", async (req, res) => {
    const allPlacesToVisit = await PlacesToVisit.find();
    res.send(allPlacesToVisit);
});

router.post("/", async (req, res) => {
    const placesToVisit = new PlacesToVisit({
        address: req.body.address,
        rating: req.body.rating,
        content: req.body.content,
        tags: req.body.tags,
    });
    const result = await placesToVisit.save();
    res.send(result);
});

router.get("/placesToVisit/:address", async function(req, res, next) {  
    const address = req.params.address; 
    try {
        const place = await PlacesToVisit.findById(address);

        if (place == null) {
            return res.status(404).send({ "message": "Place not found" });
        }

        res.send(place);
    } catch (err) {
        res.status(500).send({ "message": "Something went wrong" });
    }
});


router.put("/placesToVisit/:address", async function(req, res, next) {
    try {
        const place = await PlacesToVisit.findById(req.params.address);
        
        if (place == null) {
            return res.status(404).send({"message": "Place not found"});
        }
        place.address = req.body.address;
        place.rating = req.body.rating;
        place.content = req.body.content;
        place.tags = req.body.tags;
        await place.save();
        res.send(place);
    } catch (err) {
        return next(err);
    }
});

router.patch("/placesToVisit/:address", async function(req, res, next){
    try{
        const place = await PlacesToVisitlacesToVisit.findById(req.params.address);

        if (place == null){
            return res.status(404).send({"message": "Place not found"});
        }

        place.content = (req.body.content || place.content);
        await place.save();
        res.send(place);
    } catch (err) {
        return next(err);
    }
});


