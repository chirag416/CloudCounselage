const mongoose = require('mongoose');

// Schema for connection requests
const connectionRequestSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  headline: { type: String },
  experiences: [
    {
      title: String,
      company: String,
      startDate: Date,
      endDate: Date,
      description: String,
    },
  ],
  skills: [String],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  connectionRequests: [connectionRequestSchema], // Add connection requests array
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
