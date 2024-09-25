const ReviewsModel = require("../models/reviewsModel");
const express = require("express");
const router = express.Router();
const UsersModel = require("../models/usersModel");     


async function getAllReviews(req, res) {
    try {
        const reviews = await ReviewsModel.find(); 
        if (!reviews || reviews.length === 0) {
            return res.status(404).send({ error: 'No reviews found.' });
        }
        res.status(200).send({ reviews });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching reviews.' });
    }
}


async function deleteOldReviews(req, res) { 

    try {
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

        const result = await ReviewsModel.deleteMany({ date: { $lt: fiveYearsAgo } });

        if (result.deletedCount === 0) {
            return res.status(404).send({ "message": "There are no reviews older than 5 years to delete" });
        }
        res.status(200).send({ "message": `${result.deletedCount} reviews deleted successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).send({ "message": "An error occurred while deleting reviews" });
    }
}

module.exports = {
    getAllReviews,
    deleteOldReviews, 
} 