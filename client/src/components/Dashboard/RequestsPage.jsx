import React, { useState, useEffect } from 'react';
import { Container, List, ListItem, ListItemText, Button } from '@mui/material';
import { toast } from 'react-toastify';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;

        if (!token) {
          toast.error('User not authenticated');
          return;
        }

        const response = await fetch(`http://localhost:3000/api/users/requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        toast.error('Failed to fetch connection requests');
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;

      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      await fetch(`http://localhost:3000/api/users/requests/${requestId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Connection request accepted');
      setRequests(requests.filter((req) => req._id !== requestId));
    } catch (error) {
      toast.error('Failed to accept connection request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;

      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      await fetch(`http://localhost:3000/api/users/requests/${requestId}/reject`, {
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
