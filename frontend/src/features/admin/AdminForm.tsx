import { useEffect, useRef, useState } from 'react';
import type { z } from 'zod';
import { TextField } from '../../shared/components/ui/Fields';
import { Button } from '../../shared/components/ui/Button';
import type { AdminAdapter } from './api/mock';
import type { AdminCommand } from './model';
import { useAdminCommand } from './query';

export function AdminForm({ adapter, schema, initial = '', inputLabel, label, command, onSaved }: {
  adapter: AdminAdapter; schema: z.ZodString; initial?: string; inputLabel: string; label: string;
  command: (value: string) => AdminCommand; onSaved?: () => void;
}) {
  const input = useRef<HTMLInputElement>(null); const submit = useRef<HTMLButtonElement>(null);
  const submitting = useRef(false); const [error, setError] = useState('');
  const mutation = useAdminCommand(adapter);
  useEffect(() => {
    if (!mutation.isPending && (mutation.isError || mutation.isSuccess) && document.activeElement === document.body) submit.current?.focus();
  }, [mutation.isPending, mutation.isError, mutation.isSuccess]);
  return <form className="admin-form" aria-label={label} noValidate onSubmit={(event) => {
    event.preventDefault(); if (submitting.current) return;
    const value = schema.safeParse(input.current?.value ?? '');
    if (!value.success) { setError(value.error.issues[0]?.message ?? 'Check the sample text.'); input.current?.focus(); return; }
    setError(''); submitting.current = true;
    if (input.current) input.current.value = value.data;
    mutation.mutate(command(value.data), { onSuccess: onSaved, onSettled: () => { submitting.current = false; } });
  }}>
    <TextField ref={input} label={inputLabel} defaultValue={initial} required error={error} disabled={mutation.isPending}
      onChange={() => { if (mutation.isSuccess) mutation.reset(); }} />
    {mutation.isPending && <p role="status">Saving sample changes.</p>}
    {mutation.isError && <p role="alert">Sample changes could not be saved. Your text has been kept. Review the latest data and try again.</p>}
    {mutation.isSuccess && <p role="status">Sample changes saved for this session only.</p>}
    <Button ref={submit} type="submit" busy={mutation.isPending}>{label}</Button>
  </form>;
}
