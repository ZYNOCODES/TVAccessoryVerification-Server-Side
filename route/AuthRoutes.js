const express = require('express');
const {
    Signin,
    Signup,
} = require('../controller/AuthController');
const router = express.Router();

//login
router.post('/signin', Signin);
//signup
router.post('/signup', Signup);

module.exports = router;