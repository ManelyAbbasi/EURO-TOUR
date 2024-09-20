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

function validateUserData(data) {
    const errors = [];

    if (!data.username || typeof data.username !== 'string') {
        errors.push('Username is required and must be a string.');
    }

    if (!data.password || typeof data.password !== 'string') {
        errors.push('Password is required and must be a string.');
    }

    if (!data.birthDate || isNaN(new Date(data.birthDate))) {
        errors.push('Valid birth date is required.');
    } else {
        const minDate = new Date(1920, 1, 1);
        const maxDate = new Date(2012, 1, 1);
        const userBirthDate = new Date(data.birthDate);
        
        if (userBirthDate < minDate || userBirthDate > maxDate) {
            errors.push('Birth date must be between 1920 and 2012.');
        }
    }

    if (data.isLGBTQIA !== undefined && typeof data.isLGBTQIA !== 'boolean') {
        errors.push('isLGBTQIA must be a boolean value.');
    }

    if (data.gender && typeof data.gender !== 'string') {
        errors.push('Gender must be a string.');
    } else if (data.gender && !['male', 'female', 'non-binary', 'other'].includes(data.gender)) {
        errors.push('Gender must be one of the following: male, female, non-binary, other.');
    }

    if (data.isAdmin !== undefined && typeof data.isAdmin !== 'boolean') {
        errors.push('isAdmin must be a boolean value.');
    }

    return errors; 
}

async function createUser(req, res, next) {
    const errors = validateUserData(req.body);
    
    if (errors.length > 0) {
        return res.status(404).send({ errors }); 
    }

    const { username } = req.body;

    try {
        const existingUser = await UsersModelModel.findOne({ username });

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
        const user = await UsersModel.findById(req.params.username);
        if (user == null) {
            return res.status(404).send({"message": "User not found"});
        }
        user.password = req.body.password;
        user.sexuality = req.body.sexuality;
        user.gender = req.body.gender;
        await user.save();
        res.status(201).send(user);
    } catch (err) { return res.status(500).next(err); }
};

async function patchUser(req, res, next){
    try{
        const user = await UsersModel.findById(req.params.username);
        if (user == null){
            return res.status(404).send({"message": "User not found"});
        }
        user.password = (req.body.password || user.password);
        await user.save();
        res.status(201).res.send(user);
    } catch (err) {
        return res.status(500).next(err);
    }
};

async function deleteOneUser(req, res) {
    const username = req.params.username;
    try {
        const result = await UsersModel.deleteOne({ username: username });
        
        if (result.deletedCount === 0) {
            return res.status(404).send({ "message": "User not found" });
        }
        res.status(200).send({ "message": "User deleted successfully" });
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