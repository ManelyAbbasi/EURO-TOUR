var express = require('express');
var router = express.Router();
var citiesControllers = require('../controllers/citiesController');

router.get('/', citiesControllers.getAllCities);

router.post('/', citiesControllers.createCity);

router.get('/:id', citiesControllers.getOneCity);

router.put('/:id', citiesControllers.updateCity);

router.patch('/:id', citiesControllers.patchCity);

router.delete('/:id', citiesControllers.deleteOneCity);

router.post('/:id/placesToVisit', citiesControllers.createPlaceInCity);

router.get('/:id/placesToVisit', citiesControllers.getPlacesFromCity);

router.get('/:id/placesToVisit/:address', citiesControllers.getOnePlaceFromCity);

router.post('/:id/reviews', citiesControllers.addReviewToCity);

router.get('/:id/reviews', citiesControllers.getReviewsForCity);

module.exports = router;