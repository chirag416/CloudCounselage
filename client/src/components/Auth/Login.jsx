import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Paper, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify'; // Import toast
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const { login } = useContext(AuthContext); // Get login function from context
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); // Call login function from context
      navigate('/profile'); // Redirect to profile page on successful login
    } catch (error) {
      console.error("Login failed", error);
      toast.error('Login failed. Please check your credentials and try again.'); // Show error popup
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            Login
          </Button>
          <Button
            fullWidth
            variant="text"
            color="secondary"
            onClick={() => navigate('/register')}
          >
            Don't have an account? Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
