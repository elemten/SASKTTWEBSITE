import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NativeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
  disabled?: boolean;
}

export function NativeSelect({
  value,
  onValueChange,
  placeholder,
  options,
  className,
  disabled = false
}: NativeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find selected option
  const selectedOption = options.find(option => option.value === value);

  // Calculate dropdown position
  const updateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      const position = {
        top: rect.bottom + scrollY + 4, // 4px gap
        left: rect.left + scrollX,
        width: rect.width
      };
      
      console.log('Dropdown position calculated:', position, 'for rect:', rect);
      setDropdownPosition(position);
    }
  };

  // Close dropdown when clicking outside and handle scroll/resize
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Don't close if clicking inside the dropdown portal
        if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
          return;
        }
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : options.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0) {
            onValueChange(options[highlightedIndex].value);
            setIsOpen(false);
            setHighlightedIndex(-1);
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, highlightedIndex, options, onValueChange]);

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) {
        // Ensure position is calculated before opening
        setTimeout(() => {
          updateDropdownPosition();
        }, 0);
      }
      setIsOpen(!isOpen);
      setHighlightedIndex(-1);
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
          "transition-all duration-200 hover:border-green-400",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isOpen && "ring-2 ring-green-500 ring-offset-2"
        )}
      >
        <span className={cn(
          "truncate",
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

      {/* Dropdown Portal */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className={cn(
            "fixed overflow-auto rounded-lg border bg-white shadow-xl",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}
          style={{
            top: dropdownPosition.top || 100,
            left: dropdownPosition.left || 100, 
            width: dropdownPosition.width || 200,
            maxHeight: 'min(384px, calc(100vh - ' + (dropdownPosition.top || 100) + 'px - 20px))',
            zIndex: 99999,
            // Debug: make it visible with background
            backgroundColor: 'white',
            border: '2px solid #10b981'
          }}
        >
          <div className="p-1">
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none",
                  "transition-colors hover:bg-green-50 focus:bg-green-50 focus:text-green-900",
                  highlightedIndex === index && "bg-green-50 text-green-900",
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
        </div>,
        document.body
      )}
    </div>
  );
}
