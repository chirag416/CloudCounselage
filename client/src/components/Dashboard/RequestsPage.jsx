import React, { useState, useEffect } from 'react';
import { Container, List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user'))?._id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;

        if (!token || !userId) {
          toast.error('User not authenticated or user ID not available');
          return;
        }

        const response = await fetch(`http://localhost:3000/api/users/${userId}/requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch requests: ${response.statusText}`);
        }

        const data = await response.json();
        setRequests(data);
      } catch (error) {
        toast.error('Failed to fetch connection requests');
      }
    };

    fetchRequests();
  }, [userId]);

  const handleAccept = async (requestId) => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;

      if (!token || !userId) {
        toast.error('User not authenticated or user ID not available');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/users/${userId}/requests/${requestId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to accept connection request: ${response.statusText}`);
      }

      toast.success('Connection request accepted');
      setRequests(requests.filter((req) => req._id !== requestId));
    } catch (error) {
      toast.error('Failed to accept connection request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;

      if (!token || !userId) {
        toast.error('User not authenticated or user ID not available');
        return;
      }

      await fetch(`http://localhost:3000/api/users/${userId}/requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Connection request rejected');
      setRequests(requests.filter((req) => req._id !== requestId));
    } catch (error) {
      toast.error('Failed to reject connection request');
    }
  };

  const handleGoToProfile = () => {
    navigate('/profile'); // Adjust the path to match your route configuration
  };

  return (
    <Container component="main" maxWidth="md">
      {requests.length > 0 ? (
        <List>
          {requests.map((req) => (
            <ListItem key={req._id}>
              <ListItemText primary={req.sender.name} secondary={req.sender.email} />
              <Button onClick={() => handleAccept(req._id)}>Accept</Button>
              <Button onClick={() => handleReject(req._id)}>Reject</Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Typography variant="h6" color="textSecondary">
            No requests remaining
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleGoToProfile} 
            style={{ marginTop: '20px' }}
          >
            Go to Profile
          </Button>
        </div>
      )}
    </Container>
  );
};

export default RequestsPage;
