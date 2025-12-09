-- SVS Stock Management System - Schema V2
-- Matches TypeScript entities exactly

-- Drop all tables in reverse order
DROP TABLE IF EXISTS fifo_transactions CASCADE;
DROP TABLE IF EXISTS fifo_layers CASCADE;
DROP TABLE IF EXISTS stock_balances CASCADE;
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
DROP TABLE IF EXISTS doc_sequences CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS supplier_contacts CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS customer_contacts CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop enums
DROP TYPE IF EXISTS doc_status CASCADE;
DROP TYPE IF EXISTS doc_type CASCADE;

-- Create enums
CREATE TYPE doc_status AS ENUM ('DRAFT', 'CONFIRMED', 'APPROVED', 'POSTED', 'CANCELLED');
CREATE TYPE doc_type AS ENUM ('QT', 'PO', 'GR', 'IS', 'TR', 'SI');

-- Users & Permissions
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    module VARCHAR(50)
);

CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE(user_id, role_id)
);

CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE(role_id, permission_id)
);

-- Products
CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    abbreviation VARCHAR(10),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES product_categories(id),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES product_categories(id),
    unit_id INTEGER REFERENCES units(id),
    barcode VARCHAR(50),
    min_stock DECIMAL(15,4) DEFAULT 0,
    max_stock DECIMAL(15,4) DEFAULT 0,
    reorder_point DECIMAL(15,4) DEFAULT 0,
    standard_cost DECIMAL(15,4) DEFAULT 0,
    selling_price DECIMAL(15,4) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Customers
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    tax_id VARCHAR(20),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(100),
    credit_limit DECIMAL(15,4) DEFAULT 0,
    credit_term_days INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_contacts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(100),
    is_primary BOOLEAN DEFAULT false
);

-- Suppliers
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    tax_id VARCHAR(20),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(100),
    payment_term_days INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supplier_contacts (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(100),
    is_primary BOOLEAN DEFAULT false
);

-- Warehouses
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Doc Sequences
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

