import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { AsyncRegion } from './AsyncRegion';

describe('foundation async states', () => {
  it('announces pending work, then replaces it with an empty state', () => {
    const { rerender } = render(<AsyncRegion title="Content" state={{ status: 'loading' }} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    rerender(<AsyncRegion title="Content" state={{ status: 'empty', message: 'Nothing available yet.' }} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Content' })).toHaveTextContent('Nothing available yet.');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('keeps repeated regions uniquely labeled', () => {
    render(<><AsyncRegion title="First" state={{ status: 'loading' }} /><AsyncRegion title="Second" state={{ status: 'loading' }} /></>);
    expect(screen.getByRole('region', { name: 'First' }).getAttribute('aria-labelledby'))
      .not.toBe(screen.getByRole('region', { name: 'Second' }).getAttribute('aria-labelledby'));
  });

  it('shows forbidden content without exposing children or a retry action', () => {
    const { rerender } = render(<AsyncRegion title="Content" state={{ status: 'ready', children: <p>Restricted sample</p> }} />);
    rerender(<AsyncRegion title="Content" state={{ status: 'forbidden' }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('permission');
    expect(screen.queryByText('Restricted sample')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('supports errors without an available retry operation', () => {
    render(<AsyncRegion title="Content" state={{ status: 'error' }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Please try again');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('preserves React escaping in empty-state messages', () => {
    const { container } = render(<AsyncRegion title="Content" state={{ status: 'empty', message: '<script>private()</script>' }} />);
    expect(screen.getByText('<script>private()</script>')).toBeVisible();
    expect(container.querySelector('script')).toBeNull();
  });

  it('does not steal focus if the user moves away while retrying', async () => {
    const user = userEvent.setup();
    const retry = vi.fn();
    const { rerender } = render(<><AsyncRegion title="Content" state={{ status: 'error', onRetry: retry }} /><button>Other action</button></>);
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(retry).toHaveBeenCalledOnce();
    rerender(<><AsyncRegion title="Content" state={{ status: 'loading' }} /><button>Other action</button></>);
    await user.click(screen.getByRole('button', { name: 'Other action' }));
    rerender(<><AsyncRegion title="Content" state={{ status: 'empty', message: 'Nothing available yet.' }} /><button>Other action</button></>);
    expect(screen.getByRole('button', { name: 'Other action' })).toHaveFocus();
  });

  it.each(['empty', 'ready'] as const)('recovers a failed query to %s using the keyboard', async (result) => {
    // Local test fixture only: no marketplace DTO or backend operation is proposed.
    let resolve: ((items: string[]) => void) | undefined;
    const load = vi.fn<() => Promise<string[]>>()
      .mockRejectedValueOnce(new Error('private internal response'))
      .mockImplementationOnce(() => new Promise((done) => { resolve = done; }));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    function Fixture() {
      const query = useQuery({ queryKey: ['MOCK-foundation-content'], queryFn: load });
      return <AsyncRegion title="Content" state={query.isPending || query.isFetching
        ? { status: 'loading' }
        : query.isError ? { status: 'error', onRetry: () => { void query.refetch(); } }
        : query.data.length === 0 ? { status: 'empty', message: 'Nothing available yet.' }
        : { status: 'ready', children: <p>{query.data.join(', ')}</p> }} />;
    }
    const user = userEvent.setup();
    const { unmount } = render(<QueryClientProvider client={client}><Fixture /></QueryClientProvider>);
    try {
      await screen.findByRole('alert');
      expect(screen.queryByText('private internal response')).not.toBeInTheDocument();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Try again' })).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(await screen.findByRole('status')).toHaveTextContent('Loading');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      await act(async () => { resolve?.(result === 'empty' ? [] : ['Sample content']); });
      await screen.findByText(result === 'empty' ? 'Nothing available yet.' : 'Sample content');
      expect(screen.getByRole('heading', { name: 'Content' })).toHaveFocus();
      expect(load).toHaveBeenCalledTimes(2);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    } finally {
      unmount();
      client.clear();
    }
  });
});
