var express = require('express');
var router = express.Router();
var citiesControllers = require('../controllers/citiesController');

router.get('/', citiesControllers.getAllCities);

router.post('/', citiesControllers.createCity);

router.get('/:postcode', citiesControllers.getOneCity);

router.put('/:postcode', citiesControllers.updateCity);

router.patch('/:postcode', citiesControllers.patchCity);

router.delete('/:postcode', citiesControllers.deleteOneCity);

module.exports = router;