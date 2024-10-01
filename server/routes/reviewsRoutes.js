var express = require('express');
var router = express.Router();
var reviewsControllers = require('../controllers/reviewsController');
const authentication = require('../middleware/authentication');


router.get('/', reviewsControllers.getAllReviews);

router.delete('/', authentication, reviewsControllers.deleteOldReviews);

module.exports = router;