// src/components/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Frontend validation
    if (!firstName || !lastName || !email || !username || !password) {
      return alert("All fields are required.");
    }

    if (password.length < 8) {
      return alert("Password is too short! Choose a password between 8-20 characters!");
    } else if (password.length > 20) {
      return alert("Password is too long! Choose a password between 8-20 characters!");
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          firstName,
          lastName,
          email
        })
      });

      if (response.ok) {
        const data = await response.text();
        alert(data);
        navigate("/dashboard");
      } else if (response.status === 409) {
        alert("Username already exists!");
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed!");
    }
  };

return (
  <div className="signup-container">
    <h2>Create an Account</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
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
      </div>
      <button type="submit">Signup</button>
    </form>
    <div className="login-link-container">
      <button
        type="button"
        className="login-link"
        onClick={() => navigate("/login")}
      >
        Already have an account? Login here!
      </button>
    </div>
  </div>
);

}

export default Signup;
