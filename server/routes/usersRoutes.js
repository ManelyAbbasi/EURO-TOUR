var express = require('express');
var router = express.Router();
var usersControllers = require('../controllers/usersController');

router.post('/', usersControllers.createUser);

router.get('/', usersControllers.getAllUsers);

router.put('/:username', usersControllers.updateUser);

router.patch('/:username', usersControllers.patchUser);

router.delete('/:username', usersControllers.deleteOneUser);

router.delete('/user/:username', usersControllers.adminDeleteUser);

module.exports = router;
