const placesToVisitModel = require("../models/placesToVisitModel");
const PlacesToVisitModel = require("../models/placesToVisitModel");
const UsersModel = require("../models/usersModel");


async function getAllPlaces(req, res) { 
    try {
        const { tags, minRating, maxRating, sortByRating } = req.query;

        let filter = {};

        if (tags) {
            const tagsArray = tags.split(','); 
            filter.tags = { $all: tagsArray };
        }

        if (minRating || maxRating) {
            filter.rating = {}; 
            if (minRating) filter.rating.$gte = parseFloat(minRating); // $gte = greater than or equal
            if (maxRating) filter.rating.$lte = parseFloat(maxRating); // $lte = less than or equal
        }

        let sortOption = {};

        if (sortByRating) {
            sortOption.rating = sortByRating === 'asc' ? 1 : -1; // Ascending = 1, Descending = -1
        }

        const placesToVisit = await placesToVisitModel.find(filter).sort(sortOption).populate({
            path: 'city',  // Adjust to match the schema field
            select: 'cityName'  // Select only the city name field
        });

        if (!placesToVisit || placesToVisit.length === 0) {
            return res.status(404).json({ error: 'No places found.' });
        }

        res.status(200).json({ placesToVisit });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching places.' });
    }
}


async function getOnePlace(req, res) {
    const address = req.params.address;

    try {
        const placesToVisit = await PlacesToVisitModel.findOne({ address }).populate({
            path: 'city',  // Path to populate
            select: 'cityName'  // Only select the cityName field from the City model
        }); 
        if (!placesToVisit) {
            return res.status(404).json({ message: "Place not found" });
        }
        res.status(200).json(placesToVisit);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the place.' })
    }
}


async function updatePlace(req, res, next) {
    try {

        if (!req.body.isAdmin) {
            return res.status(403).json({ message: "Access denied. Only admins can update places." });
        }

        const placesToVisit = await PlacesToVisitModel.findOne({ address: req.params.address });
        if (placesToVisit == null) {
            return res.status(404).json({ message: "Place not found" });
        }

        if (req.body.placeName !== undefined) {
            if (typeof req.body.placeName !== 'string' || req.body.placeName.trim() === "") {
                return res.status(400).json({ message: "Invalid placeName: must be a non-empty string" });
            }
            placesToVisit.placeName = req.body.placeName;
        }
        if (req.body.address !== undefined) {
            if (typeof req.body.address !== 'string' || req.body.address.trim() === "") {
                return res.status(400).json({ message: "Invalid address: must be a non-empty string" });
            }
            placesToVisit.address = req.body.address;
        }
        if (req.body.rating !== undefined) {
            if (req.body.rating < 0.0 || req.body.rating > 5.0) {
                return res.status(400).json({ message: "Invalid rating: must be between 0.0 and 5.0" });
            }
            placesToVisit.rating = req.body.rating;
        }
        if (req.body.content !== undefined) {
            if (typeof req.body.content !== 'string' || req.body.content.trim() === '') {
                return res.status(400).json({ message: "Invalid content: must be a non-empty string" });
            }
            placesToVisit.content = req.body.content;
        }
        if (Array.isArray(req.body.tags)) {
            if (req.body.tags.length === 0) {
                return res.status(400).json({ message: "Tags cannot be an empty array" });
            }
            placesToVisit.tags = req.body.tags;
        }

        await placesToVisit.save();
        return res.status(200).json(placesToVisit);
    } catch (err) {
        if (err.name === 'ValidationError' && err.errors && err.errors.tags) {
            return res.status(400).json({ message: "Invalid tag(s) provided. Please provide valid tags." });
        }
        return next(err);
    }
}


async function patchPlace(req, res) {
    try {
        if (!req.body.isAdmin) {
            return res.status(403).json({ message: "Access denied. Only admins can patch places." });
        }

        const placesToVisit = await PlacesToVisitModel.findOne({ address: req.params.address });
        if (placesToVisit == null) {
            return res.status(404).json({ message: "Place not found" });
        }

        placesToVisit.content = req.body.content || placesToVisit.content;
        await placesToVisit.save();
        res.status(200).json(placesToVisit);
    } catch (err) {
        if (err.name === 'ValidationError' && err.errors && err.errors.tags) {
            return res.status(400).json({ message: "Invalid tag(s) provided. Please provide valid tags." });
        }
        return res.status(500).next(err);
    }
}

async function deleteOnePlace(req, res) {
    const address = req.params.address;

    try {
        if (!req.body.isAdmin) {
            return res.status(403).json({ message: "Access denied. Only admins can delete places." });
        }

        const result = await PlacesToVisitModel.deleteOne({ address: address });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Place not found" });
        }
        
        res.status(200).json({ message: "Place deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getAllPlaces,
    getOnePlace,
    updatePlace,
    patchPlace,
    deleteOnePlace,
}