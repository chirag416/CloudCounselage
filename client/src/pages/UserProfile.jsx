// src/components/UserProfile.js
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
import { styled } from '@mui/system';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

// Styled Components
const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  marginRight: theme.spacing(2),
}));

const Section = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

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
            // Include Authorization if the endpoint is protected
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
    <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
      <ProfileHeader>
        <Box display="flex" alignItems="center">
          <ProfileAvatar>{profileUser.name.charAt(0).toUpperCase()}</ProfileAvatar>
          <Box>
            <Typography variant="h4">{profileUser.name}</Typography>
            <Typography variant="subtitle1">{profileUser.email}</Typography>
          </Box>
        </Box>
        <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </ProfileHeader>

      <Section>
        <Typography variant="h5">Skills</Typography>
        <List>
          {profileUser.skills && profileUser.skills.length > 0 ? (
            profileUser.skills.map((skill, index) => (
              <ListItem key={index}>
                <ListItemText primary={skill} />
              </ListItem>
            ))
          ) : (
            <Typography color="textSecondary">No skills available.</Typography>
          )}
        </List>
      </Section>

      <Section>
        <Typography variant="h5">Experiences</Typography>
        <List>
          {profileUser.experiences && profileUser.experiences.length > 0 ? (
            profileUser.experiences.map((exp, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${exp.title} at ${exp.company}`}
                    secondary={`${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`}
                  />
                </ListItem>
                {exp.description && (
                  <Typography variant="body2" sx={{ ml: 4, mt: 1 }}>
                    {exp.description}
                  </Typography>
                )}
                {index < profileUser.experiences.length - 1 && <Divider sx={{ my: 2 }} />}
              </React.Fragment>
            ))
          ) : (
            <Typography color="textSecondary">No experiences available.</Typography>
          )}
        </List>
      </Section>
    </Container>
  );
};

export default UserProfile;
