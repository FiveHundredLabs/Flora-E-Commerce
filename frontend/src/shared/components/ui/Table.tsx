import { type ComponentProps, type ReactNode } from 'react';
import { Skeleton } from './Content';

export type TableDensity = 'normal' | 'compact';

export function Table({
  density = 'normal',
  className = '',
  children,
  caption,
  ...props
}: ComponentProps<'table'> & {
  density?: TableDensity;
  caption?: string;
}) {
  return (
    <div className="table-responsive-wrapper" tabIndex={0} role="region" aria-label={caption || 'Data table'}>
      <table
        {...props}
        className={`data-table data-table--${density} ${className}`.trim()}
      >
        {caption && <caption className="data-table__caption">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className = '', children, ...props }: ComponentProps<'thead'>) {
  return <thead {...props} className={`data-table__head ${className}`.trim()}>{children}</thead>;
}

export function TableBody({ className = '', children, ...props }: ComponentProps<'tbody'>) {
  return <tbody {...props} className={`data-table__body ${className}`.trim()}>{children}</tbody>;
}

export function TableRow({
  className = '',
  selected = false,
  children,
  ...props
}: ComponentProps<'tr'> & { selected?: boolean }) {
  return (
    <tr
      {...props}
      className={`data-table__row ${selected ? 'is-selected' : ''} ${className}`.trim()}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  className = '',
  align = 'left',
  children,
  ...props
}: ComponentProps<'th'> & { align?: 'left' | 'center' | 'right' }) {
  return (
    <th
      {...props}
      scope="col"
      className={`data-table__header-cell text-${align} ${className}`.trim()}
    >
      {children}
    </th>
  );
}

export function TableCell({
  className = '',
  align = 'left',
  children,
  ...props
}: ComponentProps<'td'> & { align?: 'left' | 'center' | 'right' }) {
  return (
    <td
      {...props}
      className={`data-table__cell text-${align} ${className}`.trim()}
    >
      {children}
    </td>
  );
}

export function TableEmptyRow({
  colSpan,
  message = 'No data available in this table.',
  className = '',
}: {
  colSpan: number;
  message?: ReactNode;
  className?: string;
}) {
  return (
    <tr className={`data-table__row data-table__row--empty ${className}`.trim()}>
      <td colSpan={colSpan} className="data-table__empty-cell">
        <div className="data-table__empty-state">{message}</div>
      </td>
    </tr>
  );
}

export function TableLoadingRow({
  colSpan,
  rows = 3,
}: {
  colSpan: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="data-table__row data-table__row--loading" aria-hidden="true">
          <td colSpan={colSpan} className="data-table__cell">
            <Skeleton height={20} label="Loading row data" />
          </td>
        </tr>
      ))}
    </>
  );
}
