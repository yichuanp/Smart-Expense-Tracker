import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Reset from '../Reset';
import { MemoryRouter } from 'react-router-dom';

describe('Reset Integration', () => {
  it('accepts username and new password input', () => {
    render(
      <MemoryRouter>
        <Reset />
      </MemoryRouter>
    );

    const username = screen.getByPlaceholderText(/Enter username/i);
    const password = screen.getByPlaceholderText(/Enter new password/i);

    fireEvent.change(username, { target: { value: 'resetuser' } });
    fireEvent.change(password, { target: { value: 'newpass123' } });

    expect(username.value).toBe('resetuser');
    expect(password.value).toBe('newpass123');
  });

  it('allows clicking reset button', () => {
    render(
      <MemoryRouter>
        <Reset />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Reset/i }));
  });
});
