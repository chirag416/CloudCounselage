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

    // Check if the connection request already exists
    const existingRequest = user.connectionRequests.find(
      (request) => request.sender.toString() === connectUser._id.toString()
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }

    // Check if already connected
    if (user.connections.includes(id)) {
      return res.status(400).json({ message: 'Already connected' });
    }

    // Send connection request
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
    const { userId, requestId } = req.params;

    // Find the receiver (user accepting the request)
    const receiver = await User.findById(userId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the connection request in the receiver's connectionRequests array
    const requestIndex = receiver.connectionRequests.findIndex(req => req._id.toString() === requestId);
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Find the sender using the sender's ID stored in the connection request
    const request = receiver.connectionRequests[requestIndex];
    const sender = await User.findById(request.sender);
    if (!sender) {
      return res.status(404).json({ message: 'Request sender not found' });
    }

    // Update the connections array for both the receiver and the sender
    if (!receiver.connections.includes(sender._id)) {
      receiver.connections.push(sender._id);
    }
    if (!sender.connections.includes(receiver._id)) {
      sender.connections.push(receiver._id);
    }

    // Remove the request from the receiver's connectionRequests array
    receiver.connectionRequests.splice(requestIndex, 1);

    // Save the updated users
    await receiver.save();
    await sender.save();

    res.status(200).json({ message: 'Connection request accepted' });
  } catch (error) {
    console.error('Error accepting connection request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject Connection Request
// Reject Connection Request
const rejectConnectionRequest = async (req, res) => {
  try {
    const { userId, requestId } = req.params;

    // Find the receiver (user rejecting the request)
    const receiver = await User.findById(userId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the connection request in the receiver's connectionRequests array
    const requestIndex = receiver.connectionRequests.findIndex(req => req._id.toString() === requestId);
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Remove the request from the receiver's connectionRequests array
    receiver.connectionRequests.splice(requestIndex, 1);

    // Save the updated receiver
    await receiver.save();

    res.status(200).json({ message: 'Connection request rejected' });
  } catch (error) {
    console.error('Error rejecting connection request:', error);
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
