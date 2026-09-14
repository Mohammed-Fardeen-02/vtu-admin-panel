import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface CustomDropdownOption {
  value: string | number;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface CustomDropdownProps {
  label?: string;
  options: CustomDropdownOption[];
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchable = false,
  disabled = false,
  className = '',
  error,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const filteredOptions = searchable && searchTerm.trim()
    ? options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (opt.sublabel && opt.sublabel.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : options;

  const handleSelect = (optValue: string | number) => {
    onChange(optValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const sizeClasses =
    size === 'sm'
      ? 'h-8 px-2.5 text-xs'
      : size === 'lg'
      ? 'h-11 px-4 text-sm'
      : 'h-10 px-3 text-xs';

  return (
    <div className={`relative w-full space-y-1 ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-xl border bg-card text-foreground font-semibold transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${sizeClasses} ${
          isOpen ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-border hover:border-accent'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
          error ? 'border-destructive ring-destructive/20' : ''
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {selectedOption?.icon}
          <span className={`truncate ${!selectedOption ? 'text-muted-foreground font-normal' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-purple-500/10 text-purple-500 border border-purple-500/20">
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-purple-500' : ''
          }`}
        />
      </button>

      {error && <p className="text-[11px] font-bold text-destructive mt-1">{error}</p>}

      {/* Floating Options Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-border bg-card shadow-2xl p-1 animate-in fade-in duration-150 divide-y divide-border/40">
          {searchable && (
            <div className="p-1.5 sticky top-0 bg-card z-10 pb-2">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-lg bg-accent/20 border border-border text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          <div className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                No matching options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon}
                      <div className="truncate">
                        <div className="truncate">{opt.label}</div>
                        {opt.sublabel && (
                          <div className="text-[10px] text-muted-foreground font-normal truncate">
                            {opt.sublabel}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      {opt.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-accent text-muted-foreground">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className="h-4 w-4 text-purple-500" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
