import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Reset from './components/Reset';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password" element={<Reset />} />
      </Routes>
    </Router>

  );
}

export default App;