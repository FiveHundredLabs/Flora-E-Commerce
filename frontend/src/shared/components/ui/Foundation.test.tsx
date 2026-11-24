import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Price, Toast } from './Feedback';
import { ChoiceField, TextareaField } from './Fields';
import { Tabs } from './Navigation';

describe('foundation primitives', () => {
  it('does not invent missing or invalid prices', () => {
    const { rerender } = render(<Price />);
    expect(screen.getByText('Price unavailable')).toBeInTheDocument();
    rerender(<Price amount={Number.NaN} currency="LKR" />);
    expect(screen.getByText('Price unavailable')).toBeInTheDocument();
    rerender(<Price amount={0} currency="LKR" />);
    expect(screen.getByText(/0\.00/)).toBeInTheDocument();
  });

  it('moves tabs with arrow keys and updates selection', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Examples" items={[{ id: 'one', label: 'One', content: 'First' }, { id: 'two', label: 'Two', content: 'Second' }]} />);
    await user.click(screen.getByRole('tab', { name: 'One' }));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true');
  });

  it('connects choice and textarea descriptions to their controls', () => {
    render(<><ChoiceField label="Remember" hint="Only on this device" /><TextareaField label="Notes" error="Notes are required" /></>);
    expect(screen.getByRole('checkbox', { name: 'Remember' })).toHaveAccessibleDescription('Only on this device');
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveAccessibleDescription('Notes are required');
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('provides a named toast dismissal action', async () => {
    const user = userEvent.setup();
    const dismiss = vi.fn();
    render(<Toast message="Saved locally" onDismiss={dismiss} />);
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(dismiss).toHaveBeenCalledOnce();
  });
});
