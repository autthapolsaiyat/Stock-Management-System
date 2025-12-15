-- =====================================================
-- SVS Stock - Goods Receipt Upgrade (Link to PO/QT)
-- =====================================================

-- 1. Add new columns to goods_receipts table
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS purchase_order_doc_no VARCHAR(25);
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS quotation_id INT;
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS quotation_doc_no VARCHAR(25);
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS supplier_name VARCHAR(255);
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS warehouse_name VARCHAR(100);
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS receive_date DATE;
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS supplier_invoice_date DATE;
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS subtotal DECIMAL(15,4) DEFAULT 0;
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(15,4) DEFAULT 0;
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(15,4) DEFAULT 0;
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS total_expected_cost DECIMAL(15,4) DEFAULT 0;
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS total_variance DECIMAL(15,4) DEFAULT 0;
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS variance_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS has_variance_alert BOOLEAN DEFAULT FALSE;
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS internal_note TEXT;
ALTER TABLE goods_receipts ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

-- 2. Add new columns to goods_receipt_items table
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS po_item_id INT;
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS quotation_item_id INT;
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS source_type VARCHAR(10) DEFAULT 'MASTER';
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS temp_product_id INT;
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS item_code VARCHAR(50);
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS item_name VARCHAR(255);
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS item_description TEXT;
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS brand VARCHAR(100);
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS unit VARCHAR(20) DEFAULT 'ea';
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS expected_unit_cost DECIMAL(15,4);
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS cost_variance DECIMAL(15,4);
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS variance_percent DECIMAL(5,2);
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS has_variance_alert BOOLEAN DEFAULT FALSE;
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS lot_no VARCHAR(50);
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS expiry_date DATE;
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS location_code VARCHAR(50);
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS internal_note TEXT;
ALTER TABLE goods_receipt_items ADD COLUMN IF NOT EXISTS activated_product_id INT;

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_gr_po ON goods_receipts(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_gr_quotation ON goods_receipts(quotation_id);
CREATE INDEX IF NOT EXISTS idx_gr_status ON goods_receipts(status);
CREATE INDEX IF NOT EXISTS idx_gr_items_po ON goods_receipt_items(po_item_id);
CREATE INDEX IF NOT EXISTS idx_gr_items_qt ON goods_receipt_items(quotation_item_id);

-- 4. Update existing data
UPDATE goods_receipt_items SET item_code = 'LEGACY', item_name = 'Legacy Item' WHERE item_code IS NULL;

COMMIT;
