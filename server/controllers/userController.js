// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && user.password === password) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        skills: user.skills || [], // Include skills in response
        experiences: user.experiences || [], // Include experiences in response
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Add Skill to User
const addSkill = async (req, res) => {
  try {
    console.log(`Received request to add skill. User ID: ${req.params.id}`);
    console.log(`Skill data: ${JSON.stringify(req.body)}`);

    const user = await User.findById(req.params.id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    user.skills.push(req.body.skill);
    await user.save();
    console.log('Skill added successfully', user.skills);
    res.json(user);
  } catch (error) {
    console.error('Error adding skill:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Search Users
const searchUsers = async (req, res) => {
  const { query } = req.query;
  
  try {
    const users = await User.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { email: new RegExp(query, 'i') },
      ]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Connect User
const connectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    const connectUser = await User.findById(id);

    if (!connectUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.connections.includes(id)) {
      return res.status(400).json({ message: 'Already connected' });
    }

    user.connectionRequests.push({ sender: req.user.id });
    await user.save();

    connectUser.connectionRequests.push({ sender: user._id });
    await connectUser.save();

    res.json({ message: 'Connection request sent' });
  } catch (error) {
    console.error(`Error in connectUser: ${error.message}`);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Get Connection Requests
const getConnectionRequests = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: 'connectionRequests.sender',
        select: 'name email'
      });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.connectionRequests);
  } catch (error) {
    console.error(`Error in getConnectionRequests: ${error.message}`);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Accept Connection Request
const acceptConnectionRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const request = user.connectionRequests.id(req.params.requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    user.connections.push(request.sender);
    user.connectionRequests.id(req.params.requestId).remove();
    await user.save();

    res.json({ message: 'Connection accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject Connection Request
const rejectConnectionRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const request = user.connectionRequests.id(req.params.requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    user.connectionRequests.id(req.params.requestId).remove();
    await user.save();

    res.json({ message: 'Connection rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  addSkill,
  searchUsers,
  connectUser,
  getConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest
};
