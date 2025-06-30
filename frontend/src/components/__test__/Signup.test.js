import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Signup from '../Signup';
import { MemoryRouter } from 'react-router-dom';

describe('Signup Integration', () => {
  it('accepts username and password input', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const username = screen.getByPlaceholderText(/Username/i);
    const password = screen.getByPlaceholderText(/Password/i);

    fireEvent.change(username, { target: { value: 'newuser' } });
    fireEvent.change(password, { target: { value: 'mypassword123' } });

    expect(username.value).toBe('newuser');
    expect(password.value).toBe('mypassword123');
  });

  it('submits form on button click', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));
  });
});
