const user = require(".../models/user");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    const user = new user({
        username: req.body.name,
        password: req.body.password,
        birthDate: Date(req.body.birthDate),
        sexuality: body.sexuality,
        gender: body.gender
    });
    const result = await user.save();
    res.send(result);
});