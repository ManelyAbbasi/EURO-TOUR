const UsersModel = require("../models/usersModel");
const PlacesToVisitSchema = require('../models/placesToVisitModel');
const CitiesModel = require('../models/citiesModel');
const usersModel = require("../models/usersModel");
const mongoose = require("mongoose");


async function createUser(req, res, next) {
    try {
        const existingUser = await UsersModel.findOne({ username: req.body.username });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this username already exists' });
        }
        if (typeof req.body.username !== 'string' || req.body.username.trim() === '') {
            return res.status(400).json({ "message": "Invalid username: must be a non-empty string" });
        }
        if (req.body.username.length > 20) {
            return res.status(400).json({ message: 'Username cannot be longer than 20 characters' });
        }
        if (typeof req.body.password !== 'string' || req.body.password.trim() === '') {
            return res.status(400).json({ "message": "Invalid password: must be a non-empty string" });
        }
        if (req.body.password.length > 25) {
            return res.status(400).json({ message: 'Password cannot be longer than 25 characters' });
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
            return res.status(400).json({ message: 'Invalid gender value. Must be male, female, non-binary, or other.' });
        }

        const user = new usersModel(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

async function addToFavorites(req, res) {
    const sessionKey = req.headers['x-auth-token'];
    const { cityId, address } = req.body;

    try {
        const user = await UsersModel.findOne({ "session.key": sessionKey });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let addedFavorite = null;

        if (cityId) {
            const city = await CitiesModel.findById(cityId);

            if (!city) {
                return res.status(404).json({ message: "City not found" });
            }

            const cityAlreadyFavorited = user.cityFavs.includes(city._id);

            if (!cityAlreadyFavorited) {
                user.cityFavs.push(city._id);
                addedFavorite = { type: "city", cityName: city.cityName, country: city.country };
            }
        }

        if (address) {
            const place = await PlacesToVisitSchema.findOne({ address }).populate('city', 'cityName');

            if (!place) {
                return res.status(404).json({ message: "Place not found" });
            }

            const placeAlreadyFavorited = user.placeFavs.includes(place._id);

            if (!placeAlreadyFavorited) {
                user.placeFavs.push(place._id);
                addedFavorite = { type: "place", placeName: place.placeName, cityName: place.city.cityName, address: place.address };
            }
        }

        await user.save();

        const favouriteCities = [];
        const favouritePlaces = [];

        for (const cityId of user.cityFavs) {
            const city = await CitiesModel.findById(cityId);
            favouriteCities.push({
                cityId: city._id,
                cityName: city.cityName,
                country: city.country
            });
        }

        for (const placeId of user.placeFavs) {
            const place = await PlacesToVisitSchema.findById(placeId).populate('city', 'cityName');
            favouritePlaces.push({
                placeId: place._id,
                placeName: place.placeName,
                cityName: place.city.cityName,
                address: place.address
            });
        }

        res.status(200).json({
            message: addedFavorite
                ? `${addedFavorite.type === 'city' ? 'City' : 'Place'} added to favorites successfully`
                : "No new favorites added",
            favouriteCities,
            favouritePlaces
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}


async function updateUser(req, res, next) {
    try {
        const sessionKey = req.headers['x-auth-token'];
        if (!sessionKey) {
            return res.status(401).json({ message: "No session token provided, authorization denied" });
        }

        const currentUser = await UsersModel.findOne({ 'session.key': sessionKey });
        if (!currentUser) {
            return res.status(401).json({ message: "Invalid session token" });
        }

        const userToUpdate = await UsersModel.findOne({ username: req.params.username });
        if (!userToUpdate) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check authorization
        if (currentUser.username !== req.params.username && !currentUser.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to update this user." });
        }

        // Update password
        if (req.body.password !== undefined) {  
            if (typeof req.body.password !== 'string' || req.body.password.trim() === "") {
                return res.status(400).json({ message: "Invalid password: must be a non-empty string" });
            }
            if (req.body.password.length > 25) {
                return res.status(400).json({ message: 'Password cannot be longer than 25 characters' });
            }
            userToUpdate.password = req.body.password; 
        }

        // Update gender
        if (req.body.gender !== undefined) {
            const validGenders = ['male', 'female', 'non-binary', 'other'];
            if (typeof req.body.gender !== 'string' || req.body.gender.trim() === "") {
                return res.status(400).json({ message: "Invalid gender: must be a non-empty string" });
            }
            if (!validGenders.includes(req.body.gender)) {
                return res.status(400).json({ message: 'Invalid gender value. Must be male, female, non-binary, or other.' });
            }
            userToUpdate.gender = req.body.gender;
        }

        // Update isLGBTQIA
        if (req.body.isLGBTQIA !== undefined) {
            if (typeof req.body.isLGBTQIA !== 'boolean') {
                return res.status(400).json({ message: "Invalid isLGBTQIA: must be a boolean value" });
            }
            userToUpdate.isLGBTQIA = req.body.isLGBTQIA;
        }

        await userToUpdate.save();
        res.status(200).json(userToUpdate);
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function deleteOneUser(req, res) {
    try {
        const sessionKey = req.headers['x-auth-token'];
        if (!sessionKey) {
            return res.status(401).json({ message: "No session token provided, authorization denied" });
        }

        const currentUser = await UsersModel.findOne({ 'session.key': sessionKey });
        if (!currentUser) {
            return res.status(401).json({ message: "Invalid session token" });
        }

        const userToDelete = await UsersModel.findOne({ username: req.params.username });
        if (!userToDelete) {
            return res.status(404).json({ message: "User not found" });
        }

        if (currentUser.username !== req.params.username) {
            return res.status(403).json({ message: "You are not authorized to delete this user." });
        }

        if (!req.body.password) {
            return res.status(400).json({ message: "Password is required for deletion." });
        }
        
        if (currentUser.password !== req.body.password) {
            return res.status(403).json({ message: "Passwords don't match." });
        }
        
        await UsersModel.deleteOne({ username: req.params.username });

        res.status(200).json({ message: "User deleted successfully", username: userToDelete.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function login(req, res, next) {
    try {
        const { username, password } = req.body;

        if (typeof username !== 'string' || username.trim() === '') {
            return res.status(400).json({ message: "Invalid username: must be a non-empty string" });
        }
        if (username.length > 20) {
            return res.status(400).json({ message: 'Username cannot be longer than 20 characters' });
        }

        if (typeof password !== 'string' || password.trim() === '') {
            return res.status(400).json({ message: "Invalid password: must be a non-empty string" });
        }
        if (password.length > 25) {
            return res.status(400).json({ message: 'Password cannot be longer than 25 characters' });
        }

        const user = await UsersModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const sessionKey = new mongoose.Types.ObjectId();
        const sessionExpiry = Date.now() + 60 * 60 * 1000;
        user.session = {
            key: sessionKey,
            expiry: sessionExpiry,
        };

        await user.save();

        res.set('x-auth-token', sessionKey);
        res.status(200).json({
            message: "Login successful",
            user: {
                username: user.username,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function removeFromFavorites(req, res) {
    const sessionKey = req.headers['x-auth-token'];
    const { cityId, address } = req.body;

    try {
        const user = await UsersModel.findOne({ "session.key": sessionKey });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let removedCityMessage = null;
        let removedPlaceMessage = null;

        if (cityId) {
            const cityIndex = user.cityFavs.indexOf(cityId);
            if (cityIndex > -1) {
                user.cityFavs.splice(cityIndex, 1);
                removedCityMessage = "City removed from favorites.";
            } else {
                removedCityMessage = "City not found in favorites.";
            }
        }

        if (address) {
            const place = await PlacesToVisitSchema.findOne({ address });
            if (!place) {
                return res.status(404).json({ message: "Place not found" });
            }

            const placeIndex = user.placeFavs.indexOf(place._id);
            if (placeIndex > -1) {
                user.placeFavs.splice(placeIndex, 1);
                removedPlaceMessage = "Place removed from favorites.";
            } else {
                removedPlaceMessage = "Place not found in favorites.";
            }
        }

        await user.save();

        const responseMessages = [];
        if (removedCityMessage) responseMessages.push(removedCityMessage);
        if (removedPlaceMessage) responseMessages.push(removedPlaceMessage);

        res.status(200).json({
            message: responseMessages.length > 0 ? responseMessages.join(' ') : "No changes made.",
            cityFavs: user.cityFavs,
            placeFavs: user.placeFavs
        });

    } catch (err) {
        console.error("Error in removeFromFavorites:", err.message, err.stack);
        res.status(500).json({ message: "Internal server error" });
    }
}


async function getFavorites(req, res) {
    const sessionKey = req.headers['x-auth-token'];

    try {
        const user = await UsersModel.findOne({ "session.key": sessionKey });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const favouriteCities = [];
        const favouritePlaces = [];

        for (const cityId of user.cityFavs) {
            const city = await CitiesModel.findById(cityId);
            if (city) {
                favouriteCities.push({
                    cityId: city._id,
                    cityName: city.cityName,
                    country: city.country
                });
            }
        }

        for (const placeId of user.placeFavs) {
            const place = await PlacesToVisitSchema.findById(placeId).populate('city', 'cityName');
            if (place) {
                favouritePlaces.push({
                    placeId: place._id,
                    placeName: place.placeName,
                    cityName: place.city.cityName,
                    address: place.address
                });
            }
        }

        res.status(200).json({
            favouriteCities,
            favouritePlaces
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    createUser,
    addToFavorites,
    updateUser,
    deleteOneUser,
    login,
    removeFromFavorites,
    getFavorites,
    addToFavorites
}