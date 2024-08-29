import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Profile from './components/Dashboard/Profile';
import NotFound from './pages/NotFound';
import RequestsPage from './components/Dashboard/RequestsPage';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Jobs from './pages/Jobs';

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/requests" element={<RequestsPage />} />
          {/* <Route path="/profile/:userId" element={<UserProfile />} /> */}

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
