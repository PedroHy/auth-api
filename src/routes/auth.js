const express = require('express');
const router = express.Router();

const authControllers = require('./controllers/authControllers');

//GET

//POST
router.post('/register', authControllers.register);

//PUT

//DELETE

module.exports = router;