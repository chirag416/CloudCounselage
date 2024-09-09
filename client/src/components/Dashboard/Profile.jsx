import React, { useContext, useState, useEffect } from 'react';
import {
  Container, Typography, List, ListItem, ListItemText,
  TextField, Button, Box, MenuItem, Avatar, IconButton, Divider, Paper
} from '@mui/material';
import { Work as WorkIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Search from './SearchComponent';
import MailIconComponent from './MailIconComponent';

// Define a vibrant color palette
const themeColors = {
  primary: '#1E90FF', // Dodger Blue
  secondary: '#FF6347', // Tomato
  background: '#F0F8FF', // Alice Blue
  textPrimary: '#333333', // Dark Gray
  textSecondary: '#666666', // Medium Gray
  border: '#E0E0E0', // Light Gray
};

// Styled components
const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${themeColors.border}`,
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  marginRight: theme.spacing(2),
  backgroundColor: themeColors.secondary,
  color: '#FFFFFF',
}));

const Section = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const ContainerStyled = styled(Container)(({ theme }) => ({
  width: '80vw',
  maxWidth: '1200px',
  padding: theme.spacing(4),
  backgroundColor: themeColors.background,
}));

const SearchStyled = styled(Search)(({ theme }) => ({
  width: '100%',
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const SkillsSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#FFFFFF',
  boxShadow: `0px 4px 8px rgba(0, 0, 0, 0.1)`,
  borderRadius: theme.shape.borderRadius,
}));

const ExperienceSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#FFFFFF',
  boxShadow: `0px 4px 8px rgba(0, 0, 0, 0.1)`,
  borderRadius: theme.shape.borderRadius,
}));

const SkillItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${themeColors.border}`,
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  boxShadow: `0px 2px 4px rgba(0, 0, 0, 0.05)`,
}));

const ExperienceItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${themeColors.border}`,
  marginBottom: theme.spacing(2),
  backgroundColor: '#FFFFFF',
  boxShadow: `0px 2px 4px rgba(0, 0, 0, 0.05)`,
}));

const years = Array.from(new Array(50), (val, index) => new Date().getFullYear() - index);
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Profile = () => {
  const { user, updateSkills, updateExperiences, logout } = useContext(AuthContext);
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
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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

  const handleAddExperience = async () => {
    const { title, company, startMonth, startYear, endMonth, endYear, description } = newExperience;
    if (!title || !company || !startMonth || !startYear || !endMonth || !endYear) {
      toast.error('All fields are required');
      return;
    }
    if (description.split(' ').length > 50) {
      toast.error('Description cannot exceed 50 words');
      return;
    }
    try {
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

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <ContainerStyled component="main">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <SearchStyled />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/jobs')} color="primary">
            <WorkIcon />
          </IconButton>
        </Box>
        <MailIconComponent />
      </Box>

      <Box sx={{ padding: 4, borderRadius: 2 }}>
        <ProfileHeader>
          <Box display="flex" alignItems="center">
            <ProfileAvatar>{user.name.charAt(0)}</ProfileAvatar>
            <Box>
              <Typography variant="h4">{user.name}</Typography>
            </Box>
          </Box>
          <Button variant="outlined" color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </ProfileHeader>

        <Section>
          <SkillsSection>
            <Typography variant="h5" gutterBottom>Skills</Typography>
            <List>
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill, index) => (
                  <SkillItem key={index}>
                    <Typography variant="body1" color={themeColors.textPrimary}>{skill}</Typography>
                  </SkillItem>
                ))
              ) : (
                <Typography color={themeColors.textSecondary}>No skills available. Add some skills to get started!</Typography>
              )}
            </List>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowAddSkill(prev => !prev)}
              sx={{ mt: 2, mb: 2 }}
            >
              {showAddSkill ? 'Cancel' : 'Add Skill'}
            </Button>
            {showAddSkill && (
              <FormSection>
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
              </FormSection>
            )}
          </SkillsSection>
        </Section>

        <Section>
          <ExperienceSection>
            <Typography variant="h5" gutterBottom>Experiences</Typography>
            {user.experiences && user.experiences.length > 0 ? (
              user.experiences.map((exp, index) => (
                <ExperienceItem key={index}>
                  <Typography variant="h6" color={themeColors.textPrimary}>
                    {exp.title} at {exp.company}
                  </Typography>
                  <Typography variant="subtitle1" color={themeColors.textSecondary}>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </Typography>
                  <Typography variant="body2" color={themeColors.textPrimary} sx={{ mt: 1 }}>
                    {exp.description}
                  </Typography>
                  {index < user.experiences.length - 1 && <Divider sx={{ my: 2 }} />}
                </ExperienceItem>
              ))
            ) : (
              <Typography color={themeColors.textSecondary}>No experiences available.</Typography>
            )}
          </ExperienceSection>
        </Section>

        <Section>
          <ExperienceSection>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowAddExperience(prev => !prev)}
              sx={{ mb: 2 }}
            >
              {showAddExperience ? 'Cancel' : 'Add Experience'}
            </Button>
            {showAddExperience && (
              <>
                <Typography variant="h5" gutterBottom>Add Experience</Typography>
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
                <Box display="flex" gap={2} mb={2}>
                  <TextField
                    select
                    variant="outlined"
                    margin="normal"
                    id="startMonth"
                    label="Start Month"
                    value={newExperience.startMonth}
                    onChange={(e) => setNewExperience({ ...newExperience, startMonth: e.target.value })}
                    sx={{ flex: 1 }}
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
                    sx={{ flex: 1 }}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Box display="flex" gap={2} mb={2}>
                  <TextField
                    select
                    variant="outlined"
                    margin="normal"
                    id="endMonth"
                    label="End Month"
                    value={newExperience.endMonth}
                    onChange={(e) => setNewExperience({ ...newExperience, endMonth: e.target.value })}
                    sx={{ flex: 1 }}
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
                    sx={{ flex: 1 }}
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
              </>
            )}
          </ExperienceSection>
        </Section>
      </Box>
    </ContainerStyled>
  );
};

export default Profile;
