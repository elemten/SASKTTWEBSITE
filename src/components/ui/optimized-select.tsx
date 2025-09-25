import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface OptimizedSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
  disabled?: boolean;
  maxHeight?: string;
}

export function OptimizedSelect({
  value,
  onValueChange,
  placeholder,
  options,
  className,
  disabled = false,
  maxHeight = "max-h-60"
}: OptimizedSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent 
        position="popper" 
        className={cn(
          "min-w-[var(--radix-select-trigger-width)] z-50",
          maxHeight,
          // Better mobile positioning
          "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          // Prevent content from going off-screen
          "data-[align=start]:left-0 data-[align=end]:right-0"
        )}
        sideOffset={4}
      >
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="cursor-pointer"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
