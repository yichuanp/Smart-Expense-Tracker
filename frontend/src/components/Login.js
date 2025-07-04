// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle login logic here (e.g., API call)
    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
        });

        if(response.ok) {
            const token = await response.text();
            localStorage.setItem("token", token);
            alert("Login Successful!");
            console.log("JWT Token: ", token);
            navigate("/dashboard");
        } else if (response.status === 409) {
            alert("Username already exists!");
        } else {
            alert("Something went wrong!");
        }
    } catch(error) {
        console.error("Login failed:", error);
        alert("Login failed");
    }

  };

  return (
    <div className="login-container">
      <h2>Welcome! Login to start tracking!</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" className="forgot-password" onClick={() => navigate("/reset-password")}>Forgot your Password?</button>
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
        <div className="create-account-container">
          <button
            type="button"
            className="create-account"
            onClick={() => navigate("/signup")}
          >
            Don't have an account? Create an account here!
          </button>
        </div>
    </div>

  );
}

export default Login;