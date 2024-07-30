import React from 'react';
import { Container, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        404 - Page Not Found
      </Typography>
    </Container>
  );
};

export default NotFound;
