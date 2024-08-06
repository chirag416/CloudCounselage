import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider, TextField, Button } from '@mui/material';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateSkills } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const handleAddSkill = async () => {
    if (newSkill.trim() === '') {
      toast.error('Skill cannot be empty');
      return;
    }
    try {
      await updateSkills(user._id, newSkill);
      setNewSkill('');
      toast.success('Skill added successfully');
    } catch (error) {
      toast.error('Failed to add skill');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
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
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="newSkill"
          label="Add New Skill"
          name="newSkill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddSkill}
          sx={{ mt: 2 }}
        >
          Add Skill
        </Button>

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
