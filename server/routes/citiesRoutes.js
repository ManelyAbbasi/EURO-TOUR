var express = require('express');
var router = express.Router();
var citiesControllers = require('../controllers/citiesController');

router.get('/', citiesControllers.getAllCities);

router.post('/', citiesControllers.createCity);

router.get('/:id', citiesControllers.getOneCity);

router.put('/:id', citiesControllers.updateCity);

router.patch('/:id', citiesControllers.patchCity);

router.delete('/:id', citiesControllers.deleteOneCity);

module.exports = router;