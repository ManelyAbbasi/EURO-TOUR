var express = require('express');
var router = express.Router();
var authenticate = require('../controllers/authenticate');

router.post('/login', authenticate.login);

router.get('/isAuthenticated', authenticate.isAuthenticated);

router.delete('/logout', authenticate.logout);

module.exports = router;