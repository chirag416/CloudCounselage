import React, { createContext, useState } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        token: data.token,
      });
    } catch (error) {
      toast.error('Login failed');
      throw error;
    }
  };

  const updateSkills = async (userId, newSkill) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/skills`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill: newSkill }),
      });

      if (!response.ok) throw new Error('Failed to update skills');

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      toast.error('Failed to update skills');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, updateSkills }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
