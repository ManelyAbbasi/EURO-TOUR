const UsersModel = require("server/models/usersModel.js");
const express = require("express");
const router = express.Router();
const usersModel = require("../models/usersModel");

router.post("/", async (req, res) => {
    const user = new User({
        username: req.body.name,
        password: req.body.password,
        birthDate: Date(req.body.birthDate),
        sexuality: body.sexuality,
        gender: body.gender
    });
    const result = await user.save();
    res.send(result);
});

// GET a user by their username
router.get("/userController/:username", async function(req, res, next){
    const username = req.params.username;
    try{
        const user = await User.findById(username);
        if (user == null){
            return res.status(404).send({"message": "User not found"});
        }
        res.send(user);
    } catch (err) { return next(err); }
});

router.put("/userController/:username", async function(req, res, next) {
    try {
        const user = await User.findById(req.params.username);
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

router.patch("/userController/:username", async function(req, res, next){
    try{
        const user = await User.findById(req.params.username);
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

router.delete("/userController/:username", async function(req, res, next) {
    try {
        const user = await User.findById(req.params.username);
   if (user == null) {
    return res.status(404).json({"message": "User not found"});
   }
   res.send(user);
    } catch (err) { return next(err); }
});