//modules
const express = require('express');
const router = express.Router();

//controllers
const authControllers = require('./controllers/authControllers');

//GET

//POST
router.post('/register', authControllers.register);
router.post('/login', authControllers.authenticate);
router.post('/forgot-pass', authControllers.forgotPassword);
router.post('/reset-pass', authControllers.resetPassword);
//PUT

//DELETE

module.exports = router;