var express = require('express');
var router = express.Router();
var reviewsControllers = require('../controllers/reviewsController');

router.post('/', reviewsControllers.createReview);

router.get('/', reviewsControllers.getAllReviews);

router.delete('/', reviewsControllers.deleteOldReviews);

module.exports = router;