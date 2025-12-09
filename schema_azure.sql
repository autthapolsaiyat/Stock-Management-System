-- SVS Stock Management System - Azure PostgreSQL Schema
-- Version 2: Uses SERIAL instead of UUID for Azure compatibility

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS sales_invoice_items CASCADE;
DROP TABLE IF EXISTS sales_invoices CASCADE;
DROP TABLE IF EXISTS stock_transfer_items CASCADE;
DROP TABLE IF EXISTS stock_transfers CASCADE;
DROP TABLE IF EXISTS stock_issue_items CASCADE;
DROP TABLE IF EXISTS stock_issues CASCADE;
DROP TABLE IF EXISTS goods_receipt_items CASCADE;
DROP TABLE IF EXISTS goods_receipts CASCADE;
DROP TABLE IF EXISTS purchase_order_items CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS quotation_items CASCADE;
DROP TABLE IF EXISTS quotations CASCADE;
DROP TABLE IF EXISTS fifo_transactions CASCADE;
DROP TABLE IF EXISTS fifo_layers CASCADE;
DROP TABLE IF EXISTS stock_balances CASCADE;
DROP TABLE IF EXISTS doc_sequences CASCADE;
DROP TABLE IF EXISTS customer_contacts CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS supplier_contacts CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enums
DROP TYPE IF EXISTS doc_status CASCADE;
DROP TYPE IF EXISTS doc_type CASCADE;
DROP TYPE IF EXISTS fifo_transaction_type CASCADE;

CREATE TYPE doc_status AS ENUM ('DRAFT', 'CONFIRMED', 'APPROVED', 'ORDERED', 'PARTIALLY_RECEIVED', 'COMPLETED', 'POSTED', 'CANCELLED');
CREATE TYPE doc_type AS ENUM ('QT', 'PO', 'GR', 'SI', 'TR', 'INV');
CREATE TYPE fifo_transaction_type AS ENUM ('GRN', 'ISSUE', 'SALES', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT');

-- =====================================================
-- USER & AUTHENTICATION TABLES
-- =====================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
);

-- =====================================================
-- MASTER DATA TABLES
-- =====================================================

CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES product_categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES product_categories(id),
    unit_id INTEGER NOT NULL REFERENCES units(id),
    unit_price DECIMAL(15,4) DEFAULT 0,
    cost_price DECIMAL(15,4) DEFAULT 0,
    min_stock_level DECIMAL(15,4) DEFAULT 0,
    max_stock_level DECIMAL(15,4) DEFAULT 0,
    reorder_point DECIMAL(15,4) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);

CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    manager_id INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    tax_id VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'Thailand',
    phone VARCHAR(20),
    email VARCHAR(100),
    payment_term_days INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);
CREATE INDEX idx_suppliers_code ON suppliers(code);

CREATE TABLE supplier_contacts (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    contact_name VARCHAR(100) NOT NULL,
    position VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    tax_id VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'Thailand',
    phone VARCHAR(20),
    email VARCHAR(100),
    credit_term_days INTEGER DEFAULT 30,
    credit_limit DECIMAL(15,4) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);
CREATE INDEX idx_customers_code ON customers(code);

CREATE TABLE customer_contacts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    contact_name VARCHAR(100) NOT NULL,
    position VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DOCUMENT NUMBERING
-- =====================================================

CREATE TABLE doc_sequences (
    id SERIAL PRIMARY KEY,
    doc_type doc_type NOT NULL,
    year_month VARCHAR(4) NOT NULL,
    last_number INTEGER DEFAULT 0,
    prefix VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(doc_type, year_month)
);

-- =====================================================
-- STOCK & FIFO TABLES
-- =====================================================

CREATE TABLE stock_balances (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    qty_on_hand DECIMAL(15,4) DEFAULT 0,
    qty_reserved DECIMAL(15,4) DEFAULT 0,
    avg_cost DECIMAL(15,4) DEFAULT 0,
    last_received_at TIMESTAMPTZ,
    last_issued_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, warehouse_id)
);
CREATE INDEX idx_stock_balances_product ON stock_balances(product_id);
CREATE INDEX idx_stock_balances_warehouse ON stock_balances(warehouse_id);

