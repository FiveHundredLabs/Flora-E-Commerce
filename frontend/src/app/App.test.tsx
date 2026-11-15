import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { App } from './App';
describe('foundation routes', () => {
  it('shows an honest unavailable catalog state', () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Welcome to Flower & Flora' })).toBeVisible();
    expect(screen.getByText(/Stores and products are not available/)).toBeVisible();
  });

  it('recovers from unknown routes using client navigation', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/missing']}><App /></MemoryRouter>);
    await user.click(screen.getByRole('link', { name: 'Return home' }));
    expect(screen.getByRole('heading', { name: 'Welcome to Flower & Flora' })).toBeVisible();
  });
});
