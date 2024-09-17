const PlacesToVisitModel = require("server\models\placesToVisitModel.js");
const express = require("express");
const placesToVisitModell = require("../models/placesToVisitModel");
const router = express.Router();


router.get("/placesToVisitController", async function getAllPlaces(req, res, next) {
    try {
    const placesToVisit = await PlacesToVisitModel.find();
    } catch (err) {
    return next(err);
    }
    res.send({"placesToVisit": placesToVisit});
    });

router.post("/placesToVisitController", async function createPlace(req, res, next) {
    const placesToVisit = new PlacesToVisitModel(req.body);
    try {
    await placesToVisit.save();
    } catch (err) {
    return next(err);
    }
    res.status(201).send(placesToVisit);
    });

router.get("/placesToVisitController/:address", async function getOnePlace(req, res, next) {  
    const address = req.params.address; 
    try {
        const placesToVisit = await PlacesToVisitModel.findById(address);

        if (placesToVisit == null) {
            return res.status(404).send({ "message": "Place not found" });
        }

        res.send(placesToVisit);
    } catch (err) {
        res.status(500).send({ "message": "Something went wrong" });
    }
});


router.put("/placesToVisitController/:address", async function updatePlace(req, res, next) {
    try {
        const placesToVisit = await PlacesToVisitModel.findById(req.params.address);
        
        if (placesToVisit == null) {
            return res.status(404).send({"message": "Place not found"});
        }
        placesToVisit.address = req.body.address;
        placesToVisit.rating = req.body.rating;
        placesToVisit.content = req.body.content;
        placesToVisit.tags = req.body.tags;
        placesToVisit.reviews = null;
        await placesToVisit.save();
        res.send(placesToVisit);
    } catch (err) {
        return next(err);
    }
});

router.patch("/placesToVisitController/:address", async function patchPlace(req, res, next){
    try{
        const placesToVisit = await PlacesToVisitModel.findById(req.params.address);

        if (placesToVisit == null){
            return res.status(404).send({"message": "Place not found"});
        }

        placesToVisit.content = (req.body.content || placesToVisit.content);
        await place.save();
        res.send(placesToVisit);
    } catch (err) {
        return next(err);
    }
});

router.delete("/placesToVisitController/:address", async function deleteOnePlace(req, res, next) {
    const address = req.params.address; 
    try{
        const placesToVisit = await PlacesToVisitModel.findByIdAndDelete(address);
        
        if (placesToVisit == null){
            return res.status(404).send({"message": "Place not found"});
        }
        res.send(placesToVisit);
    } catch (err) {
        return next(err);
    } 
});


