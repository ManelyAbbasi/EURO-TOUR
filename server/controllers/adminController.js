const CitiesModel = require("../models/citiesModel");
const PlacesToVisit = require("../models/placesToVisitModel");
const UsersModel = require("../models/usersModel");
const citiesModel = require("../models/citiesModel");
const adminsSchema = require("../models/adminsModel");
const mongoose = require("mongoose");



async function patchAdmin(req, res, next) {
    try {
        const sessionKey = req.headers['x-auth-token'];
        const { password } = req.body;
        const username = req.params.name;

        if (!sessionKey) {
            return res.status(401).json({ message: "No session token provided, authorization denied" });
        }

        if (typeof password !== 'string' || password.trim() === '') {
            return res.status(400).json({ message: "Invalid password: must be a non-empty string" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        if (password.length > 25) {
            return res.status(400).json({ message: "Password cannot be longer than 25 characters" });
        }

        const admin = await adminsSchema.findOne({ username, 'session.key': sessionKey });

        if (!admin) {
            return res.status(401).json({ message: "Invalid session token or username" });
        }

        admin.password = password;
        await admin.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error('Password update error:', error);
        return res.status(500).json({ message: "Internal server error", error });
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
        const adminCheckResponse = await checkIfAdmin(req);

        if (!adminCheckResponse.isAdmin) {
            return res.status(403).json({ message: "Access denied. Only admins can delete a city." });
        }

        const deletedCity = await CitiesModel.findByIdAndDelete(cityId);

        if (!deletedCity) {
            return res.status(404).json({ message: "City not found" });
        }

        return res.status(200).json({ message: "City deleted successfully", city: deletedCity });
    } catch (error) {
        console.error('Error deleting city:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function checkIfAdmin(req) {
    if (!req.headers['x-auth-token']) {
        return { isAdmin: false, message: "Access denied. No token provided." };
    }

    const token = req.headers['x-auth-token'];

    const admin = await adminsSchema.findOne({ "session.key": token });
    if (admin) {
        if (Date.now() > admin.session.expiry) {
            return { isAdmin: false, message: "Session expired" };
        }
        return { isAdmin: true };
    }

    const user = await UsersModel.findOne({ "session.key": token });
    if (user) {
        if (Date.now() > user.session.expiry) {
            return { isAdmin: false, message: "Session expired" };
        }
        return { isAdmin: false };
    }

    return { isAdmin: false, message: "User or admin not found" };
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

async function getAllAdmins(req, res, next) {
    try {
        const admins = await adminsSchema.find({});
        res.status(200).json(admins);
    } catch (err) {
        next(err);
    }
}


module.exports ={
    patchAdmin,
    deleteCity,
    checkIfAdmin, 
    createAdmin,
    login,
    getAllAdmins
};
