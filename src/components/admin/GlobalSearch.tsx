import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Users, Trophy, Building2, FileText, Calendar, DollarSign, ArrowRight, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Mock data for search
const mockMembers = [
  { id: 1, name: "John Smith", email: "john@example.com", type: "member", club: "Saskatoon TTC" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", type: "member", club: "Regina Table Tennis" },
  { id: 3, name: "Mike Wilson", email: "mike@example.com", type: "member", club: "Moose Jaw TTC" },
];

const mockTournaments = [
  { id: 1, name: "Saskatchewan Open Championship 2024", type: "tournament", date: "2024-03-15", venue: "Saskatoon Sports Centre" },
  { id: 2, name: "Youth Provincial Qualifier", type: "tournament", date: "2024-02-10", venue: "Regina Table Tennis Club" },
];

const mockClubs = [
  { id: 1, name: "Saskatoon Table Tennis Club", type: "club", members: 45, status: "active" },
  { id: 2, name: "Regina Table Tennis Association", type: "club", members: 32, status: "active" },
  { id: 3, name: "Moose Jaw Community Table Tennis", type: "club", members: 28, status: "active" },
];

const mockInvoices = [
  { id: 1, name: "Tournament Entry - Saskatchewan Open", type: "invoice", amount: 50, status: "paid" },
  { id: 2, name: "Membership Renewal - John Smith", type: "invoice", amount: 450, status: "pending" },
];

const mockEvents = [
  { id: 1, name: "Monthly Training Session", type: "event", date: "2024-03-20", venue: "Saskatoon Sports Centre" },
  { id: 2, name: "Club Championship", type: "event", date: "2024-04-05", venue: "Regina Table Tennis Club" },
];

const allData = [...mockMembers, ...mockTournaments, ...mockClubs, ...mockInvoices, ...mockEvents];

const getIcon = (type: string) => {
  switch (type) {
    case "member": return Users;
    case "tournament": return Trophy;
    case "club": return Building2;
    case "invoice": return FileText;
    case "event": return Calendar;
    default: return Search;
  }
};

const getBadgeColor = (type: string) => {
  switch (type) {
    case "member": return "bg-blue-100 text-blue-800";
    case "tournament": return "bg-purple-100 text-purple-800";
    case "club": return "bg-green-100 text-green-800";
    case "invoice": return "bg-orange-100 text-orange-800";
    case "event": return "bg-indigo-100 text-indigo-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  // Filter results based on query
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    return allData.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      (item.email && item.email.toLowerCase().includes(query.toLowerCase())) ||
      (item.club && item.club.toLowerCase().includes(query.toLowerCase())) ||
      (item.venue && item.venue.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 8); // Limit to 8 results
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        handleResultClick(filteredResults[selectedIndex]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredResults, onClose]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  const handleResultClick = (item: any) => {
    // Navigate based on item type
    switch (item.type) {
      case "member":
        navigate(`/admin/members/${item.id}`);
        break;
      case "tournament":
        navigate(`/admin/tournaments/${item.id}`);
        break;
      case "club":
        navigate(`/admin/clubs/${item.id}`);
        break;
      case "invoice":
        navigate(`/admin/invoices/${item.id}`);
        break;
      case "event":
        navigate(`/admin/events/${item.id}`);
        break;
      default:
        break;
    }
    onClose();
  };

  const getResultSubtitle = (item: any) => {
    switch (item.type) {
      case "member":
        return `${item.email} • ${item.club}`;
      case "tournament":
        return `${item.date} • ${item.venue}`;
      case "club":
        return `${item.members} members • ${item.status}`;
      case "invoice":
        return `$${item.amount} • ${item.status}`;
      case "event":
        return `${item.date} • ${item.venue}`;
      default:
        return "";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20vh] left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-background rounded-xl shadow-2xl border border-border overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search members, tournaments, clubs, invoices..."
                  className="border-0 shadow-none text-lg placeholder:text-muted-foreground focus-visible:ring-0 p-0"
                  autoFocus
                />
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">K</kbd>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {query.trim() === "" ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Search Everything</h3>
                    <p className="text-sm">
                      Search across members, tournaments, clubs, invoices, and events
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {["members", "tournaments", "clubs", "invoices", "events"].map((type) => (
                        <Badge key={type} variant="outline" className="capitalize">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : filteredResults.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No results found</h3>
                    <p className="text-sm">
                      Try searching for members, tournaments, clubs, or invoices
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    {filteredResults.map((item, index) => {
                      const Icon = getIcon(item.type);
                      const isSelected = index === selectedIndex;

                      return (
                        <motion.div
                          key={`${item.type}-${item.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <button
                            onClick={() => handleResultClick(item)}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left ${
                              isSelected ? "bg-accent" : ""
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${getBadgeColor(item.type)}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-foreground truncate">
                                  {item.name}
                                </h4>
                                <Badge variant="outline" className={`text-xs capitalize ${getBadgeColor(item.type)}`}>
                                  {item.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {getResultSubtitle(item)}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for using global search
export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}
