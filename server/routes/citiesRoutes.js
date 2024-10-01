var express = require('express');
var router = express.Router();
var citiesControllers = require('../controllers/citiesController');
const authentication = require('../middleware/authentication');

router.get('/', citiesControllers.getAllCities);

router.post('/', authentication, citiesControllers.createCity);

router.get('/:id', citiesControllers.getOneCity);

router.put('/:id', authentication, citiesControllers.updateCity);

router.patch('/:id', authentication, citiesControllers.patchCity);

router.delete('/:id', authentication, citiesControllers.deleteOneCity);

router.post('/:id/placesToVisit', authentication, citiesControllers.createPlaceInCity);

router.get('/:id/placesToVisit', citiesControllers.getPlacesFromCity);

router.get('/:id/placesToVisit/:address', citiesControllers.getOnePlaceFromCity);

router.post('/:id/reviews', authenticatoin, citiesControllers.createReviewToCity);

router.get('/:id/reviews', citiesControllers.getReviewsForCity);
 
router.delete('/:id/reviews', authentication, citiesControllers.deleteReviewsById);


module.exports = router;