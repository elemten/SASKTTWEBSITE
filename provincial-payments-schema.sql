-- =====================================================
-- PROVINCIAL MEMBERSHIP PAYMENTS DATABASE SCHEMA
-- =====================================================
-- This file creates the necessary tables and functions to track
-- provincial membership payments via Stripe integration.

-- 1. CREATE PROVINCIAL PAYMENTS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS provincial_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL, -- Changed to VARCHAR to match mem_number
    
    -- Stripe payment details
    stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_session_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    
    -- Payment information
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 10.00,
    currency VARCHAR(3) DEFAULT 'CAD',
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded, canceled
    
    -- Membership period (September 1 - August 31)
    membership_year INTEGER NOT NULL, -- 2025 means Sept 2025 - Aug 2026
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    
    -- Payment metadata
    payment_method VARCHAR(50), -- card, bank_transfer, etc
    receipt_url TEXT,
    invoice_url TEXT,
    stripe_receipt_url TEXT,
    
    -- Additional tracking
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    
    -- Timestamps
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    
    -- Note: Foreign key constraint will be added separately after all_members table is updated
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_provincial_payments_member_id ON provincial_payments(member_id);
CREATE INDEX IF NOT EXISTS idx_provincial_payments_stripe_payment_intent ON provincial_payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_provincial_payments_membership_year ON provincial_payments(membership_year);
CREATE INDEX IF NOT EXISTS idx_provincial_payments_status ON provincial_payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_provincial_payments_valid_period ON provincial_payments(valid_from, valid_until);

-- 2. UPDATE ALL_MEMBERS TABLE
-- ===========================
-- First, drop any dependent foreign key constraints
ALTER TABLE training_members_list DROP CONSTRAINT IF EXISTS training_members_list_member_id_fkey;

-- Remove people_index column from all_members table
ALTER TABLE all_members DROP COLUMN IF EXISTS people_index;

-- Make mem_number the primary key
ALTER TABLE all_members DROP CONSTRAINT IF EXISTS all_members_pkey CASCADE;
ALTER TABLE all_members ADD CONSTRAINT all_members_pkey PRIMARY KEY (mem_number);

-- Recreate the foreign key constraint for training_members_list
-- Note: We need to make sure the data types match
-- If training_members_list.member_id is UUID and mem_number is TEXT, we need to cast or change types
-- For now, let's skip this constraint and handle it separately if needed
-- ALTER TABLE training_members_list 
-- ADD CONSTRAINT training_members_list_member_id_fkey 
-- FOREIGN KEY (member_id) REFERENCES all_members(mem_number) ON DELETE CASCADE;

-- Add computed fields for membership status tracking
ALTER TABLE all_members 
ADD COLUMN IF NOT EXISTS current_membership_status VARCHAR(20) DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS last_payment_date DATE,
ADD COLUMN IF NOT EXISTS membership_expires_at DATE;

-- Create index for membership status queries
CREATE INDEX IF NOT EXISTS idx_all_members_membership_status ON all_members(current_membership_status);
CREATE INDEX IF NOT EXISTS idx_all_members_expires_at ON all_members(membership_expires_at);

-- Add foreign key constraint now that mem_number is the primary key
ALTER TABLE provincial_payments 
DROP CONSTRAINT IF EXISTS fk_member_id;

ALTER TABLE provincial_payments 
ADD CONSTRAINT fk_member_id 
FOREIGN KEY (member_id) REFERENCES all_members(mem_number) ON DELETE CASCADE;

-- 3. HELPER FUNCTIONS
-- ===================

-- Function to get current membership year
CREATE OR REPLACE FUNCTION get_current_membership_year()
RETURNS INTEGER AS $$
DECLARE
    current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
    current_month INTEGER := EXTRACT(MONTH FROM CURRENT_DATE);
BEGIN
    -- Membership year runs Sept 1 - Aug 31
    -- Sept-Dec = current calendar year
    -- Jan-Aug = previous calendar year
    IF current_month >= 9 THEN
        RETURN current_year;
    ELSE
        RETURN current_year - 1;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to check if member has valid provincial membership
CREATE OR REPLACE FUNCTION has_current_provincial_membership(member_number VARCHAR(50))
RETURNS BOOLEAN AS $$
DECLARE
    membership_year INTEGER := get_current_membership_year();
    payment_exists BOOLEAN;
