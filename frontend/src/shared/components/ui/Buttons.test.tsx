import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Button, IconButton, ButtonLink } from './Button';
import { Heart } from 'lucide-react';

describe('Button primitives', () => {
  it('renders all variants and sizes with correct classes', () => {
    const { rerender } = render(<Button variant="primary">Solid Deep</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--primary');

    rerender(<Button variant="secondary" size="sm">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--secondary', 'button--sm');

    rerender(<Button variant="quiet" size="lg">Quiet</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--quiet', 'button--lg');

    rerender(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--destructive');

    rerender(<Button variant="accent">Gold</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--accent');
  });

  it('renders busy state with spinner and disables button', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <Button busy onClick={onClick} endIcon={<span data-testid="end-icon">→</span>}>
        Submitting
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('.button__spinner')).toBeInTheDocument();
    // End icon should be suppressed while busy
    expect(screen.queryByTestId('end-icon')).not.toBeInTheDocument();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();

    // When not busy, end icon appears
    rerender(
      <Button onClick={onClick} endIcon={<span data-testid="end-icon">→</span>}>
        Submitting
      </Button>
    );
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('renders icon button with mandatory aria-label and hides icon when busy', () => {
    const { rerender } = render(
      <IconButton aria-label="Favorite item" icon={<Heart data-testid="heart" />} />
    );
    const button = screen.getByRole('button', { name: 'Favorite item' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('icon-button');
    expect(screen.getByTestId('heart')).toBeInTheDocument();

    rerender(
      <IconButton busy aria-label="Favorite item" icon={<Heart data-testid="heart" />} />
    );
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.queryByTestId('heart')).not.toBeInTheDocument();
    expect(button.querySelector('.button__spinner')).toBeInTheDocument();
  });

  it('renders ButtonLink with valid router link semantics', () => {
    render(
      <MemoryRouter>
        <ButtonLink to="/shops" variant="secondary">Browse Florists</ButtonLink>
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: 'Browse Florists' });
    expect(link).toHaveAttribute('href', '/shops');
    expect(link).toHaveClass('button--secondary');
  });
});
