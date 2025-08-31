import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Bell, Home, Users, Trophy, FileText, Calendar, DollarSign, Settings, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { ADMIN_NAV } from "@/lib/admin-nav";

interface MobileAdminModeProps {
  children: React.ReactNode;
}

export function MobileAdminMode({ children }: MobileAdminModeProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentSection = () => {
    const path = location.pathname;
    for (const item of ADMIN_NAV) {
      if (path.startsWith(item.href)) return item.label;
    }
    return "Dashboard";
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center">
                    <img
                      src="/logo.png"
                      alt="Table Tennis Saskatchewan logo"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">Admin Panel</h2>
                    <p className="text-xs text-muted-foreground">TTS Sask</p>
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* Navigation Menu */}
              <nav className="flex-1 overflow-y-auto">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Navigation
                  </div>
                  <div className="space-y-1">
                    {ADMIN_NAV.map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className="w-full justify-start h-12 px-3"
                        onClick={() => handleNavigation(item.href)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    ))}
                  </div>
                </div>
              </nav>

              {/* User Section */}
              <div className="border-t p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">AD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Admin User</p>
                    <p className="text-xs text-muted-foreground truncate">admin@tts.ca</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/auth/sign-out')}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Current Section Title */}
          <div className="flex-1">
            <h1 className="text-lg font-semibold truncate">{getCurrentSection()}</h1>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="absolute left-16 right-16"
                >
                  <Input
                    placeholder="Search..."
                    className="w-full h-8 text-sm"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                </motion.div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </AnimatePresence>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>

            {/* Quick Actions Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Quick Actions</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-3">
                  <Button
                    className="w-full justify-start h-12"
                    onClick={() => navigate('/admin/members/new')}
                  >
                    <Users className="h-4 w-4 mr-3" />
                    Add Member
                  </Button>
                  <Button
                    className="w-full justify-start h-12"
                    onClick={() => navigate('/admin/tournaments/new')}
                  >
                    <Trophy className="h-4 w-4 mr-3" />
                    Create Tournament
                  </Button>
                  <Button
                    className="w-full justify-start h-12"
                    onClick={() => navigate('/admin/clubs/new')}
                  >
                    <Home className="h-4 w-4 mr-3" />
                    Register Club
                  </Button>
                  <Button
                    className="w-full justify-start h-12"
                    variant="outline"
                    onClick={() => navigate('/admin/reports/monthly')}
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    Monthly Report
                  </Button>
                  <Button
                    className="w-full justify-start h-12"
                    variant="outline"
                    onClick={() => navigate('/admin/reports')}
                  >
                    <DollarSign className="h-4 w-4 mr-3" />
                    Export Data
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden">
        <div className="grid grid-cols-5 h-16">
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none"
            onClick={() => navigate('/admin')}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none"
            onClick={() => navigate('/admin/members')}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs">Members</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none"
            onClick={() => navigate('/admin/tournaments')}
          >
            <Trophy className="h-5 w-5" />
            <span className="text-xs">Tournaments</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none"
            onClick={() => navigate('/admin/reports')}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs">Reports</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-full rounded-none"
            onClick={() => navigate('/admin')}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">More</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}

// Hook to detect mobile devices
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}
