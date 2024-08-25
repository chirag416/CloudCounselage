const express = require('express');
const {
  registerUser,
  loginUser,
  addSkill,
  searchUsers,
  connectUser,
  getConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  addExperience
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/search', searchUsers);

// Protected Routes
router.use(protect);  // Apply to all routes below this point

router.put('/:id/skills', addSkill);  // Use PUT to update skills
router.post('/connect/:id', connectUser);
router.get('/:id/requests', getConnectionRequests);
router.post('/:userId/requests/:requestId/accept', acceptConnectionRequest);
router.post('/:userId/requests/:requestId/reject', rejectConnectionRequest);
// Add this route to your userRoutes.js
router.post('/:userId/experiences', addExperience);


module.exports = router;
