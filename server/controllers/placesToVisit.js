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

router.delete('/', async (req, res) => {
    try {
        const result = await PlacesToVisit.deleteMany();  // Removes all placesToVisit

        if (result.deletedCount === 0) {
            return res.status(404).json({ "message": "There are no places to delete" });
        }

        return res.status(200).json({ "message": "All places deleted successfully" });

    } catch (err) {
        res.status(500).json({ "message": "An error occurred while deleting places" });
    }
});
