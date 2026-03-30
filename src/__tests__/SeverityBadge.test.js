import React from 'react';
import { render, screen } from '@testing-library/react';
import SeverityBadge from '../components/SeverityBadge';

describe('SeverityBadge Component', () => {
    it('renders Critical severity correctly', () => {
        render(<SeverityBadge severity="Critical" />);
        expect(screen.getByText(/Critical/i)).toBeInTheDocument();
    });

    it('renders High severity correctly', () => {
        render(<SeverityBadge severity="High" />);
        expect(screen.getByText(/High/i)).toBeInTheDocument();
    });

    it('renders Medium severity correctly', () => {
        render(<SeverityBadge severity="Medium" />);
        expect(screen.getByText(/Medium/i)).toBeInTheDocument();
    });

    it('renders Low severity correctly', () => {
        render(<SeverityBadge severity="Low" />);
        expect(screen.getByText(/Low/i)).toBeInTheDocument();
    });
});
