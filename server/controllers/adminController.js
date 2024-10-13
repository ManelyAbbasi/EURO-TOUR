const CitiesModel = require("../models/citiesModel");
const PlacesToVisit = require("../models/placesToVisitModel");
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

async function deletePlace(req, res) {
    const address = req.params.address;

    try {
        if (!req.body.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const deletedPlace = await PlacesToVisit.findOneAndDelete({ address: address });

        if (!deletedPlace) {
            return res.status(404).json({ message: "Place not found" });
        }

        res.status(200).json({ message: "Place deleted successfully", place: deletedPlace });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


async function deleteCity(req, res) {
    const cityId = req.params.id;
    try {
        if (!req.body.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const deletedCity = await CitiesModel.findByIdAndDelete(cityId);

        if (!deletedCity) {
            return res.status(404).json({ message: "City not found" });
        }

        res.status(200).json({ message: "City deleted successfully", city: deletedCity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function checkIfAdmin(req, res) {
    try {
        const username = req.params.username; // Get the username from the route parameters

        // Find the user by username
        const user = await UsersModel.findOne({ username });

        // If the user is not found, return 404
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the admin status
        return res.status(200).json({ isAdmin: user.isAdmin });
    } catch (err) {
        console.error('Error checking admin status:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
}



module.exports ={
    patchAdmin,
    deleteCity,
    deletePlace,
    checkIfAdmin
};
   