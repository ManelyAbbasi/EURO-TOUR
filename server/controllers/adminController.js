const CitiesModel = require("../models/citiesModel");
const PlacesToVisit = require("../models/placesToVisitModel");
const UsersModel = require("../models/usersModel");
const citiesModel = require("../models/citiesModel");
const adminsSchema = require("../models/adminsModel");
const mongoose = require("mongoose");


async function patchAdmin(req, res, next) {
    try {
        const user = await UsersModel.findOne({ username: req.params.username });

        if (user == null) {
            return res.status(404).json({ "message": "User not found" });
        }

        if (req.body.username !== req.params.username && !req.body.isAdmin) {
            return res.status(403).json({ "message": "You are not authorized to update this user." });
        }
    
        if (typeof password !== 'string' || password.trim() === '') {
            return res.status(400).json({ message: 'Invalid password: must be a non-empty string' });
        }
        user.password = req.body.password || user.password;
        await user.save();

        res.status(200).json(user); 
    } catch (err) {
        next(err);
    }
}

async function createAdmin(req, res, next) {
    try {
        const { username, password } = req.body;

        const existingAdmin = await adminsSchema.findOne({ username });

        if (existingAdmin) {
            return res.status(400).json({ message: 'User with this username already exists' });
        }

        if (typeof username !== 'string' || username.trim() === '') {
            return res.status(400).json({ message: 'Invalid username: must be a non-empty string' });
        }
        if (username.length > 20) {
            return res.status(400).json({ message: 'Username cannot be longer than 20 characters' });
        }

        if (typeof password !== 'string' || password.trim() === '') {
            return res.status(400).json({ message: 'Invalid password: must be a non-empty string' });
        }
        if (password.length > 25) {
            return res.status(400).json({ message: 'Password cannot be longer than 25 characters' });
        }

        const admin = new adminsSchema(req.body);
        await admin.save();
        res.status(201).json(admin);
    } catch (err) {
        next(err);
    }
}

async function deleteCity(req, res) {
    const cityId = req.params.id;
    try {
        if (!req.body.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const deletedCity = await CitiesModel.findByIdAndDelete(cityId);

        if (!deletedCity) {
            return res.status(404).json({ message: "City not found" });
        }

        res.status(200).json({ message: "City deleted successfully", city: deletedCity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function checkIfAdmin(req, res) {
    try {
        if (!req.headers['x-auth-token']) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const user = await UsersModel.findOne({ "session.key": req.headers['x-auth-token'] });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (Date.now() > user.session.expiry) {
            return res.status(401).json({ message: "Session expired" });
        }

        // Return the admin status
        return res.status(200).json({ isAdmin: user.isAdmin });
    } catch (err) {
        console.error('Error checking admin status:', err);
        return res.status(500).json({ message: "Internal server error" });
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

        const admin = await adminsSchema.findOne({ username });

        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }

        if (password !== admin.password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const sessionKey = new mongoose.Types.ObjectId();
        const sessionExpiry = Date.now() + 60 * 60 * 1000;
        admin.session = {
            key: sessionKey,
            expiry: sessionExpiry,
        };

        await admin.save();

        res.set('x-auth-token', sessionKey);
        res.status(200).json({
            message: "Login successful",
            admin: {
                username: admin.username,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports ={
    patchAdmin,
    deleteCity,
    checkIfAdmin,
    createAdmin,
    login
};
