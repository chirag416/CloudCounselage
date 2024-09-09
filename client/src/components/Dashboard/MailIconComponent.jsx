import React, { useContext, useEffect, useState } from 'react';
import { Badge, IconButton } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MailIconComponent = () => {
  const { user } = useContext(AuthContext);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchRequests = async () => {
        try {
          console.log(`Fetching connection requests for user ID: ${user._id}`);
          const response = await fetch(`http://localhost:3000/api/users/${user._id}/requests`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch requests: ${response.statusText}`);
          }

          const data = await response.json();
          setConnectionRequests(data);
        } catch (error) {
          console.error('Failed to fetch connection requests:', error);
          toast.error('Failed to fetch connection requests');
        }
      };

      fetchRequests();
    }
  }, [user]);

  const handleClick = () => {
    navigate('/requests'); // Route to a page that displays all connection requests
  };

  return (
    <IconButton color="primary" onClick={handleClick}>
      <Badge badgeContent={connectionRequests.length} color="secondary">
        <MailIcon />
      </Badge>
    </IconButton>
  );
};

export default MailIconComponent;
