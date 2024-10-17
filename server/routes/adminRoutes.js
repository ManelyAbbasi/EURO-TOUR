var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');

router.patch('/:username', adminController.patchAdmin);

router.delete('/placesToVisit/:address', adminController.deletePlace);

router.delete('/cities/:id', adminController.deleteCity);

router.get('/check-admin', adminController.checkIfAdmin);

router.post('/', adminController.createAdmin);

module.exports = router; 