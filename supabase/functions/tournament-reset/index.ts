// supabase/functions/tournament-reset/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
        const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
        const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

        // Auth check (user must be logged in)
        const userClient = createClient(SUPABASE_URL, ANON_KEY, {
            global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
        });

        const { data: userData, error: userErr } = await userClient.auth.getUser();
        if (userErr || !userData?.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // TODO: enforce admin here (recommended)
        // If not admin, return 403.

        const body = await req.json().catch(() => ({}));
        const tournament_id = String(body?.tournament_id ?? "").trim();
        if (!tournament_id) {
            return new Response(JSON.stringify({ error: "Missing tournament_id" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

        // ---- A) invoices (items -> invoices) ----
        const { data: invs, error: invErr } = await admin
            .from("tournament_invoices")
            .select("id")
            .eq("tournament_id", tournament_id);

        if (invErr) throw invErr;

        const invoiceIds = (invs ?? []).map((x) => x.id);

        if (invoiceIds.length) {
            const { error: delItemsErr } = await admin
                .from("tournament_invoice_items")
                .delete()
                .in("invoice_id", invoiceIds);
            if (delItemsErr) throw delItemsErr;
        }

        const { error: delInvErr } = await admin
            .from("tournament_invoices")
            .delete()
            .eq("tournament_id", tournament_id);
        if (delInvErr) throw delInvErr;

        // ---- B) allocations (lines -> headers) ----
        const { error: delLinesErr } = await admin
            .from("tournament_allocation_lines")
            .delete()
            .eq("tournament_id", tournament_id);
        if (delLinesErr) throw delLinesErr;

        const { error: delAllocErr } = await admin
            .from("tournament_allocations")
            .delete()
            .eq("tournament_id", tournament_id);
        if (delAllocErr) throw delAllocErr;

        // ---- C) cars + participants (participants -> cars) ----
        const { data: cars, error: carsErr } = await admin
            .from("tournament_cars")
            .select("id")
            .eq("tournament_id", tournament_id);

        if (carsErr) throw carsErr;

        const carIds = (cars ?? []).map((c) => c.id);

        if (carIds.length) {
            const { error: delPartsErr } = await admin
                .from("tournament_car_participants")
                .delete()
                .in("car_id", carIds);
            if (delPartsErr) throw delPartsErr;
        }

        const { error: delCarsErr } = await admin
            .from("tournament_cars")
            .delete()
            .eq("tournament_id", tournament_id);
        if (delCarsErr) throw delCarsErr;

        // ---- D) reset tournament fields/status (optional) ----
        const { error: updErr } = await admin
            .from("tournaments")
            .update({
                status: "draft",
                hotel_total: 0, // optional - remove if you want to keep it
            })
            .eq("id", tournament_id);
        if (updErr) throw updErr;

        return new Response(
            JSON.stringify({
                ok: true,
                tournament_id,
                deleted: {
                    invoices: invoiceIds.length,
                    cars: carIds.length,
                },
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e?.message ?? String(e) }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
