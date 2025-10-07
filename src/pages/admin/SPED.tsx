import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

type ConfirmedBooking = {
  id: string;
  created_at?: string;
  teacher_first_name?: string;
  teacher_last_name?: string;
  teacher_email?: string;
  teacher_phone?: string;
  school_name?: string;
  school_address_line1?: string;
  school_address_line2?: string;
  school_city?: string;
  school_province?: string;
  school_postal_code?: string;
  booking_date?: string; // YYYY-MM-DD
  booking_time_start?: string;
  booking_time_end?: string;
  number_of_students?: number;
  grade_level?: string;
  preferred_coach?: string;
  special_requirements?: string;
  total_cost?: number;
  total_minutes?: number;
  selected_slots?: any;
  school_system?: string;
  google_calendar_event_id?: string | null;
  google_calendar_link?: string | null;
  admin_notes?: string | null;
};

export default function AdminSPED() {
  const [bookings, setBookings] = useState<ConfirmedBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [fetchedCount, setFetchedCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      let data: any = null;
      let err: any = null;
      try {
        const res = await (supabase as any)
          .from("confirmed_bookings")
          .select("*")
          .order("booking_date", { ascending: true });
        data = res?.data ?? null;
        err = res?.error ?? null;
      } catch (_e) {
        const res = await (supabase as any)
          .from("confirmed_bookings")
          .select("*");
        data = res?.data ?? null;
        err = res?.error ?? null;
      }

      if (!isMounted) return;
      if (err) {
        setError(err.message || "Failed to load bookings");
        setBookings([]);
        setFetchedCount(0);
      } else {
        const rows = Array.isArray(data) ? (data as ConfirmedBooking[]) : [];
        setFetchedCount(rows.length);
        setBookings(rows);
      }
      setLoading(false);
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...bookings].sort((a, b) => {
      const ad = a.booking_date ? Date.parse(`${a.booking_date}T00:00:00`) : Number.MAX_SAFE_INTEGER;
      const bd = b.booking_date ? Date.parse(`${b.booking_date}T00:00:00`) : Number.MAX_SAFE_INTEGER;
      return ad - bd;
    });
    if (!q) return sorted;
    return sorted.filter((row) => {
      const parts = [
        row.teacher_first_name,
        row.teacher_last_name,
        row.teacher_email,
        row.teacher_phone,
        row.school_name,
        row.school_city,
        row.school_province,
        row.school_postal_code,
        row.booking_date,
        row.booking_time_start,
        row.booking_time_end,
        row.grade_level,
        row.preferred_coach,
        row.school_system,
        row.admin_notes || undefined,
      ]
        .filter(Boolean)
        .map((s) => String(s).toLowerCase());
      return parts.some((p) => p.includes(q));
    });
  }, [bookings, search]);

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">SPED Bookings</h1>
          <p className="text-muted-foreground">Confirmed bookings from the public form</p>
        </div>

        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teacher, school, city, date, etc."
              className="w-full md:w-80 rounded-md border px-3 py-2 text-sm"
            />
            <div className="ml-auto text-sm text-gray-500">{filtered.length} result{filtered.length === 1 ? "" : "s"}</div>
          </div>

          {/* Diagnostics */}
          <div className="px-4 pt-3 text-xs text-gray-500">
            <span>Supabase: {import.meta.env.VITE_SUPABASE_URL ? 'configured' : 'not configured'}</span>
            <span className="mx-2">|</span>
            <span>Fetched: {fetchedCount}</span>
            {error ? (
              <>
                <span className="mx-2">|</span>
                <span className="text-red-600">Error: {error}</span>
              </>
            ) : null}
          </div>

          {loading ? (
            <div className="p-6 text-sm text-gray-600">Loading bookings…</div>
          ) : error ? (
            <div className="p-6 text-sm text-red-600">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-sm text-gray-600">No bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b">
                    <th className="text-left font-medium px-4 py-2">Date</th>
                    <th className="text-left font-medium px-4 py-2">Time</th>
                    <th className="text-left font-medium px-4 py-2">Teacher</th>
                    <th className="text-left font-medium px-4 py-2">School</th>
                    <th className="text-left font-medium px-4 py-2">City</th>
                    <th className="text-left font-medium px-4 py-2">Grade</th>
                    <th className="text-left font-medium px-4 py-2">Students</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => {
                    const dateStr = b.booking_date || "-";
                    const timeStr = [b.booking_time_start, b.booking_time_end].filter(Boolean).join(" - ") || "-";
                    const teacher = [b.teacher_first_name, b.teacher_last_name].filter(Boolean).join(" ") || "-";
                    return (
                      <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap">{dateStr}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{timeStr}</td>
                        <td className="px-4 py-2">{teacher}</td>
                        <td className="px-4 py-2">{b.school_name || "-"}</td>
                        <td className="px-4 py-2">{b.school_city || "-"}</td>
                        <td className="px-4 py-2">{b.grade_level || "-"}</td>
                        <td className="px-4 py-2">{b.number_of_students ?? "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
}
