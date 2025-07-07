import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Reset from './components/Reset';
import Expenses from './components/Expenses';
import Profile from './components/Profile'

function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/reset-password" element={<Reset />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
