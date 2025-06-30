import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Expenses from '../Expenses';
import { MemoryRouter } from 'react-router-dom';

describe('Expenses Integration', () => {
  it('renders form and inputs work', () => {
    render(
      <MemoryRouter>
        <Expenses />
      </MemoryRouter>
    );

    const title = screen.getByPlaceholderText(/Title/i);
    const amount = screen.getByPlaceholderText(/Amount/i);
    const category = screen.getByPlaceholderText(/Category/i);
    const date = screen.getByLabelText(/Date/i);

    fireEvent.change(title, { target: { value: 'Test Expense' } });
    fireEvent.change(amount, { target: { value: '12.50' } });
    fireEvent.change(category, { target: { value: 'Test' } });
    fireEvent.change(date, { target: { value: '2025-06-25' } });

    expect(title.value).toBe('Test Expense');
    expect(amount.value).toBe('12.50');
    expect(category.value).toBe('Test');
  });

  it('renders sidebar buttons and navigates', () => {
    render(
      <MemoryRouter>
        <Expenses />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Home/i));
    fireEvent.click(screen.getByText(/Profile/i));
    fireEvent.click(screen.getByText(/Settings/i));
  });
});
