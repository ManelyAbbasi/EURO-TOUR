const UsersModel = require("../models/usersModel");
const express = require("express");
const router = express.Router();
//const usersModel = require("../models/usersModel");

async function getAllUsers(req, res) {
    try {
        const users = await UsersModel.find();
        res.status(201).send({ users });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching users.' });
    }
}

async function createUser(req, res) {
    const users = new UsersModel(req.body);
    try {
    await users.save();
    } catch (err) {
    return res.status(500).next(err);
    }
    res.status(201).send(users);
};

async function updateUser(req, res, next) {
    try {
        const user = await UsersModel.findOne({ username: req.params.username });
        if (user == null) {
            return res.status(404).send({ "message": "User not found" });
        }

        user.password = req.body.password || user.password;
        user.sexuality = req.body.sexuality || user.sexuality;
        user.gender = req.body.gender || user.gender;
    
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
        user.password = (req.body.password || user.password);
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