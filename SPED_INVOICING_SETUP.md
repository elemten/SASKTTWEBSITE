# SPED Invoicing Setup Guide

This document outlines the implementation of the SPED invoicing system for the Finance admin page.

## Components Implemented

### 1. SQL RPC Function
**File:** `get-sped-invoice-headers-rpc.sql`

This function groups SPED bookings by school system and school name for a given month.

**To deploy:**
1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Run the contents of `get-sped-invoice-headers-rpc.sql`

**Function signature:**
```sql
get_sped_invoice_headers(month_start date)
RETURNS TABLE (
  school_system text,
  school_name text,
  booking_count bigint,
  total_cost numeric
)
```

### 2. Finance Page UI
**File:** `src/pages/admin/Finance.tsx`

Features:
- Month selector (last 12 months)
- "Load Invoices" button
- Two separate tables:
  - Catholic Schools
  - Saskatoon Public Schools
- Download PDF button for each school

### 3. Edge Function
**File:** `supabase/functions/sped-invoice-pdf/index.ts`

Generates PDF invoices using `pdf-lib`.

**To deploy:**
```bash
supabase functions deploy sped-invoice-pdf
```

**Function expects:**
```typescript
{
  monthStart: "YYYY-MM-DD",
  schoolSystem: "Catholic" | "Saskatoon Public",
  schoolName: string
}
```

**Returns:**
```typescript
{
  pdf: string // base64 encoded PDF
}
```

### 4. Invoice Number Format

Format: `YYYY-MM-{SYS}-{SCHOOL_SLUG}`

Examples:
- `2025-10-CATH-HOLY-CROSS`
- `2025-10-PUB-ADEN-BOWMAN-COLLEGIATE`

Where:
- `CATH` = Catholic
- `PUB` = Saskatoon Public
- `OTHER` = Other school systems

### 5. PDF Invoice Contents

- **Header:** Table Tennis Saskatchewan + info@ttsask.ca
- **Invoice Number:** Generated slug format
- **Invoice Date:** Today's date
- **Invoice Period:** Selected month (e.g., "October 2025")
- **Bill To:** School name only
- **Line Items:** Each booking with:
  - Date
  - Teacher name
  - Time (start-end)
  - Minutes
  - Cost
- **Total:** Sum of all booking costs
- **Payment Instructions:** E-transfer details with invoice number

## Usage

1. Navigate to `/admin/finance`
2. Select a month from the dropdown
3. Click "Load Invoices"
4. Review the grouped invoices by school system
5. Click "Download PDF" for any school to generate and download the invoice

## Notes

- Only bookings with status `'confirmed'` or `'completed'` are included
- Invoice totals use `total_cost` from the database (already computed)
- PDFs are generated on-demand via the Edge Function
- Invoice numbers are deterministic and readable