-- Quotations
CREATE TABLE quotations (
    id SERIAL PRIMARY KEY,
    doc_base_no VARCHAR(20) NOT NULL,
    doc_revision INTEGER DEFAULT 1,
    doc_full_no VARCHAR(25) UNIQUE NOT NULL,
    is_latest_revision BOOLEAN DEFAULT true,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    doc_date DATE NOT NULL,
    valid_until DATE,
    credit_term_days INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'DRAFT',
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

CREATE TABLE quotation_items (
    id SERIAL PRIMARY KEY,
    quotation_id INTEGER NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    line_no INTEGER NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    qty DECIMAL(15,4) NOT NULL,
    unit_price DECIMAL(15,4) NOT NULL,
    discount_amount DECIMAL(15,4) DEFAULT 0,
    line_total DECIMAL(15,4) NOT NULL
);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    doc_base_no VARCHAR(20) NOT NULL,
    doc_revision INTEGER DEFAULT 1,
    doc_full_no VARCHAR(25) UNIQUE NOT NULL,
    is_latest_revision BOOLEAN DEFAULT true,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    doc_date DATE NOT NULL,
    delivery_date DATE,
    payment_term_days INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'DRAFT',
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

CREATE TABLE purchase_order_items (
    id SERIAL PRIMARY KEY,
    purchase_order_id INTEGER NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    line_no INTEGER NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    qty DECIMAL(15,4) NOT NULL,
    unit_price DECIMAL(15,4) NOT NULL,
    discount_amount DECIMAL(15,4) DEFAULT 0,
    line_total DECIMAL(15,4) NOT NULL,
    qty_received DECIMAL(15,4) DEFAULT 0
);

-- Goods Receipts
CREATE TABLE goods_receipts (
    id SERIAL PRIMARY KEY,
    doc_base_no VARCHAR(20) NOT NULL,
    doc_revision INTEGER DEFAULT 1,
    doc_full_no VARCHAR(25) UNIQUE NOT NULL,
    is_latest_revision BOOLEAN DEFAULT true,
    purchase_order_id INTEGER REFERENCES purchase_orders(id),
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    doc_date DATE NOT NULL,
    supplier_invoice_no VARCHAR(50),
    status VARCHAR(20) DEFAULT 'DRAFT',
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

CREATE TABLE goods_receipt_items (
    id SERIAL PRIMARY KEY,
    goods_receipt_id INTEGER NOT NULL REFERENCES goods_receipts(id) ON DELETE CASCADE,
    line_no INTEGER NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    qty DECIMAL(15,4) NOT NULL,
    unit_cost DECIMAL(15,4) NOT NULL,
    line_total DECIMAL(15,4) NOT NULL
);

-- Stock Issues
CREATE TABLE stock_issues (
    id SERIAL PRIMARY KEY,
    doc_base_no VARCHAR(20) NOT NULL,
    doc_revision INTEGER DEFAULT 1,
    doc_full_no VARCHAR(25) UNIQUE NOT NULL,
    is_latest_revision BOOLEAN DEFAULT true,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    doc_date DATE NOT NULL,
    reason VARCHAR(200),
    status VARCHAR(20) DEFAULT 'DRAFT',
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

CREATE TABLE stock_issue_items (
    id SERIAL PRIMARY KEY,
    stock_issue_id INTEGER NOT NULL REFERENCES stock_issues(id) ON DELETE CASCADE,
    line_no INTEGER NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    qty DECIMAL(15,4) NOT NULL,
    unit_cost DECIMAL(15,4) DEFAULT 0,
    line_total DECIMAL(15,4) DEFAULT 0
);

-- Stock Transfers
CREATE TABLE stock_transfers (
    id SERIAL PRIMARY KEY,
    doc_base_no VARCHAR(20) NOT NULL,
    doc_revision INTEGER DEFAULT 1,
    doc_full_no VARCHAR(25) UNIQUE NOT NULL,
    is_latest_revision BOOLEAN DEFAULT true,
    from_warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    to_warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    doc_date DATE NOT NULL,
    reason VARCHAR(200),
    status VARCHAR(20) DEFAULT 'DRAFT',
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

CREATE TABLE stock_transfer_items (
    id SERIAL PRIMARY KEY,
    stock_transfer_id INTEGER NOT NULL REFERENCES stock_transfers(id) ON DELETE CASCADE,
    line_no INTEGER NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    qty DECIMAL(15,4) NOT NULL,
    unit_cost DECIMAL(15,4) DEFAULT 0,
    line_total DECIMAL(15,4) DEFAULT 0
);

-- Sales Invoices
CREATE TABLE sales_invoices (
    id SERIAL PRIMARY KEY,
    doc_base_no VARCHAR(20) NOT NULL,
    doc_revision INTEGER DEFAULT 1,
    doc_full_no VARCHAR(25) UNIQUE NOT NULL,
    is_latest_revision BOOLEAN DEFAULT true,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    quotation_id INTEGER REFERENCES quotations(id),
    doc_date DATE NOT NULL,
    due_date DATE,
    credit_term_days INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'DRAFT',
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
    cost_total DECIMAL(15,4) DEFAULT 0
);

-- FIFO Layers
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

CREATE TABLE fifo_transactions (
    id SERIAL PRIMARY KEY,
    fifo_layer_id INTEGER NOT NULL REFERENCES fifo_layers(id),
    qty DECIMAL(15,4) NOT NULL,
    unit_cost DECIMAL(15,4) NOT NULL,
    total_cost DECIMAL(15,4) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL,
    reference_type VARCHAR(50),
    reference_id INTEGER,
    reference_item_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Stock Balances
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

-- Indexes
CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_customers_code ON customers(code);
CREATE INDEX idx_suppliers_code ON suppliers(code);
CREATE INDEX idx_quotations_customer ON quotations(customer_id);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_grn_supplier ON goods_receipts(supplier_id);
CREATE INDEX idx_grn_warehouse ON goods_receipts(warehouse_id);
CREATE INDEX idx_grn_status ON goods_receipts(status);
CREATE INDEX idx_issue_warehouse ON stock_issues(warehouse_id);
CREATE INDEX idx_issue_status ON stock_issues(status);
CREATE INDEX idx_transfer_from ON stock_transfers(from_warehouse_id);
CREATE INDEX idx_transfer_to ON stock_transfers(to_warehouse_id);
CREATE INDEX idx_transfer_status ON stock_transfers(status);
CREATE INDEX idx_invoice_customer ON sales_invoices(customer_id);
CREATE INDEX idx_invoice_warehouse ON sales_invoices(warehouse_id);
CREATE INDEX idx_invoice_status ON sales_invoices(status);
CREATE INDEX idx_fifo_product ON fifo_layers(product_id);
CREATE INDEX idx_fifo_warehouse ON fifo_layers(warehouse_id);
CREATE INDEX idx_fifo_remaining ON fifo_layers(qty_remaining) WHERE qty_remaining > 0;
CREATE INDEX idx_balance_product ON stock_balances(product_id);
CREATE INDEX idx_balance_warehouse ON stock_balances(warehouse_id);

-- Insert initial data
INSERT INTO roles (name, description) VALUES 
('ADMIN', 'System Administrator'),
('MANAGER', 'Manager'),
('WAREHOUSE', 'Warehouse Staff'),
('SALES', 'Sales Staff'),
('PURCHASING', 'Purchasing Staff'),
('ACCOUNTING', 'Accounting Staff'),
('VIEWER', 'View Only');

INSERT INTO permissions (code, name, module) VALUES
('user:view', 'View Users', 'user'),
('user:create', 'Create Users', 'user'),
('user:edit', 'Edit Users', 'user'),
('user:delete', 'Delete Users', 'user'),
('product:view', 'View Products', 'product'),
('product:create', 'Create Products', 'product'),
('product:edit', 'Edit Products', 'product'),
('product:delete', 'Delete Products', 'product'),
('customer:view', 'View Customers', 'customer'),
('customer:create', 'Create Customers', 'customer'),
('customer:edit', 'Edit Customers', 'customer'),
('supplier:view', 'View Suppliers', 'supplier'),
('supplier:create', 'Create Suppliers', 'supplier'),
('supplier:edit', 'Edit Suppliers', 'supplier'),
('warehouse:view', 'View Warehouses', 'warehouse'),
('warehouse:manage', 'Manage Warehouses', 'warehouse'),
('quotation:view', 'View Quotations', 'quotation'),
('quotation:create', 'Create Quotations', 'quotation'),
('quotation:confirm', 'Confirm Quotations', 'quotation'),
('po:view', 'View Purchase Orders', 'purchase'),
('po:create', 'Create Purchase Orders', 'purchase'),
('po:approve', 'Approve Purchase Orders', 'purchase'),
('grn:view', 'View Goods Receipts', 'inventory'),
('grn:create', 'Create Goods Receipts', 'inventory'),
('grn:post', 'Post Goods Receipts', 'inventory'),
('issue:view', 'View Stock Issues', 'inventory'),
('issue:create', 'Create Stock Issues', 'inventory'),
('issue:post', 'Post Stock Issues', 'inventory'),
('transfer:view', 'View Stock Transfers', 'inventory'),
('transfer:create', 'Create Stock Transfers', 'inventory'),
('transfer:post', 'Post Stock Transfers', 'inventory'),
('invoice:view', 'View Sales Invoices', 'sales'),
('invoice:create', 'Create Sales Invoices', 'sales'),
('invoice:post', 'Post Sales Invoices', 'sales'),
('stock:view', 'View Stock Balance', 'inventory'),
('report:view', 'View Reports', 'report');

-- Assign all permissions to ADMIN role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Create admin user (password: admin123)
INSERT INTO users (username, password_hash, full_name, email) VALUES 
('admin', '$2a$10$EvdDw2Udq7qqIzfHyua5vOrs/3z459hLgiaiwILHJY0BJp9o1BsYm', 'System Administrator', 'admin@svs.com');

INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);

-- Sample master data
INSERT INTO units (name, abbreviation) VALUES 
('Piece', 'PCS'),
('Box', 'BOX'),
('Set', 'SET'),
('Kilogram', 'KG'),
('Meter', 'M');

INSERT INTO product_categories (name, description) VALUES 
('Electronics', 'Electronic products'),
('Chemicals', 'Chemical products'),
('Equipment', 'Equipment and tools'),
('Consumables', 'Consumable items');

INSERT INTO warehouses (code, name, address) VALUES 
('WH01', 'Main Warehouse', 'Bangkok'),
('WH02', 'Branch Warehouse', 'Chonburi');

INSERT INTO customers (code, name, tax_id, address, phone) VALUES 
('C001', 'ABC Company Ltd.', '0123456789012', '123 Bangkok', '02-123-4567'),
('C002', 'XYZ Trading Co.', '0987654321098', '456 Chonburi', '038-987-6543');

INSERT INTO suppliers (code, name, tax_id, address, phone) VALUES 
('S001', 'Tech Supply Co.', '1234567890123', '789 Bangkok', '02-111-2222'),
('S002', 'Chemical Import Ltd.', '9876543210987', '321 Rayong', '038-333-4444');

INSERT INTO products (code, name, category_id, unit_id, standard_cost, selling_price) VALUES 
('P001', 'Laptop Computer', 1, 1, 25000, 35000),
('P002', 'USB Flash Drive 32GB', 1, 1, 150, 250),
('P003', 'Solvent Chemical A', 2, 4, 500, 750),
('P004', 'Safety Equipment Set', 3, 3, 2000, 3500);

-- Success message
SELECT 'Schema V2 created successfully!' as result;
