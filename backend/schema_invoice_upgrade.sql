-- =====================================================
-- SVS Stock - Sales Invoice Upgrade (Link to QT)
-- =====================================================

-- 1. Add new columns to sales_invoices table
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS quotation_doc_no VARCHAR(25);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS contact_person VARCHAR(100);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS warehouse_name VARCHAR(100);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS after_discount DECIMAL(15,4) DEFAULT 0;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS profit_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS has_price_variance BOOLEAN DEFAULT FALSE;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS price_variance_approved BOOLEAN DEFAULT FALSE;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS price_variance_approved_by INT;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS price_variance_approved_at TIMESTAMP;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS public_note TEXT;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS internal_note TEXT;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

-- 2. Add new columns to sales_invoice_items table
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS quotation_item_id INT;
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS item_code VARCHAR(50);
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS item_name VARCHAR(255);
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS item_description TEXT;
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS brand VARCHAR(100);
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS unit VARCHAR(20) DEFAULT 'ea';
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS net_price DECIMAL(15,4) DEFAULT 0;
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS profit_amount DECIMAL(15,4) DEFAULT 0;
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS profit_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS quoted_price DECIMAL(15,4);
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS price_variance DECIMAL(15,4);
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS price_variance_percent DECIMAL(5,2);
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS has_price_variance BOOLEAN DEFAULT FALSE;
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS price_adjustment_reason TEXT;
ALTER TABLE sales_invoice_items ADD COLUMN IF NOT EXISTS internal_note TEXT;

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_inv_quotation ON sales_invoices(quotation_id);
CREATE INDEX IF NOT EXISTS idx_inv_status ON sales_invoices(status);
CREATE INDEX IF NOT EXISTS idx_inv_items_qt ON sales_invoice_items(quotation_item_id);

-- 4. Update existing data
UPDATE sales_invoice_items SET item_code = 'LEGACY', item_name = 'Legacy Item' WHERE item_code IS NULL;

COMMIT;
