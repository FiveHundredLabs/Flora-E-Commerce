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

export function TextareaField({ label, hint, error, id: suppliedId, className = '', ...props }: FieldDetails & ComponentProps<'textarea'>) {
  const generatedId = useId(); const id = suppliedId ?? generatedId;
  const describedBy = [props['aria-describedby'], hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return <div className={`field ${className}`.trim()}><label htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label>{hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}<textarea {...props} id={id} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy} />{error && <p className="field__error" id={`${id}-error`}>{error}</p>}</div>;
}

export function ChoiceField({ label, hint, error, id: suppliedId, type = 'checkbox', ...props }: FieldDetails & Omit<ComponentProps<'input'>, 'type'> & { type?: 'checkbox' | 'radio' }) {
  const generatedId = useId(); const id = suppliedId ?? generatedId;
  const describedBy = [props['aria-describedby'], hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return <div className="choice-field"><label htmlFor={id}><input {...props} type={type} id={id} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy} /><span>{label}</span></label>{hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}{error && <p className="field__error" id={`${id}-error`}>{error}</p>}</div>;
}

export function Combobox({ options, ...props }: FieldDetails & Omit<ComponentProps<'input'>, 'list' | 'type'> & { options: readonly string[] }) {
  const listId = useId(); return <><TextField {...props} type="text" list={listId} /><datalist id={listId}>{options.map(option => <option key={option} value={option} />)}</datalist></>;
}
