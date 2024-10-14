var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');
const authentication = require('../middleware/authentication');

router.patch('/:username', adminController.patchAdmin);

router.delete('/placesToVisit/:address', adminController.deletePlace);

router.delete('/cities/:id', adminController.deleteCity);

router.get('/check-admin', adminController.checkIfAdmin);

module.exports = router; 