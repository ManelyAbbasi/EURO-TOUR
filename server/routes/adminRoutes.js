var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');

router.patch('/:name', adminController.patchAdmin); 

router.delete('/cities/:id', adminController.deleteCity);

router.get('/verify-admin', adminController.verifyAdmin);

router.post('/', adminController.createAdmin);

router.post('/login', adminController.login);

router.delete('/:username', adminController.deleteOneAdmin);

router.get('/', adminController.checkIfAdmin);

module.exports = router; 