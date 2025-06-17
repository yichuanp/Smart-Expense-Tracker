import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    recurring: false
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`http://localhost:8080/api/exp/returnExpenses?token=${token}`, {
            method: 'POST'
          });

          if (response.ok) {
            const data = await response.json();
            setExpenses(data);
          } else {
            console.error("Failed to fetch expenses");
          }
        } catch (error) {
          console.error("Error fetching expenses:", error);
        }
      }
    };

    fetchExpenses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/api/exp/addExpense?token=${token}`
      ,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, token })
      });

      if (response.ok) {
        setFormData({ title: '', amount: '', category: '', date: '', recurring: false });
        setShowForm(false);
        const newExpense = await response.json();
        setExpenses(prev => [...prev, newExpense]);
      } else {
        console.error("Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Your Expenses</h2>
      <ul>
        {expenses.map(exp => (
          <li key={exp.id}>{exp.title} - ${exp.amount}</li>
        ))}
      </ul>

      {!showForm ? (
        <button onClick={() => setShowForm(true)}>Add Expense</button>
      ) : (
        <form className="expense-form" onSubmit={handleAddExpense}>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" required />
          <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="Amount" step="0.01" required />
          <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="Category" required />
          <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
          <label>
            <input type="checkbox" name="recurring" checked={formData.recurring} onChange={handleInputChange} />
            Recurring
          </label>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default Dashboard;
