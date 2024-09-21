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

        if (existingUser) {
            return res.status(400).send({ message: 'User with this username already exists' });
        }

        const users = new UsersModel(req.body);
        await users.save();
        res.status(201).send(users);
    } catch (err) {
    return res.status(500).next(err);
    }
 };


async function updateUser(req, res, next) {
    try {
        const user = await UsersModel.findOne({ username: req.params.username });
        if (user == null) {
            return res.status(404).send({ "message": "User not found" });
        }
        if (req.body.password !== undefined) {  
            user.password = req.body.password
        }
      
        if (req.body.sexuality !== undefined) {
            const validSexualities = ['heterosexual', 'homosexual', 'bisexual', 'asexual', 'other'];
            if (!validSexualities.includes(req.body.sexuality)) {
                return res.status(400).send({ message: 'Invalid sexuality value' });
            }
            user.sexuality = req.body.sexuality;
        }

        if (req.body.gender !== undefined) {
            const validGenders = ['male', 'female', 'non-binary', 'other'];
            if (!validGenders.includes(req.body.gender)) {
                return res.status(400).send({ message: 'Invalid gender value' });
            }
            user.gender = req.body.gender;
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

module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    patchUser,
    deleteOneUser,
}