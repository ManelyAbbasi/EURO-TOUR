const UsersModel = require("../models/usersModel");
const express = require("express");
const router = express.Router();
//const usersModel = require("../models/usersModel");

async function getAllUsers(req, res) {
    try {
        const users = await UsersModel.find(); // Fetch users from the database
        if (!users || users.length === 0) {
            return res.status(404).send({ error: 'No users found.' });
        }
        res.status(200).send({ users });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching users.' });
    }
}


async function createUser(req, res, next) {
    try {
        const existingUser = await UsersModel.findOne({ username: req.body.username });

        if (existingUser) { // check if existing user exists
            return res.status(400).send({ message: 'User with this username already exists' });
        }

        if (typeof req.body.username !== 'string' || req.body.username.trim() === '') {
            return res.status(400).send({ "message": "Invalid username: must be a non-empty string" });
        }
        if (typeof req.body.password !== 'string' || req.body.password.trim() === '') {
            return res.status(400).send({ "message": "Invalid password: must be a non-empty string" });
        }
        if (!req.body.birthDate || isNaN(Date.parse(req.body.birthDate))) {
            return res.status(400).send({ "message": "Invalid birth date: must be a valid date format" });
        }
        const birthDate = new Date(req.body.birthDate);
        const minDate = new Date('1920-01-01');
        const maxDate = new Date('2012-01-01');
        if (birthDate < minDate || birthDate > maxDate) {
            return res.status(400).send({ message: "Invalid birthDate: must be between 1920-01-01 and 2012-01-01" });
        }
        if (typeof req.body.isLGBTQIA !== 'boolean') {
            return res.status(400).send({ "message": "Invalid isLGBTQIA: must be a boolean value" });
        }
        const validGenders = ['male', 'female', 'non-binary', 'other'];
        if (!validGenders.includes(req.body.gender)) {
            return res.status(400).send({ message: 'Invalid gender value' });
        }
        if (typeof req.body.isAdmin !== 'boolean') {
            return res.status(400).send({ "message": "Invalid isAdmin: must be a boolean value" });
        }

        const users = new UsersModel(req.body);
        await users.save();
        res.status(201).send(users);
    } catch (err) {
        next(err); // Pass the error to the next middleware
    }
 };


async function updateUser(req, res, next) {
    try {
        const user = await UsersModel.findOne({ username: req.params.username });
        if (user == null) {
            return res.status(404).send({ "message": "User not found" });
        }
        if (req.body.password !== undefined) {  
            if (typeof req.body.password !== 'string' || req.body.password.trim() === "") {
                return res.status(400).send({ "message": "Invalid password: must be a non-empty string" });
            }
            user.password = req.body.password
        }

        if (req.body.gender !== undefined) {
            const validGenders = ['male', 'female', 'non-binary', 'other'];
            if (!validGenders.includes(req.body.gender)) {
                return res.status(400).send({ message: 'Invalid gender value' });
            }
            user.gender = req.body.gender;
        } 
        if (req.body.isLGBTQIA !== undefined) {
            if (typeof req.body.isLGBTQIA !== 'boolean') {
                return res.status(400).send({ "message": "Invalid isLGBTQIA: must be a boolean value" });
            }
            user.isLGBTQIA = req.body.isLGBTQIA;
        }

        await user.save();
        res.status(200).send(user);

    } catch (err) {
        res.status(500).next(err);
    }
}

async function patchUser(req, res, next) {
    try {
        const user = await UsersModel.findOne({ username: req.params.username });
        if (user == null) {
            return res.status(404).send({ "message": "User not found" });
        }

        user.password = req.body.password || user.password;
        await user.save();
        res.status(200).send(user); 
    } catch (err) {
        res.status(500).next(err); 
    }
}

async function deleteOneUser(req, res) {
    const username = req.params.username;
    try {
        const user = await UsersModel.findOneAndDelete({ username: username });
        
        if (!user) {
            return res.status(404).send({ "message": "User not found" });
        }

        res.status(200).send({ "message": "User deleted successfully", user });
    } catch (err) {
        console.error(err);
        res.status(500).send({ "message": "Internal server error" });
    }
}

async function adminDeletesOneUser(req, res) {
    const usernameToDelete = req.params.username; 
    const adminUsername = req.body.username; 

    try {
        // Check if the requester user exists
        const adminUser = await UsersModel.findOne({ username: adminUsername });

        if (!adminUser) {
            return res.status(404).send({ "message": "Requester user not found" });
        }
        if (!adminUser.isAdmin) {
            return res.status(403).send({ "message": "Access denied. Admins only." });
        }

        const userToDelete = await UsersModel.findOneAndDelete({ username: usernameToDelete });

        if (!userToDelete) {
            return res.status(404).send({ "message": "User not found" });
        }

        res.status(200).send({ "message": "User deleted successfully", user: userToDelete });
    } catch (err) {
        console.error(err);
        res.status(500).send({ "message": "Internal server error" });
    }
};


module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    patchUser,
    deleteOneUser,
    adminDeletesOneUser,
}