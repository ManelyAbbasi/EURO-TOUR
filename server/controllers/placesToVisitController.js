const placesToVisitModel = require("../models/placesToVisitModel");
const PlacesToVisitModel = require("../models/placesToVisitModel");
const ReviewsModel = require("../models/reviewsModel");
const UsersModel = require("../models/usersModel");


async function createReviewToPlace(req, res) {
    const address = req.params.address;

    try {

        const place = await PlacesToVisitModel.findOne({ address });
        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }

        const user = await UsersModel.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (typeof req.body.rating !== 'number') {
            return res.status(400).json({ message: "Invalid rating: must be a number" });
        }
        if (req.body.rating < 0.0 || req.body.rating > 5.0) {
            return res.status(400).json({ message: "Invalid rating: must be between 0.0 and 5.0" });
        }
        if (typeof req.body.content !== 'string' || req.body.content.trim() === '') {
            return res.status(400).json({ message: "Invalid content: must be a non-empty string" });
        }

        const review = new ReviewsModel({
            rating: req.body.rating,
            content: req.body.content,
            date: Date.now(),
            user: user._id,
        });

        await review.save();

        place.reviews.push(review._id);
        await place.save();

        res.status(201).json({ message: "Review added successfully", review });

    } catch (err) {
        console.error("Error adding review to place:", err);
        res.status(500).json({ message: "An error occurred while adding the review.", error: err.message });
    }
}


async function getAllPlaces(req, res) {
    try {
        const { tags } = req.query;

        let filter = {};

        // If 'tags' are provided in the query, filter places by those tags
        if (tags) {
            const tagsArray = tags.split(','); // Convert tags string to array (comma-separated)
            filter = { tags: { $all: tagsArray } };
        }

        const placesToVisit = await placesToVisitModel.find(filter);
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
        const placesToVisit = await PlacesToVisitModel.findOne({ address }); 
        if (!placesToVisit) {
            return res.status(404).json({ message: "Place not found" });
        }
        res.status(200).json(placesToVisit);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the place.' })
    }
}


async function getReviewsForPlace(req, res) {
    const address = req.params.address;
    const minRating = parseFloat(req.query.minRating); // Get min rating from query
    const maxRating = parseFloat(req.query.maxRating); // Get max rating from query
    const sortOrder = req.query.sortOrder || 'asc';

    try {
        const place = await PlacesToVisitModel.findOne({ address }).populate('reviews');
        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }

        let reviews = place.reviews;

        if (!isNaN(minRating) || !isNaN(maxRating)) {
            reviews = reviews.filter(review => {
                const reviewRating = review.rating;
                return (isNaN(minRating) || reviewRating >= minRating) && 
                       (isNaN(maxRating) || reviewRating <= maxRating);
            });
        }

        if (reviews.length > 0) {
            reviews.sort((a, b) => {
                if (sortOrder === 'desc') {
                    return b.rating - a.rating; // Descending order
                } else {
                    return a.rating - b.rating; // Ascending order
                }
            });
        }

        res.status(200).json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the reviews.' });
    }
}


async function updatePlace(req, res, next) {
    try {

        if (!req.user.isAdmin) {
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
        if (!req.user.isAdmin) {
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
        if (!req.user.isAdmin) {
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


async function deleteReviewsByAddress(req, res) {
    const address = req.params.address;

    try {
        const place = await PlacesToVisitModel.findOne({ address }).populate('reviews');
        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }
        if (place.reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this place' });
        }

        // Retrieve the review objects before deletion
        const reviewsToDelete = await ReviewsModel.find({ _id: { $in: place.reviews } });
        if (!reviewsToDelete || reviewsToDelete.length === 0) {
            return res.status(404).json({ message: 'No reviews found to delete' });
        }

        const result = await ReviewsModel.deleteMany({ _id: { $in: place.reviews } });
        place.reviews = [];
        await place.save();

        res.status(200).json({
            message: `Successfully deleted ${result.deletedCount} reviews for the place at address: ${address}`,
            deletedReviews: reviewsToDelete
        });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting reviews', details: error.message });
    }
}
 

module.exports = {
    createReviewToPlace,
    getReviewsForPlace,
    getAllPlaces,
    getOnePlace,
    updatePlace,
    patchPlace,
    deleteOnePlace,
    deleteReviewsByAddress,
}