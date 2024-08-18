import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { toast } from 'react-toastify';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const currentUserId = JSON.parse(localStorage.getItem('user'))?._id; // Get current user ID

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/search?query=${query}`);
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      const data = await response.json();
      // Exclude the current user from search results
      const filteredResults = data.filter(user => user._id !== currentUserId);
      setResults(filteredResults);
    } catch (error) {
      toast.error(`Failed to search users: ${error.message}`);
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

  return (
    <div>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users by name"
        fullWidth
      />
      <Button onClick={handleSearch}>Search</Button>
      <List>
        {results.map((user) => (
          <ListItem key={user._id}>
            <ListItemText primary={user.name} secondary={user.email} />
            <Button onClick={() => handleConnect(user._id)}>Connect</Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Search;
