const UsersModel = require("../models/usersModel");
const express = require("express");
const router = express.Router();
const ReviewsModel = require('../models/reviewsModel');
const PlacesToVisitSchema = require('../models/placesToVisitModel');
const CitiesModel = require('../models/citiesModel');
var passport = require('passport');


async function createUser(req, res, next) {
    try {
        const existingUser = await UsersModel.findOne({ username: req.body.username });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this username already exists' });
        }
        if (typeof req.body.username !== 'string' || req.body.username.trim() === '') {
            return res.status(400).json({ "message": "Invalid username: must be a non-empty string" });
        }
        if (typeof req.body.password !== 'string' || req.body.password.trim() === '') {
            return res.status(400).json({ "message": "Invalid password: must be a non-empty string" });
        }
        if (!req.body.birthDate || isNaN(Date.parse(req.body.birthDate))) {
            return res.status(400).json({ "message": "Invalid birth date: must be a valid date format" });
        }

        const birthDate = new Date(req.body.birthDate);
        const minDate = new Date('1920-01-01');
        const maxDate = new Date('2012-01-01');

        if (birthDate < minDate || birthDate > maxDate) {
            return res.status(400).json({ message: "Invalid birthDate: must be between 1920-01-01 and 2012-01-01" });
        }
        if (typeof req.body.isLGBTQIA !== 'boolean') {
            return res.status(400).json({ "message": "Invalid isLGBTQIA: must be a boolean value" });
        }
        const validGenders = ['male', 'female', 'non-binary', 'other'];
        if (!validGenders.includes(req.body.gender)) {
            return res.status(400).json({ message: 'Invalid gender value' });
        }
        if (typeof req.body.isAdmin !== 'boolean') {
            return res.status(400).json({ "message": "Invalid isAdmin: must be a boolean value" });
        }

        UsersModel.register(new UsersModel({
            username: req.body.username,
            birthDate: req.body.birthDate,
            isLGBTQIA: req.body.isLGBTQIA,
            gender: req.body.gender,
            isAdmin: req.body.isAdmin
        }), req.body.password, function (err, user) {
            if (err) {
                return res.status(400).json({ "message": err.message });
            }

            passport.authenticate('local')(req, res, function () {
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.status(201).json({ user, "message": "User created & authenticated" });
                });
            });
        });
    } catch (err) {
        next(err);
    }
};

async function getAllUsers(req, res) {

    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: 'You need to be logged in to view this resource.' });
        }

        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        const users = await UsersModel.find(); 
        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'No users found.' });
        }
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
}

/*In future add admin too?*/
async function getUserReviews(req, res) {
    const username = req.params.username;

    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: 'You need to be logged in to view reviews' });
        }

        const user = await UsersModel.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.user.username !== username && !req.user.isAdmin) {
            return res.status(403).json({ message: 'You are not authorized to view these reviews' });
        }

        const reviews = await ReviewsModel.find({ user: user._id });

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this user' });
        }

        res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


async function updateUser(req, res, next) {

    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ "message": "You need to be logged in to update a user." });
        }

        const user = await UsersModel.findOne({ username: req.params.username });
        
        if (user == null) {
            return res.status(404).json({ "message": "User not found" });
        }
        if (req.user.username !== req.params.username && !req.user.isAdmin) {
            return res.status(403).json({ "message": "You are not authorized to update this user." });
        }
        if (req.body.password !== undefined) {  
            if (typeof req.body.password !== 'string' || req.body.password.trim() === "") {
                return res.status(400).json({ "message": "Invalid password: must be a non-empty string" });
            }
            user.password = req.body.password
        }
        if (req.body.gender !== undefined) {
            const validGenders = ['male', 'female', 'non-binary', 'other'];
            if (!validGenders.includes(req.body.gender)) {
                return res.status(400).json({ message: 'Invalid gender value' });
            }
            user.gender = req.body.gender;
        } 
        if (req.body.isLGBTQIA !== undefined) {
            if (typeof req.body.isLGBTQIA !== 'boolean') {
                return res.status(400).json({ "message": "Invalid isLGBTQIA: must be a boolean value" });
            }
            user.isLGBTQIA = req.body.isLGBTQIA;
        }

        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).next(err);
    }
}


async function patchUser(req, res, next) {

    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ "message": "You need to be logged in to update a user." });
        }

        const user = await UsersModel.findOne({ username: req.params.username });
        if (user == null) {
            return res.status(404).json({ "message": "User not found" });
        }
        if (req.user.username !== req.params.username && !req.user.isAdmin) {
            return res.status(403).json({ "message": "You are not authorized to update this user." });
        }
        if (!req.isAuthenticated() || req.user._id.toString() !== user._id.toString()) {
            return res.status(401).json({ "message": "You are not authorized to edit this user" });
        }

        user.password = req.body.password || user.password;
        await user.save();
        res.status(200).json(user); 
    } catch (err) {
        res.status(500).next(err); 
    }
}


async function deleteOneUser(req, res) {
    const username = req.params.username;

    try {
        if (!req.isAuthenticated() || (req.user.username !== username && !req.user.isAdmin)) {
            return res.status(403).json({ message: "You are not authorized to delete this user" });
        }
        
        const user = await UsersModel.findOneAndDelete({ username: username });
        
        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }

        res.status(200).json({ "message": "User deleted successfully", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "message": "Internal server error" });
    }
}


async function deleteUserByAdmin(req, res) {
    const usernameToDelete = req.params.username; 

    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "You need to be logged in to perform this action." });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const userToDelete = await UsersModel.findOneAndDelete({ username: usernameToDelete });

        if (!userToDelete) {
            return res.status(404).json({ "message": "User not found" });
        }

        res.status(200).json({ "message": "User deleted successfully", user: userToDelete });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "message": "Internal server error" });
    }
};


async function deletePlaceViaAdmin(req, res) {
    const address = req.params.address;

    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "You need to be logged in to perform this action." });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const deletedPlace = await PlacesToVisitSchema.findOneAndDelete({ address: address });

        if (!deletedPlace) {
            return res.status(404).json({ message: "Place not found" });
        }

        res.status(200).json({ message: "Place deleted successfully", place: deletedPlace });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


async function deleteCityViaAdmin(req, res) {
    const cityId = req.params.cityId;

    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "You need to be logged in to perform this action." });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const deletedCity = await CitiesModel.findOneAndDelete({cityId: cityId});

        if (!deletedCity) {
            return res.status(404).json({ message: "City not found" });
        }

        res.status(200).json({ message: "City deleted successfully", city: deletedCity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteReviewViaAdmin(req, res) {
    const { username, review_id } = req.params;

    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "You need to be logged in to perform this action." });
        }

        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const user = await UsersModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const review = await ReviewsModel.findOne({ _id: review_id, user: user._id });
        if (!review) {
            return res.status(404).json({ message: "Review not found or doesn't belong to the specified user" });
        }
        await ReviewsModel.findByIdAndDelete(review_id);
        res.status(200).json({ message: "Review deleted successfully", review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserReviews,
    updateUser,
    patchUser,
    deleteOneUser,
    deleteUserByAdmin,
    deletePlaceViaAdmin,
    deleteCityViaAdmin,
    deleteReviewViaAdmin
}