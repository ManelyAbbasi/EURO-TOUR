const ReviewsModel = require("../models/reviewsModel");
const express = require("express");
const router = express.Router();
//const reviewsModel = require("../models/reviewsModel");


async function createReview(req, res, next) {
    const reviews = new ReviewsModel(req.body);
    try {
    await reviews.save();
    } catch (err) {
    return res.status(500).next(err);
    }
    res.status(201).send(reviews);
    };

async function getAllreviews(req, res, next) {
    try {
    const reviews = await ReviewsModel.find();
    } catch (err) {
    return res.status(500).next(err);
    }
    res.status(201).send({"reviews": reviews});
    };

async function deleteOldReviews(req, res, next) {
    try {
        // calculate the date 5 years ago
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

        // delete reviews older than 5 years
        const result = await ReviewsModel.deleteMany({ date: { $lt: fiveYearsAgo } }); 

        if (result.deletedCount === 0) {
            return res.status(404).send({ "message": "There are no reviews older than 5 years to delete" });
        }
        res.status(201).send(result);
    } catch (err) {
        res.status(500).send({ "message": "An error occurred while deleting reviews" });
    }
};

module.exports = {
    createReview, 
    getAllReviews,
    deleteOldReviews,
} 