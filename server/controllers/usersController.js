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

            const cityAlreadyFavorited = user.favourites.some(fav => fav.city.toString() === city._id.toString());

            if (!cityAlreadyFavorited) {
                user.favourites.push({ city: city._id, places: [] });
                addedFavorite = { type: "city", cityName: city.cityName, country: city.country };
            }
        }

        if (address) {
            const place = await PlacesToVisitSchema.findOne({ address }).populate('city', 'cityName');

            if (!place) {
                return res.status(404).json({ message: "Place not found" });
            }

            const placeAlreadyFavorited = user.favourites.some(fav => fav.places && fav.places.includes(place._id));

            if (!placeAlreadyFavorited) {
                let favouriteCity = user.favourites.find(fav => fav.city.toString() === place.city._id.toString());

                if (favouriteCity) {
                    favouriteCity.places.push(place._id);
                } else {
                    user.favourites.push({ city: place.city._id, places: [place._id] });
                }

                addedFavorite = { type: "place", placeName: place.placeName, cityName: place.city.cityName, address: place.address };
            }
        }

        await user.save();

        const favouriteCities = [];
        const favouritePlaces = [];

        for (const fav of user.favourites) {
            const city = await CitiesModel.findById(fav.city);
            favouriteCities.push({
                cityId: city._id,
                cityName: city.cityName,
                country: city.country
            });
            if (fav.places.length > 0) {
                const places = await PlacesToVisitSchema.find({ _id: { $in: fav.places } });
                for (const place of places) {
                    favouritePlaces.push({
                        placeId: place._id,
                        placeName: place.placeName,
                        cityName: city.cityName,
                        address: place.address // Add address here
                    });
                }
            }
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


async function getAllUsers(req, res) {

    try {
        if (!req.body.isAdmin) {
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


async function updateUser(req, res, next) {

    try {

        const user = await UsersModel.findOne({ username: req.params.username });
        
        if (user == null) {
            return res.status(404).json({ "message": "User not found" });
        }
        if (req.body.username !== req.params.username && !req.body.isAdmin) {
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
        const user = await UsersModel.findOne({ username: req.params.username });

        if (user == null) {
            return res.status(404).json({ "message": "User not found" });
        }

        if (req.body.username !== req.params.username && !req.body.isAdmin) {
            return res.status(403).json({ "message": "You are not authorized to update this user." });
        }

        user.password = req.body.password || user.password;
        await user.save(); // Save the updated user

        res.status(200).json(user); 
    } catch (err) {
        next(err); // Pass the error to the next middleware
    }
}



async function deleteOneUser(req, res) {
    const username = req.params.username;

    try {
        if (req.body.username !== username && !req.body.isAdmin) {
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

async function deleteUserHelper(username, res) {
    const userToDelete = await UsersModel.findOneAndDelete({ username });

    if (!userToDelete) {
        return res.status(404).json({ "message": "User not found" });
    }

    res.status(200).json({ "message": "User deleted successfully", user: userToDelete });
}
 

async function deleteUserByAdmin(req, res) {
    const usernameToDelete = req.params.username; 

    try {

        if (!req.body.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        await deleteUserHelper(usernameToDelete, res);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ "message": "Internal server error" });
    }
}


async function deletePlaceViaAdmin(req, res) {
    const address = req.params.address;

    try {
        if (!req.body.isAdmin) {
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
        if (!req.body.isAdmin) {
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

async function login(req, res, next) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await UsersModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const sessionKey = new mongoose.Types.ObjectId();
        const sessionExpiry = Date.now() + 60 * 60 * 1000; // 1 hour session expiry
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
    const sessionKey = req.headers['x-auth-token'];

    try {
        const user = await UsersModel.findOne({ "session.key": sessionKey });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const favouriteCities = [];
        const favouritePlaces = [];

        for (const fav of user.favourites) {
            const city = await CitiesModel.findById(fav.city);

            if (city) {
                favouriteCities.push({
                    cityId: city._id,
                    cityName: city.cityName,
                    country: city.country
                });

                if (fav.places.length > 0) {
                    const places = await PlacesToVisitSchema.find({ _id: { $in: fav.places } });

                    for (const place of places) {
                        favouritePlaces.push({
                            placeId: place._id,
                            placeName: place.placeName,
                            cityName: city.cityName,
                            address: place.address
                        });
                    }
                }
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
    getAllUsers,
    updateUser,
    patchUser,
    deleteOneUser,
    deleteUserByAdmin,
    deletePlaceViaAdmin,
    deleteCityViaAdmin,
    login,
    removeFromFavorites,
    getFavorites,
    addToFavorites
}