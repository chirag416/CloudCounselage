import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === 'User already exists') {
          toast.error('User already registered. Please use a different email.'); // Show error popup for existing user
        } else {
          toast.error('Registration failed. Please try again.'); // Generic error message
        }
        throw new Error('Registration failed');
      }
      const data = await response.json();
      console.log('Registration successful:', data);
      navigate('/login'); // Redirect to login page on success
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'} // Toggle password type
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Button
            fullWidth
            variant="text"
            color="secondary"
            onClick={() => navigate('/login')}
          >
            Already have an account? Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
