import React, { useState, useEffect } from 'react';
import { Container, List, ListItem, ListItemText, Button } from '@mui/material';
import { toast } from 'react-toastify';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user'))?._id;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;

    if (!token) {
      console.error('No token found');
    }
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
      const userId = JSON.parse(localStorage.getItem('user'))?._id;
  
      if (!token || !userId) {
        toast.error('User not authenticated or user ID not available');
        return;
      }
  
      // Debugging lines
      console.log('Accepting request:', { userId, requestId });
      console.log(`Request URL: http://localhost:3000/api/users/${userId}/requests/${requestId}/accept`);
  
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
      console.error('Error in handleAccept:', error);
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

  return (
    <Container component="main" maxWidth="md">
      <List>
        {requests.map((req) => (
          <ListItem key={req._id}>
            <ListItemText primary={req.sender.name} secondary={req.sender.email} />
            <Button onClick={() => handleAccept(req._id)}>Accept</Button>
            <Button onClick={() => handleReject(req._id)}>Reject</Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default RequestsPage;
