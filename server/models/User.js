const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

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
}, { timestamps: true });

// Password encryption
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
