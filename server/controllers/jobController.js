const Job = require('../models/Job');

// Create a new job
const createJob = async (req, res) => {
  const { title, company, location, description, salary } = req.body;

  try {
    const job = await Job.create({
      title,
      company,
      location,
      description,
      salary,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJob, getAllJobs };
