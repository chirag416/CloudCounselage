import React, { useContext, useState, useEffect } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider, TextField, Button } from '@mui/material';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Search from './SearchComponent';
import MailIconComponent from './MailIconComponent';

const Profile = () => {
  const { user, updateSkills, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleAddSkill = async () => {
    if (newSkill.trim() === '') {
      toast.error('Skill cannot be empty');
      return;
    }
    try {
      console.log('Adding skill:', newSkill);
      await updateSkills(user._id, newSkill);
      setNewSkill('');
      toast.success('Skill added successfully');
    } catch (error) {
      toast.error('Failed to add skill');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
      <Search />
      <MailIconComponent />
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
            <Typography>No skills available. Add some skills to get started!</Typography>
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

        {/* Logout Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ mt: 4 }}
        >
          Logout
        </Button>
      </Paper>
    </Container>
  );
};

export default Profile;
