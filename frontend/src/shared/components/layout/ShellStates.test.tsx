import { useState } from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { expect, it, vi } from 'vitest';
import { z } from 'zod';
import { Shell } from './Shell';
import { AsyncRegion } from '../AsyncRegion';
import { TextField } from '../ui/Fields';
import { Button } from '../ui/Button';

// Test-only consumer: no marketplace DTO, persistence or production operation.
const sampleSchema = z.string().trim().min(1, 'Enter sample text.');

function SampleForm() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();
  const [saved, setSaved] = useState(false);
  return <form noValidate onSubmit={(event) => {
    event.preventDefault();
    const result = sampleSchema.safeParse(value);
    setError(result.success ? undefined : result.error.issues[0]?.message);
    setSaved(result.success);
    if (!result.success) event.currentTarget.querySelector('input')?.focus();
  }}>
    <TextField label="Sample text" hint="Local test fixture." error={error} required value={value} onChange={(event) => setValue(event.target.value)} />
    <Button type="submit">Save sample</Button>
    {saved && <p role="status">Sample accepted.</p>}
  </form>;
}

it.each(['customer', 'supplier', 'admin'] as const)('%s shell preserves loading, error, retry, empty and validated ready states', async (audience) => {
  let resolve: ((value: unknown) => void) | undefined;
  const load = vi.fn<() => Promise<unknown>>()
    .mockImplementationOnce(() => new Promise((done) => { resolve = done; }))
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce(['Sample']);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  function Consumer() {
    const query = useQuery({ queryKey: ['MOCK-shell-sample'], queryFn: async () => z.array(z.string()).parse(await load()) });
    return <AsyncRegion title="Sample content" state={query.isPending || query.isFetching ? { status: 'loading' }
      : query.isError ? { status: 'error', onRetry: () => { void query.refetch(); } }
      : query.data.length === 0 ? { status: 'empty', message: 'No sample content.' }
      : { status: 'ready', children: <SampleForm /> }} />;
  }
  const user = userEvent.setup();
  const { unmount } = render(<MemoryRouter><QueryClientProvider client={client}>
    <Shell audience={audience}><h1>Sample workspace</h1><Consumer /></Shell>
  </QueryClientProvider></MemoryRouter>);
  try {
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    // A malformed untrusted fixture must become a safe failure, not render its fields.
    await act(async () => { resolve?.({ internal: 'private response' }); });
    await screen.findByRole('alert');
    expect(screen.queryByText(/private response/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    await screen.findByText('No sample content.');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await act(async () => { await client.invalidateQueries({ queryKey: ['MOCK-shell-sample'] }); });
    await user.click(await screen.findByRole('button', { name: 'Save sample' }));
    const input = screen.getByRole('textbox', { name: 'Sample text' });
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Local test fixture. Enter sample text.');
    await user.type(input, 'Example');
    await user.click(screen.getByRole('button', { name: 'Save sample' }));
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(screen.getByRole('status')).toHaveTextContent('Sample accepted.');
    expect(load).toHaveBeenCalledTimes(3);
    expect(within(screen.getByRole('main')).getByRole('heading', { level: 1 })).toHaveTextContent('Sample workspace');
  } finally {
    unmount();
    client.clear();
  }
});
