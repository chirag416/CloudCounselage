const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: Number },
  datePosted: { type: Date, default: Date.now },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;


