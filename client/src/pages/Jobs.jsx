import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, IconButton, Box, Button, CircularProgress, Grid } from '@mui/material';
import { styled } from '@mui/system';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import MailIconComponent from '../components/Dashboard/MailIconComponent';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const ContainerStyled = styled(Container)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(8),
  padding: theme.spacing(2),
}));

const Navbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

const JobCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Direct CSS for box shadow
  backgroundColor: '#fff',
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)', // Direct CSS for box shadow
  },
}));

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/jobs');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <ContainerStyled>
        <Typography variant="h6" align="center" gutterBottom>
          Loading jobs...
        </Typography>
        <CircularProgress />
      </ContainerStyled>
    );
  }

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
      <Typography variant="h4" gutterBottom align="center">
        Available Jobs
      </Typography>
      <Grid container spacing={4}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job._id}>
            <JobCard>
              <ListItem>
                <ListItemText
                  primary={job.title}
                  secondary={`${job.company} - ${job.location}`}
                />
              </ListItem>
              <Button
                variant="contained"
                color="primary"
                fullWidth
              >
                Apply
              </Button>
            </JobCard>
          </Grid>
        ))}
      </Grid>
    </ContainerStyled>
  );
};

export default Jobs;
