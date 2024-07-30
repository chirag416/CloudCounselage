import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Stack } from '@mui/material';

const Home = () => {
  return (
    <Container component="main" maxWidth="xs" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to LinkedIn Clone
      </Typography>
      <Typography variant="h6" component="p" gutterBottom>
        Find jobs, connect with professionals, and learn new skills.
      </Typography>
      <Stack spacing={2} mt={4} direction="row" justifyContent="center">
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
