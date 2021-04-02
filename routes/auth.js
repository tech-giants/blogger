const express = require('express')
const router = express.Router();

// importing the controller
const authController = require('../controllers/auth')

router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports = router
