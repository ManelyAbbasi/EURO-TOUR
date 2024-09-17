const User = require("server/models/user.js");
const express = require("express");
const router = express.Router();
const user = require("../models/user");

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
router.get("/user/:username", async function(req, res, next){
    const username = req.params.username;
    try{
        const user = await User.findById(username);
        if (user == null){
            return res.status(404).send({"message": "User not found"});
        }
        res.send(user);
    } catch (err) { return next(err); }
});

router.put("/user/:username", async function(req, res, next) {
    try {
        const user = await User.findById(req.params.username);
        if (user == null) {
            return res.status(404).send({"message": "User not found"});
        }
        user.password = req.body.password;
        user.sexuality = req.body.sexuality;
        user.gender = req.body.gender;
        await User.save();
        res.send(user);
    } catch (err) { return next (err); }
});

router.patch("/user/:username", async function(req, res, next){
    try{
        const user = await User.findById(req.params.username);
        if (user == null){
            return res.status(404).send({"message": "User not found"});
        }
        user.password = (req.body.password || user.password);
        await User.save();
        res.send(user);
    } catch (err) {
        return next(err);
    }
});

router.delete("/user/:username", async function(req, res, next) {
    try {
        const user = await User.findById(req.params.username);
   if (user == null) {
    return res.status(404).json({"message": "User not found"});
   }
   res.json(user);
    } catch (err) { return next(err); }
});