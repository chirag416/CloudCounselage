// routes/userRoutes.js
const express = require('express');
const {
  registerUser,
  loginUser,
  addSkill,
  searchUsers,
  connectUser,
  getConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/search', searchUsers);

// Protected Routes
router.use(protect);  // Apply to all routes below this point

router.put('/:id/skills',protect, addSkill);  // Use PUT to update skills
router.post('/connect/:id', connectUser);
router.get('/:id/requests', getConnectionRequests);
router.post('/:userId/requests/:requestId/accept', (req, res, next) => {
  console.log('Accept connection request route hit:', req.params);
  next();
}, protect, acceptConnectionRequest);
router.post('/:userId/requests/:requestId/reject', rejectConnectionRequest);

module.exports = router;
