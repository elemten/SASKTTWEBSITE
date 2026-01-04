import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

type ExpenseType = "coaching" | "mileage" | "hotel" | "other";

type CoachingDetails = {
    dates: Array<{ date: string; hours: number }>;
    rate: number | undefined;
    notes: string | undefined;
};

type MileageDetails = {
    date: string;
    kms: number;
    from: string | undefined;
    to: string | undefined;
    ratePerKm: number | undefined;
};

type HotelDetails = {
    checkIn: string;
    checkOut: string;
    city: string | undefined;
    hotelName: string | undefined;
    roomRate: number | undefined;
    taxes: number | undefined;
};

type OtherDetails = {
    date: string;
    description: string;
    amount: number;
};

type CommonFields = {
    claimantName: string;
    claimantEmail: string;
    program: string | undefined;
};

type ClaimPayload =
    | { type: "coaching"; common: CommonFields; details: CoachingDetails }
    | { type: "mileage"; common: CommonFields; details: MileageDetails }
    | { type: "hotel"; common: CommonFields; details: HotelDetails }
    | { type: "other"; common: CommonFields; details: OtherDetails };

function toNumber(v: string) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

export default function ExpenseClaimDynamicForm() {
    const [type, setType] = useState<ExpenseType>("coaching");

    // common fields
    const [common, setCommon] = useState<CommonFields>({
        claimantName: "",
        claimantEmail: "",
        program: "",
    });

    // coaching
    const [coachingDates, setCoachingDates] = useState<
        Array<{ date: string; hours: number }>
    >([{ date: "", hours: 0 }]);
    const [coachingRate, setCoachingRate] = useState<string>("");
    const [coachingNotes, setCoachingNotes] = useState<string>("");

    // mileage
    const [mileageDate, setMileageDate] = useState<string>("");
    const [mileageKms, setMileageKms] = useState<string>("");
    const [mileageFrom, setMileageFrom] = useState<string>("");
    const [mileageTo, setMileageTo] = useState<string>("");
    const [mileageRate, setMileageRate] = useState<string>("");

    // hotel
    const [checkIn, setCheckIn] = useState<string>("");
    const [checkOut, setCheckOut] = useState<string>("");
    const [hotelCity, setHotelCity] = useState<string>("");
    const [hotelName, setHotelName] = useState<string>("");
    const [roomRate, setRoomRate] = useState<string>("");
    const [taxes, setTaxes] = useState<string>("");

    // other
    const [otherDate, setOtherDate] = useState<string>("");
    const [otherDesc, setOtherDesc] = useState<string>("");
    const [otherAmount, setOtherAmount] = useState<string>("");

    const coachingTotalHours = useMemo(() => {
        return coachingDates.reduce((sum, r) => sum + (Number(r.hours) || 0), 0);
    }, [coachingDates]);

    const mileageEstimated = useMemo(() => {
        const kms = toNumber(mileageKms);
        const rate = mileageRate ? toNumber(mileageRate) : 0;
        return kms * rate;
    }, [mileageKms, mileageRate]);

    const hotelEstimated = useMemo(() => {
        const rr = roomRate ? toNumber(roomRate) : 0;
        const tx = taxes ? toNumber(taxes) : 0;
        return rr + tx;
    }, [roomRate, taxes]);

    function buildPayload(): ClaimPayload {
        if (type === "coaching") {
            return {
                type,
                common,
                details: {
                    dates: coachingDates
                        .filter((r) => r.date)
                        .map((r) => ({ date: r.date, hours: Number(r.hours) || 0 })),
                    rate: coachingRate ? toNumber(coachingRate) : undefined,
                    notes: coachingNotes || undefined,
                },
            };
        }
        if (type === "mileage") {
            return {
                type,
                common,
                details: {
                    date: mileageDate,
                    kms: toNumber(mileageKms),
                    from: mileageFrom || undefined,
                    to: mileageTo || undefined,
                    ratePerKm: mileageRate ? toNumber(mileageRate) : undefined,
                },
            };
        }
        if (type === "hotel") {
            return {
                type,
                common,
                details: {
                    checkIn,
                    checkOut,
                    city: hotelCity || undefined,
                    hotelName: hotelName || undefined,
                    roomRate: roomRate ? toNumber(roomRate) : undefined,
                    taxes: taxes ? toNumber(taxes) : undefined,
                },
            };
        }
        return {
            type: "other",
            common,
            details: {
                date: otherDate,
                description: otherDesc,
                amount: toNumber(otherAmount),
            },
        };
    }

    function validate(payload: ClaimPayload): string[] {
        const errors: string[] = [];

        if (!payload.common.claimantName.trim()) errors.push("Claimant name is required.");
        if (!payload.common.claimantEmail.trim()) errors.push("Claimant email is required.");

        if (payload.type === "coaching") {
            const validRows = payload.details.dates.filter((r) => r.date);
            if (validRows.length === 0) errors.push("Add at least one coaching date.");
            if (validRows.some((r) => r.hours <= 0)) errors.push("Coaching hours must be > 0.");
        }

        if (payload.type === "mileage") {
            if (!payload.details.date) errors.push("Mileage date is required.");
            if (payload.details.kms <= 0) errors.push("KMs must be > 0.");
        }

        if (payload.type === "hotel") {
            if (!payload.details.checkIn) errors.push("Check-in date is required.");
            if (!payload.details.checkOut) errors.push("Check-out date is required.");
        }

        if (payload.type === "other") {
            if (!payload.details.date) errors.push("Date is required.");
            if (!payload.details.description.trim()) errors.push("Description is required.");
            if (payload.details.amount <= 0) errors.push("Amount must be > 0.");
        }

        return errors;
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = buildPayload();
        const errors = validate(payload);

        if (errors.length) {
            errors.forEach(err => toast.error(err));
            return;
        }

        console.log("CLAIM PAYLOAD:", payload);
        toast.success("Expense claim submitted! Check console for payload.");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Expense Claim</h2>
                    <p className="text-muted-foreground">Submit individual expense claims safely</p>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Claimant Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="claimantName">Name</Label>
                                <Input
                                    id="claimantName"
                                    value={common.claimantName}
                                    onChange={(e) => setCommon((c) => ({ ...c, claimantName: e.target.value }))}
                                    placeholder="e.g., Huzaifa Ishaq"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="claimantEmail">Email</Label>
                                <Input
                                    id="claimantEmail"
                                    type="email"
                                    value={common.claimantEmail}
                                    onChange={(e) => setCommon((c) => ({ ...c, claimantEmail: e.target.value }))}
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="program">Program (optional)</Label>
                                <Input
                                    id="program"
                                    value={common.program}
                                    onChange={(e) => setCommon((c) => ({ ...c, program: e.target.value }))}
                                    placeholder="e.g., SPED"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-lg">Expense Details</CardTitle>
                        <div className="w-[180px]">
                            <Select
                                value={type}
                                onValueChange={(v) => setType(v as ExpenseType)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="coaching">Coaching</SelectItem>
                                    <SelectItem value="mileage">Mileage</SelectItem>
                                    <SelectItem value="hotel">Hotel</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-2">
                            {type === "coaching" && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground">
                                            Total coaching hours: <span className="font-bold text-foreground">{coachingTotalHours}</span>
                                        </p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCoachingDates((rows) => [...rows, { date: "", hours: 0 }])}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Date
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {coachingDates.map((row, idx) => (
                                            <div key={idx} className="flex gap-3 items-end">
                                                <div className="flex-1 space-y-2">
                                                    <Label>Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={row.date}
                                                        onChange={(e) => {
                                                            const v = e.target.value;
                                                            setCoachingDates((rows) =>
                                                                rows.map((r, i) => (i === idx ? { ...r, date: v } : r))
                                                            );
                                                        }}
                                                    />
                                                </div>

                                                <div className="w-[120px] space-y-2">
                                                    <Label>Hours</Label>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        step={0.25}
                                                        value={row.hours}
                                                        onChange={(e) => {
                                                            const v = toNumber(e.target.value);
                                                            setCoachingDates((rows) =>
                                                                rows.map((r, i) => (i === idx ? { ...r, hours: v } : r))
                                                            );
                                                        }}
                                                    />
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() =>
                                                        setCoachingDates((rows) =>
                                                            rows.length === 1 ? rows : rows.filter((_, i) => i !== idx)
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Rate (optional)</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                step={0.01}
                                                value={coachingRate}
                                                onChange={(e) => setCoachingRate(e.target.value)}
                                                placeholder="e.g., 35.00"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Notes (optional)</Label>
                                            <Input
                                                value={coachingNotes}
                                                onChange={(e) => setCoachingNotes(e.target.value)}
                                                placeholder="e.g., SPED clinic coaching"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {type === "mileage" && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Input
                                            type="date"
                                            value={mileageDate}
                                            onChange={(e) => setMileageDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>KMs</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            step={0.1}
                                            value={mileageKms}
                                            onChange={(e) => setMileageKms(e.target.value)}
                                            placeholder="e.g., 120"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>From (optional)</Label>
                                        <Input
                                            value={mileageFrom}
                                            onChange={(e) => setMileageFrom(e.target.value)}
                                            placeholder="e.g., Saskatoon"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>To (optional)</Label>
                                        <Input
                                            value={mileageTo}
                                            onChange={(e) => setMileageTo(e.target.value)}
                                            placeholder="e.g., Regina"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Rate per KM (optional)</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            step={0.001}
                                            value={mileageRate}
                                            onChange={(e) => setMileageRate(e.target.value)}
                                            placeholder="e.g., 0.55"
                                        />
                                    </div>

                                    <div className="flex items-end pb-2">
                                        <p className="text-sm text-muted-foreground">
                                            Estimated: <span className="font-bold text-foreground">
                                                ${Number.isFinite(mileageEstimated) ? mileageEstimated.toFixed(2) : "0.00"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {type === "hotel" && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Check-in</Label>
                                        <Input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Check-out</Label>
                                        <Input
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>City (optional)</Label>
                                        <Input
                                            value={hotelCity}
                                            onChange={(e) => setHotelCity(e.target.value)}
                                            placeholder="e.g., Regina"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Hotel name (optional)</Label>
                                        <Input
                                            value={hotelName}
                                            onChange={(e) => setHotelName(e.target.value)}
                                            placeholder="e.g., Delta Hotels"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Room total (optional)</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            value={roomRate}
                                            onChange={(e) => setRoomRate(e.target.value)}
                                            placeholder="e.g., 260.00"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Taxes/fees (optional)</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            value={taxes}
                                            onChange={(e) => setTaxes(e.target.value)}
                                            placeholder="e.g., 32.50"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <p className="text-sm text-muted-foreground">
                                            Estimated: <span className="font-bold text-foreground">
                                                ${Number.isFinite(hotelEstimated) ? hotelEstimated.toFixed(2) : "0.00"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {type === "other" && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Input
                                            type="date"
                                            value={otherDate}
                                            onChange={(e) => setOtherDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Amount</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            value={otherAmount}
                                            onChange={(e) => setOtherAmount(e.target.value)}
                                            placeholder="e.g., 45.00"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Label>Description</Label>
                                        <Input
                                            value={otherDesc}
                                            onChange={(e) => setOtherDesc(e.target.value)}
                                            placeholder="e.g., supplies for coaching session"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" size="lg">
                        Submit Claim
                    </Button>
                </div>
            </form>
        </div>
    );
}
