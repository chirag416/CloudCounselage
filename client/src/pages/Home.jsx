import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Stack, Box } from '@mui/material';
import './styles.css';

const Home = () => {
  return (
    <Container component="main" maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        className="header-title"
      >
        Welcome to <span className="career-text">Career</span>
        <span className="connect-text">Connect</span>
      </Typography>
      <Typography variant="h6" component="p" gutterBottom>
        Find jobs, connect with professionals, and learn new skills.
      </Typography>
      
      <Box className="additional-content">
        <Typography variant="body1" paragraph>
          At CareerConnect, we empower professionals to build their careers through meaningful connections and valuable opportunities. Whether you're looking for your next job, seeking to expand your network, or aiming to acquire new skills, we have the tools and community to support your journey.
        </Typography>
        <Typography variant="body1" paragraph>
          Join a vibrant community of like-minded professionals and take the next step in your career. With features designed to facilitate networking and professional growth, CareerConnect is the ultimate platform for career advancement.
        </Typography>
      </Box>

      <Stack spacing={2} mt={4} direction="row" justifyContent="center" className="button-container">
        <Button
          component={Link}
          to="/register"
          variant="contained"
          color="primary"
          size="large"
        >
          Register
        </Button>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          color="secondary"
          size="large"
        >
          Login
        </Button>
      </Stack>
    </Container>
  );
};

export default Home;
