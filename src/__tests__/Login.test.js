import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';

const mockLogin = jest.fn();
jest.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({ login: mockLogin })
}));

describe('Login Page', () => {
    beforeEach(() => {
        mockLogin.mockClear();
    });

    it('renders login form', () => {
        render(<Login />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('shows validation errors on empty submit', () => {
        render(<Login />);
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(screen.queryByText(/email is required/i)).toBeInTheDocument();
    });

    it('calls login with valid credentials', () => {
        render(<Login />);
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
});
