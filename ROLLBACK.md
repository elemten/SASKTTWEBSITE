# Performance Optimizations Rollback Guide

This document explains how to revert the performance optimizations implemented to eliminate chunk size warnings and improve performance.

## Quick Rollback (Disable All Optimizations)

Set environment variable to disable optimizations:
```bash
# Windows
set DISABLE_PERF_OPTIMIZATIONS=true

# macOS/Linux
export DISABLE_PERF_OPTIMIZATIONS=true
```

## Individual Rollbacks

### 1. Vite Configuration Changes

**File:** `vite.config.ts`

**Changes Made:**
- Added `splitVendorChunkPlugin()`
- Enhanced `manualChunks` configuration
- Added performance budgets
- Set build target to `es2019`

**Rollback:**
```typescript
// Remove splitVendorChunkPlugin import and usage
import { splitVendorChunkPlugin } from "vite"; // DELETE THIS LINE

// Remove from plugins array
splitVendorChunkPlugin(), // DELETE THIS LINE

// Restore original manualChunks
manualChunks: {
  vendor: ['react', 'react-dom'],
  ui: ['@radix-ui/react-slot', '@radix-ui/react-toast'],
  animations: ['framer-motion'],
}

// Remove performance budgets
chunkSizeWarningLimit: 500, // DELETE THIS LINE
target: "es2019", // DELETE THIS LINE
```

### 2. Admin Component Dynamic Imports

**File:** `src/pages/Admin.tsx`

**Changes Made:**
- Converted admin components to lazy imports
- Added Suspense fallback
- Added error boundary wrapper

**Rollback:**
```typescript
// Restore direct imports
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { MembersManagement } from "@/components/admin/MembersManagement";
import { ClubsManagement } from "@/components/admin/ClubsManagement";
import { InvoicesPayments } from "@/components/admin/InvoicesPayments";
import { EventsRentals } from "@/components/admin/EventsRentals";
import { ExpensesReimbursements } from "@/components/admin/ExpensesReimbursements";
import { Reports } from "@/components/admin/Reports";
import { AdminsLogs } from "@/components/admin/AdminsLogs";

// Remove lazy imports and Suspense
// Remove AdminContentFallback component
// Remove Suspense wrapper around renderContent()
```

### 3. Dashboard Charts Dynamic Imports

**File:** `src/components/admin/DashboardOverview.tsx`

**Changes Made:**
- Converted recharts components to lazy imports
- Added Suspense fallbacks for charts
- Added ChartFallback component

**Rollback:**
```typescript
// Restore direct recharts imports
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Remove lazy imports
// Remove ChartFallback component
// Remove Suspense wrappers around charts
```

### 4. App.tsx Error Boundary

**File:** `src/App.tsx`

**Changes Made:**
- Added ErrorBoundary class component
- Wrapped routes with error boundary

**Rollback:**
```typescript
// Remove ErrorBoundary class
// Remove error boundary wrapper around Suspense
// Restore original structure
```

### 5. Navigation Image Optimization

**File:** `src/components/ui/navigation.tsx`

**Changes Made:**
- Added explicit width/height attributes
- Added loading="eager" and fetchPriority="high"
- Changed class from "h-12 w-auto" to "h-12 w-12"

**Rollback:**
```typescript
// Restore original image attributes
<img 
  src={logo} 
  alt="Table Tennis Saskatchewan" 
  className="h-12 w-auto"
  // Remove: width="48", height="48", loading="eager", fetchPriority="high"
/>
```

## Performance Impact of Rollback

**Before Optimizations:**
- Admin chunk: ~574 kB (151 kB gzip)
- Main index chunk: ~150 kB (49 kB gzip)
- Chunk size warnings: Present

**After Rollback:**
- Admin chunk: ~574 kB (151 kB gzip) - Back to original size
- Main index chunk: ~150 kB (49 kB gzip) - Back to original size
- Chunk size warnings: Will reappear

## Alternative: Selective Rollback

If you want to keep some optimizations:

1. **Keep chunk splitting, remove dynamic imports:**
   - Keep `vite.config.ts` changes
   - Rollback Admin component changes
   - Rollback Dashboard chart changes

2. **Keep dynamic imports, remove chunk splitting:**
   - Rollback `vite.config.ts` changes
   - Keep Admin component changes
   - Keep Dashboard chart changes

## Verification Commands

After rollback, verify the changes:
```bash
# Build to check for warnings
npm run build

# Check bundle sizes
ls -la dist/assets/

# Test functionality
npm run dev
```

## Notes

- Rolling back will restore the original bundle sizes and warnings
- All functionality will remain intact
- HMR and development experience will be unchanged
- Performance will return to pre-optimization levels
