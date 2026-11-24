import { useId, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, X } from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';

export interface ColumnDef<T> {
  id: string;
  header: string;
  cell: (record: T) => ReactNode;
  className?: string;
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  let tone: 'success' | 'warning' | 'danger' | 'neutral' = 'neutral';
  if (['approved', 'active', 'delivered', 'successful'].includes(normalized)) {
    tone = 'success';
  } else if (['pending', 'processing'].includes(normalized)) {
    tone = 'warning';
  } else if (['suspended', 'rejected', 'hidden', 'failed', 'cancelled'].includes(normalized)) {
    tone = 'danger';
  } else if (['flagged', 'shipped', 'archived'].includes(normalized)) {
    tone = 'neutral';
  }

  return (
    <span className={`badge badge--${tone} badge--status badge--status-${normalized}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export interface AdminTableProps<T extends { id: string; label: string }> {
  title: string;
  totalRecordsCount: number;
  filteredRecords: T[];
  columns: ColumnDef<T>[];
  statusFilterOptions?: { id: string; label: string; count: number }[];
  currentStatusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchPlaceholder?: string;
  recordHref: (record: T) => string;
  primaryAction?: ReactNode;
  rowActions?: (record: T) => ReactNode;
  emptyMessage?: string;
}

export function AdminTable<T extends { id: string; label: string }>({
  title,
  totalRecordsCount,
  filteredRecords,
  columns,
  statusFilterOptions,
  currentStatusFilter = 'all',
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  searchPlaceholder,
  recordHref,
  primaryAction,
  rowActions,
  emptyMessage,
}: AdminTableProps<T>) {
  const navigate = useNavigate();
  const searchInputId = useId();

  if (totalRecordsCount === 0) {
    return (
      <div className="admin-table-wrapper">
        {primaryAction && <div className="admin-table__top-bar">{primaryAction}</div>}
        <p>{emptyMessage ?? `No sample ${title.toLowerCase()} in this workspace.`}</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      {/* Top Controls Bar: Search, Status Filter Pills & Primary Action */}
      <div className="admin-table__controls">
        <div className="admin-table__search-wrap">
          <label htmlFor={searchInputId} className="sr-only">Search {title}</label>
          <Search size={16} className="admin-table__search-icon" aria-hidden="true" />
          <input
            id={searchInputId}
            type="search"
            className="admin-table__search-input"
            placeholder={searchPlaceholder ?? `Search ${title.toLowerCase()}...`}
            aria-label={`Search ${title}`}
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="admin-table__search-clear"
              aria-label="Clear search"
              onClick={() => onSearchQueryChange('')}
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        {primaryAction && <div className="admin-table__primary-action">{primaryAction}</div>}
      </div>

      {/* Status Filter Pill Tabs */}
      {statusFilterOptions && statusFilterOptions.length > 0 && onStatusFilterChange && (
        <div className="admin-table__filters" role="tablist" aria-label={`Filter ${title} by status`}>
          {statusFilterOptions.map((opt) => {
            const isSelected = currentStatusFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`admin-filter-pill ${isSelected ? 'is-active' : ''}`}
                onClick={() => onStatusFilterChange(opt.id)}
              >
                <span>{opt.label}</span>
                <span className="admin-filter-count">{opt.count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Table Data View */}
      {filteredRecords.length === 0 ? (
        <div className="admin-table__empty-state">
          <p>No {title.toLowerCase()} match your current search query or filter criteria.</p>
          <Button
            variant="secondary"
            onClick={() => {
              onSearchQueryChange('');
              if (onStatusFilterChange) onStatusFilterChange('all');
            }}
          >
            Clear Search & Filters
          </Button>
        </div>
      ) : (
        <div className="admin-table-scroll">
          <table className="admin-table" aria-label={`${title} data table`}>
            <thead>
              <tr>
                <th scope="col" className="col-primary">Record / Name</th>
                {columns.map((col) => (
                  <th key={col.id} scope="col" className={col.className}>
                    {col.header}
                  </th>
                ))}
                {rowActions && <th scope="col" className="col-actions">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="admin-table__row"
                  onClick={(e) => {
                    // Do not navigate if user clicked on button, link, or input inside row
                    const target = e.target as HTMLElement;
                    if (target.closest('button, a, input, select, textarea')) return;
                    void navigate(recordHref(record));
                  }}
                >
                  <td className="col-primary">
                    <Link to={recordHref(record)} className="admin-record-link">
                      {record.label}
                    </Link>
                    <span className="admin-record-id">ID: {record.id}</span>
                  </td>

                  {columns.map((col) => (
                    <td key={col.id} className={col.className}>
                      {col.cell(record)}
                    </td>
                  ))}

                  {rowActions && (
                    <td className="col-actions" onClick={(e) => e.stopPropagation()}>
                      <div className="admin-row-actions">
                        {rowActions(record)}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
