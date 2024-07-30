import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('/api/jobs');
        setJobs(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <h1>Job Listings</h1>
      {jobs.map((job) => (
        <div key={job._id}>
          <h2>{job.title}</h2>
          <p>{job.company}</p>
          <p>{job.location}</p>
          <p>{job.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Jobs;
