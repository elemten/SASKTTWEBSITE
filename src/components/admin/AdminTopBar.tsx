import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/auth";

export const AdminTopBar = () => {
  const [user, setUser] = useState<any>(null);
  const [notifications] = useState([
    { id: 1, type: "warning", message: "5 memberships expiring this week" },
    { id: 2, type: "info", message: "New club registration pending" },
    { id: 3, type: "error", message: "3 overdue invoices" },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    setUser({
      name: 'Admin User',
      email: 'info@ttsask.ca'
    });
  }, []);

  const handleSignOut = () => {
    auth.signOut();
    navigate('/sign-in');
  };

  return (
    <header className="px-4 py-2 border-b border-gray-100 bg-white/50 backdrop-blur-md">
      <div className="flex items-center justify-end gap-3">

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative group hover:bg-emerald-50 rounded-full transition-all">
              <Bell className="h-5 w-5 text-gray-500 group-hover:text-emerald-600" />
              {notifications.length > 0 && (
                <Badge
                  className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full p-0 bg-emerald-500 border-2 border-white pointer-events-none"
                />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl shadow-xl border-gray-100 p-2">
            <DropdownMenuLabel className="px-3 py-2 text-xs font-black text-gray-400 uppercase tracking-widest">Recent Activity</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-50" />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 rounded-xl focus:bg-emerald-50 cursor-pointer">
                <div className="flex items-center gap-2 w-full">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    notification.type === "warning" && "bg-yellow-400",
                    notification.type === "info" && "bg-emerald-500",
                    notification.type === "error" && "bg-red-500"
                  )} />
                  <span className="text-sm font-medium text-gray-700">{notification.message}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 p-0 rounded-full hover:bg-emerald-50 overflow-hidden border border-gray-100 transition-all active:scale-95">
              <div className="w-full h-full bg-emerald-100 flex items-center justify-center p-1.5">
                <img
                  src="/logo.png"
                  alt="Avatar"
                  className="w-full h-full object-contain"
                />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-gray-100 p-2">
            <div className="px-3 py-3">
              <p className="text-sm font-black text-gray-900">{user?.name || 'Admin'}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{user?.email || 'admin@tts.ca'}</p>
            </div>
            <DropdownMenuSeparator className="bg-gray-50" />
            <DropdownMenuItem className="p-3 rounded-xl focus:bg-gray-50 cursor-pointer">
              <User className="mr-3 h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 rounded-xl focus:bg-gray-50 cursor-pointer">
              <Settings className="mr-3 h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">Preferences</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-50" />
            <DropdownMenuItem
              className="p-3 rounded-xl focus:bg-red-50 text-red-600 cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="text-sm font-black italic uppercase">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}