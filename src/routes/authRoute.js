const express = require('express');
const router = express.Router();

const authControllers = require('./controllers/authControllers');

//GET

//POST
router.post('/register', authControllers.register);
router.post('/login', authControllers.authenticate);
//PUT

//DELETE

module.exports = router;