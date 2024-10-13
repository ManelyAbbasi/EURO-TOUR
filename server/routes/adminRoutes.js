var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');
const authentication = require('../middleware/authentication');

router.patch('/:username', adminController.patchAdmin);

router.delete('/:username/placesToVisit/:address', adminController.deletePlace);

router.delete('/:username/cities/:id', adminController.deleteCity);

module.exports = router;