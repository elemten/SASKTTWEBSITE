import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Download, Eye, ChevronDown, ChevronRight, DollarSign, Calendar, Clock } from "lucide-react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Mock data
const mockInvoices = [
  {
    id: "INV-001",
    memberClub: "John Smith",
    type: "Member",
    amount: 120.00,
    dueDate: "2024-12-31",
    issueDate: "2024-01-01",
    status: "Paid",
    lineItems: [
      { description: "Annual Membership", amount: 100.00 },
      { description: "Processing Fee", amount: 20.00 }
    ]
  },
  {
    id: "INV-002",
    memberClub: "Regina Table Tennis Club",
    type: "Club",
    amount: 500.00,
    dueDate: "2024-01-15",
    issueDate: "2023-12-01",
    status: "Overdue",
    lineItems: [
      { description: "Club Registration Fee", amount: 500.00 }
    ]
  },
  {
    id: "INV-003",
    memberClub: "Sarah Johnson",
    type: "Member",
    amount: 85.00,
    dueDate: "2024-12-15",
    issueDate: "2024-11-15",
    status: "Issued",
    lineItems: [
      { description: "6-Month Membership", amount: 60.00 },
      { description: "Equipment Rental", amount: 25.00 }
    ]
  }
];

const quickStats = [
  {
    title: "Total Outstanding",
    value: "$1,250",
    icon: DollarSign,
    color: "text-destructive"
  },
  {
    title: "Paid This Month",
    value: "$3,420",
    icon: DollarSign,
    color: "text-success"
  },
  {
    title: "Overdue Invoices",
    value: "3",
    icon: Clock,
    color: "text-warning"
  }
];

export const InvoicesPayments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = invoice.memberClub.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === "all" || invoice.type.toLowerCase() === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-success text-success-foreground";
      case "issued":
        return "bg-primary text-primary-foreground";
      case "overdue":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "member":
        return "bg-primary text-primary-foreground";
      case "club":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
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
          <h1 className="text-3xl font-bold text-foreground">Invoices & Payments</h1>
          <p className="text-muted-foreground">Manage billing and payment processing</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="glass max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>
                  Generate a new invoice for membership or services.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Invoice Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="club">Club</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Member/Club Name" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Line Items</label>
                  <div className="border border-border/50 rounded-lg p-4 space-y-2">
                    <div className="flex gap-2">
                      <Input placeholder="Description" className="flex-1" />
                      <Input placeholder="Amount" className="w-24" />
                      <Button variant="outline" size="sm">Add</Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input type="date" placeholder="Due Date" />
                  <Input placeholder="Total Amount" disabled />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Create Invoice</Button>
                  <Button variant="outline" className="flex-1">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass hover:shadow-medium transition-all duration-300 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="glass border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices by ID or member/club name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="issued">Issued</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="club">Club</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Member/Club</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <Collapsible key={invoice.id} asChild>
                  <>
                    <TableRow className="hover:bg-accent/50 transition-colors">
                      <TableCell>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(invoice.id)}
                            className="h-6 w-6 p-0"
                          >
                            {expandedRows.has(invoice.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </TableCell>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.memberClub}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(invoice.type)}>
                          {invoice.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell colSpan={7}>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 bg-muted/30 rounded-lg border border-border/50"
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium text-foreground">Issue Date:</span>
                                <span className="text-muted-foreground">{invoice.issueDate}</span>
                              </div>
                              
                              <div className="border-t border-border/50 pt-3">
                                <span className="font-medium text-foreground text-sm">Line Items:</span>
                                <div className="mt-2 space-y-1">
                                  {invoice.lineItems.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">{item.description}</span>
                                      <span className="font-medium">${item.amount.toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};