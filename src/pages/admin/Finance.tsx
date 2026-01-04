import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Loader2, FileText, BadgeDollarSign, CreditCard, Calendar, Activity, Database } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { format, startOfMonth, parseISO, isBefore, isSameDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface InvoiceHeader {
  school_system: string;
  school_name: string;
  booking_count: number;
  total_cost: number;
}

function createInvoiceNumber(year: number, month: number, schoolSystem: string, schoolName: string): string {
  const sysCode = schoolSystem === 'Catholic' ? 'CATH' : schoolSystem === 'Saskatoon Public' ? 'PUB' : 'OTHER';
  const initials = schoolName.toUpperCase().replace(/[^A-Z0-9\s]/g, '').split(/\s+/).filter(Boolean).map(word => word[0]).join('');
  return `${year}-${String(month).padStart(2, '0')}-${sysCode}-${initials}`;
}

export default function AdminFinance() {
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [invoiceHeaders, setInvoiceHeaders] = useState<InvoiceHeader[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({
    revenueToDate: 0,
    bookingsToDate: 0,
    currentMonthRevenue: 0,
    totalAllTime: 0
  });

  useEffect(() => {
    const initPage = async () => {
      setPageLoading(true);
      const today = new Date();
      const monthStartStr = format(startOfMonth(today), 'yyyy-MM-dd');

      setSelectedYear(today.getFullYear().toString());
      setSelectedMonth(monthStartStr);

      try {
        // Direct calculation from public.confirmed_bookings
        const { data: rawBookings, error } = await (supabase as any)
          .from('confirmed_bookings')
          .select('total_cost, booking_date');

        if (error) throw error;

        const now = new Date();
        const bookings = rawBookings || [];

        // Revenue to this date (Total sum of all sessions up to and including today)
        const revenueToDate = bookings
          .filter((b: any) => b.booking_date && (isBefore(parseISO(b.booking_date), now) || isSameDay(parseISO(b.booking_date), now)))
          .reduce((sum: number, b: any) => sum + (Number(b.total_cost) || 0), 0);

        // Bookings till this date (Total count of sessions up to and including today)
        const bookingsToDate = bookings
          .filter((b: any) => b.booking_date && (isBefore(parseISO(b.booking_date), now) || isSameDay(parseISO(b.booking_date), now)))
          .length;

        // Revenue by current month
        const currentMonthStart = startOfMonth(now);
        const currentMonthRevenue = bookings
          .filter((b: any) => b.booking_date && format(parseISO(b.booking_date), 'yyyy-MM') === format(currentMonthStart, 'yyyy-MM'))
          .reduce((sum: number, b: any) => sum + (Number(b.total_cost) || 0), 0);

        setSummaryData({
          revenueToDate,
          bookingsToDate,
          currentMonthRevenue,
          totalAllTime: bookings.reduce((sum: number, b: any) => sum + (Number(b.total_cost) || 0), 0)
        });

        // Load the list for current month
        const { data: headers } = await (supabase as any).rpc('get_sped_invoice_headers', {
          month_start: monthStartStr
        });
        setInvoiceHeaders(headers || []);

      } catch (err) {
        console.error('Finance Init Error:', err);
      } finally {
        setPageLoading(false);
      }
    };

    initPage();
  }, []);

  const loadMonthData = async () => {
    if (!selectedMonth) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase as any).rpc('get_sped_invoice_headers', {
        month_start: selectedMonth
      });
      if (error) throw error;
      setInvoiceHeaders(data || []);
    } catch (error) {
      console.error('Load Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (header: InvoiceHeader) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sped-invoice-pdf', {
        body: {
          monthStart: selectedMonth,
          schoolSystem: header.school_system,
          schoolName: header.school_name
        }
      });

      if (error) throw error;
      if (!data) throw new Error("No data returned from function");

      let blob: Blob;

      // If data is already a Blob (direct binary response)
      if (data instanceof Blob) {
        blob = data;
      }
      // If data is an object with a base64 'pdf' property
      else if (data.pdf) {
        const byteCharacters = atob(data.pdf);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: 'application/pdf' });
      }
      else {
        throw new Error("Invalid response format from invoice function");
      }

      const fileName = createInvoiceNumber(
        new Date(selectedMonth).getFullYear(),
        new Date(selectedMonth).getMonth() + 1,
        header.school_system,
        header.school_name
      ) + '.pdf';

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getYearOptions = () => {
    const cy = new Date().getFullYear();
    return [cy + 1, cy, cy - 1, cy - 2].map(y => ({ value: y.toString(), label: y.toString() }));
  };

  const getMonthOptions = () => {
    if (!selectedYear) return [];
    const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return names.map((name, i) => ({
      value: format(new Date(parseInt(selectedYear), i, 1), 'yyyy-MM-dd'),
      label: name
    }));
  };

  if (pageLoading) {
    return (
      <AdminLayout>
        <div className="space-y-8 p-6">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </div>
          <Skeleton className="h-[400px] rounded-3xl" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-7xl mx-auto px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 italic uppercase">Finance</h1>
            <p className="text-emerald-600 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <Database className="h-3 w-3" />
              Live Calculations
            </p>
          </div>
        </div>

        {/* User-Requested Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <SummaryCard
            title="Revenue To This Date"
            value={`$${summaryData.revenueToDate.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={BadgeDollarSign}
            subtitle="Sum of sessions before today"
            variant="emerald"
          />
          <SummaryCard
            title="Booking Till This Date"
            value={summaryData.bookingsToDate}
            icon={CreditCard}
            subtitle="Completed sessions count"
            variant="gray"
          />
          <SummaryCard
            title="Revenue By Month"
            value={`$${summaryData.currentMonthRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={Calendar}
            subtitle={`Total for ${format(new Date(), 'MMMM yyyy')}`}
            variant="yellow"
          />
        </div>

        {/* Settlement Engine */}
        <Card className="border-none shadow-none bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
          <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <CardTitle className="text-lg font-black text-gray-900 tracking-tight">Settlement Explorer</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 bg-gray-50/50 border-y border-gray-50">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Period Year</label>
                <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); setSelectedMonth(''); }}>
                  <SelectTrigger className="rounded-xl border-gray-200 bg-white h-11 font-bold text-sm">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {getYearOptions().map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Period Month</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={!selectedYear}>
                  <SelectTrigger className="rounded-xl border-gray-200 bg-white h-11 font-bold text-sm">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {getMonthOptions().map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={loadMonthData} disabled={!selectedMonth || loading} className="w-full h-11 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-emerald-600 transition-all">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch Statement'}
                </Button>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {invoiceHeaders.length > 0 ? (
                invoiceHeaders.map((header, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${header.school_system === 'Catholic' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                        {header.school_system[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{header.school_name}</p>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{header.school_system}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900">${Number(header.total_cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{header.booking_count} sessions</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl text-gray-300 hover:text-emerald-600"
                        onClick={() => handleDownload(header)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center">
                  <Activity className="h-10 w-10 text-gray-100 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-400">Specify a period to visualize data</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AdminLayout>
  );
}

const SummaryCard = ({ title, value, icon: Icon, subtitle, variant }: any) => {
  const styles: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    gray: "bg-gray-50 text-gray-500",
    yellow: "bg-yellow-50 text-yellow-600"
  };
  return (
    <Card className="border-none shadow-none bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${styles[variant]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-2xl font-black tracking-tighter text-gray-900 truncate">{value}</h3>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate">{title}</p>
            {subtitle && <p className="text-[9px] font-bold text-gray-300 truncate mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
