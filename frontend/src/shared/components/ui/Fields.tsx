import {
  useId,
  useState,
  useRef,
  useEffect,
  type ComponentProps,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { Search, X, Check, ChevronDown } from 'lucide-react';

export type FieldDetails = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
};

export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <p className="field__error" id={id} role="alert">
      {children}
    </p>
  );
}

export function FormField({
  label,
  hint,
  error,
  id,
  required,
  className = '',
  children,
}: FieldDetails & { id: string; className?: string; children: ReactNode }) {
  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={id}>
        {label}
        {required && <span className="field__required" aria-hidden="true"> *</span>}
      </label>
      {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {children}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

export function TextField({
  label,
  hint,
  error,
  id: suppliedId,
  className = '',
  prefixIcon,
  suffixIcon,
  required = false,
  ...props
}: FieldDetails &
  ComponentProps<'input'> & {
    prefixIcon?: ReactNode;
    suffixIcon?: ReactNode;
  }) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const isRequired = required;
  const describedBy =
    [props['aria-describedby'], hint && `${id}-hint`, error && `${id}-error`]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={id}>
        {label}
        {isRequired && <span className="field__required" aria-hidden="true"> *</span>}
      </label>
      {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      <div className={`field__control-wrapper ${prefixIcon ? 'has-prefix' : ''} ${suffixIcon ? 'has-suffix' : ''}`.trim()}>
        {prefixIcon && <span className="field__affix field__affix--prefix" aria-hidden="true">{prefixIcon}</span>}
        <input
          {...props}
          id={id}
          required={isRequired}
          aria-invalid={error ? true : props['aria-invalid']}
          aria-describedby={describedBy}
        />
        {suffixIcon && <span className="field__affix field__affix--suffix" aria-hidden="true">{suffixIcon}</span>}
      </div>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

export function TextareaField({
  label,
  hint,
  error,
  id: suppliedId,
  className = '',
  required = false,
  maxLength,
  showCount,
  value,
  defaultValue,
  rows = 4,
  onChange,
  ...props
}: FieldDetails &
  ComponentProps<'textarea'> & {
    showCount?: boolean;
  }) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const isRequired = required;
  const describedBy =
    [props['aria-describedby'], hint && `${id}-hint`, error && `${id}-error`]
      .filter(Boolean)
      .join(' ') || undefined;

  const [uncontrolledCount, setUncontrolledCount] = useState(() => {
    if (typeof defaultValue === 'string') return defaultValue.length;
    return 0;
  });

  const charCount = typeof value === 'string' ? value.length : uncontrolledCount;

  return (
    <div className={`field ${className}`.trim()}>
      <div className="field__label-row">
        <label htmlFor={id}>
          {label}
          {isRequired && <span className="field__required" aria-hidden="true"> *</span>}
        </label>
        {showCount && maxLength && (
          <span className="field__char-count" aria-live="polite">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      <textarea
        {...props}
        id={id}
        rows={rows}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        required={isRequired}
        aria-invalid={error ? true : props['aria-invalid']}
        aria-describedby={describedBy}
        onChange={(e) => {
          setUncontrolledCount(e.target.value.length);
          onChange?.(e);
        }}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

export function SelectField({
  label,
  hint,
  error,
  id: suppliedId,
  className = '',
  children,
  required = false,
  ...props
}: FieldDetails & ComponentProps<'select'> & { children: ReactNode }) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const isRequired = required;
  const describedBy =
    [props['aria-describedby'], hint && `${id}-hint`, error && `${id}-error`]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={id}>
        {label}
        {isRequired && <span className="field__required" aria-hidden="true"> *</span>}
      </label>
      {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      <div className="field__select-wrapper">
        <select
          {...props}
          id={id}
          required={isRequired}
          aria-invalid={error ? true : props['aria-invalid']}
          aria-describedby={describedBy}
        >
          {children}
        </select>
        <span className="field__select-arrow" aria-hidden="true">
          <ChevronDown size={16} />
        </span>
      </div>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

export function SearchInput({
  label = 'Search',
  value,
  onChange,
  onClear,
  id: suppliedId,
  className = '',
  placeholder = 'Search...',
  ...props
}: Omit<ComponentProps<'input'>, 'type'> & {
  label?: string;
  onClear?: () => void;
}) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;

  return (
    <div className={`search-field ${className}`.trim()} role="search">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="search-field__inner">
        <Search className="search-field__icon" size={18} aria-hidden="true" />
        <input
          {...props}
          type="search"
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="search-field__input"
        />
        {value && onClear && (
          <button
            type="button"
            className="search-field__clear"
            onClick={onClear}
            aria-label="Clear search input"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

export function CheckboxField({
  label,
  hint,
  error,
  id: suppliedId,
  className = '',
  required = false,
  ...props
}: FieldDetails & ComponentProps<'input'>) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const isRequired = required;
  const describedBy =
    [props['aria-describedby'], hint && `${id}-hint`, error && `${id}-error`]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div className={`field-choice ${className}`.trim()}>
      <div className="field-choice__control">
        <input
          {...props}
          type="checkbox"
          id={id}
          required={isRequired}
          aria-invalid={error ? true : props['aria-invalid']}
          aria-describedby={describedBy}
          className="field-choice__input"
        />
        <label htmlFor={id} className="field-choice__label">
          {label}
          {isRequired && <span className="field__required" aria-hidden="true"> *</span>}
        </label>
      </div>
      {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

export type RadioOption = {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
};

export function RadioGroupField({
  legend,
  name,
  options,
  value,
  onChange,
  hint,
  error,
  required = false,
  orientation = 'vertical',
  className = '',
}: {
  legend: string;
  name: string;
  options: readonly RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  hint?: string;
  error?: string;
  required?: boolean;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}) {
  const groupId = useId();
  const describedBy =
    [hint && `${groupId}-hint`, error && `${groupId}-error`].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      className={`field-group ${orientation === 'horizontal' ? 'field-group--inline' : ''} ${className}`.trim()}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
    >
      <legend className="field-group__legend">
        {legend}
        {required && <span className="field__required" aria-hidden="true"> *</span>}
      </legend>
      {hint && <p className="field__hint" id={`${groupId}-hint`}>{hint}</p>}
      <div className="field-group__options">
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          return (
            <div key={option.value} className="field-choice">
              <div className="field-choice__control">
                <input
                  type="radio"
                  id={optionId}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  disabled={option.disabled}
                  required={required}
                  onChange={() => onChange?.(option.value)}
                  className="field-choice__input"
                />
                <label htmlFor={optionId} className="field-choice__label">
                  {option.label}
                </label>
              </div>
              {option.hint && <p className="field__hint">{option.hint}</p>}
            </div>
          );
        })}
      </div>
      {error && <FieldError id={`${groupId}-error`}>{error}</FieldError>}
    </fieldset>
  );
}

export function SwitchField({
  label,
  checked,
  onChange,
  disabled = false,
  hint,
  error,
  id: suppliedId,
  className = '',
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  hint?: string;
  error?: string;
  id?: string;
  className?: string;
}) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const describedBy =
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`field-switch ${className}`.trim()}>
      <div className="field-switch__row">
        <label htmlFor={id} className="field-switch__label">
          {label}
        </label>
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          aria-describedby={describedBy}
          onClick={() => onChange(!checked)}
          className={`switch-toggle ${checked ? 'is-checked' : ''}`.trim()}
        >
          <span className="switch-toggle__thumb" aria-hidden="true" />
        </button>
      </div>
      {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

export type ComboboxOption = {
  value: string;
  label: string;
  hint?: string;
};

export function Combobox({
  label,
  options,
  value,
  onChange,
  hint,
  error,
  placeholder = 'Select an option...',
  required = false,
  id: suppliedId,
  className = '',
}: {
  label: string;
  options: readonly ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
  className?: string;
}) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const listboxId = `${id}-listbox`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filtered = query
    ? options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && activeIndex >= 0 && listboxRef.current) {
      const activeOpt = listboxRef.current.querySelector<HTMLElement>(`#${id}-opt-${activeIndex}`);
      if (typeof activeOpt?.scrollIntoView === 'function') {
        activeOpt.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [open, activeIndex, id]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filtered.length === 0) return;
      if (!open) {
        setOpen(true);
        setActiveIndex(0);
      } else {
        setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filtered.length === 0) return;
      if (!open) {
        setOpen(true);
        setActiveIndex(filtered.length - 1);
      } else {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      }
    } else if (e.key === 'Enter') {
      if (open && activeIndex >= 0 && filtered[activeIndex]) {
        e.preventDefault();
        onChange(filtered[activeIndex].value);
        setOpen(false);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        setQuery('');
      }
    }
  };

  const describedBy =
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

  return (
    <div
      className={`field field-combobox ${className}`.trim()}
      ref={containerRef}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setOpen(false);
          setQuery('');
        }
      }}
    >
      <label htmlFor={id}>
        {label}
        {required && <span className="field__required" aria-hidden="true"> *</span>}
      </label>
      {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      <div className="field-combobox__control">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={
            open && activeIndex >= 0 && filtered[activeIndex]
              ? `${id}-opt-${activeIndex}`
              : undefined
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          value={open ? query : selectedOption ? selectedOption.label : ''}
          placeholder={open && selectedOption ? selectedOption.label : placeholder}
          autoComplete="off"
          onFocus={() => {
            setOpen(true);
            setQuery('');
            setActiveIndex(-1);
          }}
          onClick={() => {
            if (!open) {
              setOpen(true);
              setQuery('');
              setActiveIndex(-1);
            }
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          className="field-combobox__input"
        />
        <button
          type="button"
          tabIndex={-1}
          className="field-combobox__toggle"
          aria-label={open ? 'Close options' : 'Open options'}
          onClick={() => {
            if (open) {
              setOpen(false);
            } else {
              setOpen(true);
              setQuery('');
              inputRef.current?.focus();
            }
          }}
        >
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </div>

      {open && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="field-combobox__listbox"
        >
          {filtered.length === 0 ? (
            <li role="option" aria-disabled="true" className="field-combobox__empty">
              No matches found
            </li>
          ) : (
            filtered.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;
              return (
                <li
                  key={option.value}
                  id={`${id}-opt-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`field-combobox__option ${isActive ? 'is-active' : ''} ${isSelected ? 'is-selected' : ''}`.trim()}
                  onMouseDown={(e) => {
                    // Prevent input blur before selection completes
                    e.preventDefault();
                    onChange(option.value);
                    setOpen(false);
                    setQuery('');
                  }}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery('');
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <span className="field-combobox__option-label">{option.label}</span>
                  {option.hint && (
                    <span className="field-combobox__option-hint">{option.hint}</span>
                  )}
                  {isSelected && (
                    <Check size={14} className="field-combobox__check" aria-hidden="true" />
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}

      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}