CREATE TABLE fifo_layers (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    qty_original DECIMAL(15,4) NOT NULL,
    qty_remaining DECIMAL(15,4) NOT NULL,
    unit_cost DECIMAL(15,4) NOT NULL,
    reference_type VARCHAR(50),
    reference_id INTEGER,
    reference_item_id INTEGER,
    received_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_fifo_layers_product ON fifo_layers(product_id);
CREATE INDEX idx_fifo_layers_warehouse ON fifo_layers(warehouse_id);
CREATE INDEX idx_fifo_layers_remaining ON fifo_layers(qty_remaining) WHERE qty_remaining > 0;

CREATE TABLE fifo_transactions (
    id SERIAL PRIMARY KEY,
    fifo_layer_id INTEGER REFERENCES fifo_layers(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    transaction_type fifo_transaction_type NOT NULL,
    qty DECIMAL(15,4) NOT NULL,
    unit_cost DECIMAL(15,4) NOT NULL,
    total_cost DECIMAL(15,4) NOT NULL,
    reference_type VARCHAR(50),
    reference_id INTEGER,
    reference_item_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);
CREATE INDEX idx_fifo_trans_product ON fifo_transactions(product_id);
CREATE INDEX idx_fifo_trans_warehouse ON fifo_transactions(warehouse_id);
CREATE INDEX idx_fifo_trans_created ON fifo_transactions(created_at);

-- =====================================================
-- QUOTATION TABLES
-- =====================================================

CREATE TABLE quotations (
    id SERIAL PRIMARY KEY,
    doc_base_no VARCHAR(20) NOT NULL,
    doc_revision INTEGER DEFAULT 1,
    doc_full_no VARCHAR(25) NOT NULL UNIQUE,
    is_latest_revision BOOLEAN DEFAULT true,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    doc_date DATE NOT NULL,
    valid_until DATE,
    credit_term_days INTEGER DEFAULT 30,
    status doc_status DEFAULT 'DRAFT',
    subtotal DECIMAL(15,4) DEFAULT 0,
    discount_total DECIMAL(15,4) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 7,
    tax_amount DECIMAL(15,4) DEFAULT 0,
    grand_total DECIMAL(15,4) DEFAULT 0,
    remark TEXT,
    revision_reason TEXT,
    confirmed_at TIMESTAMPTZ,
    confirmed_by INTEGER REFERENCES users(id),
    cancelled_at TIMESTAMPTZ,
    cancelled_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);
CREATE INDEX idx_quotations_doc_no ON quotations(doc_full_no);
CREATE INDEX idx_quotations_customer ON quotations(customer_id);
CREATE INDEX idx_quotations_status ON quotations(status);

CREATE TABLE quotation_items (
    id SERIAL PRIMARY KEY,
    quotation_id INTEGER NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    line_no INTEGER NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    qty DECIMAL(15,4) NOT NULL,
    unit_price DECIMAL(15,4) NOT NULL,
    discount_amount DECIMAL(15,4) DEFAULT 0,
    line_total DECIMAL(15,4) NOT NULL,
    remark TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_quotation_items_quotation ON quotation_items(quotation_id);

-- =====================================================
-- PURCHASE ORDER TABLES
-- =====================================================

CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    doc_base_no VARCHAR(20) NOT NULL,
    doc_revision INTEGER DEFAULT 1,
    doc_full_no VARCHAR(25) NOT NULL UNIQUE,
    is_latest_revision BOOLEAN DEFAULT true,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    doc_date DATE NOT NULL,
    delivery_date DATE,
    payment_term_days INTEGER DEFAULT 30,
    status doc_status DEFAULT 'DRAFT',
    subtotal DECIMAL(15,4) DEFAULT 0,
    discount_total DECIMAL(15,4) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 7,
    tax_amount DECIMAL(15,4) DEFAULT 0,
    grand_total DECIMAL(15,4) DEFAULT 0,
    remark TEXT,
    approved_at TIMESTAMPTZ,
    approved_by INTEGER REFERENCES users(id),
    cancelled_at TIMESTAMPTZ,
    cancelled_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);
CREATE INDEX idx_po_doc_no ON purchase_orders(doc_full_no);
CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_po_status ON purchase_orders(status);

CREATE TABLE purchase_order_items (
    id SERIAL PRIMARY KEY,
    purchase_order_id INTEGER NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    line_no INTEGER NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    qty DECIMAL(15,4) NOT NULL,
    qty_received DECIMAL(15,4) DEFAULT 0,
    unit_price DECIMAL(15,4) NOT NULL,
    discount_amount DECIMAL(15,4) DEFAULT 0,
    line_total DECIMAL(15,4) NOT NULL,
    remark TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_po_items_po ON purchase_order_items(purchase_order_id);

-- =====================================================
-- GOODS RECEIPT TABLES
-- =====================================================

CREATE TABLE goods_receipts (
    id SERIAL PRIMARY KEY,
    doc_base_no VARCHAR(20) NOT NULL,
    doc_revision INTEGER DEFAULT 1,
    doc_full_no VARCHAR(25) NOT NULL UNIQUE,
    is_latest_revision BOOLEAN DEFAULT true,
    purchase_order_id INTEGER REFERENCES purchase_orders(id),
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    doc_date DATE NOT NULL,
    supplier_invoice_no VARCHAR(50),
    status doc_status DEFAULT 'DRAFT',
    total_amount DECIMAL(15,4) DEFAULT 0,
    remark TEXT,
    posted_at TIMESTAMPTZ,
    posted_by INTEGER REFERENCES users(id),
    cancelled_at TIMESTAMPTZ,
    cancelled_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);
CREATE INDEX idx_grn_doc_no ON goods_receipts(doc_full_no);
CREATE INDEX idx_grn_supplier ON goods_receipts(supplier_id);
CREATE INDEX idx_grn_warehouse ON goods_receipts(warehouse_id);
CREATE INDEX idx_grn_status ON goods_receipts(status);

CREATE TABLE goods_receipt_items (
    id SERIAL PRIMARY KEY,
    goods_receipt_id INTEGER NOT NULL REFERENCES goods_receipts(id) ON DELETE CASCADE,
    line_no INTEGER NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    po_item_id INTEGER REFERENCES purchase_order_items(id),
    qty DECIMAL(15,4) NOT NULL,
    unit_cost DECIMAL(15,4) NOT NULL,
    line_total DECIMAL(15,4) NOT NULL,
    remark TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_grn_items_grn ON goods_receipt_items(goods_receipt_id);

-- =====================================================
-- STOCK ISSUE TABLES
-- =====================================================

CREATE TABLE stock_issues (
    id SERIAL PRIMARY KEY,
    doc_base_no VARCHAR(20) NOT NULL,
    doc_revision INTEGER DEFAULT 1,
    doc_full_no VARCHAR(25) NOT NULL UNIQUE,
    is_latest_revision BOOLEAN DEFAULT true,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    doc_date DATE NOT NULL,
    reason VARCHAR(200),
    status doc_status DEFAULT 'DRAFT',
    total_amount DECIMAL(15,4) DEFAULT 0,
    remark TEXT,
    posted_at TIMESTAMPTZ,
    posted_by INTEGER REFERENCES users(id),
    cancelled_at TIMESTAMPTZ,
    cancelled_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);
CREATE INDEX idx_issue_doc_no ON stock_issues(doc_full_no);
CREATE INDEX idx_issue_warehouse ON stock_issues(warehouse_id);
CREATE INDEX idx_issue_status ON stock_issues(status);

CREATE TABLE stock_issue_items (
    id SERIAL PRIMARY KEY,
    stock_issue_id INTEGER NOT NULL REFERENCES stock_issues(id) ON DELETE CASCADE,
    line_no INTEGER NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    qty DECIMAL(15,4) NOT NULL,
    unit_cost DECIMAL(15,4) DEFAULT 0,
    line_total DECIMAL(15,4) DEFAULT 0,
    remark TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_issue_items_issue ON stock_issue_items(stock_issue_id);

-- =====================================================
-- STOCK TRANSFER TABLES
-- =====================================================

CREATE TABLE stock_transfers (
    id SERIAL PRIMARY KEY,
    doc_base_no VARCHAR(20) NOT NULL,
    doc_revision INTEGER DEFAULT 1,
    doc_full_no VARCHAR(25) NOT NULL UNIQUE,
    is_latest_revision BOOLEAN DEFAULT true,
    from_warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    to_warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    doc_date DATE NOT NULL,
    reason VARCHAR(200),
    status doc_status DEFAULT 'DRAFT',
    total_amount DECIMAL(15,4) DEFAULT 0,
    remark TEXT,
    posted_at TIMESTAMPTZ,
    posted_by INTEGER REFERENCES users(id),
    cancelled_at TIMESTAMPTZ,
    cancelled_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);
CREATE INDEX idx_transfer_doc_no ON stock_transfers(doc_full_no);
CREATE INDEX idx_transfer_from_wh ON stock_transfers(from_warehouse_id);
CREATE INDEX idx_transfer_to_wh ON stock_transfers(to_warehouse_id);
CREATE INDEX idx_transfer_status ON stock_transfers(status);

CREATE TABLE stock_transfer_items (
    id SERIAL PRIMARY KEY,
    stock_transfer_id INTEGER NOT NULL REFERENCES stock_transfers(id) ON DELETE CASCADE,
    line_no INTEGER NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    qty DECIMAL(15,4) NOT NULL,
    unit_cost DECIMAL(15,4) DEFAULT 0,
    line_total DECIMAL(15,4) DEFAULT 0,
    remark TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_transfer_items_transfer ON stock_transfer_items(stock_transfer_id);

-- =====================================================
-- SALES INVOICE TABLES
-- =====================================================

CREATE TABLE sales_invoices (
    id SERIAL PRIMARY KEY,
    doc_base_no VARCHAR(20) NOT NULL,
    doc_revision INTEGER DEFAULT 1,
    doc_full_no VARCHAR(25) NOT NULL UNIQUE,
    is_latest_revision BOOLEAN DEFAULT true,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    quotation_id INTEGER REFERENCES quotations(id),
    doc_date DATE NOT NULL,
    due_date DATE,
    credit_term_days INTEGER DEFAULT 30,
    status doc_status DEFAULT 'DRAFT',
    subtotal DECIMAL(15,4) DEFAULT 0,
    discount_total DECIMAL(15,4) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 7,
    tax_amount DECIMAL(15,4) DEFAULT 0,
    grand_total DECIMAL(15,4) DEFAULT 0,
    cost_total DECIMAL(15,4) DEFAULT 0,
    profit_total DECIMAL(15,4) DEFAULT 0,
    remark TEXT,
    posted_at TIMESTAMPTZ,
    posted_by INTEGER REFERENCES users(id),
    cancelled_at TIMESTAMPTZ,
    cancelled_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);
CREATE INDEX idx_invoice_doc_no ON sales_invoices(doc_full_no);
CREATE INDEX idx_invoice_customer ON sales_invoices(customer_id);
CREATE INDEX idx_invoice_warehouse ON sales_invoices(warehouse_id);
CREATE INDEX idx_invoice_status ON sales_invoices(status);

CREATE TABLE sales_invoice_items (
    id SERIAL PRIMARY KEY,
    sales_invoice_id INTEGER NOT NULL REFERENCES sales_invoices(id) ON DELETE CASCADE,
    line_no INTEGER NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    qty DECIMAL(15,4) NOT NULL,
    unit_price DECIMAL(15,4) NOT NULL,
    discount_amount DECIMAL(15,4) DEFAULT 0,
    line_total DECIMAL(15,4) NOT NULL,
    unit_cost DECIMAL(15,4) DEFAULT 0,
    cost_total DECIMAL(15,4) DEFAULT 0,
    remark TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_invoice_items_invoice ON sales_invoice_items(sales_invoice_id);

-- =====================================================
-- AUDIT LOG TABLE
-- =====================================================

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_table ON audit_logs(table_name);
CREATE INDEX idx_audit_record ON audit_logs(record_id);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Roles
INSERT INTO roles (code, name, description) VALUES
('ADMIN', 'Administrator', 'Full system access'),
('MANAGER', 'Manager', 'Management access'),
('STOCK', 'Stock Keeper', 'Stock management access'),
('SALES', 'Sales', 'Sales and quotation access'),
('PURCHASE', 'Purchaser', 'Purchase order access'),
('VIEWER', 'Viewer', 'Read-only access');

-- Permissions
INSERT INTO permissions (code, name, module) VALUES
-- User permissions
('user:view', 'View Users', 'user'),
('user:create', 'Create Users', 'user'),
('user:update', 'Update Users', 'user'),
('user:delete', 'Delete Users', 'user'),
-- Product permissions
('product:view', 'View Products', 'product'),
('product:create', 'Create Products', 'product'),
('product:update', 'Update Products', 'product'),
('product:delete', 'Delete Products', 'product'),
-- Customer permissions
('customer:view', 'View Customers', 'customer'),
('customer:create', 'Create Customers', 'customer'),
('customer:update', 'Update Customers', 'customer'),
('customer:delete', 'Delete Customers', 'customer'),
-- Supplier permissions
('supplier:view', 'View Suppliers', 'supplier'),
('supplier:create', 'Create Suppliers', 'supplier'),
('supplier:update', 'Update Suppliers', 'supplier'),
('supplier:delete', 'Delete Suppliers', 'supplier'),
-- Quotation permissions
('quotation:view', 'View Quotations', 'quotation'),
('quotation:create', 'Create Quotations', 'quotation'),
('quotation:update', 'Update Quotations', 'quotation'),
('quotation:confirm', 'Confirm Quotations', 'quotation'),
('quotation:delete', 'Delete Quotations', 'quotation'),
-- PO permissions
('po:view', 'View Purchase Orders', 'purchase-order'),
('po:create', 'Create Purchase Orders', 'purchase-order'),
('po:update', 'Update Purchase Orders', 'purchase-order'),
('po:approve', 'Approve Purchase Orders', 'purchase-order'),
('po:delete', 'Delete Purchase Orders', 'purchase-order'),
-- GRN permissions
('grn:view', 'View Goods Receipts', 'goods-receipt'),
('grn:create', 'Create Goods Receipts', 'goods-receipt'),
('grn:update', 'Update Goods Receipts', 'goods-receipt'),
('grn:post', 'Post Goods Receipts', 'goods-receipt'),
('grn:delete', 'Delete Goods Receipts', 'goods-receipt'),
-- Stock Issue permissions
('issue:view', 'View Stock Issues', 'stock-issue'),
('issue:create', 'Create Stock Issues', 'stock-issue'),
('issue:update', 'Update Stock Issues', 'stock-issue'),
('issue:post', 'Post Stock Issues', 'stock-issue'),
('issue:delete', 'Delete Stock Issues', 'stock-issue'),
-- Transfer permissions
('transfer:view', 'View Transfers', 'stock-transfer'),
('transfer:create', 'Create Transfers', 'stock-transfer'),
('transfer:update', 'Update Transfers', 'stock-transfer'),
('transfer:post', 'Post Transfers', 'stock-transfer'),
('transfer:delete', 'Delete Transfers', 'stock-transfer'),
-- Invoice permissions
('invoice:view', 'View Invoices', 'sales-invoice'),
('invoice:create', 'Create Invoices', 'sales-invoice'),
('invoice:update', 'Update Invoices', 'sales-invoice'),
('invoice:post', 'Post Invoices', 'sales-invoice'),
('invoice:delete', 'Delete Invoices', 'sales-invoice'),
-- Report permissions
('report:view', 'View Reports', 'report'),
('report:export', 'Export Reports', 'report'),
-- Settings permissions
('settings:view', 'View Settings', 'settings'),
('settings:update', 'Update Settings', 'settings');

-- Admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Units
INSERT INTO units (code, name, description) VALUES
('PCS', 'Pieces', 'Individual pieces'),
('BOX', 'Box', 'Box packaging'),
('KG', 'Kilogram', 'Weight in kilograms'),
('M', 'Meter', 'Length in meters'),
('L', 'Liter', 'Volume in liters'),
('SET', 'Set', 'Complete set'),
('PACK', 'Pack', 'Pack/Package');

-- Default Warehouse
INSERT INTO warehouses (code, name, address) VALUES
('WH-MAIN', 'Main Warehouse', 'Bangkok, Thailand'),
('WH-STORE', 'Store Room', 'Bangkok, Thailand');

-- Default Admin User (password: admin123)
INSERT INTO users (username, password_hash, full_name, email) VALUES
('admin', '$2a$10$rS5GKCI2OiVwkEYEPH5w8uQxVj7xGWxZEbPnNOYfLqXIK.FRxsZOi', 'System Administrator', 'admin@svs-stock.com');

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);

-- Sample Categories
INSERT INTO product_categories (name, description) VALUES
('Electronics', 'Electronic components and devices'),
('Office Supplies', 'Office equipment and supplies'),
('Raw Materials', 'Raw materials for production');

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to relevant tables
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END;
$$;

-- Function to generate document number
CREATE OR REPLACE FUNCTION generate_doc_number(
    p_doc_type doc_type,
    p_date DATE DEFAULT CURRENT_DATE
) RETURNS VARCHAR AS $$
DECLARE
    v_year_month VARCHAR(4);
    v_seq INTEGER;
    v_prefix VARCHAR(10);
    v_doc_no VARCHAR(25);
BEGIN
    v_year_month := TO_CHAR(p_date, 'MMYY');
    
    -- Get prefix based on doc type
    v_prefix := CASE p_doc_type
        WHEN 'QT' THEN 'QT'
        WHEN 'PO' THEN 'PO'
        WHEN 'GR' THEN 'GR'
        WHEN 'SI' THEN 'SI'
        WHEN 'TR' THEN 'TR'
        WHEN 'INV' THEN 'INV'
    END;
    
    -- Get and increment sequence
    INSERT INTO doc_sequences (doc_type, year_month, last_number, prefix)
    VALUES (p_doc_type, v_year_month, 1, v_prefix)
    ON CONFLICT (doc_type, year_month)
    DO UPDATE SET last_number = doc_sequences.last_number + 1, updated_at = CURRENT_TIMESTAMP
    RETURNING last_number INTO v_seq;
    
    -- Format: SVS-NNN-MMYY-R1
    v_doc_no := 'SVS-' || LPAD(v_seq::TEXT, 3, '0') || '-' || v_year_month || '-R1';
    
    RETURN v_doc_no;
END;
$$ LANGUAGE plpgsql;

SELECT 'Schema created successfully!' AS status;
