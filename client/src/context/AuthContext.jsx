import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) throw new Error('Login failed');
  
      const data = await response.json();
      console.log('Login successful, user data:', data);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        token: data.token,
        skills: data.skills || [],
        experiences: data.experiences || [],
      });
  
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        token: data.token,
        skills: data.skills || [],
        experiences: data.experiences || [],
      }));
    } catch (error) {
      toast.error('Login failed');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateSkills = async (userId, skill) => {
    try {
      console.log('Updating skills for user:', userId, skill);
      const response = await fetch(`http://localhost:3000/api/users/${userId}/skills`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ skill }),
      });

      if (!response.ok) throw new Error('Failed to update skills');

      const updatedUser = await response.json();
      console.log('Updated user data:', updatedUser);

      setUser((prevUser) => ({
        ...prevUser,
        skills: updatedUser.skills || []
      }));

      localStorage.setItem('user', JSON.stringify({
        ...user,
        skills: updatedUser.skills || []
      }));
      
      return updatedUser;
    } catch (error) {
      toast.error('Failed to update skills');
      console.error('Update skills error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateSkills }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
