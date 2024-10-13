const CitiesModel = require("../models/citiesModel");
const placesToVisitSchema = require("../models/placesToVisitModel");
const UsersModel = require("../models/usersModel");
const citiesModel = require("../models/citiesModel");
async function patchAdmin(req, res, next) {

    try {
        const user = await UsersModel.findOne({ username: req.params.username });

        if (user == null) {
            return res.status(404).json({ "message": "User not found" });
        }

        if (req.body.username !== req.params.username && !req.body.isAdmin) {
            return res.status(403).json({ "message": "You are not authorized to update this user." });
        }

        user.password = req.body.password || user.password;
        await user.save(); // Save the updated user

        res.status(200).json(user); 
    } catch (err) {
        next(err); // Pass the error to the next middleware
    }
}

module.exports ={
    patchAdmin
};
   