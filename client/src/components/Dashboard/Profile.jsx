import React, { useContext, useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  TextField, 
  Button, 
  Box, 
  MenuItem,
  Avatar 
} from '@mui/material';
import { styled } from '@mui/system';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Search from './SearchComponent';
import MailIconComponent from './MailIconComponent';

// Styled components
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

const years = Array.from(new Array(50), (val, index) => new Date().getFullYear() - index);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Profile = () => {
  const { user, updateSkills, updateExperiences, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    description: '',
  });
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

  const handleAddExperience = async () => {
    const { title, company, startMonth, startYear, endMonth, endYear, description } = newExperience;
    if (!title || !company || !startMonth || !startYear || !endMonth || !endYear) {
      toast.error('All fields are required');
      return;
    }
    try {
      console.log('Adding experience:', newExperience);
      await updateExperiences(user._id, {
        title,
        company,
        startDate: `${startYear}-${months.indexOf(startMonth) + 1}`,
        endDate: `${endYear}-${months.indexOf(endMonth) + 1}`,
        description
      });
      setNewExperience({
        title: '',
        company: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        description: '',
      });
      toast.success('Experience added successfully');
    } catch (error) {
      toast.error('Failed to add experience');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (date) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    return `${months[parseInt(month, 10) - 1]} ${year}`;
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
      <Search />
      <MailIconComponent />
      <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <ProfileHeader>
          <Box display="flex" alignItems="center">
            <ProfileAvatar>{user.name.charAt(0)}</ProfileAvatar>
            <Box>
              <Typography variant="h4">{user.name}</Typography>
              <Typography variant="h6" color="textSecondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </ProfileHeader>

        <Section>
          <Typography variant="h5">Skills</Typography>
          <List>
            {user.skills && user.skills.length > 0 ? (
              user.skills.map((skill, index) => (
                <ListItem key={index}>
                  <ListItemText primary={skill} />
                </ListItem>
              ))
            ) : (
              <Typography color="textSecondary">No skills available. Add some skills to get started!</Typography>
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
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSkill}
            sx={{ mt: 2 }}
          >
            Add Skill
          </Button>
        </Section>

        <Section>
          <Typography variant="h5">Add Experience</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="title"
            label="Role"
            name="title"
            value={newExperience.title}
            onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="company"
            label="Company"
            name="company"
            value={newExperience.company}
            onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
            sx={{ mt: 2 }}
          />
          <Box display="flex" justifyContent="space-between">
            <TextField
              select
              variant="outlined"
              margin="normal"
              id="startMonth"
              label="Start Month"
              value={newExperience.startMonth}
              onChange={(e) => setNewExperience({ ...newExperience, startMonth: e.target.value })}
              sx={{ mt: 2, width: '45%' }}
            >
              {months.map((month, index) => (
                <MenuItem key={index} value={month}>{month}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              variant="outlined"
              margin="normal"
              id="startYear"
              label="Start Year"
              value={newExperience.startYear}
              onChange={(e) => setNewExperience({ ...newExperience, startYear: e.target.value })}
              sx={{ mt: 2, width: '45%' }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </TextField>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <TextField
              select
              variant="outlined"
              margin="normal"
              id="endMonth"
              label="End Month"
              value={newExperience.endMonth}
              onChange={(e) => setNewExperience({ ...newExperience, endMonth: e.target.value })}
              sx={{ mt: 2, width: '45%' }}
            >
              {months.map((month, index) => (
                <MenuItem key={index} value={month}>{month}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              variant="outlined"
              margin="normal"
              id="endYear"
              label="End Year"
              value={newExperience.endYear}
              onChange={(e) => setNewExperience({ ...newExperience, endYear: e.target.value })}
              sx={{ mt: 2, width: '45%' }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </TextField>
          </Box>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={newExperience.description}
            onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddExperience}
            sx={{ mt: 2 }}
          >
            Add Experience
          </Button>
        </Section>

        <Section>
          <Typography variant="h5">Experiences</Typography>
          <List>
            {user.experiences && user.experiences.length > 0 ? (
              user.experiences.map((exp, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${exp.title} at ${exp.company}`}
                      secondary={`${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`}
                    />
                  </ListItem>
                  <Typography variant="body2" sx={{ ml: 4, mt: 1 }}>
                    {exp.description}
                  </Typography>
                  {index < user.experiences.length - 1 && <Divider sx={{ my: 2 }} />}
                </React.Fragment>
              ))
            ) : (
              <Typography color="textSecondary">No experiences available.</Typography>
            )}
          </List>
        </Section>
      </Box>
    </Container>
  );
};

export default Profile;
