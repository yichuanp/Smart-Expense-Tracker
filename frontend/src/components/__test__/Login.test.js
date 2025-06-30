import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';
import { MemoryRouter } from 'react-router-dom';

describe('Login Integration', () => {
  it('allows entering username and password', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const username = screen.getByPlaceholderText(/Username/i);
    const password = screen.getByPlaceholderText(/Password/i);

    fireEvent.change(username, { target: { value: 'testuser' } });
    fireEvent.change(password, { target: { value: 'testpass' } });

    expect(username.value).toBe('testuser');
    expect(password.value).toBe('testpass');
  });

  it('allows clicking forgot password', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Forgot your Password/i));
  });
});
