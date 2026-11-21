import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Dialog, ConfirmDialog } from './Dialog';
import { Drawer } from './Drawer';
import { Dropdown } from './Dropdown';
import { Tabs } from './Tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmptyRow,
  TableLoadingRow,
} from './Table';

describe('Overlays, Menus & Table Primitives', () => {
  it('renders Dialog with default and custom actions', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Dialog open={true} title="Default Actions" description="Sample desc" onClose={onClose}>
        <p>Modal body</p>
      </Dialog>
    );

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();

    // Custom actions
    rerender(
      <Dialog
        open={true}
        title="Custom Actions"
        description="Sample desc"
        onClose={onClose}
        actions={<button type="button">Save Changes</button>}
      >
        <p>Modal body</p>
      </Dialog>
    );
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();

    // Suppressed actions (null)
    rerender(
      <Dialog
        open={true}
        title="No Actions"
        description="Sample desc"
        onClose={onClose}
        actions={null}
      >
        <p>Modal body</p>
      </Dialog>
    );
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save Changes' })).not.toBeInTheDocument();
  });

  it('confirms and cancels in ConfirmDialog', async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <ConfirmDialog
        open={true}
        title="Confirm deletion"
        description="Are you sure?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={onConfirm}
        onClose={onClose}
      />
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('open');
    expect(screen.getByText('Confirm deletion')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledOnce();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledOnce();

    rerender(
      <ConfirmDialog
        open={false}
        title="Confirm deletion"
        description="Are you sure?"
        onConfirm={onConfirm}
        onClose={onClose}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it('renders Drawer and handles close action, Escape dismiss and Tab focus trap', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Drawer
        open={true}
        onClose={onClose}
        title="Filter Stems"
        description="Pick categories"
        footer={<button type="button">Apply Filter</button>}
      >
        <button type="button">Category A</button>
      </Drawer>
    );

    const dialog = screen.getByRole('dialog', { name: 'Filter Stems' });
    expect(dialog).toBeInTheDocument();

    const closeBtn = screen.getByLabelText('Close panel');
    const applyBtn = screen.getByRole('button', { name: 'Apply Filter' });

    // Focus was placed on close button initially
    expect(closeBtn).toHaveFocus();

    // Tab to last element
    applyBtn.focus();
    expect(applyBtn).toHaveFocus();

    // Tab from last element wraps to first element
    await user.keyboard('{Tab}');
    expect(closeBtn).toHaveFocus();

    // Shift+Tab from first element wraps to last element
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(applyBtn).toHaveFocus();

    // Escape dismisses
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('locks body scroll while Drawer is open and restores upon close', () => {
    document.body.style.overflow = 'auto';
    const { unmount } = render(
      <Drawer open={true} onClose={vi.fn()} title="Test Drawer">
        <p>Drawer content</p>
      </Drawer>
    );

    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('navigates Dropdown items with keyboard and closes on blur', async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();
    const items = [
      { id: '1', label: 'Item 1', onClick: onAction },
      { id: '2', label: 'Item 2', onClick: vi.fn() },
    ];

    render(
      <div>
        <Dropdown label="Menu Options" items={items} />
        <button type="button">Outside element</button>
      </div>
    );
    const trigger = screen.getByRole('button', { name: 'Menu Options' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Arrow down moves focus to item 1
    await user.keyboard('{ArrowDown}');
    const item1 = screen.getByRole('menuitem', { name: 'Item 1' });
    expect(item1).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onAction).toHaveBeenCalledOnce();

    // Reopen and blur by clicking outside element
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('button', { name: 'Outside element' }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Escape closes dropdown and stops propagation to parent
    const parentEscape = vi.fn();
    const { unmount } = render(
      <div onKeyDown={(e) => e.key === 'Escape' && parentEscape()}>
        <Dropdown label="Menu Inside Dialog" items={items} />
      </div>
    );
    const trigger2 = screen.getByRole('button', { name: 'Menu Inside Dialog' });
    await user.click(trigger2);
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(trigger2).toHaveAttribute('aria-expanded', 'false');
    expect(parentEscape).not.toHaveBeenCalled();
    unmount();
  });

  it('switches Tabs and navigates with arrow keys, updating DOM focus', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const tabs = [
      { id: 'tab1', label: 'Overview', content: <p>Overview Panel</p> },
      { id: 'tab2', label: 'Products', content: <p>Products Panel</p> },
    ];

    render(<Tabs tabs={tabs} onChange={onChange} />);

    const tab1 = screen.getByRole('tab', { name: 'Overview' });
    const tab2 = screen.getByRole('tab', { name: 'Products' });

    expect(tab1).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview Panel');

    // Click second tab
    await user.click(tab2);
    expect(onChange).toHaveBeenCalledWith('tab2');
    expect(tab2).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Products Panel');

    // Arrow navigation moves active tab and DOM focus
    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenCalledWith('tab1');
    expect(tab1).toHaveAttribute('aria-selected', 'true');
  });

  it('renders Table with headers, empty state and loading skeletons', () => {
    render(
      <Table density="compact" caption="Florist Catalog">
        <TableHeader>
          <TableRow>
            <TableHead>Shop Name</TableHead>
            <TableHead align="right">Stems</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Meadow Bloom</TableCell>
            <TableCell align="right">25</TableCell>
          </TableRow>
          <TableEmptyRow colSpan={2} message="No additional florists." />
          <TableLoadingRow colSpan={2} rows={1} />
        </TableBody>
      </Table>
    );

    expect(screen.getByRole('table')).toHaveClass('data-table--compact');
    expect(screen.getByText('Shop Name')).toHaveAttribute('scope', 'col');
    expect(screen.getByText('Meadow Bloom')).toBeInTheDocument();
    expect(screen.getByText('No additional florists.')).toBeInTheDocument();
  });
});
