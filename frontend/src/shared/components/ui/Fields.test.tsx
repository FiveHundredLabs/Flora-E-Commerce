import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { TextField, SelectField } from './Fields';

it('keeps explicit field IDs and removes stale select error descriptions after correction', () => {
  const { rerender } = render(<SelectField id="sample-choice" label="Sample choice" hint="Choose locally." error="A choice is required."><option>Alpha</option></SelectField>);
  const select = screen.getByRole('combobox');
  expect(select).toHaveAttribute('id', 'sample-choice');
  expect(select).toHaveAccessibleDescription('Choose locally. A choice is required.');
  rerender(<SelectField id="sample-choice" label="Sample choice" hint="Choose locally."><option>Alpha</option></SelectField>);
  expect(select).not.toHaveAttribute('aria-invalid');
  expect(select).toHaveAccessibleDescription('Choose locally.');
  expect(screen.queryByText('A choice is required.')).not.toBeInTheDocument();
});

it('preserves read-only values and skips disabled fields during keyboard navigation', async () => {
  const user = userEvent.setup();
  render(<><TextField label="Disabled sample" disabled defaultValue="Disabled" /><TextField label="Read-only sample" readOnly value="Fixed" /><SelectField label="Disabled choice" disabled><option>Alpha</option></SelectField><button>Next action</button></>);
  await user.tab();
  const input = screen.getByRole('textbox', { name: 'Read-only sample' });
  expect(input).toHaveFocus();
  await user.type(input, 'Changed');
  expect(input).toHaveValue('Fixed');
  await user.tab();
  expect(screen.getByRole('button')).toHaveFocus();
});
