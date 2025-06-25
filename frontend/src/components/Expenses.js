import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Expenses.css';

function Expenses() {
  const navigate = useNavigate();
  const location = useLocation();
  const formType = location.state?.formType || 'add';

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    recurring: false
  });

  const [expenses, setExpenses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (formType === 'remove') {
      fetchExpenses();
    }
  }, [formType]);

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/api/exp/returnExpenses?token=${token}`, {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        // Sort descending by date
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setExpenses(sorted);
      } else {
        console.error("Failed to fetch expenses");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMultiDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/api/exp/removeMultiple?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedIds)
      });
      if (response.ok) {
        alert("Selected expenses removed");
        setSelectedIds([]);
        fetchExpenses();
      } else {
        console.error("Failed to remove expenses");
      }
    } catch (error) {
      console.error("Error removing expenses:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (formType === 'add') {
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
    }
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
        <div className="header">{formType === 'add' ? 'Add New Expense' : 'Remove Expense'}</div>

        {formType === 'add' ? (
          <form className="expense-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              required
            />
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Amount"
              step="0.01"
              required
            />
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Category"
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="recurring"
                checked={formData.recurring}
                onChange={handleInputChange}
              />
              Recurring
            </label>
            <button type="submit">Submit</button>
          </form>
        ) : (
          <>
            <ul className="removal-list">
              {expenses.map(exp => (
                <li
                  key={exp.id}
                  onClick={() => toggleSelect(exp.id)}
                  className={selectedIds.includes(exp.id) ? 'selected' : ''}
                >
                  [{new Date(exp.date).toLocaleDateString()}] {exp.title}: ${parseFloat(exp.amount).toFixed(2)} ({exp.category})
                </li>
              ))}
            </ul>
            {selectedIds.length > 0 && (
              <button className="delete-button" onClick={handleMultiDelete}>
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Expenses;
