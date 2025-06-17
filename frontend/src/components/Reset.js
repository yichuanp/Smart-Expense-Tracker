// src/components/Reset-Password.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reset.css';

function Reset() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    try {
            const response = await fetch('http://localhost:8080/api/auth/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });

        if(response.ok) {
            navigate("/")
        }
    } catch(error) {
        console.error("Reset password failed: ", error)
        alert("Could not reset password")
    }

  }

  return (
    <div className="Reset-Password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="button" className="Reset-Password-button" onClick={handleForgotPassword}>Reset</button>
      </form>
    </div>

  );
}

export default Reset;