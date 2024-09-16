const User = require("server/models/user.js");
const express = require("express");
const router = express.Router();

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
router.get("/:username", async (req, res) => {
    try {
        const user = await User.find({ username: req.params.username });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user);
    } catch (error) {
        res.status(404).send("Something went wrong");
    }
});