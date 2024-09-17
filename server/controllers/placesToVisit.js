const PlacesToVisit = require("server\models\placesToVisit.js");
const express = require("express");
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

router.get('/:address', async (req, res) => {
    try {
        var place = await PlacesToVisit.find({ address: req.params.address });

        if (place === null) {
            return res.status(404).send({ "message": "Place not found" });
        }

        res.send(place);
    } catch (err) {
        res.status(500).send({ "message": "Something went wrong" });
    }
});



