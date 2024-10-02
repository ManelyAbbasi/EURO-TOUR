var express = require('express');
var router = express.Router();
var placesToVisitControllers = require('../controllers/placesToVisitController');
const authentication = require('../middleware/authentication');

router.get('/', placesToVisitControllers.getAllPlaces);

router.get('/:address', placesToVisitControllers.getOnePlace);

router.put('/:address', authentication, placesToVisitControllers.updatePlace);

router.patch('/:address', authentication, placesToVisitControllers.patchPlace);

router.delete('/:address', authentication, placesToVisitControllers.deleteOnePlace);

module.exports = router;