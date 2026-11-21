import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  Card,
  Price,
  StatusChip,
  Alert,
  EmptyState,
  ImageWithFallback,
  Separator,
} from './Content';
import { ToastProvider, useToast } from './Toast';
import { Button } from './Button';
import { Inbox } from 'lucide-react';

function ToastDemo() {
  const { showToast } = useToast();
  return (
    <Button onClick={() => showToast({ title: 'Batch updated', tone: 'success' })}>
      Trigger Toast
    </Button>
  );
}

describe('Content, Feedback & Status Primitives', () => {
  it('formats valid prices and shows honest unavailable state when missing', () => {
    const { rerender } = render(<Price amount={3500} currency="LKR" />);
    expect(screen.getByText(/3,500/)).toBeInTheDocument();

    rerender(<Price amount={null} />);
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
    expect(screen.getByText(/Price:/)).toHaveClass('sr-only');

    rerender(<Price amount={undefined} />);
    expect(screen.getByText('Unavailable')).toBeInTheDocument();

    // Invalid currency code falls back gracefully without throwing RangeError
    rerender(<Price amount={1200} currency="INVALID" />);
    expect(screen.getByText(/1200/)).toBeInTheDocument();
  });

  it('renders StatusChip with accessible dot and tone label', () => {
    render(<StatusChip status="Verified Florist" tone="success" />);
    const chip = screen.getByText('Verified Florist');
    expect(chip.closest('.status-chip')).toHaveClass('status-chip--success');
  });

  it('renders Alert with tone and dismiss action', async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(
      <Alert tone="danger" title="Validation Error" onDismiss={onDismiss}>
        Selected arrangement is out of season.
      </Alert>
    );

    expect(screen.getByRole('alert')).toHaveClass('alert--danger');
    expect(screen.getByText('Validation Error')).toBeInTheDocument();

    const dismissBtn = screen.getByRole('button', { name: 'Dismiss alert' });
    await user.click(dismissBtn);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('renders EmptyState with accessible role and action', () => {
    render(
      <EmptyState
        icon={<Inbox data-testid="inbox-icon" />}
        title="No Orders Yet"
        description="Incoming orders will show up here."
        action={<Button>Create Order</Button>}
      />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('No Orders Yet')).toBeInTheDocument();
    expect(screen.getByTestId('inbox-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Order' })).toBeInTheDocument();
  });

  it('renders ImageWithFallback, falls back on error, and recovers when src changes', () => {
    const { rerender } = render(<ImageWithFallback src="https://example.com/broken.jpg" alt="Botanical bouquet" />);
    const img = screen.getByRole('img', { name: 'Botanical bouquet' });
    expect(img).toBeInTheDocument();

    // Trigger image error
    fireEvent.error(img);
    expect(screen.getByText('Image unavailable')).toBeInTheDocument();

    // Decorative image with empty alt string renders role="presentation"
    rerender(<ImageWithFallback src={null} alt="" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    // Update src prop to a new URL
    rerender(<ImageWithFallback src="https://example.com/valid.jpg" alt="Botanical bouquet" />);
    expect(screen.queryByText('Image unavailable')).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Botanical bouquet' })).toHaveAttribute('src', 'https://example.com/valid.jpg');
  });

  it('renders Separator with role separator', () => {
    const { rerender } = render(<Separator />);
    expect(screen.getByRole('separator')).toHaveClass('separator--horizontal');

    rerender(<Separator orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveClass('separator--vertical');
  });

  it('triggers and renders Toast inside ToastProvider', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastDemo />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Trigger Toast' }));
    expect(await screen.findByText('Batch updated')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('renders Card with and without title properly managing accessibility semantics', () => {
    const { rerender } = render(
      <Card title="Seasonal Offerings">
        <p>Winter blooms available now.</p>
      </Card>
    );
    expect(screen.getByRole('region', { name: 'Seasonal Offerings' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Seasonal Offerings' })).toBeInTheDocument();

    // Without title, renders clean container without dangling aria-labelledby
    rerender(
      <Card>
        <p>Container only content</p>
      </Card>
    );
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.getByText('Container only content')).toBeInTheDocument();
  });
});
