import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { MemoryRouter } from 'react-router-dom';

// ✅ MOCK react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-chart">Mock Chart</div>
}));

describe('Dashboard Integration', () => {
  it('renders recent expenses and sidebar buttons', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Recent Expenses/i)).toBeInTheDocument();
    const charts = screen.getAllByTestId('mock-chart');
    expect(charts).toHaveLength(2);

    fireEvent.click(screen.getByText(/Home/i));
    fireEvent.click(screen.getByText(/Profile/i));
    fireEvent.click(screen.getByText(/Settings/i));
  });

  it('renders and interacts with quick access buttons', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const charts = screen.getAllByTestId('mock-chart');
    expect(charts).toHaveLength(2);

    fireEvent.click(screen.getByText(/Add Expense/i));
    fireEvent.click(screen.getByText(/Remove Expense/i));
  });
});
