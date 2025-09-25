import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimpleSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
  disabled?: boolean;
}

export function SimpleSelect({
  value,
  onValueChange,
  placeholder,
  options,
  className,
  disabled = false
}: SimpleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Find selected option
  const selectedOption = options.find(option => option.value === value);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-select-container]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} data-select-container>
      {/* Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
          "transition-all duration-200 hover:border-green-400",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isOpen && "ring-2 ring-green-500 ring-offset-2"
        )}
      >
        <span className={cn(
          "truncate text-left",
          !selectedOption && "text-muted-foreground"
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={cn(
            "h-4 w-4 opacity-50 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown - Simple absolute positioning */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <div
            className={cn(
              "max-h-60 overflow-auto rounded-lg border bg-white shadow-lg",
              "animate-in fade-in-0 zoom-in-95 duration-200"
            )}
          >
            <div className="p-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option.value)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none",
                    "transition-colors hover:bg-green-50 focus:bg-green-50 focus:text-green-900",
                    value === option.value && "bg-green-100 text-green-900 font-medium"
                  )}
                >
                  {value === option.value && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </span>
                  )}
                  <span className="truncate">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
