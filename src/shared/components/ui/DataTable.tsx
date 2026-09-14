import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  searchPlaceholder?: string;
  searchField?: (row: T) => string;
  statusField?: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
  pageSize?: number;
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  searchPlaceholder = 'Search records...',
  searchField,
  statusField,
  onRowClick,
  loading = false,
  emptyTitle = 'No Records Found',
  emptySubtitle = 'There are no active records matching your criteria.',
  pageSize = 5,
  actions,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Status Filter options
  const statusOptions = useMemo(() => {
    if (!statusField) return [];
    const statuses = new Set<string>();
    data.forEach((row) => {
      const s = statusField(row);
      if (s) statuses.add(s);
    });
    return Array.from(statuses);
  }, [data, statusField]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Search
      let matchesSearch = true;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        if (searchField) {
          matchesSearch = searchField(row).toLowerCase().includes(query);
        } else {
          matchesSearch = JSON.stringify(row).toLowerCase().includes(query);
        }
      }

      // Status
      let matchesStatus = true;
      if (statusField && selectedStatus !== 'ALL') {
        matchesStatus = statusField(row) === selectedStatus;
      }

      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, selectedStatus, searchField, statusField]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Selection logic
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const ids = new Set(paginatedData.map(keyExtractor));
      setSelectedIds(ids);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  const isAllSelected =
    paginatedData.length > 0 && paginatedData.every((r) => selectedIds.has(keyExtractor(r)));

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
      {/* Top Filter Bar */}
      <div className="p-4 border-b border-border bg-accent/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        {statusOptions.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold cursor-pointer"
            >
              <option value="ALL">All Statuses ({data.length})</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-table-header-bg text-table-header-text border-b border-table-header-border">
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded accent-primary cursor-pointer h-3.5 w-3.5"
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-3.5 font-extrabold uppercase tracking-wider text-[11px] ${
                    col.align === 'center'
                      ? 'text-center'
                      : col.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                  }`}
                >
                  {col.header}
                </th>
              ))}
              {actions && <th className="p-3.5 text-right font-extrabold">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              Array.from({ length: pageSize }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="p-3.5">
                    <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="p-3.5">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                    </td>
                  ))}
                  {actions && (
                    <td className="p-3.5">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-8 ml-auto" />
                    </td>
                  )}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 2 : 1)}
                  className="p-8 text-center"
                >
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <h4 className="text-sm font-extrabold text-foreground">{emptyTitle}</h4>
                    <p className="text-xs text-muted-foreground">{emptySubtitle}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const id = keyExtractor(row);
                const isSelected = selectedIds.has(id);

                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors ${
                      isSelected ? 'bg-primary/5' : 'hover:bg-accent/40'
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    <td
                      className="p-3.5 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(id, e.target.checked)}
                        className="rounded accent-primary cursor-pointer h-3.5 w-3.5"
                      />
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`p-3.5 text-foreground font-medium ${
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                            ? 'text-right'
                            : 'text-left'
                        }`}
                      >
                        {col.render ? col.render(row) : (row as any)[col.key]}
                      </td>
                    ))}
                    {actions && (
                      <td
                        className="p-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {actions(row)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="p-3.5 border-t border-border bg-accent/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground font-medium">
          Showing <span className="font-bold text-foreground">{filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
          <span className="font-bold text-foreground">{Math.min(currentPage * pageSize, filteredData.length)}</span> of{' '}
          <span className="font-bold text-foreground">{filteredData.length}</span> records
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            icon={<ChevronLeft className="h-3.5 w-3.5" />}
          >
            Prev
          </Button>
          <span className="px-3 text-xs font-extrabold text-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages || loading}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            icon={<ChevronRight className="h-3.5 w-3.5" />}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
