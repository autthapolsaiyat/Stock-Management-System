-- =====================================================
-- SVS Stock - Quotation System Upgrade
-- Run this script on Azure PostgreSQL
-- =====================================================

-- 1. System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(20) DEFAULT 'STRING',
    description TEXT,
    category VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT
);

-- Insert default settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category) VALUES
('QT_MIN_MARGIN_PERCENT', '10', 'NUMBER', 'Minimum margin percentage allowed', 'QUOTATION'),
('QT_LOW_MARGIN_APPROVER_ROLE', 'MANAGER', 'STRING', 'Role that can approve low margin sales', 'QUOTATION'),
('QT_PRICE_VALIDITY_DAYS', '30', 'NUMBER', 'Default price validity in days', 'QUOTATION'),
('QT_DELIVERY_DAYS', '120', 'NUMBER', 'Default delivery days', 'QUOTATION'),
('QT_PAYMENT_TERMS_DAYS', '30', 'NUMBER', 'Default payment terms in days', 'QUOTATION'),
('QT_VARIANCE_ALERT_PERCENT', '5', 'NUMBER', 'Alert when cost variance exceeds this %', 'QUOTATION'),
('QT_TYPES', '["STANDARD","FORENSIC","MAINTENANCE"]', 'JSON', 'Available quotation types', 'QUOTATION')
ON CONFLICT (setting_key) DO NOTHING;

-- 2. Temp Products Table
CREATE TABLE IF NOT EXISTS temp_products (
    id SERIAL PRIMARY KEY,
    temp_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    unit VARCHAR(20) DEFAULT 'ea',
    estimated_cost DECIMAL(15,4) DEFAULT 0,
    quoted_price DECIMAL(15,4) DEFAULT 0,
    source_quotation_id INT,
    source_qt_item_id INT,
    status VARCHAR(20) DEFAULT 'PENDING',
    activated_to_product_id INT,
    activated_at TIMESTAMP,
    activated_by INT,
    activated_from_gr_id INT,
    internal_note TEXT,
    supplier_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT
);

CREATE INDEX IF NOT EXISTS idx_temp_products_status ON temp_products(status);
CREATE INDEX IF NOT EXISTS idx_temp_products_source ON temp_products(source_quotation_id);

-- 3. Add new columns to quotations table
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS qt_type VARCHAR(20) DEFAULT 'STANDARD';
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS contact_person VARCHAR(100);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS price_validity_days INT DEFAULT 30;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS delivery_days INT DEFAULT 120;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS payment_terms_text TEXT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS delivery_terms TEXT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS sales_person_id INT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS sales_person_name VARCHAR(100);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS after_discount DECIMAL(15,4) DEFAULT 0;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS total_estimated_cost DECIMAL(15,4) DEFAULT 0;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS total_actual_cost DECIMAL(15,4) DEFAULT 0;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS expected_margin_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS actual_margin_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS approved_by INT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS approval_note TEXT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS requires_margin_approval BOOLEAN DEFAULT FALSE;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS margin_approved_by INT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS margin_approved_at TIMESTAMP;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS margin_approval_note TEXT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS public_note TEXT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS internal_note TEXT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS cancel_reason TEXT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS total_items INT DEFAULT 0;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS items_sold INT DEFAULT 0;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS items_partial INT DEFAULT 0;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS items_cancelled INT DEFAULT 0;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS fulfillment_percent DECIMAL(5,2) DEFAULT 0;

-- Rename discount_total to discount_amount if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotations' AND column_name = 'discount_total') THEN
        ALTER TABLE quotations RENAME COLUMN discount_total TO discount_amount;
    ELSE
        ALTER TABLE quotations ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(15,4) DEFAULT 0;
    END IF;
END $$;

-- 4. Add new columns to quotation_items table
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS source_type VARCHAR(10) DEFAULT 'MASTER';
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS temp_product_id INT;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS item_code VARCHAR(50);
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS item_name VARCHAR(255);
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS item_description TEXT;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS brand VARCHAR(100);
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS unit VARCHAR(20) DEFAULT 'ea';
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS estimated_cost DECIMAL(15,4) DEFAULT 0;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS net_price DECIMAL(15,4) DEFAULT 0;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS margin_amount DECIMAL(15,4) DEFAULT 0;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS margin_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS qty_quoted DECIMAL(15,4) DEFAULT 0;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS qty_ordered DECIMAL(15,4) DEFAULT 0;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS qty_received DECIMAL(15,4) DEFAULT 0;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS qty_sold DECIMAL(15,4) DEFAULT 0;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS qty_cancelled DECIMAL(15,4) DEFAULT 0;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS qty_remaining DECIMAL(15,4) DEFAULT 0;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS item_status VARCHAR(20) DEFAULT 'PENDING';
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS actual_cost DECIMAL(15,4);
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS actual_margin_amount DECIMAL(15,4);
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS actual_margin_percent DECIMAL(5,2);
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS cost_variance_amount DECIMAL(15,4);
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS cost_variance_percent DECIMAL(5,2);
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS invoice_price DECIMAL(15,4);
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS price_adjustment_reason TEXT;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS price_adjustment_approved_by INT;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS cancel_reason TEXT;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS cancelled_by INT;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS public_note TEXT;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS internal_note TEXT;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS po_item_id INT;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS gr_item_id INT;
ALTER TABLE quotation_items ADD COLUMN IF NOT EXISTS invoice_item_id INT;

-- 5. Create indexes
CREATE INDEX IF NOT EXISTS idx_quotations_qt_type ON quotations(qt_type);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotation_items_status ON quotation_items(item_status);
CREATE INDEX IF NOT EXISTS idx_quotation_items_source ON quotation_items(source_type);
CREATE INDEX IF NOT EXISTS idx_quotation_items_temp ON quotation_items(temp_product_id);

-- 6. Update existing data
UPDATE quotation_items SET qty_quoted = qty, qty_remaining = qty WHERE qty_quoted = 0;
UPDATE quotation_items SET item_code = 'LEGACY', item_name = 'Legacy Item' WHERE item_code IS NULL;

COMMIT;
