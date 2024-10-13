var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');
const authentication = require('../middleware/authentication');

router.patch('/:username', adminController.patchAdmin);

module.exports = router;