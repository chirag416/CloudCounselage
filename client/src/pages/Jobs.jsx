import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, IconButton, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import MailIconComponent from '../components/Dashboard/MailIconComponent';
import { useNavigate } from 'react-router-dom';

const ContainerStyled = styled(Container)(({ theme }) => ({
  width: '70vw',
  marginTop: theme.spacing(8),
}));

const Navbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/jobs');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      }
    };

    fetchJobs();
  }, []);

  if (!jobs.length) {
    return <Typography>No jobs available at the moment.</Typography>;
  }

  return (
    <ContainerStyled>
      <Navbar>
        <IconButton onClick={() => navigate('/profile')}>
          <HomeIcon />
        </IconButton>
        <IconButton>
          <WorkIcon />
        </IconButton>
        <MailIconComponent />
      </Navbar>
      <Typography variant="h4" gutterBottom>Available Jobs</Typography>
      <List>
        {jobs.map((job) => (
          <ListItem key={job._id} secondaryAction={
            <Button 
              variant="contained" 
              color="primary" 
            >
              Apply
            </Button>
          }>
            <ListItemText primary={job.title} secondary={`${job.company} - ${job.location}`} />
          </ListItem>
        ))}
      </List>
    </ContainerStyled>
  );
};

export default Jobs;
