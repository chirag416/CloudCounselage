import React, { createContext, useState } from 'react';

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
      console.log("Login response status:", response.status); // Debug log

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      console.log("Login response data:", data); // Debug log

      if (data && data._id && data.name && data.email && data.token) {
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          token: data.token,
        });
      } else {
        console.error("User data not received properly."); // Debug log
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      throw error; // Rethrow to handle in Login component
    }
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
