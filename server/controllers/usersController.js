const UsersModel = require("server/models/usersModel.js");
const express = require("express");
const router = express.Router();
const usersModel = require("../models/usersModel");


router.post("/usersController", async function createUser(req, res, next) {
    const users = new UsersModel(req.body);
    try {
    await users.save();
    } catch (err) {
    return res.status(500).next(err);
    }
    res.status(201).send(users);
    });

router.get("/usersController", async function getAllUsers(req, res, next) {
    try {
    const users = await UsersModel.find();
    } catch (err) {
    return res.status(500).next(err);
    }
    res.status(201).send({"users": users});
    });

router.put("/usersController/:username", async function updateUser(req, res, next) {
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
});

router.patch("/usersController/:username", async function patchUser(req, res, next){
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
});

router.delete("/usersController/:username", async function deleteOneUser(req, res, next) {
    try {
        const user = await UsersModel.findById(req.params.username);
   if (user == null) {
    return res.status(404).send({"message": "User not found"});
   }
   res.status(201).send(user);
    } catch (err) { return res.status(500).next(err); }
});