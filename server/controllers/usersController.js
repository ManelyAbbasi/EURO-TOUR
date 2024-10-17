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
        if (typeof req.body.isAdmin !== 'boolean') {
            return res.status(400).json({ "message": "Invalid isAdmin: must be a boolean value" });
        }

        const user = new usersModel(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

async function addToFavorites(req, res) {
    const username = req.params.username;
    const { cityId, address } = req.body;

    try {
        const user = await UsersModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (cityId) {
            const cityExists = await CitiesModel.findById(cityId);
            if (!cityExists) {
                return res.status(404).json({ message: "City not found" });
            }
            user.favourites.push({ city: cityId, places: [] });
        }

        if (address) {
            const placeExists = await PlacesToVisitSchema.findOne({ address });
            if (!placeExists) {
                return res.status(404).json({ message: "Place not found" });
            }

            const favouriteCity = user.favourites.find(fav => fav.city.toString() === placeExists.city.toString());
            if (favouriteCity) {
                if (!favouriteCity.places.includes(placeExists._id)) {
                    favouriteCity.places.push(placeExists._id); 
                }
            } else {
                user.favourites.push({ city: placeExists.city, places: [placeExists._id] });
            }
        }

        await user.save();
        res.status(200).json({ message: "Added to favorites successfully", favourites: user.favourites });
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

        if (currentUser.username !== req.params.username && !currentUser.isAdmin) {
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
                isAdmin: user.isAdmin,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function removeFromFavorites(req, res) {
    const username = req.params.username;
    const { cityId, address } = req.body;

    try {
        const user = await UsersModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let removedCityMessage = null;
        let removedPlaceMessage = null;

        if (cityId && address) {
            const favouriteCity = user.favourites.find(fav => fav.city.toString() === cityId);
            if (favouriteCity) {
                const originalLength = favouriteCity.places.length;
                favouriteCity.places = favouriteCity.places.filter(place => place.address !== address);
                
                if (favouriteCity.places.length < originalLength) {
                    removedPlaceMessage = "Place removed from favorites.";
                } else {
                    removedPlaceMessage = "Place not found in favorites."; 
                }
                
                if (favouriteCity.places.length === 0) {
                    user.favourites = user.favourites.filter(fav => fav.city.toString() !== cityId);
                    removedCityMessage = "City removed from favorites.";
                }
            } else {
                removedCityMessage = "City not found in favorites.";
            }
        } 
        
        else if (cityId) {
            const favouriteCity = user.favourites.find(fav => fav.city.toString() === cityId);
            if (favouriteCity) {
                user.favourites = user.favourites.filter(fav => fav.city.toString() !== cityId);
                removedCityMessage = "City removed from favorites.";
            } else {
                return res.status(404).json({ message: "City not found in favorites." });
            }
        } 
        
        else if (address) {
            let placeRemoved = false;
            for (const favourite of user.favourites) {
                if (favourite.places.some(place => place.address === address)) {
                    favourite.places = favourite.places.filter(place => place.address !== address);
                    placeRemoved = true;
                    removedPlaceMessage = "Place removed from favorites.";
                    break;
                }
            }
            if (!placeRemoved) {
                return res.status(404).json({ message: "Place not found in favorites." });
            }
        }
        await user.save();
        
        const responseMessages = [];
        if (removedCityMessage) responseMessages.push(removedCityMessage);
        if (removedPlaceMessage) responseMessages.push(removedPlaceMessage);

        res.status(200).json({ 
            message: responseMessages.length > 0 ? responseMessages.join(' ') : "No changes made.",
            favourites: user.favourites 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}


async function getFavorites(req, res) {
    const username = req.params.username;

    try {
        const user = await UsersModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ favourites: user.favourites });
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
    getFavorites
}