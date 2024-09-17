const UsersModel = require("server/models/usersModel.js");
const express = require("express");
const router = express.Router();
const usersModel = require("../models/usersModel");


router.post("/usersController", async function (req, res, next) {
    const users = new UsersModel(req.body);
    try {
    await users.save();
    } catch (err) {
    return next(err);
    }
    res.status(201).send(users);
    });

router.get("/usersController", async function(req, res, next) {
    try {
    const users = await UsersModel.find();
    } catch (err) {
    return next(err);
    }
    res.send({"users": users});
    });

router.put("/usersController/:username", async function(req, res, next) {
    try {
        const user = await UsersModel.findById(req.params.username);
        if (user == null) {
            return res.status(404).send({"message": "User not found"});
        }
        user.password = req.body.password;
        user.sexuality = req.body.sexuality;
        user.gender = req.body.gender;
        await user.save();
        res.send(user);
    } catch (err) { return next (err); }
});

router.patch("/usersController/:username", async function(req, res, next){
    try{
        const user = await UsersModel.findById(req.params.username);
        if (user == null){
            return res.status(404).send({"message": "User not found"});
        }
        user.password = (req.body.password || user.password);
        await user.save();
        res.send(user);
    } catch (err) {
        return next(err);
    }
});

router.delete("/usersController/:username", async function(req, res, next) {
    try {
        const user = await UsersModel.findById(req.params.username);
   if (user == null) {
    return res.status(404).json({"message": "User not found"});
   }
   res.send(user);
    } catch (err) { return next(err); }
});