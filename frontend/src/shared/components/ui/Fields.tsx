import { useId, type ComponentProps, type ReactNode } from 'react';

type FieldDetails = { label: string; hint?: string; error?: string };

export function TextField({ label, hint, error, id: suppliedId, className = '', ...props }: FieldDetails & ComponentProps<'input'>) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const describedBy = [props['aria-describedby'], hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return <div className={`field ${className}`.trim()}>
    <label htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label>
    {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
    <input {...props} id={id} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy} />
    {error && <p className="field__error" id={`${id}-error`}>{error}</p>}
  </div>;
}

export function SelectField({ label, hint, error, id: suppliedId, className = '', children, ...props }: FieldDetails & ComponentProps<'select'> & { children: ReactNode }) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const describedBy = [props['aria-describedby'], hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return <div className={`field ${className}`.trim()}>
    <label htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label>
    {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
    <select {...props} id={id} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy}>{children}</select>
    {error && <p className="field__error" id={`${id}-error`}>{error}</p>}
  </div>;
}
