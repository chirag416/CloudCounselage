const express = require('express');
const { registerUser, loginUser, addSkill } = require('../controllers/userController');

const router = express.Router();

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:id/skills', addSkill);

module.exports = router;
