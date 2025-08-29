import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Receipt, Eye, FileText, Download } from "lucide-react";
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

// Mock data
const mockExpenses = [
  {
    id: "EXP-001",
    type: "Travel",
    linkedEntity: "John Smith",
    entityType: "Member",
    amount: 250.00,
    date: "2024-11-15",
    status: "Submitted",
    description: "Travel to Provincial Championship",
    receiptUrl: "/receipts/exp-001.pdf",
    submittedBy: "John Smith"
  },
  {
    id: "EXP-002",
    type: "Equipment",
    linkedEntity: "Regina Table Tennis Club",
    entityType: "Club",
    amount: 450.00,
    date: "2024-11-10",
    status: "Paid",
    description: "New table tennis tables",
    receiptUrl: "/receipts/exp-002.pdf",
    submittedBy: "Robert Wilson"
  },
  {
    id: "EXP-003",
    type: "Tournament",
    linkedEntity: "Sarah Johnson",
    entityType: "Member", 
    amount: 125.00,
    date: "2024-11-08",
    status: "Approved",
    description: "Tournament entry fees",
    receiptUrl: "/receipts/exp-003.pdf",
    submittedBy: "Sarah Johnson"
  }
];

const expenseTypes = ["Travel", "Equipment", "Tournament", "Training", "Miscellaneous"];
const expenseStatuses = ["Submitted", "Approved", "Paid", "Rejected"];

export const ExpensesReimbursements = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredExpenses = mockExpenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.linkedEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || expense.type === typeFilter;
    const matchesStatus = statusFilter === "all" || expense.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
        return "bg-warning text-warning-foreground";
      case "approved":
        return "bg-primary text-primary-foreground";
      case "paid":
        return "bg-success text-success-foreground";
      case "rejected":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getEntityTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "member":
        return "bg-primary text-primary-foreground";
      case "club":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const totalSubmitted = mockExpenses
    .filter(e => e.status === "Submitted")
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalPaid = mockExpenses
    .filter(e => e.status === "Paid")
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingCount = mockExpenses.filter(e => e.status === "Submitted").length;

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
          <h1 className="text-3xl font-bold text-foreground">Expenses & Reimbursements</h1>
          <p className="text-muted-foreground">Manage expense claims and reimbursements</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Submit a new expense for reimbursement.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Expense Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseTypes.map(type => (
                      <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="Amount" type="number" step="0.01" />
              </div>
              
              <Input placeholder="Description" />
              
              <div className="grid grid-cols-2 gap-4">
                <Input type="date" placeholder="Expense Date" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Entity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="club">Club</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Input placeholder="Member/Club Name" />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Receipt Upload</label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Submit Expense</Button>
                <Button variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass hover:shadow-medium transition-all duration-300 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Expenses</p>
                <p className="text-2xl font-bold text-warning">{pendingCount}</p>
              </div>
              <Receipt className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass hover:shadow-medium transition-all duration-300 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Submitted</p>
                <p className="text-2xl font-bold text-primary">${totalSubmitted.toFixed(2)}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass hover:shadow-medium transition-all duration-300 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-success">${totalPaid.toFixed(2)}</p>
              </div>
              <Download className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses by description, entity, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {expenseTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {expenseStatuses.map(status => (
                    <SelectItem key={status} value={status.toLowerCase()}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Expenses ({filteredExpenses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id} className="hover:bg-accent/50 transition-colors">
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.type}</TableCell>
                  <TableCell>{expense.linkedEntity}</TableCell>
                  <TableCell>
                    <Badge className={getEntityTypeColor(expense.entityType)}>
                      {expense.entityType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(expense.status)}>
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Process
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};