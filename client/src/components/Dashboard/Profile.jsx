import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("User in Profile:", user); // Debug log

    if (user) {
      console.log("User found:", user); // Debug log
      setLoading(false);
    } else {
      console.log("User data is still null."); // Debug log
    }
  }, [user]);

  if (loading) {
    console.log("User data loading...");
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
    console.log("No user found.");
    return <Typography>No user data available</Typography>;
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="h6" component="p" color="textSecondary">
          {user.email}
        </Typography>
        
        <Typography variant="h5" component="h2" sx={{ mt: 4 }}>
          Skills
        </Typography>
        <List>
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill, index) => (
              <ListItem key={index}>
                <ListItemText primary={skill} />
              </ListItem>
            ))
          ) : (
            <Typography>No skills available</Typography>
          )}
        </List>

        <Typography variant="h5" component="h2" sx={{ mt: 4 }}>
          Experiences
        </Typography>
        <List>
          {user.experiences && user.experiences.length > 0 ? (
            user.experiences.map((exp, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${exp.title} at ${exp.company}`}
                  secondary={`${exp.startDate} - ${exp.endDate}`}
                />
                <Typography variant="body2">{exp.description}</Typography>
                {index < user.experiences.length - 1 && <Divider />}
              </ListItem>
            ))
          ) : (
            <Typography>No experiences available</Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default Profile;
