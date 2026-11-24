import { useEffect, useRef, useState } from 'react';
import type { z } from 'zod';
import { TextField } from '../../shared/components/ui/Fields';
import { Button } from '../../shared/components/ui/Button';
import { useSupplierCommand } from './query';
import type { SupplierCommand } from './model';
import type { SupplierAdapter } from './api/mock';

type Field<T> = { name: keyof T & string; label: string; value?: string | number; numeric?: boolean; hint?: string };
export function SampleForm<T extends Record<string, string | number>>({ schema, fields, command, label, adapter, onSaved, resetAfterSave = false }: {
  schema: z.ZodType<T>; fields: Field<T>[]; command: (data: T) => SupplierCommand; label: string;
  adapter?: SupplierAdapter; onSaved?: () => void; resetAfterSave?: boolean;
}) {
  const form = useRef<HTMLFormElement>(null);
  const submit = useRef<HTMLButtonElement>(null);
  const inFlight = useRef(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const mutation = useSupplierCommand(adapter);
  useEffect(() => {
    if (!mutation.isPending && (mutation.isError || mutation.isSuccess) && document.activeElement === document.body) submit.current?.focus();
  }, [mutation.isPending, mutation.isError, mutation.isSuccess]);
  return <form ref={form} className="supplier-form" noValidate aria-label={label} onChange={() => { if (mutation.isSuccess) mutation.reset(); }} onSubmit={(event) => {
    event.preventDefault();
    if (inFlight.current) return;
    const entries = new FormData(event.currentTarget);
    const values = Object.fromEntries(fields.map((field) => {
      const raw = String(entries.get(field.name) ?? '');
      return [field.name, field.numeric ? (raw.trim() ? Number(raw) : NaN) : raw];
    }));
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])));
      const first = fields.find((field) => parsed.error.issues.some((issue) => issue.path[0] === field.name));
      const control = first && form.current?.elements.namedItem(first.name);
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    setErrors({}); inFlight.current = true;
    mutation.mutate(command(parsed.data), { onSuccess: () => {
      if (resetAfterSave) form.current?.reset();
      onSaved?.();
    }, onSettled: () => { inFlight.current = false; } });
  }}>
    {fields.map((field) => <TextField key={field.name} name={field.name} label={field.label} hint={field.hint} defaultValue={field.value ?? ''}
      type={field.numeric ? 'number' : 'text'} min={field.numeric ? 0 : undefined} max={field.numeric ? 9999 : undefined} step={field.numeric ? 1 : undefined}
      required={field.name !== 'description'} error={errors[field.name]} disabled={mutation.isPending} />)}
    {mutation.isError && <p role="alert">Sample changes could not be saved. Your inputs have been kept. Review the latest data and try again.</p>}
    {mutation.isPending && <p role="status">Saving sample changes.</p>}
    {mutation.isSuccess && <p role="status">Sample changes saved for this session only.</p>}
    <Button ref={submit} type="submit" busy={mutation.isPending}>{label}</Button>
  </form>;
}
