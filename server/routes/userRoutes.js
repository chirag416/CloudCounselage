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
  addExperience,
  getUserById,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/search', searchUsers);
router.get('/:id', getUserById);

// Protected Routes
router.use(protect);  // Apply to all routes below this point

router.put('/:id/skills', addSkill);
router.post('/connect/:id', connectUser);
router.get('/:id/requests', getConnectionRequests);
router.post('/:userId/requests/:requestId/accept', acceptConnectionRequest);
router.post('/:userId/requests/:requestId/reject', rejectConnectionRequest);
router.post('/:userId/experiences', addExperience);




module.exports = router;
