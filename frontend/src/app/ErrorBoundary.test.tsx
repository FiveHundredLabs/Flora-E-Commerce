import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

it('offers recovery without exposing internal error details', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  function BrokenChild(): never { throw new Error('private internal details'); }
  try {
    render(<ErrorBoundary><BrokenChild /></ErrorBoundary>);
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeVisible();
    expect(screen.queryByText('private internal details')).not.toBeInTheDocument();
  } finally {
    consoleError.mockRestore();
  }
});
