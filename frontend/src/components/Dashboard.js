import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function getMonthlySpending(expenses) {
  const monthlyTotals = {};

  expenses.forEach(exp => {
    const date = new Date(exp.date);
    const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });

    if (!monthlyTotals[month]) monthlyTotals[month] = 0;
    monthlyTotals[month] += parseFloat(exp.amount);
  });

  const labels = Object.keys(monthlyTotals);
  const data = Object.values(monthlyTotals);

  return {
    labels,
    datasets: [
      {
        label: 'Monthly Spending ($)',
        data,
        backgroundColor: '#008080',
      },
    ],
  };
}

function getDailySpending(expenses) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const dailyTotals = {};

  expenses.forEach(exp => {
    const date = new Date(exp.date);
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      const day = date.getDate();
      if (!dailyTotals[day]) dailyTotals[day] = 0;
      dailyTotals[day] += parseFloat(exp.amount);
    }
  });

  const days = Array.from({ length: 31 }, (_, i) => i + 1); // max days in month
  const data = days.map(day => dailyTotals[day] || 0);

  return {
    labels: days,
    datasets: [
      {
        label: 'Daily Spending ($)',
        data,
        backgroundColor: '#FFA07A',
      },
    ],
  };
}


function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

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

return (
  <div className="dashboard-wrapper">
    <div className="sidebar">
      <div className="profile-photo"></div>
      <button onClick={() => navigate('/dashboard')} className="sidebar-button">Home</button>
      <button onClick={() => navigate('/profile')} className="sidebar-button">Profile</button>
      <button onClick={() => navigate('/settings')} className="sidebar-button">Settings</button>
    </div>

    <div className="dashboard-container">
      <div className="item recent-expenses">
        <div className="header">Recent Expenses</div>
            <ul className="expense-list">
              {expenses.slice(0, 5).map((exp) => (
                <li key={exp.id}>
                  <span>[{new Date(exp.date).toLocaleDateString()}] {exp.title}: ${parseFloat(exp.amount).toFixed(2)} ({exp.category})</span>
                </li>
              ))}
            </ul>
      </div>

        <div className="item quick-access">
          <div className="header">Quick Access</div>
          <div className="quick-access-buttons">
            <button onClick={() => navigate("/add-expenses")}>Add Expense</button>
            <button onClick={() => navigate("/remove-expenses")}>Remove Expense</button>
          </div>
        </div>

        <div className="item monthly-report">
          <div className="header">Monthly Report</div>
          <div className="monthly-spending">
            <Bar data={getMonthlySpending(expenses)} />
          </div>
          <div className="daily-spending">
            <Bar data={getDailySpending(expenses)} />
          </div>

        </div>

    </div>
  </div>
);

}

export default Dashboard;
