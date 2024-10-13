var express = require('express');
var router = express.Router();
var usersControllers = require('../controllers/usersController');
const authentication = require('../middleware/authentication');

router.post('/', (req, res, next) => {
    if (req.headers['x-http-method-override']) {
        req.method = req.headers['x-http-method-override'].toUpperCase();
    }
    next();
}, usersControllers.createUser);

router.post('/:username/favorites', usersControllers.addToFavorites);

router.get('/', usersControllers.getAllUsers);

router.put('/:username', usersControllers.updateUser);

router.delete('/:username', usersControllers.deleteOneUser);

router.delete('/user/:username', usersControllers.deleteUserByAdmin); 

router.delete('/placesToVisit/:address', usersControllers.deletePlaceViaAdmin);

router.delete('/cities/:id', usersControllers.deleteCityViaAdmin);

router.post('/login', usersControllers.login);

router.delete('/:username/favorites', usersControllers.removeFromFavorites);

router.get('/:username/favorites', usersControllers.getFavorites);


module.exports = router;
