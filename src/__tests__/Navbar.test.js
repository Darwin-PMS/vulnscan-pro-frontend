import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

describe('Navbar Component', () => {
    it('renders navigation links', () => {
        renderWithRouter(<Navbar />);
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    it('shows login link when not authenticated', () => {
        renderWithRouter(<Navbar />);
        expect(screen.getByText(/login/i)).toBeInTheDocument();
    });
});
