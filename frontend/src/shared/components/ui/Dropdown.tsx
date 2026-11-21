import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { Button, type ButtonVariant, type ButtonSize } from './Button';

export type DropdownItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function Dropdown({
  label,
  items,
  variant = 'secondary',
  size = 'md',
  align = 'start',
  className = '',
}: {
  label: string;
  items: readonly DropdownItem[];
  variant?: ButtonVariant;
  size?: ButtonSize;
  align?: 'start' | 'end';
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && activeIndex >= 0 && menuRef.current) {
      const menuItems = menuRef.current.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
      menuItems[activeIndex]?.focus();
    }
  }, [open, activeIndex]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(0);
      } else {
        setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(items.length - 1);
      } else {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        setActiveIndex(-1);
        triggerRef.current?.focus();
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (open && activeIndex >= 0 && items[activeIndex] && !items[activeIndex].disabled) {
        e.preventDefault();
        items[activeIndex].onClick();
        setOpen(false);
        setActiveIndex(-1);
        triggerRef.current?.focus();
      }
    }
  };

  return (
    <div
      className={`dropdown ${className}`.trim()}
      ref={containerRef}
      onKeyDown={handleKeyDown}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setOpen(false);
          setActiveIndex(-1);
        }
      }}
    >
      <Button
        ref={triggerRef}
        variant={variant}
        size={size}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setOpen((prev) => !prev);
          setActiveIndex(-1);
        }}
        endIcon={<ChevronDown size={16} aria-hidden="true" />}
      >
        {label}
      </Button>

      {open && (
        <ul
          ref={menuRef}
          role="menu"
          aria-label={label}
          className={`dropdown__menu dropdown__menu--${align}`}
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={item.id} role="none">
                <button
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  disabled={item.disabled}
                  className={`dropdown__item ${isActive ? 'is-active' : ''} ${item.destructive ? 'is-destructive' : ''}`.trim()}
                  onClick={() => {
                    if (item.disabled) return;
                    item.onClick();
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {item.icon && <span className="dropdown__item-icon" aria-hidden="true">{item.icon}</span>}
                  <span className="dropdown__item-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
