var express = require('express');
var router = express.Router();
var citiesControllers = require('../controllers/citiesController');
const authentication = require('../middleware/authentication');

router.get('/', citiesControllers.getAllCities);

router.post('/', authentication, citiesControllers.createCity);

router.get('/:id', citiesControllers.getOneCity);

router.put('/:id', authentication, citiesControllers.updateCity);

router.post('/:id/placesToVisit', authentication, citiesControllers.createPlaceInCity);

router.get('/:id/placesToVisit', citiesControllers.getPlacesFromCity);

router.delete('/:id/placesToVisit/:address', authentication, citiesControllers.deleteOnePlaceFromCity);

router.delete('/:id/placesToVisit', authentication, citiesControllers.deleteAllPlacesFromCity)

module.exports = router;