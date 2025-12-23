import { motion } from "framer-motion";
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface InvoiceHeader {
  school_system: string;
  school_name: string;
  booking_count: number;
  total_cost: number;
}

// Slug function for invoice numbers
function createInvoiceNumber(year: number, month: number, schoolSystem: string, schoolName: string): string {
  const sysCode = schoolSystem === 'Catholic' ? 'CATH' : schoolSystem === 'Saskatoon Public' ? 'PUB' : 'OTHER';
  const schoolSlug = schoolName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${year}-${String(month).padStart(2, '0')}-${sysCode}-${schoolSlug}`;
}

export default function AdminFinance() {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [invoiceHeaders, setInvoiceHeaders] = useState<InvoiceHeader[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [loadedMonth, setLoadedMonth] = useState<string>('');

  // Generate last 12 months for dropdown
  const getMonthOptions = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const value = format(date, 'yyyy-MM-dd');
      const label = format(date, 'MMMM yyyy');
      months.push({ value, label });
    }
    return months;
  };

  const loadInvoices = async () => {
    if (!selectedMonth) return;
    
    setLoading(true);
    try {
      // Ensure we're using the first day of the month
      const monthStart = new Date(selectedMonth + 'T00:00:00');
      const monthStartStr = format(monthStart, 'yyyy-MM-dd');
      
      console.log('Loading invoices for month:', monthStartStr);
      
      const { data, error } = await (supabase as any).rpc('get_sped_invoice_headers', {
        month_start: monthStartStr
      });

      if (error) {
        console.error('RPC Error:', error);
        throw error;
      }
      
      console.log('Invoice headers loaded:', data);
      setInvoiceHeaders(data || []);
      setLoadedMonth(monthStartStr); // Remember which month was loaded
    } catch (error: any) {
      console.error('Error loading invoices:', error);
      alert('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (header: InvoiceHeader) => {
    if (!selectedMonth) {
      alert('Please select a month first');
      return;
    }
    
    // Ensure we use the first day of the month (same logic as loadInvoices)
    const monthStart = new Date(selectedMonth + 'T00:00:00');
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth(); // 0-indexed
    const firstDayOfMonth = new Date(year, month, 1);
    const monthNum = month + 1; // 1-indexed for invoice number
    const invoiceNumber = createInvoiceNumber(year, monthNum, header.school_system, header.school_name);
    
    setDownloading(invoiceNumber);
    try {
      const monthStartStr = format(firstDayOfMonth, 'yyyy-MM-dd');
      const payload = {
        monthStart: monthStartStr,
        schoolSystem: header.school_system,
        schoolName: header.school_name
      };
      
      console.log('Selected month:', selectedMonth);
      console.log('Loaded month:', loadedMonth);
      console.log('Calling Edge Function with payload:', payload);
      
      // Warn if trying to download for a different month than was loaded
      if (loadedMonth && monthStartStr !== loadedMonth) {
        const proceed = confirm(
          `Warning: You loaded invoices for ${loadedMonth}, but you're trying to download for ${monthStartStr}.\n\n` +
          `Make sure you've selected the correct month. Continue anyway?`
        );
        if (!proceed) {
          setDownloading(null);
          return;
        }
      }
      
      // Use fetch directly to get error response body
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const response = await fetch(`${supabaseUrl}/functions/v1/sped-invoice-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();
      console.log('Edge Function response:', { status: response.status, data: responseData });

      if (!response.ok) {
        let errorMessage = responseData.error || 'Unknown error';
        if (responseData.debug) {
          console.error('Debug info:', responseData.debug);
          errorMessage += `\n\nDebug: Found ${responseData.debug.totalBookingsInRange || 0} bookings in date range.`;
          if (responseData.debug.matchingSchools && responseData.debug.matchingSchools.length > 0) {
            errorMessage += `\nSimilar school names: ${responseData.debug.matchingSchools.join(', ')}`;
          }
          if (responseData.debug.searchedSchool) {
            errorMessage += `\nSearched for: "${responseData.debug.searchedSchool}" in system "${responseData.debug.searchedSystem}"`;
          }
        }
        throw new Error(errorMessage);
      }

      if (!responseData || !responseData.pdf) {
        throw new Error('No PDF data returned from function');
      }

      // Convert base64 to blob and download
      const pdfBytes = Uint8Array.from(atob(responseData.pdf), (c: string) => c.charCodeAt(0));
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `INVOICE_${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading invoice:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        error: error
      });
      alert(`Failed to download invoice: ${error.message || 'Unknown error'}. Check console for details.`);
    } finally {
      setDownloading(null);
    }
  };

  const monthOptions = getMonthOptions();
  const catholicSchools = invoiceHeaders.filter(h => h.school_system === 'Catholic');
  const publicSchools = invoiceHeaders.filter(h => h.school_system === 'Saskatoon Public');

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finance Management</h1>
          <p className="text-muted-foreground">Track expenses, receivables, and financial health</p>
        </div>

        {/* SPED Invoicing Card */}
        <Card>
          <CardHeader>
            <CardTitle>SPED Invoicing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Select Month</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={loadInvoices} 
                disabled={!selectedMonth || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load Invoices'
                )}
              </Button>
            </div>

            {invoiceHeaders.length > 0 && (
              <div className="space-y-6 mt-6">
                {/* Catholic Schools Table */}
                {catholicSchools.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Catholic Schools</h3>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>School Name</TableHead>
                            <TableHead>Bookings</TableHead>
                            <TableHead className="text-right">Total Cost</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {catholicSchools.map((header, idx) => {
                            const monthStart = new Date(selectedMonth);
                            const invoiceNumber = createInvoiceNumber(
                              monthStart.getFullYear(),
                              monthStart.getMonth() + 1,
                              header.school_system,
                              header.school_name
                            );
                            return (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{header.school_name}</TableCell>
                                <TableCell>{header.booking_count}</TableCell>
                                <TableCell className="text-right">${header.total_cost.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => downloadInvoice(header)}
                                    disabled={downloading === invoiceNumber}
                                  >
                                    {downloading === invoiceNumber ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Generating...
                                      </>
                                    ) : (
                                      <>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download PDF
                                      </>
                                    )}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Saskatoon Public Schools Table */}
                {publicSchools.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Saskatoon Public Schools</h3>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>School Name</TableHead>
                            <TableHead>Bookings</TableHead>
                            <TableHead className="text-right">Total Cost</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {publicSchools.map((header, idx) => {
                            const monthStart = new Date(selectedMonth);
                            const invoiceNumber = createInvoiceNumber(
                              monthStart.getFullYear(),
                              monthStart.getMonth() + 1,
                              header.school_system,
                              header.school_name
                            );
                            return (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{header.school_name}</TableCell>
                                <TableCell>{header.booking_count}</TableCell>
                                <TableCell className="text-right">${header.total_cost.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => downloadInvoice(header)}
                                    disabled={downloading === invoiceNumber}
                                  >
                                    {downloading === invoiceNumber ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Generating...
                                      </>
                                    ) : (
                                      <>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download PDF
                                      </>
                                    )}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AdminLayout>
  );
}
