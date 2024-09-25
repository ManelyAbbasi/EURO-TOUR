var express = require('express');
var router = express.Router();
var usersControllers = require('../controllers/usersController');

router.post('/', usersControllers.createUser);

router.get('/', usersControllers.getAllUsers);

router.put('/:username', usersControllers.updateUser);

router.patch('/:username', usersControllers.patchUser);

router.delete('/:username', usersControllers.deleteOneUser);

router.delete('/user/:username', usersControllers.deleteUserByAdmin); 

router.get('/:username/reviews', usersControllers.getUserReviews);

router.delete('/placesToVisit/:address', usersControllers.deletePlaceViaAdmin);

router.delete('/cities/:id', usersControllers.deleteCityViaAdmin);

router.delete('/:username/reviews/:review_id', usersControllers.deleteReviewViaAdmin);

module.exports = router;
