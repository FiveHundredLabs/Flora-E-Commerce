import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Button } from './Button';
import { SelectField, TextField } from './Fields';

it('does not submit its surrounding form by default and blocks busy actions', async () => {
  const click = vi.fn();
  const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
  const user = userEvent.setup();
  const { rerender } = render(<form onSubmit={submit}><Button onClick={click}>Save</Button></form>);
  await user.click(screen.getByRole('button', { name: 'Save' }));
  expect(click).toHaveBeenCalledOnce();
  expect(submit).not.toHaveBeenCalled();
  rerender(<Button busy onClick={click}>Saving</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
  expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  await user.click(screen.getByRole('button'));
  expect(click).toHaveBeenCalledOnce();
});

it('connects labels, hints and errors without dropping external descriptions', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<><p id="extra">Sample context</p><TextField label="Sample name" hint="Use plain text." error="Enter a name." aria-describedby="extra" required /></>);
  const input = screen.getByRole('textbox', { name: 'Sample name' });
  expect(input).toHaveAccessibleDescription('Sample context Use plain text. Enter a name.');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toBeRequired();
  await user.type(input, 'Sample');
  expect(input).toHaveValue('Sample');
  rerender(<TextField label="Sample name" hint="Use plain text." />);
  expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Use plain text.');
});

it('keeps multiple native select fields labeled and independently operable', async () => {
  const user = userEvent.setup();
  render(<><SelectField label="First choice" hint="Sample choices"><option value="a">Alpha</option><option value="b">Beta</option></SelectField><SelectField label="Second choice" error="Choose a value"><option>Gamma</option></SelectField></>);
  const first = screen.getByRole('combobox', { name: 'First choice' });
  await user.selectOptions(first, 'b');
  expect(first).toHaveValue('b');
  expect(first).toHaveAccessibleDescription('Sample choices');
  expect(screen.getByRole('combobox', { name: 'Second choice' })).toHaveAttribute('aria-invalid', 'true');
  expect(first.id).not.toBe(screen.getByRole('combobox', { name: 'Second choice' }).id);
});
