import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, ChevronDown, ChevronRight, Users, UserCheck, UserX, Clock } from "lucide-react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { membersService } from "@/lib/services/members";
import type { Member, MemberAnalytics, MemberFilters } from "@/lib/types/members";
import { useNavigate } from "react-router-dom";

export const MembersManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [analytics, setAnalytics] = useState<MemberAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clubFilter, setClubFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [clubs, setClubs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 20;

  // Load initial data
  useEffect(() => {
    loadData();
    loadClubs();
    
    // Set up real-time subscription
    const subscription = membersService.subscribeToMembers((payload) => {
      console.log('Real-time update:', payload);
      loadData(); // Reload data when changes occur
      toast({
        title: "Data Updated",
        description: "Member data has been updated in real-time.",
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Reload data when filters change
  useEffect(() => {
    loadData();
  }, [searchQuery, statusFilter, clubFilter, currentPage]);

  const loadData = async () => {
    setLoading(true);
    try {
      const filters: MemberFilters = {
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        club: clubFilter !== 'all' ? clubFilter : undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE
      };

      const [membersResult, analyticsResult] = await Promise.all([
        membersService.getMembers(filters),
        membersService.getMemberAnalytics()
      ]);

      if (membersResult.error) {
        toast({
          title: "Error",
          description: "Failed to load members data",
          variant: "destructive"
        });
      } else {
        setMembers(membersResult.data);
      }

      if (analyticsResult.error) {
        toast({
          title: "Error", 
          description: "Failed to load analytics",
          variant: "destructive"
        });
      } else {
        setAnalytics(analyticsResult.data);
        setTotalMembers(analyticsResult.data?.totalMembers || 0);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadClubs = async () => {
    try {
      const { data, error } = await membersService.getClubs();
      if (!error) {
        setClubs(data);
      }
    } catch (error) {
      console.error('Error loading clubs:', error);
    }
  };

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
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExportCSV = async () => {
    try {
      toast({
        title: "Export Started",
        description: "CSV export has been initiated. Download will begin shortly.",
      });

      // Get all members for export (without pagination)
      const { data: allMembers, error } = await membersService.getMembers({
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        club: clubFilter !== 'all' ? clubFilter : undefined,
      });

      if (error) {
        throw new Error('Failed to fetch members for export');
      }

      // Create CSV content
      const headers = [
        'Member Number', 'Name', 'Email', 'Phone', 'Club', 'Status', 
        'District', 'Community', 'Gender', 'Age', 'Membership Expires'
      ];
      
      const csvContent = [
        headers.join(','),
        ...allMembers.map(member => [
          member.mem_number,
          `"${member.name}"`,
          member.email,
          member.phone || '',
          `"${member.club || ''}"`,
          member.current_membership_status || '',
          member.district || '',
          member.community || '',
          member.gender || '',
          member.age || '',
          member.membership_expires_at || ''
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `members_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Complete",
        description: `${allMembers.length} members exported successfully.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export members data",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };


  const handleDeleteMember = async (member: Member) => {
    if (!window.confirm(`Are you sure you want to delete ${member.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await membersService.deleteMember(member.id);
      
      if (error) {
        throw new Error(error.message || 'Failed to delete member');
      }

      toast({
        title: "Success",
        description: `Member ${member.name} has been deleted`,
      });

      loadData(); // Refresh the members list
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete member",
        variant: "destructive"
      });
    }
  };

  const totalPages = Math.ceil(totalMembers / ITEMS_PER_PAGE);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Members Management</h1>
          <p className="text-muted-foreground">Manage member accounts and memberships</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
            onClick={handleExportCSV}
            disabled={loading}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            className="gap-2 bg-green-600 hover:bg-green-700"
            onClick={() => navigate('/admin/members/add')}
          >
            <Plus className="h-4 w-4" />
            Add New Member
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass hover:shadow-medium transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                Total Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalMembers}</div>
              <div className="text-sm text-green-600">
                +{analytics.recentJoins} this month
              </div>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-medium transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-green-600" />
                Active Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeMembers}</div>
              <div className="text-sm text-green-600">
                {Math.round((analytics.activeMembers / analytics.totalMembers) * 100)}% of total
              </div>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-medium transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserX className="h-4 w-4 text-green-600" />
                Expired Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.expiredMembers}</div>
              <div className="text-sm text-green-600">
                {analytics.expiringThisMonth} expiring soon
              </div>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-medium transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                Pending Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.pendingMembers}</div>
              <div className="text-sm text-green-600">
                Require attention
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or member number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={clubFilter} onValueChange={setClubFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by club" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clubs</SelectItem>
                {clubs.map(club => (
                  <SelectItem key={club} value={club}>{club}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>
            Members ({totalMembers} total)
            {loading && <span className="text-sm font-normal text-muted-foreground ml-2">Loading...</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Member #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Club</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        Loading members...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No members found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <>
                      <TableRow 
                        key={member.id} 
                        className="hover:bg-muted/50 transition-colors duration-200"
                      >
                        <TableCell>
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRowExpansion(member.id)}
                                className="p-1"
                              >
                                {expandedRows.has(member.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </Collapsible>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{member.mem_number}</TableCell>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.club || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(member.current_membership_status || '')}>
                            {member.current_membership_status || 'inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(member.membership_expires_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => toggleRowExpansion(member.id)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700 transition-all duration-200"
                              onClick={() => navigate(`/admin/members/edit/${member.id}`)}
                              title="Edit Member"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteMember(member)}
                              title="Delete Member"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Row Details */}
                      {expandedRows.has(member.id) && (
                        <TableRow>
                          <TableCell colSpan={8}>
                            <Collapsible open={expandedRows.has(member.id)}>
                              <CollapsibleContent>
                                <div className="p-4 bg-muted/20 rounded-lg space-y-3">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <strong>Phone:</strong> {member.phone || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>District:</strong> {member.district || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Community:</strong> {member.community || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Gender:</strong> {member.gender || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Age:</strong> {member.age || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Joined:</strong> {formatDate(member.created_at)}
                                    </div>
                                    <div>
                                      <strong>Last Payment:</strong> {formatDate(member.last_payment_date)}
                                    </div>
                                    <div>
                                      <strong>Provincial Year:</strong> {member.provincial_paid_year || 'N/A'}
                                    </div>
                                  </div>
                                  {member.address && (
                                    <div className="text-sm">
                                      <strong>Address:</strong> {member.address}
                                    </div>
                                  )}
                                  {member.notes && (
                                    <div className="text-sm">
                                      <strong>Notes:</strong> {member.notes}
                                    </div>
                                  )}
                                  {member.guardian_name_phone && (
                                    <div className="text-sm">
                                      <strong>Guardian:</strong> {member.guardian_name_phone}
                                      {member.guardian_email && ` (${member.guardian_email})`}
                                    </div>
                                  )}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalMembers)} of {totalMembers} members
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};