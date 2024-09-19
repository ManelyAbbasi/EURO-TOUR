var express = require('express');
var router = express.Router();
var citiesControllers = require('../controllers/citiesController');

router.get('/', citiesControllers.getAllCities);

router.get('/', citiesControllers.createCity);

router.get('/:postcode', citiesControllers.getOneCity);

router.get('/:postcode', citiesControllers.updateCity);

router.get('/:postcode', citiesControllers.patchCity);

router.get('/:postcode', citiesControllers.deleteOneCity);

module.exports = router;