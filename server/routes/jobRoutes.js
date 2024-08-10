const express = require('express');
const { createJob, getAllJobs } = require('../controllers/jobController');
const router = express.Router();

router.post('/', createJob);
router.get('/', getAllJobs);



module.exports = router;
