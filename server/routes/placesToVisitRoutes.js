var express = require('express');
var router = express.Router();
var placesToVisitControllers = require('../controllers/placesToVisitController');
const authentication = require('../middleware/authentication');

router.get('/', placesToVisitControllers.getAllPlaces);

router.get('/:address', placesToVisitControllers.getOnePlace);

router.put('/:address', authentication, placesToVisitControllers.updatePlace);

router.patch('/:address', authentication, placesToVisitControllers.patchPlace);

router.delete('/:address', authentication, placesToVisitControllers.deleteOnePlace);

router.get('/:address/reviews', placesToVisitControllers.getReviewsForPlace);

router.post('/:address/reviews', authentication, placesToVisitControllers.createReviewToPlace);

router.delete('/:address/reviews', authentication, placesToVisitControllers.deleteReviewsByAddress);

module.exports = router;