import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-muted border-t-primary",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}

export function PageLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}
