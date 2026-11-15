import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { App } from './App';
describe('foundation routes', () => {
  it('clearly labels the sample catalog entry points', () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Welcome to Flower & Flora' })).toBeVisible();
    expect(screen.getByText(/All shops and products shown are fictional/)).toBeVisible();
    expect(screen.getByRole('link', { name: 'Browse sample shops' })).toHaveAttribute('href', '/shops');
  });

  it('recovers from unknown routes using client navigation', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/missing']}><App /></MemoryRouter>);
    await user.click(screen.getByRole('link', { name: 'Return home' }));
    expect(screen.getByRole('heading', { name: 'Welcome to Flower & Flora' })).toBeVisible();
    expect(screen.getByRole('main')).toHaveFocus();
    expect(document.title).toBe('Welcome to Flower & Flora | Flower & Flora');
  });

  it('does not steal keyboard focus on initial entry', () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByRole('main')).not.toHaveFocus();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
  });

  it.each([
    ['/supplier', 'Supplier workspace'],
    ['/admin', 'Super admin workspace'],
  ])('renders the %s layout preview without account data', (path, name) => {
    render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name, level: 1 })).toBeVisible();
    expect(screen.getByRole('navigation', { name: `${name} navigation` })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('region', { name: 'Overview' })).toHaveTextContent('not available yet');
  });
});
