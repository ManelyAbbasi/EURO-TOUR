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

router.put('/:username', usersControllers.updateUser);

router.delete('/:username', usersControllers.deleteOneUser);

router.post('/login', usersControllers.login);

router.delete('/cities&places/favorites', usersControllers.removeFromFavorites);

router.get('/favorites', usersControllers.getFavorites);

router.post('/:username/favorites', usersControllers.addToFavorites);

module.exports = router;
