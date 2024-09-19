const PlacesToVisitModel = require("../models/placesToVisitModel");
const express = require("express");
//const placesToVisitModell = require("../models/placesToVisitModel");
const router = express.Router();

    
    async function getAllPlaces(req, res) {
        try {
            const placesToVisit = await placesToVisit.find(); // Fetch users from the database
            res.status(201).send({ placesToVisit });
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while fetching places.' });
        }
    }

async function createPlace(req, res, next) {
    const placesToVisit = new PlacesToVisitModel(req.body);
    try {
    await placesToVisit.save();
    } catch (err) {
    return res.status(500).next(err);
    }
    res.status(201).send(placesToVisit);
    };

async function getOnePlace(req, res) {
    const address = req.params.address;
    try {

        const placesToVisit = await PlacesToVisitModel.findOne({ address }); 

        if (!placesToVisit) {
            return res.status(404).send({ message: "Place not found" });
        }

        res.status(200).send(placesToVisit);
    } catch (err) {
        res.status(500).send({ error: 'An error occurred while fetching the place.' })
    }
}


async function updatePlace(req, res, next) {
    try {
        const placesToVisit = await PlacesToVisitModel.findById(req.params.address);
        if (placesToVisit == null) {
            return res.status(404).send({"message": "Place not found"});
        }
        placesToVisit.placeName = req.body.placeName;
        placesToVisit.address = req.body.address;
        placesToVisit.rating = req.body.rating;
        placesToVisit.content = req.body.content;
        placesToVisit.tags = req.body.tags;
        placesToVisit.reviews = null;
        await placesToVisit.save();
        res.status(201).send(placesToVisit);
    } catch (err) {
        return res.status(500).next(err);
    }
};

async function patchPlace(req, res, next){
    try{
        const placesToVisit = await PlacesToVisitModel.findById(req.params.address);

        if (placesToVisit == null){
            return res.status(404).send({"message": "Place not found"});
        }

        placesToVisit.content = (req.body.content || placesToVisit.content);
        await place.save();
        res.status(201).send(placesToVisit);
    } catch (err) {
        return res.status(500).next(err);
    }
};

async function deleteOnePlace(req, res, next) {
    const address = req.params.address; 
    try{
        const placesToVisit = await PlacesToVisitModel.findByIdAndDelete(address);
        
        if (placesToVisit == null){
            return res.status(404).send({"message": "Place not found"});
        }
        res.status(201).send(placesToVisit);
    } catch (err) {
        return res.status(500).next(err);
    } 
};

module.exports = {
    getAllPlaces,
    createPlace,
    getOnePlace,
    updatePlace,
    patchPlace,
    deleteOnePlace,
}