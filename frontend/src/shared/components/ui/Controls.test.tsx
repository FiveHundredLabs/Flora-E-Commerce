import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  TextareaField,
  SearchInput,
  Combobox,
  CheckboxField,
  RadioGroupField,
  SwitchField,
} from './Fields';

describe('Form Controls & Choice Primitives', () => {
  it('renders TextareaField with char count and accessible descriptions', async () => {
    const user = userEvent.setup();
    render(
      <TextareaField
        label="Special Instructions"
        hint="Max 50 chars."
        maxLength={50}
        showCount
        error="Too short"
      />
    );
    const textarea = screen.getByRole('textbox', { name: /Special Instructions/ });
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Too short')).toBeInTheDocument();
    expect(screen.getByText('0/50')).toBeInTheDocument();

    await user.type(textarea, 'Seasonal greenery please');
    expect(screen.getByText('24/50')).toBeInTheDocument();
  });

  it('renders SearchInput with clear action', async () => {
    const onClear = vi.fn();
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <SearchInput value="" onChange={onChange} onClear={onClear} placeholder="Search flowers" />
    );

    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('placeholder', 'Search flowers');
    expect(screen.queryByLabelText('Clear search input')).not.toBeInTheDocument();

    rerender(<SearchInput value="peonies" onChange={onChange} onClear={onClear} />);
    const clearBtn = screen.getByLabelText('Clear search input');
    expect(clearBtn).toBeInTheDocument();
    await user.click(clearBtn);
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('handles Combobox filtering and keyboard navigation', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const options = [
      { value: 'colombo', label: 'Colombo 03' },
      { value: 'kandy', label: 'Kandy Central' },
      { value: 'galle', label: 'Galle Fort' },
    ];

    render(
      <Combobox
        label="Delivery Destination"
        options={options}
        value=""
        onChange={onChange}
      />
    );

    const input = screen.getByRole('combobox', { name: 'Delivery Destination' });
    expect(input).toHaveAttribute('aria-expanded', 'false');

    await user.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Navigate with arrow keys
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith('kandy');
  });

  it('selects option on click and closes the listbox without reopening', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const options = [
      { value: 'colombo', label: 'Colombo 03' },
      { value: 'kandy', label: 'Kandy Central' },
    ];

    render(
      <Combobox
        label="Delivery Destination"
        options={options}
        value=""
        onChange={onChange}
      />
    );

    const input = screen.getByRole('combobox', { name: 'Delivery Destination' });
    await user.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');

    const option = screen.getByRole('option', { name: 'Kandy Central' });
    await user.click(option);
    expect(onChange).toHaveBeenCalledWith('kandy');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('toggles CheckboxField and SwitchField', async () => {
    const onSwitch = vi.fn();
    const user = userEvent.setup();

    render(
      <>
        <CheckboxField label="Gift wrapping" defaultChecked />
        <SwitchField label="Store active" checked={false} onChange={onSwitch} />
      </>
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Gift wrapping' });
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();

    const switchBtn = screen.getByRole('switch', { name: 'Store active' });
    expect(switchBtn).toHaveAttribute('aria-checked', 'false');
    await user.click(switchBtn);
    expect(onSwitch).toHaveBeenCalledWith(true);
  });

  it('renders RadioGroupField with proper fieldset semantics', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const options = [
      { value: 'standard', label: 'Standard' },
      { value: 'express', label: 'Express' },
    ];

    render(
      <RadioGroupField
        legend="Delivery Speed"
        name="speed"
        options={options}
        value="standard"
        onChange={onChange}
      />
    );

    const standardRadio = screen.getByRole('radio', { name: 'Standard' });
    const expressRadio = screen.getByRole('radio', { name: 'Express' });
    expect(standardRadio).toBeChecked();
    expect(expressRadio).not.toBeChecked();

    await user.click(expressRadio);
    expect(onChange).toHaveBeenCalledWith('express');
  });

  it('synchronizes TextareaField character count with controlled value updates', () => {
    const { rerender } = render(
      <TextareaField
        label="Controlled Notes"
        value="Initial text"
        maxLength={100}
        showCount
      />
    );
    expect(screen.getByText('12/100')).toBeInTheDocument();

    rerender(
      <TextareaField
        label="Controlled Notes"
        value="Updated with more details"
        maxLength={100}
        showCount
      />
    );
    expect(screen.getByText('25/100')).toBeInTheDocument();

    rerender(
      <TextareaField
        label="Controlled Notes"
        value=""
        maxLength={100}
        showCount
      />
    );
    expect(screen.getByText('0/100')).toBeInTheDocument();
  });

  it('closes Combobox via toggle button, Escape key, and on blur', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const options = [
      { value: 'colombo', label: 'Colombo 03' },
      { value: 'kandy', label: 'Kandy Central' },
    ];

    render(
      <div>
        <Combobox
          label="Select Area"
          options={options}
          value="colombo"
          onChange={onChange}
        />
        <button type="button">Outside element</button>
      </div>
    );

    const input = screen.getByRole('combobox', { name: 'Select Area' });
    const toggleBtn = screen.getByLabelText('Open options');

    // Open via toggle button
    await user.click(toggleBtn);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Close via toggle button click while open
    const closeBtn = screen.getByLabelText('Close options');
    await user.click(closeBtn);
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    // Reopen and close via Escape
    await user.click(screen.getByLabelText('Open options'));
    expect(input).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');

    // Reopen and close on blur (tabbing to outside element)
    await user.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('button', { name: 'Outside element' }));
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders accessible disabled option when no combobox matches found and prevents Escape from bubbling', async () => {
    const parentEscapeHandler = vi.fn();
    const user = userEvent.setup();
    const options = [{ value: 'colombo', label: 'Colombo 03' }];

    render(
      <div onKeyDown={(e) => e.key === 'Escape' && parentEscapeHandler()}>
        <Combobox
          label="Destination"
          options={options}
          value=""
          onChange={vi.fn()}
        />
      </div>
    );

    const input = screen.getByRole('combobox', { name: 'Destination' });
    await user.click(input);
    await user.type(input, 'Nonexistent city');

    const emptyOption = screen.getByRole('option', { name: 'No matches found' });
    expect(emptyOption).toBeInTheDocument();
    expect(emptyOption).toHaveAttribute('aria-disabled', 'true');

    // Press Escape to close combobox popup
    await user.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    // Parent dialog/container should NOT have received the Escape event
    expect(parentEscapeHandler).not.toHaveBeenCalled();
  });
});
