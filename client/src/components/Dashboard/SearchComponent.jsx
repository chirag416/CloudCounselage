import React, { useState } from 'react';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentUserId = JSON.parse(localStorage.getItem('user'))?._id;

  const handleSearch = async () => {
    if (query.trim() === '') {
      toast.error('Search query cannot be empty');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/users/search?query=${query}`);
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      const data = await response.json();

      // Exclude the current user
      const filteredResults = data.filter(user => user._id !== currentUserId);

      setResults(filteredResults);

      if (filteredResults.length === 0) {
        toast.info('No users found');
      }
    } catch (error) {
      setError(error.message);
      toast.error(`Failed to search users: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (userId) => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;

      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/users/connect/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to send request: ${errorData.message || response.statusText}`);
      }

      toast.success('Connection request sent');
    } catch (error) {
      console.error('Failed to send connection request:', error);
      toast.error(`Failed to send connection request: ${error.message}`);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users by name"
        fullWidth
        variant="outlined"
      />
      <Button onClick={handleSearch} variant="contained" color="primary" sx={{ mt: 2 }}>
        Search
      </Button>

      {isLoading && <Typography>Loading...</Typography>}

      {error && <Typography color="error">{error}</Typography>}

      <List>
        {results.length > 0 ? (
          results.map((user) => (
            <ListItem key={user._id}>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <ListItemText primary={user.name} />
                <Box sx={{ ml: 2 }}>
                  <Button
                    onClick={() => handleConnect(user._id)}
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    disabled={user.connections && user.connections.includes(currentUserId)}
                  >
                    Connect
                  </Button>
                  <Button
                    onClick={() => handleViewProfile(user._id)}
                    variant="outlined"
                  >
                    View Profile
                  </Button>
                </Box>
              </Box>
            </ListItem>
          ))
        ) : null}
      </List>
    </div>
  );
};

export default Search;
