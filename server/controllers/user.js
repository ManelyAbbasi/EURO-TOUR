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