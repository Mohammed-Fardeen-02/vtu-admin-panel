import React from 'react';

export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>> = ({
  className = '',
  ...props
}) => (
  <div className="w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
    <table className={`w-full border-collapse text-left text-xs align-middle ${className}`} {...props} />
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  ...props
}) => (
  <thead
    className={`bg-muted/40 border-b border-border text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground ${className}`}
    {...props}
  />
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  ...props
}) => <tbody className={`divide-y divide-border text-xs font-medium ${className}`} {...props} />;

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className = '',
  ...props
}) => (
  <tr
    className={`hover:bg-muted/20 transition-colors duration-150 ${className}`}
    {...props}
  />
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className = '',
  ...props
}) => (
  <th className={`px-6 py-3.5 font-extrabold text-foreground uppercase tracking-wider ${className}`} {...props} />
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className = '',
  ...props
}) => <td className={`px-6 py-4 whitespace-nowrap text-foreground ${className}`} {...props} />;
