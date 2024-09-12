const PlacesToVisit = require("server\models\placesToVisit.js");
const express = require("express");
const router = express.Router();

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