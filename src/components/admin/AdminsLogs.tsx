import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Shield, Activity, User, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const mockAdmins = [
  {
    id: "A001",
    name: "John Admin",
    email: "john.admin@tts.ca",
    role: "Super Admin",
    lastLogin: "2024-12-01 14:30",
    status: "Active",
    createdDate: "2023-01-15"
  },
  {
    id: "A002",
    name: "Sarah Manager",
    email: "sarah.manager@tts.ca", 
    role: "Manager",
    lastLogin: "2024-12-01 09:15",
    status: "Active",
    createdDate: "2023-06-10"
  },
  {
    id: "A003",
    name: "Mike Support",
    email: "mike.support@tts.ca",
    role: "Support",
    lastLogin: "2024-11-28 16:45",
    status: "Inactive",
    createdDate: "2024-03-20"
  }
];

const mockLogs = [
  {
    id: "L001",
    timestamp: "2024-12-01 14:35:22",
    action: "Member Created",
    entity: "John Smith (M001)",
    admin: "John Admin",
    ipAddress: "192.168.1.100",
    details: "Created new member account"
  },
  {
    id: "L002", 
    timestamp: "2024-12-01 14:20:15",
    action: "Invoice Generated",
    entity: "INV-003",
    admin: "Sarah Manager",
    ipAddress: "192.168.1.105",
    details: "Generated membership invoice"
  },
  {
    id: "L003",
    timestamp: "2024-12-01 13:45:30",
    action: "Payment Processed",
    entity: "INV-002",
    admin: "John Admin", 
    ipAddress: "192.168.1.100",
    details: "Processed club registration payment"
  },
  {
    id: "L004",
    timestamp: "2024-12-01 12:30:18",
    action: "Club Updated",
    entity: "Regina Table Tennis Club (C001)",
    admin: "Sarah Manager",
    ipAddress: "192.168.1.105",
    details: "Updated club contact information"
  },
  {
    id: "L005",
    timestamp: "2024-12-01 11:15:45",
    action: "Event Created",
    entity: "Provincial Championship (E001)",
    admin: "John Admin",
    ipAddress: "192.168.1.100",
    details: "Created new tournament event"
  }
];

const actionTypes = ["Member Created", "Member Updated", "Invoice Generated", "Payment Processed", "Club Updated", "Event Created", "Admin Login"];

export const AdminsLogs = () => {
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [adminFilter, setAdminFilter] = useState("all");

  const filteredAdmins = mockAdmins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
                         admin.email.toLowerCase().includes(adminSearchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                         log.entity.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                         log.admin.toLowerCase().includes(logSearchQuery.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesAdmin = adminFilter === "all" || log.admin === adminFilter;
    
    return matchesSearch && matchesAction && matchesAdmin;
  });

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "super admin":
        return "bg-destructive text-destructive-foreground";
      case "manager":
        return "bg-primary text-primary-foreground";
      case "support":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-success text-success-foreground";
      case "inactive":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes("Created")) return "bg-success text-success-foreground";
    if (action.includes("Updated")) return "bg-primary text-primary-foreground";
    if (action.includes("Deleted")) return "bg-destructive text-destructive-foreground";
    if (action.includes("Payment")) return "bg-warning text-warning-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admins & Logs</h1>
          <p className="text-muted-foreground">Manage admin users and view system activity logs</p>
        </div>
      </div>

      <Tabs defaultValue="admins" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Admin Users
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="space-y-6">
          {/* Admin Management */}
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search admin users..."
                value={adminSearchQuery}
                onChange={(e) => setAdminSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="glass">
                <DialogHeader>
                  <DialogTitle>Add New Admin User</DialogTitle>
                  <DialogDescription>
                    Create a new admin account with appropriate permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Full Name" />
                  <Input placeholder="Email Address" type="email" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="super-admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Temporary Password" type="password" />
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">Create Admin</Button>
                    <Button variant="outline" className="flex-1">Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Admin Users ({filteredAdmins.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-accent/50 transition-colors">
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(admin.role)}>
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{admin.lastLogin}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(admin.status)}>
                          {admin.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{admin.createdDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Disable
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          {/* Activity Logs */}
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs by action, entity, or admin..."
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Action Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {actionTypes.map(action => (
                        <SelectItem key={action} value={action}>{action}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={adminFilter} onValueChange={setAdminFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Admin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Admins</SelectItem>
                      {mockAdmins.map(admin => (
                        <SelectItem key={admin.id} value={admin.name}>{admin.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Logs ({filteredLogs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-accent/50 transition-colors">
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {log.timestamp}
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.entity}</TableCell>
                      <TableCell>{log.admin}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {log.ipAddress}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};