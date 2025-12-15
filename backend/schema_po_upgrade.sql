-- =====================================================
-- SVS Stock - Purchase Order Upgrade (Link to QT)
-- =====================================================

-- 1. Add new columns to purchase_orders table
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS quotation_id INT;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS quotation_doc_no VARCHAR(25);
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS supplier_name VARCHAR(255);
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS supplier_address TEXT;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS contact_person VARCHAR(100);
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS expected_delivery_date DATE;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS payment_terms_text TEXT;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS delivery_terms TEXT;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS after_discount DECIMAL(15,4) DEFAULT 0;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS public_note TEXT;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS internal_note TEXT;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS total_items INT DEFAULT 0;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS items_received INT DEFAULT 0;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS items_partial INT DEFAULT 0;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS receive_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS approval_note TEXT;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

-- 2. Add new columns to purchase_order_items table
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS quotation_id INT;
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS quotation_item_id INT;
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS source_type VARCHAR(10) DEFAULT 'MASTER';
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS temp_product_id INT;
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS item_code VARCHAR(50);
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS item_name VARCHAR(255);
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS item_description TEXT;
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS brand VARCHAR(100);
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS unit VARCHAR(20) DEFAULT 'ea';
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS net_price DECIMAL(15,4) DEFAULT 0;
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS qty_ordered DECIMAL(15,4) DEFAULT 0;
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS qty_remaining DECIMAL(15,4) DEFAULT 0;
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS item_status VARCHAR(20) DEFAULT 'PENDING';
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS actual_unit_cost DECIMAL(15,4);
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS internal_note TEXT;
ALTER TABLE purchase_order_items ADD COLUMN IF NOT EXISTS supplier_note TEXT;

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_po_quotation ON purchase_orders(quotation_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_po_items_quotation ON purchase_order_items(quotation_item_id);
CREATE INDEX IF NOT EXISTS idx_po_items_status ON purchase_order_items(item_status);

-- 4. Update existing data
UPDATE purchase_order_items SET qty_ordered = qty, qty_remaining = qty WHERE qty_ordered = 0;
UPDATE purchase_order_items SET item_code = 'LEGACY', item_name = 'Legacy Item' WHERE item_code IS NULL;

COMMIT;