BEGIN
    -- Check if there's a completed payment for this membership year
    SELECT EXISTS(
        SELECT 1 FROM provincial_payments 
        WHERE member_id = member_number 
        AND membership_year = membership_year 
        AND payment_status = 'completed'
        AND valid_until >= CURRENT_DATE
    ) INTO payment_exists;
    
    RETURN payment_exists;
END;
$$ LANGUAGE plpgsql;

-- Function to get membership period dates for a given year
CREATE OR REPLACE FUNCTION get_membership_period(year INTEGER)
RETURNS TABLE(valid_from DATE, valid_until DATE) AS $$
BEGIN
    RETURN QUERY SELECT 
        (year || '-09-01')::DATE as valid_from,
        ((year + 1) || '-08-31')::DATE as valid_until;
END;
$$ LANGUAGE plpgsql;

-- 4. TRIGGERS FOR AUTO-UPDATING MEMBER STATUS
-- ============================================

-- Trigger function to update member status after payment
CREATE OR REPLACE FUNCTION update_member_status_after_payment()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update if payment is completed
    IF NEW.payment_status = 'completed' AND (OLD IS NULL OR OLD.payment_status != 'completed') THEN
        UPDATE all_members 
        SET 
            provincial_paid_year = NEW.membership_year,
            is_active_member = true,
            current_membership_status = 'active',
            last_payment_date = NEW.paid_at::DATE,
            membership_expires_at = NEW.valid_until,
            updated_at = NOW()
        WHERE mem_number = NEW.member_id;
        
        -- Log the update
        RAISE NOTICE 'Updated member % status to active for membership year %', NEW.member_id, NEW.membership_year;
    END IF;
    
    -- Handle failed/canceled payments
    IF NEW.payment_status IN ('failed', 'canceled', 'refunded') THEN
        -- Only update to inactive if this was their only active payment
        IF NOT has_current_provincial_membership(NEW.member_id) THEN
            UPDATE all_members 
            SET 
                current_membership_status = 'inactive',
                updated_at = NOW()
            WHERE mem_number = NEW.member_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_member_status ON provincial_payments;
CREATE TRIGGER trigger_update_member_status
    AFTER INSERT OR UPDATE ON provincial_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_member_status_after_payment();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_provincial_payments_updated_at ON provincial_payments;
CREATE TRIGGER trigger_provincial_payments_updated_at
    BEFORE UPDATE ON provincial_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. ROW LEVEL SECURITY (RLS)
-- ============================
ALTER TABLE provincial_payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own payment records
CREATE POLICY "Users can view their own payments" ON provincial_payments
    FOR SELECT USING (auth.uid()::text = member_id::text);

-- Policy: Allow inserts for payment creation
CREATE POLICY "Allow payment creation" ON provincial_payments
    FOR INSERT WITH CHECK (true);

-- Policy: Allow updates for payment status changes (Stripe webhooks)
CREATE POLICY "Allow payment updates" ON provincial_payments
    FOR UPDATE USING (true);

-- 6. SAMPLE QUERIES FOR TESTING
-- ==============================

-- Check current membership year
-- SELECT get_current_membership_year();

-- Check if a specific member has current membership
-- SELECT has_current_provincial_membership('some-uuid-here');

-- Get all active members for current year
-- SELECT m.*, pp.paid_at, pp.valid_until 
-- FROM all_members m
-- JOIN provincial_payments pp ON m.id = pp.member_id
-- WHERE pp.membership_year = get_current_membership_year()
-- AND pp.payment_status = 'completed'
-- AND pp.valid_until >= CURRENT_DATE;

-- Get all payments for a specific member
-- SELECT * FROM provincial_payments 
-- WHERE member_id = 'some-uuid-here' 
-- ORDER BY created_at DESC;

-- 7. USEFUL VIEWS
-- ===============

-- View for current active memberships
CREATE OR REPLACE VIEW current_active_memberships AS
SELECT 
    m.*,
    pp.stripe_payment_intent_id,
    pp.amount_paid,
    pp.paid_at,
    pp.valid_from,
    pp.valid_until,
    pp.receipt_url
FROM all_members m
JOIN provincial_payments pp ON m.mem_number = pp.member_id
WHERE pp.membership_year = get_current_membership_year()
AND pp.payment_status = 'completed'
AND pp.valid_until >= CURRENT_DATE;

-- View for payment history
CREATE OR REPLACE VIEW payment_history AS
SELECT 
    m.name,
    m.email,
    m.mem_number,
    pp.*
FROM all_members m
JOIN provincial_payments pp ON m.mem_number = pp.member_id
ORDER BY pp.created_at DESC;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
