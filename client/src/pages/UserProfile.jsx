import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Box,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import './styles.css'; // Ensure this file contains your CSS

const UserProfile = () => {
  const { user: currentUser } = useContext(AuthContext);
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setProfileUser(data);
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to load profile: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, currentUser]);

  const formatDate = (date) => {
    if (!date) return 'Present';
    const [year, month] = date.split('-');
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return `${months[parseInt(month, 10) - 1]} ${year}`;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" className="user-profile-container">
      <Box className="profile-header">
        <Box display="flex" alignItems="center">
          <Avatar src={profileUser.avatarUrl} className="profile-avatar">
            {profileUser.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4">{profileUser.name}</Typography>
          </Box>
        </Box>
        <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>

      <Box className="section">
        <Typography variant="h5" className="section-title">Skills</Typography>
        <List>
          {profileUser.skills && profileUser.skills.length > 0 ? (
            profileUser.skills.map((skill, index) => (
              <ListItem key={index} className="list-item">
                <ListItemText primary={skill} />
              </ListItem>
            ))
          ) : (
            <Typography color="textSecondary">No skills available.</Typography>
          )}
        </List>
      </Box>

      <Box className="section">
        <Typography variant="h5" className="section-title">Experiences</Typography>
        <List>
          {profileUser.experiences && profileUser.experiences.length > 0 ? (
            profileUser.experiences.map((exp, index) => (
              <React.Fragment key={index}>
                <ListItem className="list-item">
                  <Box className="experience-details">
                    <ListItemText
                      primary={<strong>{`${exp.title} at ${exp.company}`}</strong>}
                      secondary={`${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`}
                    />
                    {exp.description && (
                      <Box className="experience-description">
                        <Typography variant="body2">
                          {exp.description}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </ListItem>
                {index < profileUser.experiences.length - 1 && <Divider className="divider" />}
              </React.Fragment>
            ))
          ) : (
            <Typography color="textSecondary">No experiences available.</Typography>
          )}
        </List>
      </Box>
    </Container>
  );
};

export default UserProfile;
