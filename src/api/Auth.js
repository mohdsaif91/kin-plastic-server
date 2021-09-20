const express = require('express');

const AuthController = require('../Controller/AuthController');

const router = express.Router();

router.post('/login', AuthController.loginAuth);
router.post('/signUp', AuthController.signUp);

module.exports = router;
