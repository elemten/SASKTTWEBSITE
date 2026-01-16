
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Loader2, Lock, Unlock, Calendar as CalendarIcon, AlertCircle, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";

interface Slot {
    time: string;
    display: string;
    available: boolean;
    duration?: number;
    status: "available" | "booked" | "pending" | "confirmed" | "blocked";
    bookingId?: string;
}

export default function SPEDAvailability() {
    const [date, setDate] = useState<Date>(new Date());
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null); // time of slot being processed
    const [blockReason, setBlockReason] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Fetch slots when date changes
    useEffect(() => {
        fetchSlots();
    }, [date]);

    const fetchSlots = async () => {
        setLoading(true);
        setError(null);
        try {
            const dateStr = format(date, "yyyy-MM-dd");
            const { data, error } = await supabase.functions.invoke("google-calendar-function", {
                body: { action: "getSlots", date: dateStr },
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.error);

            setSlots(data.slots);
        } catch (err: any) {
            console.error("Error fetching slots:", err);
            setError(err.message || "Failed to load slots");
        } finally {
            setLoading(false);
        }
    };

    const handleBlock = async (slot: Slot) => {
        setProcessing(slot.time);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error("You must be logged in");
            }

            const dateStr = format(date, "yyyy-MM-dd");

            const payload = {
                action: "blockSlot",
                booking: {
                    booking_date: dateStr,
                    booking_time_start: `${slot.time}:00`,
                    booking_time_end: getEndTime(slot.time, slot.duration),
                    blocked_reason: blockReason || "Admin Blocked",
                }
            };

            const { data, error } = await supabase.functions.invoke("google-calendar-function", {
                body: payload,
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.error);

            // Refresh
            await fetchSlots();
            setBlockReason("");
        } catch (err: any) {
            console.error("Block error:", err);
            setError(err.message || "Failed to block slot");
        } finally {
            setProcessing(null);
        }
    };

    const handleUnblock = async (slot: Slot) => {
        if (slot.status !== "blocked") return;

        setProcessing(slot.time);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error("You must be logged in");
            }

            const dateStr = format(date, "yyyy-MM-dd");

            const payload = {
                action: "unblockSlot",
                booking: {
                    booking_date: dateStr,
                    booking_time_start: `${slot.time}:00`
                }
            };

            const { data, error } = await supabase.functions.invoke("google-calendar-function", {
                body: payload,
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.error);

            await fetchSlots();
        } catch (err: any) {
            console.error("Unblock error:", err);
            setError(err.message || "Failed to unblock slot");
        } finally {
            setProcessing(null);
        }
    };

    const handleDelete = async (slot: Slot) => {
        if (!slot.bookingId) return;
        if (!confirm("Are you sure you want to delete this booking? This will remove it from the database and cancel the Google Calendar event.")) return;

        setProcessing(slot.time);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error("You must be logged in");
            }

            const payload = {
                action: "deleteBooking",
                bookingId: slot.bookingId
            };

            const { data, error } = await supabase.functions.invoke("google-calendar-function", {
                body: payload,
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.error);

            await fetchSlots();
        } catch (err: any) {
            console.error("Delete error:", err);
            setError(err.message || "Failed to delete booking");
        } finally {
            setProcessing(null);
        }
    };

    const getEndTime = (startHHMM: string, duration = 60) => {
        const [h, m] = startHHMM.split(":").map(Number);
        const total = h * 60 + m + duration;
        const eh = Math.floor(total / 60);
        const em = total % 60;
        return `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}:00`;
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Availability</h1>
                    <p className="text-gray-500">Block or unblock SPED time slots.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Calendar Sidebar */}
                    <Card className="md:col-span-4 lg:col-span-3 h-fit">
                        <CardContent className="p-4">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => d && setDate(d)}
                                className="rounded-md border shadow-sm w-full"
                                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                            />
                        </CardContent>
                    </Card>

                    {/* Slots List */}
                    <Card className="md:col-span-8 lg:col-span-9">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-gray-500" />
                                Slots for {format(date, "MMMM d, yyyy")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                                </div>
                            ) : slots.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    No slots configured for this day (likely weekend or holiday).
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex gap-2 items-center mb-4">
                                        <Label className="text-sm text-gray-600">Optional Reason for Blocking:</Label>
                                        <Input
                                            placeholder="e.g. Maintenance, Holiday"
                                            value={blockReason}
                                            onChange={(e) => setBlockReason(e.target.value)}
                                            className="max-w-xs h-8 text-sm"
                                        />
                                    </div>

                                    <div className="grid gap-3">
                                        {slots.map((slot) => {
                                            const isProcessing = processing === slot.time;
                                            const isBlocked = slot.status === 'blocked';
                                            const isBooked = !slot.available && !isBlocked;

                                            return (
                                                <motion.div
                                                    key={slot.time}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`
                                flex items-center justify-between p-4 rounded-lg border 
                                ${isBlocked ? 'bg-gray-100 border-gray-200' :
                                                            isBooked ? 'bg-green-50 border-green-200 opacity-60' : 'bg-white hover:border-green-300'}
                            `}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="font-medium text-lg font-mono text-gray-700">{slot.time}</div>
                                                        <div className="text-sm text-gray-500">{slot.display}</div>

                                                        {isBlocked && (
                                                            <Badge variant="secondary" className="bg-gray-200 text-gray-700">Blocked</Badge>
                                                        )}
                                                        {isBooked && (
                                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Booked</Badge>
                                                        )}
                                                        {slot.available && (
                                                            <Badge variant="outline" className="text-green-600 border-green-200">Available</Badge>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {slot.available && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleBlock(slot)}
                                                                disabled={!!processing}
                                                                className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                                                            >
                                                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4 mr-1" />}
                                                                Block
                                                            </Button>
                                                        )}

                                                        {isBlocked && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleUnblock(slot)}
                                                                disabled={!!processing}
                                                                className="text-gray-600 hover:text-gray-900 border-gray-200"
                                                            >
                                                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4 mr-1" />}
                                                                Unblock
                                                            </Button>
                                                        )}

                                                        {isBooked && (
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleDelete(slot)}
                                                                disabled={!!processing || !slot.bookingId}
                                                                className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                                            >
                                                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
                                                                Delete Booking
                                                            </Button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
