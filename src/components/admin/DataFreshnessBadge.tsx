import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Wifi, WifiOff, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DataFreshnessBadgeProps {
  lastUpdated?: Date;
  isOnline?: boolean;
  onRefresh?: () => void;
}

export function DataFreshnessBadge({
  lastUpdated = new Date(Date.now() - 2 * 60 * 1000), // Default to 2 minutes ago
  isOnline = true,
  onRefresh
}: DataFreshnessBadgeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getTimeDifference = (timestamp: Date) => {
    const now = currentTime;
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getFreshnessColor = (timestamp: Date) => {
    const diffInMinutes = Math.floor((currentTime.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 5) return "bg-green-100 text-green-800 border-green-200";
    if (diffInMinutes < 15) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const handleRefresh = async () => {
    if (!onRefresh) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 mb-6"
    >
      {/* Data Freshness Badge */}
      <Badge
        variant="outline"
        className={`${getFreshnessColor(lastUpdated)} px-3 py-1 text-xs font-medium`}
      >
        <Clock className="h-3 w-3 mr-1" />
        Updated {getTimeDifference(lastUpdated)}
      </Badge>

      {/* Environment Badge */}
      <Badge
        variant="outline"
        className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 text-xs font-medium"
      >
        <Wifi className={`h-3 w-3 mr-1 ${isOnline ? 'text-green-600' : 'text-red-600'}`} />
        Production
      </Badge>

      {/* Refresh Button */}
      {onRefresh && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-7 px-2 text-xs hover:bg-muted"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="ml-1 hidden sm:inline">Refresh</span>
        </Button>
      )}

      {/* Connection Status */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {isOnline ? (
          <>
            <Wifi className="h-3 w-3 text-green-600" />
            <span className="hidden sm:inline">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3 text-red-600" />
            <span className="hidden sm:inline">Offline</span>
          </>
        )}
      </div>
    </motion.div>
  );
}
