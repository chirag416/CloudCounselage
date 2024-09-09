import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Stack, Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import './styles.css';

const Home = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container component="main" maxWidth="lg" sx={{ textAlign: 'center', mt: 8 }}>
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

      <Grid container spacing={4} mt={4} alignItems="center">
        {/* First Image with Content */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
            <img
              src="/home1.jpg"
              alt="Professional Networking"
              className="hero-image"
            />
            <Box
              sx={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0, 0, 0, 0.3)', color: 'white', display: 'flex',
                justifyContent: 'center', alignItems: 'center', padding: '20px',
                opacity: 0.8, textAlign: 'center'
              }}
            >
              <Typography variant={isSmallScreen ? "h6" : "h5"} component="div">
                Discover new opportunities and expand your network.
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Additional Content */}
        <Grid item xs={12} md={6}>
          <Typography variant="body1" paragraph>
            At CareerConnect, we empower professionals to build their careers through meaningful connections and valuable opportunities. Whether you're looking for your next job, seeking to expand your network, or aiming to acquire new skills, we have the tools and community to support your journey.
          </Typography>
          <Typography variant="body1" paragraph>
            Join a vibrant community of like-minded professionals and take the next step in your career. With features designed to facilitate networking and professional growth, CareerConnect is the ultimate platform for career advancement.
          </Typography>
        </Grid>
      </Grid>

      {/* Second Section with Content on Left and Image on Right */}
      <Grid container spacing={4} mt={8} alignItems="center">
        {/* Additional Content for Second Section */}
        <Grid item xs={12} md={6} sx={{ textAlign: isSmallScreen ? 'center' : 'left' }}>
          <Typography variant="body1" paragraph>
            CareerConnect offers personalized recommendations to help you find the best job opportunities and connect with professionals who can support your career goals. Explore our extensive network and take advantage of our tools to enhance your professional growth.
          </Typography>
          <Typography variant="body1" paragraph>
            Whether you're aiming for a new job, a career change, or simply looking to grow your professional network, CareerConnect provides a robust platform tailored to your needs. Discover resources, attend virtual events, and leverage our community to achieve your career aspirations.
          </Typography>
        </Grid>

        {/* Second Image */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
            <img
              src="/home2.jpg"
              alt="Career Advancement"
              className="content-image"
            />
          </Box>
        </Grid>
      </Grid>

      {/* Buttons at the Top Right */}
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 10 }}>
        <Stack spacing={2} direction="row">
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
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: theme.palette.grey[200], py: 4, m: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                About Us
              </Typography>
              <Typography variant="body2" paragraph>
                CareerConnect is dedicated to helping professionals achieve their career goals through networking and job opportunities. Our platform offers a variety of resources to support your professional development.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Button color="inherit">About</Button>
                <Button color="inherit">Contact</Button>
                <Button color="inherit">Privacy Policy</Button>
                <Button color="inherit">Terms of Service</Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Follow Us
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button color="inherit">
                  <Facebook />
                </Button>
                <Button color="inherit">
                  <Twitter />
                </Button>
                <Button color="inherit">
                  <LinkedIn />
                </Button>
                <Button color="inherit">
                  <Instagram />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Container>
  );
};

export default Home;
