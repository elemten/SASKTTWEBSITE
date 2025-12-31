import { useEffect, useMemo, useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { createClient } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Plus,
  Trash2,
  Car as CarIcon,
  Calculator,
  Users,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Search,
  FileText,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type Tournament = {
  id: string;
  name: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  tournament_type: "in_province" | "out_of_province";
  status: "draft" | "allocated" | "approved" | "invoiced" | "closed";
  hotel_total: number;
};

type Member = {
  mem_number: string;
  name: string;
  email: string;
  gender: string | null;
};

type Car = {
  id: string;
  tournament_id: string;
  car_label: string;
  km_driven: number | null;
  mileage_rate: number;
  driver_member_mem_number: string | null;

  // advanced
  driver_hotel_discount: boolean; // driver gets 50% hotel share (trip-level)
  ignore_mileage_invoicing: boolean;
};

type Participant = {
  id: string;
  car_id: string;
  member_mem_number: string;

  category: "athlete_parent" | "staff";
  is_coach: boolean;
  is_chaperone: boolean;

  stayed_in_hotel: boolean;

  // legacy fields still in DB but not used in UI
  is_driver: boolean;
  nights: number;
  hotel_cost_total: number;
};

type TournamentInvoice = {
  id: string;
  tournament_id: string;
  member_mem_number: string;
  status: string;
  total_amount: number;
};

type TournamentInvoiceItem = {
  id: string;
  invoice_id: string;
  description: string;
  amount: number;
  source_line_type: string | null;
  source_car_id: string | null;
};

type InvoiceRow = {
  invoice_id: string;
  member_mem_number: string;
  name: string;
  email: string;
  hotel: number;
  mileage: number;
  total: number;
  items: { description: string; amount: number }[];
};

type AllocationLine = {
  id: string;
  allocation_id: string;
  tournament_id: string;
  member_mem_number: string;
  line_type: string;
  amount: number;
  car_id: string | null;
  meta: any; // jsonb
  created_at?: string | null;
};

type StaffCoveredRow = {
  id: string;
  member_mem_number: string;
  name: string;
  email: string;
  line_type: string;
  amount: number;
  car_label: string;
  note: string;
};

function fmtDate(d: string | null) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export default function AdminTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");

  const selectedTournament = useMemo(
    () => tournaments.find((t) => t.id === selectedTournamentId) ?? null,
    [tournaments, selectedTournamentId]
  );

  const [members, setMembers] = useState<Member[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [carSearch, setCarSearch] = useState<Record<string, string>>({});
  const [carAdvancedOpen, setCarAdvancedOpen] = useState<Record<string, boolean>>({});
  const [busyInvoice, setBusyInvoice] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [invoices, setInvoices] = useState<TournamentInvoice[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<TournamentInvoiceItem[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  const [allocLines, setAllocLines] = useState<AllocationLine[]>([]);
  const [loadingAlloc, setLoadingAlloc] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const searchInputRefs = useRef<Record<string, HTMLInputElement>>({});

  const participantsByCar = useMemo(() => {
    const map = new Map<string, Participant[]>();
    for (const p of participants) {
      const arr = map.get(p.car_id) ?? [];
      arr.push(p);
      map.set(p.car_id, arr);
    }
    return map;
  }, [participants]);

  const carLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of cars) map.set(c.id, c.car_label);
    return map;
  }, [cars]);

  const memberByMem = useMemo(() => {
    const map = new Map<string, Member>();
    for (const m of members) map.set(m.mem_number, m);
    return map;
  }, [members]);

  const invoiceRows: InvoiceRow[] = useMemo(() => {
    const itemsByInvoice = new Map<string, TournamentInvoiceItem[]>();
    for (const it of invoiceItems) {
      const arr = itemsByInvoice.get(it.invoice_id) ?? [];
      arr.push(it);
      itemsByInvoice.set(it.invoice_id, arr);
    }

    const rows: InvoiceRow[] = invoices.map((inv) => {
      const m = memberByMem.get(inv.member_mem_number);
      const items = itemsByInvoice.get(inv.id) ?? [];

      let hotel = 0;
      let mileage = 0;

      for (const it of items) {
        const amt = Number(it.amount) || 0;
        const d = (it.description ?? "").toLowerCase();
        if (d.includes("hotel")) hotel += amt;
        else if (d.includes("mileage")) mileage += amt;
      }

      return {
        invoice_id: inv.id,
        member_mem_number: inv.member_mem_number,
        name: m?.name ?? inv.member_mem_number,
        email: m?.email ?? "",
        hotel: round2(hotel),
        mileage: round2(mileage),
        total: round2(Number(inv.total_amount) || 0),
        items: items.map((x) => ({ description: x.description, amount: Number(x.amount) || 0 })),
      };
    });

    // sort highest total first
    rows.sort((a, b) => b.total - a.total);
    return rows;
  }, [invoices, invoiceItems, memberByMem]);

  const staffCoveredRows: StaffCoveredRow[] = useMemo(() => {
    const wanted = new Set(["staff_covered_hotel", "staff_covered_mileage", "staff_covered_meals"]);

    const rows = (allocLines ?? [])
      .filter((l) => wanted.has(l.line_type))
      .map((l) => {
        const m = memberByMem.get(l.member_mem_number);
        const meta = (l.meta ?? {}) as any;

        const carLabel =
          typeof meta?.car_label === "string"
            ? meta.car_label
            : l.car_id
              ? (carLabelById.get(l.car_id) ?? "Car")
              : "Trip";

        const note =
          l.line_type === "staff_covered_hotel"
            ? "Hotel usage covered by TTSASK"
            : l.line_type === "staff_covered_mileage"
              ? "Mileage covered by TTSASK"
              : "Meals covered by TTSASK";

        return {
          id: l.id,
          member_mem_number: l.member_mem_number,
          name: m?.name ?? l.member_mem_number,
          email: m?.email ?? "",
          line_type: l.line_type,
          amount: Number(l.amount) || 0,
          car_label: carLabel,
          note,
        };
      });

    // highest first
    rows.sort((a, b) => b.amount - a.amount);
    return rows;
  }, [allocLines, memberByMem, carLabelById]);

  const staffCoveredTotal = useMemo(
    () => round2(staffCoveredRows.reduce((s, r) => s + r.amount, 0)),
    [staffCoveredRows]
  );

  const financialSummary = useMemo(() => {
    const totalHotelCost = selectedTournament?.hotel_total ?? 0;
    const totalInvoiced = invoiceRows.reduce((sum, r) => sum + r.total, 0);
    const totalCovered = staffCoveredTotal;
    const balance = totalHotelCost - (totalInvoiced + totalCovered);

    return {
      totalHotelCost: round2(totalHotelCost),
      totalInvoiced: round2(totalInvoiced),
      totalCovered: round2(totalCovered),
      balance: round2(balance),
    };
  }, [selectedTournament, invoiceRows, staffCoveredTotal]);

  async function loadTournaments() {
    // IMPORTANT: Only out-of-province tournaments for this workflow
    const { data, error } = await supabase
      .from("tournaments")
      .select("id,name,location,start_date,end_date,tournament_type,status,hotel_total")
      .eq("tournament_type", "out_of_province")
      .order("start_date", { ascending: false });

    if (error) throw error;

    const list = (data ?? []) as Tournament[];
    setTournaments(list);

    if (!selectedTournamentId && list[0]?.id) setSelectedTournamentId(list[0].id);
    if (selectedTournamentId && !list.find((t) => t.id === selectedTournamentId)) {
      setSelectedTournamentId(list[0]?.id ?? "");
    }
  }

  async function loadMembers() {
    // We'll use client-side search for now.
    const { data, error } = await supabase
      .from("all_members")
      .select("mem_number,name,email,gender")
      .order("name", { ascending: true })
      .limit(3000);

    if (error) throw error;
    setMembers((data ?? []) as Member[]);
  }

  async function loadCarsAndParticipants(tournamentId: string) {
    const { data: carsData, error: carsErr } = await supabase
      .from("tournament_cars")
      .select(
        "id,tournament_id,car_label,km_driven,mileage_rate,driver_member_mem_number,driver_hotel_discount,ignore_mileage_invoicing"
      )
      .eq("tournament_id", tournamentId)
      .order("created_at", { ascending: true });

    if (carsErr) throw carsErr;
    const carIds = (carsData ?? []).map((c: any) => c.id);

    let partsData: any[] = [];
    if (carIds.length) {
      const { data: pData, error: pErr } = await supabase
        .from("tournament_car_participants")
        .select(
          "id,car_id,member_mem_number,category,is_coach,is_chaperone,stayed_in_hotel,is_driver,nights,hotel_cost_total"
        )
        .in("car_id", carIds)
        .order("created_at", { ascending: true });

      if (pErr) throw pErr;
      partsData = pData ?? [];
    }

    setCars((carsData ?? []) as Car[]);
    setParticipants((partsData ?? []) as Participant[]);
  }

  async function loadResults(tournamentId: string) {
    setLoadingResults(true);
    setError("");
    try {
      const { data: invData, error: invErr } = await supabase
        .from("tournament_invoices")
        .select("id,tournament_id,member_mem_number,status,total_amount")
        .eq("tournament_id", tournamentId)
        .order("total_amount", { ascending: false });

      if (invErr) throw invErr;

      const invs = (invData ?? []) as TournamentInvoice[];
      setInvoices(invs);

      if (!invs.length) {
        setInvoiceItems([]);
        return;
      }

      const invoiceIds = invs.map((x) => x.id);

      const { data: itemData, error: itemErr } = await supabase
        .from("tournament_invoice_items")
        .select("id,invoice_id,description,amount,source_line_type,source_car_id")
        .in("invoice_id", invoiceIds)
        .order("description", { ascending: true });

      if (itemErr) throw itemErr;

      setInvoiceItems((itemData ?? []) as TournamentInvoiceItem[]);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoadingResults(false);
    }
  }

  async function loadAllocationLines(tournamentId: string) {
    setLoadingAlloc(true);
    setError("");

    try {
      // 1) Find the latest allocation_id by looking at the newest line
      const { data: latestLine, error: latestErr } = await supabase
        .from("tournament_allocation_lines")
        .select("allocation_id")
        .eq("tournament_id", tournamentId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestErr) throw latestErr;

      if (!latestLine?.allocation_id) {
        setAllocLines([]);
        return;
      }

      // 2) Load all lines for that allocation
      const { data: lines, error: lErr } = await supabase
        .from("tournament_allocation_lines")
        .select("id,allocation_id,tournament_id,member_mem_number,line_type,amount,car_id,meta,created_at")
        .eq("allocation_id", latestLine.allocation_id)
        .order("created_at", { ascending: true });

      if (lErr) throw lErr;

      setAllocLines((lines ?? []) as AllocationLine[]);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoadingAlloc(false);
    }
  }

  async function loadAll() {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      await Promise.all([loadTournaments(), loadMembers()]);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedTournamentId) return;
    (async () => {
      setError("");
      setNotice("");
      try {
        await loadCarsAndParticipants(selectedTournamentId);
        await loadResults(selectedTournamentId);
        await loadAllocationLines(selectedTournamentId);
      } catch (e: any) {
        setError(e?.message ?? String(e));
      }
    })();
  }, [selectedTournamentId]);

  async function updateTournamentHotelTotal(value: number) {
    if (!selectedTournamentId) return;
    setError("");
    try {
      const { error } = await supabase
        .from("tournaments")
        .update({ hotel_total: value })
        .eq("id", selectedTournamentId);

      if (error) throw error;
      await loadTournaments();
      setNotice("Hotel total updated.");
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  async function addCar() {
    if (!selectedTournamentId) return;
    const car_label = `Car ${cars.length + 1}`;
    const tempId = `temp-${Date.now()}`;

    // Optimistic update
    setCars((prev) => [
      ...prev,
      {
        id: tempId,
        tournament_id: selectedTournamentId,
        car_label,
        km_driven: 0,
        mileage_rate: 0.4,
        driver_member_mem_number: null,
        driver_hotel_discount: false,
        ignore_mileage_invoicing: false,
      } as Car,
    ]);

    setBusy("addCar");
    setError("");
    setNotice("");
    try {
      const { error } = await supabase.from("tournament_cars").insert({
        tournament_id: selectedTournamentId,
        car_label,
        km_driven: 0,
        mileage_rate: 0.4,
        driver_member_mem_number: null,
        driver_hotel_discount: false,
        ignore_mileage_invoicing: false,
      });
      if (error) throw error;
      await loadCarsAndParticipants(selectedTournamentId);
      setNotice("Car added.");
    } catch (e: any) {
      setError(e?.message ?? String(e));
      // Revert optimistic update on error by reloading
      if (selectedTournamentId) await loadCarsAndParticipants(selectedTournamentId);
    } finally {
      setBusy(null);
    }
  }

  async function updateCar(carId: string, patch: Partial<Car>) {
    // Optimistic update
    setCars((prev) => prev.map((c) => (c.id === carId ? { ...c, ...patch } : c)));

    try {
      const { error } = await supabase.from("tournament_cars").update(patch).eq("id", carId);
      if (error) {
        // Revert on error
        throw error;
      }
      // Do NOT reload everything to avoid scroll jumps
    } catch (e: any) {
      setError(e?.message ?? String(e));
      // Reload on error to ensure sync
      if (selectedTournamentId) await loadCarsAndParticipants(selectedTournamentId);
    }
  }

  async function addParticipant(carId: string, mem_number: string) {
    setBusy(`addP:${carId}`);
    setError("");
    setNotice("");
    try {
      const { error } = await supabase.from("tournament_car_participants").insert({
        car_id: carId,
        member_mem_number: mem_number,
        category: "athlete_parent",
        is_coach: false,
        is_chaperone: false,
        stayed_in_hotel: false,

        // legacy columns still exist; default harmless
        is_driver: false,
        nights: 1,
        hotel_cost_total: 0,
      });
      if (error) throw error;
      if (selectedTournamentId) await loadCarsAndParticipants(selectedTournamentId);
      setNotice("Participant added.");
      // Re-focus the search input for the current car
      setTimeout(() => {
        searchInputRefs.current[carId]?.focus();
      }, 100);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setBusy(null);
    }
  }

  async function updateParticipant(id: string, patch: Partial<Participant>) {
    setError("");
    try {
      const { error } = await supabase.from("tournament_car_participants").update(patch).eq("id", id);
      if (error) throw error;
      if (selectedTournamentId) await loadCarsAndParticipants(selectedTournamentId);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  async function removeParticipant(id: string) {
    setError("");
    try {
      const { error } = await supabase.from("tournament_car_participants").delete().eq("id", id);
      if (error) throw error;
      if (selectedTournamentId) await loadCarsAndParticipants(selectedTournamentId);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  async function computeAllocation() {
    if (!selectedTournamentId) return;
    setBusy("compute");
    setError("");
    setNotice("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const res = await fetch(`${SUPABASE_URL}/functions/v1/tournament-planner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ tournament_id: selectedTournamentId }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Allocation failed.");

      setNotice(
        `✅ Allocation computed. Lines: ${json.allocation_lines_created ?? "?"}, Invoices: ${json.invoices_created ?? "?"}`
      );

      await loadTournaments();
      await loadResults(selectedTournamentId);
      await loadAllocationLines(selectedTournamentId);

      // Scroll to results section after allocation completes
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setBusy(null);
    }
  }

  async function resetTournament() {
    if (!selectedTournamentId) return;

    const ok = window.confirm(
      "HARD RESET this tournament?\n\nThis will DELETE:\n- allocations + lines\n- invoices + invoice items\n- ALL cars\n- ALL participants\n\nThis cannot be undone.\n\nProceed?"
    );
    if (!ok) return;

    setBusy("reset");
    setError("");
    setNotice("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

      const res = await fetch(`${SUPABASE_URL}/functions/v1/tournament-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ tournament_id: selectedTournamentId }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Reset failed");

      setNotice("✅ Tournament reset complete (allocations + invoices cleared).");

      await loadTournaments();
      await loadCarsAndParticipants(selectedTournamentId);
      await loadResults(selectedTournamentId);
      await loadAllocationLines(selectedTournamentId);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setBusy(null);
    }
  }

  async function handleGenerateInvoice(invoiceId: string, memNumber: string) {
    if (!selectedTournamentId) return;
    setBusyInvoice((prev) => ({ ...prev, [invoiceId]: true }));
    setError("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const res = await fetch(`${SUPABASE_URL}/functions/v1/tournament-generate-invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          tournament_id: selectedTournamentId,
          invoice_id: invoiceId,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error ?? "Failed to generate invoice PDF");
      }

      // Handle blob
      const blob = await res.blob();

      // Validate file size (less than 1KB is suspicious)
      if (blob.size < 1000) {
        throw new Error("PDF appears to be empty or corrupted");
      }

      // filename format: TTSASK_<INITIALS>_<YYYYMMDD>_<MEM>.pdf
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const tName = (selectedTournament?.name ?? "Tournament")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 6)
        .toUpperCase();
      const filename = `TTSASK_${tName}_${dateStr}_${memNumber}.pdf`;

      downloadBlob(blob, filename);
      setNotice("✅ Invoice PDF generated and downloaded.");
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setBusyInvoice((prev) => ({ ...prev, [invoiceId]: false }));
    }
  }

  const topCarSearchResults = (carId: string) => {
    const q = (carSearch[carId] ?? "").trim().toLowerCase();
    if (!q) return [];

    // exclude members already in that car
    const existing = new Set((participantsByCar.get(carId) ?? []).map((p) => p.member_mem_number));

    const results = members
      .filter((m) => {
        if (existing.has(m.mem_number)) return false;
        const hay = `${m.name} ${m.mem_number} ${m.email}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 8);

    return results;
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Tournament Planner
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage out-of-province trips, assign cars, and compute cost allocations.
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && (error || notice) && (
          <div className={cn(
            "rounded-lg border p-4 flex items-start gap-3",
            error ? "bg-red-50 border-red-200 text-red-900" : "bg-green-50 border-green-200 text-green-900"
          )}>
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div className="text-sm font-medium leading-relaxed">
              {error || notice}
            </div>
          </div>
        )}

        {!loading && (
          <>
            <Card className="shadow-lg border-opacity-50">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Trip Configuration
                </CardTitle>
                <CardDescription>
                  Select a tournament and set the total hotel cost to be split among participants.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                  <div className="md:col-span-4 space-y-2">
                    <Label>Select Tournament</Label>
                    <Select
                      value={selectedTournamentId}
                      onValueChange={setSelectedTournamentId}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a tournament..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[40vh]">
                        {!tournaments.length && (
                          <SelectItem value="none" disabled>
                            No out-of-province tournaments found
                          </SelectItem>
                        )}
                        {tournaments.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            <div className="flex flex-col items-start gap-0.5">
                              <span className="font-medium">{t.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {t.start_date ? fmtDate(t.start_date) : "TBD"} • {t.status}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTournament && (
                    <>
                      <div className="md:col-span-3 space-y-2">
                        <Label>Total Hotel Cost</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-7 h-11 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={selectedTournament.hotel_total === 0 ? "" : selectedTournament.hotel_total}
                            onFocus={(e) => e.target.select()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") e.currentTarget.blur();
                            }}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "") {
                                setTournaments((prev) =>
                                  prev.map((t) =>
                                    t.id === selectedTournamentId ? { ...t, hotel_total: 0 } : t
                                  )
                                );
                                return;
                              }
                              const v = Number(val);
                              if (v < 0) return;
                              setTournaments((prev) =>
                                prev.map((t) =>
                                  t.id === selectedTournamentId ? { ...t, hotel_total: v } : t
                                )
                              );
                            }}
                            onBlur={(e) => updateTournamentHotelTotal(Number(e.target.value) || 0)}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-5 flex gap-3 pb-0.5 justify-end">
                        <Button
                          variant="outline"
                          onClick={addCar}
                          disabled={!selectedTournamentId || !!busy}
                          className="h-11 border-dashed"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Car
                        </Button>
                        <Button
                          onClick={computeAllocation}
                          disabled={!selectedTournamentId || !!busy}
                          className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                        >
                          {busy === "compute" ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Calculator className="mr-2 h-4 w-4" />
                          )}
                          Allocations
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={resetTournament}
                          disabled={!selectedTournamentId || !!busy}
                          className="h-11"
                        >
                          {busy === "reset" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Reset
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {selectedTournament && (
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground p-3 bg-muted/20 rounded-md border border-dashed">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedTournament.start_date ? fmtDate(selectedTournament.start_date) : "Date TBD"}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedTournament.location || "Location TBD"}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div>
                      Status: <Badge variant="outline" className="ml-1 uppercase text-[10px] tracking-wider">{selectedTournament.status}</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Car Blocks - Moved here to appear right after Trip Configuration */}
            {selectedTournamentId && (
              <div className="grid gap-8">
                {cars.map((car) => {
                  const carParts = participantsByCar.get(car.id) ?? [];
                  const advancedOpen = !!carAdvancedOpen[car.id];

                  return (
                    <div key={car.id}>
                      <Card className="border-l-4 border-l-primary/60 overflow-hidden">
                        <div className="bg-muted/10 p-4 border-b flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <CarIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{car.car_label}</h3>
                              <p className="text-xs text-muted-foreground">
                                {carParts.length} occupant{carParts.length !== 1 && "s"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Label className="text-muted-foreground font-normal">Trip Distance:</Label>
                              <div className="relative w-32">
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={car.km_driven === 0 ? "" : (car.km_driven ?? "")}
                                  onFocus={(e) => e.target.select()}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") e.currentTarget.blur();
                                  }}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const v = val === "" ? 0 : Number(val);
                                    if (v < 0) return;
                                    // Optimistic update for immediate UI feedback
                                    setCars((prev) => prev.map((c) => c.id === car.id ? { ...c, km_driven: v } : c));
                                  }}
                                  onBlur={(e) => updateCar(car.id, { km_driven: Number(e.target.value) || 0 })}
                                  className="h-9 pr-12 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none">
                                  km
                                </span>
                              </div>
                            </div>

                            <Separator orientation="vertical" className="h-8 hidden md:block" />

                            <div className="flex items-center gap-2">
                              <Label className="text-muted-foreground font-normal">Driver:</Label>
                              <Select
                                value={car.driver_member_mem_number ?? "none"}
                                onValueChange={(val) =>
                                  updateCar(car.id, { driver_member_mem_number: val === "none" ? null : val })
                                }
                              >
                                <SelectTrigger className="w-[200px] h-9">
                                  <SelectValue placeholder="Select driver" />
                                </SelectTrigger>
                                <SelectContent position="popper" side="bottom" align="start" className="max-h-[200px]">
                                  <SelectItem value="none">No Driver Assigned</SelectItem>
                                  {carParts.map((p) => {
                                    const m = memberByMem.get(p.member_mem_number);
                                    return (
                                      <SelectItem key={p.id} value={p.member_mem_number}>
                                        {m?.name ?? p.member_mem_number}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setCarAdvancedOpen((prev) => ({ ...prev, [car.id]: !prev[car.id] }))
                              }
                              className={cn(
                                "gap-1 text-muted-foreground",
                                advancedOpen && "text-primary bg-primary/5"
                              )}
                            >
                              {advancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              Options
                            </Button>
                          </div>
                        </div>

                        {advancedOpen && (
                          <div className="px-6 py-4 bg-muted/20 border-b flex items-center gap-3 animate-in slide-in-from-top-2">
                            <Checkbox
                              id={`ignore-${car.id}`}
                              checked={car.ignore_mileage_invoicing}
                              onCheckedChange={(c) => updateCar(car.id, { ignore_mileage_invoicing: !!c })}
                            />
                            <Label htmlFor={`ignore-${car.id}`} className="font-normal cursor-pointer">
                              <strong>Exclude from Invoicing</strong>
                              <p className="text-xs text-muted-foreground">
                                Do not generate mileage invoices/credits for this car.
                              </p>
                            </Label>
                          </div>
                        )}

                        <div className="p-0">
                          <div className="border-b px-4 py-3 bg-muted/5 flex items-center relative">
                            <Search className="h-4 w-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                            <Input
                              className="pl-10 h-10 bg-transparent border-none focus-visible:ring-0 shadow-none placeholder:text-muted-foreground"
                              placeholder="Type name, member #, or email to add participant..."
                              value={carSearch[car.id] ?? ""}
                              ref={(el) => (searchInputRefs.current[car.id] = el as any)}
                              onChange={(e) =>
                                setCarSearch((prev) => ({ ...prev, [car.id]: e.target.value }))
                              }
                            />
                          </div>
                          {!!(carSearch[car.id] ?? "").trim() && (
                            <div className="max-h-48 overflow-y-auto border-b bg-white relative z-10 shadow-sm">
                              {topCarSearchResults(car.id).length === 0 ? (
                                <div className="p-3 text-sm text-muted-foreground text-center italic">
                                  No members found matching "{carSearch[car.id]}"
                                </div>
                              ) : (
                                topCarSearchResults(car.id).map((m) => (
                                  <button
                                    key={m.mem_number}
                                    className="w-full text-left px-4 py-2 hover:bg-muted/40 transition-colors flex items-center justify-between group"
                                    disabled={busy === `addP:${car.id}`}
                                    onClick={() => {
                                      addParticipant(car.id, m.mem_number);
                                      setCarSearch((prev) => ({ ...prev, [car.id]: "" }));
                                    }}
                                  >
                                    <div>
                                      <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                        {m.name}
                                      </div>
                                      <div className="text-xs text-muted-foreground">{m.email}</div>
                                    </div>
                                    <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                                  </button>
                                ))
                              )}
                            </div>
                          )}

                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                  <TableHead className="w-[250px]">Participant</TableHead>
                                  <TableHead className="w-[180px]">Role</TableHead>
                                  <TableHead className="text-center w-[100px]">Coach</TableHead>
                                  <TableHead className="text-center w-[100px]">Chaperone</TableHead>

                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {carParts.map((p) => {
                                  const m = memberByMem.get(p.member_mem_number);
                                  return (
                                    <TableRow key={p.id}>
                                      <TableCell className="font-medium">
                                        <div>
                                          {m?.name ?? p.member_mem_number}
                                          {p.member_mem_number === car.driver_member_mem_number && (
                                            <Badge variant="secondary" className="ml-2 text-[10px] h-5 px-1.5">Driver</Badge>
                                          )}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">{m?.email}</div>
                                      </TableCell>
                                      <TableCell>
                                        <Select
                                          value={p.category}
                                          onValueChange={(val) => updateParticipant(p.id, { category: val as any })}
                                        >
                                          <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent position="popper" side="bottom" align="start" className="max-h-[200px]">
                                            <SelectItem value="athlete_parent">Athlete / Parent</SelectItem>
                                            <SelectItem value="staff">Staff / Admin</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <Checkbox
                                          checked={p.is_coach}
                                          onCheckedChange={(c) => updateParticipant(p.id, { is_coach: !!c })}
                                        />
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <Checkbox
                                          checked={p.is_chaperone}
                                          onCheckedChange={(c) => updateParticipant(p.id, { is_chaperone: !!c })}
                                        />
                                      </TableCell>

                                      <TableCell className="text-right">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                          onClick={() => removeParticipant(p.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                                {!carParts.length && (
                                  <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                      <div className="flex flex-col items-center gap-2">
                                        <Users className="h-8 w-8 text-muted-foreground/30" />
                                        <p>No participants in this car yet.</p>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}

                {!cars.length && (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/10">
                    <CarIcon className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                    <h3 className="text-lg font-medium">No cars allocated</h3>
                    <p className="text-muted-foreground mb-4">Add a car to start organizing the trip logistics.</p>
                    <Button onClick={addCar} variant="outline" className="border-dashed">
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Car
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Results Preview - Moved to end with ref for auto-scroll */}
            <Card ref={resultsRef} className="shadow-lg border-opacity-50">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Results Preview
                </CardTitle>
                <CardDescription>
                  This shows what the allocation engine generated (invoices + line items). No math is recomputed here.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                {!selectedTournamentId ? (
                  <div className="text-sm text-muted-foreground">Select a tournament to view results.</div>
                ) : loadingResults ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading results…
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Financial Summary Dashboard */}
                    {invoiceRows.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-primary/5 border-primary/20">
                          <CardContent className="pt-4 px-4 pb-3">
                            <div className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">Trip Cost</div>
                            <div className="text-xl font-bold">${financialSummary.totalHotelCost.toFixed(2)}</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-green-500/5 border-green-500/20">
                          <CardContent className="pt-4 px-4 pb-3">
                            <div className="text-[10px] font-semibold text-green-600 uppercase tracking-wider mb-1">Invoiced</div>
                            <div className="text-xl font-bold text-green-600">${financialSummary.totalInvoiced.toFixed(2)}</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-blue-500/5 border-blue-500/20">
                          <CardContent className="pt-4 px-4 pb-3">
                            <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-1">TTSASK Covered</div>
                            <div className="text-xl font-bold text-blue-600">${financialSummary.totalCovered.toFixed(2)}</div>
                          </CardContent>
                        </Card>
                        <Card className={cn(
                          "border-opacity-30",
                          Math.abs(financialSummary.balance) > 0.05 ? "bg-amber-500/5 border-amber-500/20" : "bg-muted/30 border-muted"
                        )}>
                          <CardContent className="pt-4 px-4 pb-3">
                            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Unallocated</div>
                            <div className={cn(
                              "text-xl font-bold",
                              Math.abs(financialSummary.balance) > 0.05 ? "text-amber-600" : "text-muted-foreground"
                            )}>
                              ${financialSummary.balance.toFixed(2)}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {!invoiceRows.length ? (
                      <div className="p-8 text-center border border-dashed rounded-lg bg-muted/5">
                        <Calculator className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                        <p className="text-muted-foreground">No invoices yet. Click <strong>Allocations</strong> to compute.</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-3 mb-4">
                          <Badge variant="outline" className="text-xs">
                            Invoices: {invoiceRows.length}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Total Invoiced: $
                            {round2(invoiceRows.reduce((s, r) => s + r.total, 0)).toFixed(2)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Hotel Invoiced: $
                            {round2(invoiceRows.reduce((s, r) => s + r.hotel, 0)).toFixed(2)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Mileage Invoiced: $
                            {round2(invoiceRows.reduce((s, r) => s + r.mileage, 0)).toFixed(2)}
                          </Badge>

                          <div className="ml-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadResults(selectedTournamentId)}
                              disabled={loadingResults}
                            >
                              {loadingResults ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                              Refresh
                            </Button>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Person</TableHead>
                                <TableHead className="text-right">Hotel</TableHead>
                                <TableHead className="text-right">Mileage</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {invoiceRows.map((r) => (
                                <TableRow key={r.invoice_id}>
                                  <TableCell className="font-medium">
                                    <div>{r.name}</div>
                                    <div className="text-xs text-muted-foreground">{r.email}</div>
                                    <div className="mt-2 text-xs text-muted-foreground space-y-1">
                                      {r.items.map((it, idx) => (
                                        <div key={idx} className="flex justify-between gap-3">
                                          <span className="truncate">{it.description}</span>
                                          <span className="tabular-nums">${round2(it.amount).toFixed(2)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right tabular-nums">${r.hotel.toFixed(2)}</TableCell>
                                  <TableCell className="text-right tabular-nums">${r.mileage.toFixed(2)}</TableCell>
                                  <TableCell className="text-right font-semibold tabular-nums">
                                    ${r.total.toFixed(2)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleGenerateInvoice(r.invoice_id, r.member_mem_number)}
                                      disabled={busyInvoice[r.invoice_id]}
                                      className="h-8 gap-1.5"
                                    >
                                      {busyInvoice[r.invoice_id] ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                      ) : (
                                        <FileText className="h-3.5 w-3.5" />
                                      )}
                                      Invoice
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-opacity-50">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-6">TTSASK Covered</Badge>
                  <span className="text-base font-semibold">Staff / Coach / Chaperone Costs</span>
                </CardTitle>
                <CardDescription>
                  These are allocation lines that are *not invoiced to athletes/parents* (for transparency + audit).
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                {!selectedTournamentId ? (
                  <div className="text-sm text-muted-foreground">Select a tournament to view coverage.</div>
                ) : loadingAlloc ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading coverage…
                  </div>
                ) : !staffCoveredRows.length ? (
                  <div className="text-sm text-muted-foreground">
                    No staff-covered lines found (run <strong>Allocations</strong> first).
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <Badge variant="outline" className="text-xs">
                        Lines: {staffCoveredRows.length}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Total Covered: ${staffCoveredTotal.toFixed(2)}
                      </Badge>

                      <div className="ml-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadAllocationLines(selectedTournamentId)}
                          disabled={loadingAlloc}
                        >
                          {loadingAlloc ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Refresh
                        </Button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Person</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Context</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {staffCoveredRows.map((r) => (
                            <TableRow key={r.id}>
                              <TableCell className="font-medium">
                                <div>{r.name}</div>
                                <div className="text-xs text-muted-foreground">{r.email}</div>
                              </TableCell>
                              <TableCell className="text-sm">
                                <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                                  {r.line_type.replace(/_/g, " ")}
                                </Badge>
                                <div className="text-xs text-muted-foreground mt-1">{r.note}</div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {r.car_label}
                              </TableCell>
                              <TableCell className="text-right tabular-nums font-semibold">
                                ${round2(r.amount).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout >
  );
}