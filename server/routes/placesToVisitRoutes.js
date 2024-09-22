var express = require('express');
var router = express.Router();
var placesToVisitControllers = require('../controllers/placesToVisitController');

router.get('/', placesToVisitControllers.getAllPlaces);

router.post('/', placesToVisitControllers.createPlace);

router.get('/:address', placesToVisitControllers.getOnePlace);

router.put('/:address', placesToVisitControllers.updatePlace);

router.patch('/:address', placesToVisitControllers.patchPlace);

router.delete('/:address', placesToVisitControllers.deleteOnePlace);

router.get('/:address/reviews', placesToVisitControllers.getReviewsForPlace);

module.exports = router;