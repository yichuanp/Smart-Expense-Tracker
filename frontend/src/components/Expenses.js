// src/components/Expenses.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Expenses.css';

function Expenses() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    recurring: false
  });

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:8080/api/exp/addExpense?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, token })
      });

      if (response.ok) {
        alert("Expense added successfully!");
        setFormData({
          title: '',
          amount: '',
          category: '',
          date: '',
          recurring: false
        });
        navigate("/dashboard");
      } else {
        console.error("Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="dashboard-wrapper">
      <div className="sidebar">
        <div className="profile-photo">👤</div>
        <button className="sidebar-button" onClick={() => navigate("/dashboard")}>Home</button>
        <button className="sidebar-button" onClick={() => navigate("/profile")}>Profile</button>
        <button className="sidebar-button" onClick={() => navigate("/settings")}>Settings</button>
      </div>

      <div className="expense-container">
        <div className="header">Add New Expense</div>
        <form className="expense-form" onSubmit={handleAddExpense}>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" required />
          <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="Amount" step="0.01" required />
          <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="Category" required />
          <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
          <label className="checkbox-label">
            <input type="checkbox" name="recurring" checked={formData.recurring} onChange={handleInputChange} />
            Recurring
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Expenses;
