-- ===========================================
-- SVS Stock - Add Customer Groups
-- ===========================================

-- 1. สร้างตาราง customer_groups
CREATE TABLE IF NOT EXISTS customer_groups (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. เพิ่มกลุ่มลูกค้า
INSERT INTO customer_groups (code, name, description) VALUES 
    ('ACC', '🧪 Accustandard/PT', 'กลุ่มลูกค้า Accustandard และ PT'),
    ('FOR', '🔬 นิติวิทยาศาสตร์', 'กลุ่มลูกค้านิติวิทยาศาสตร์'),
    ('SVC', '🔧 บำรุงรักษา', 'กลุ่มลูกค้าบำรุงรักษา'),
    ('SCI', '🏭 เครื่องมือวิทยาศาสตร์', 'กลุ่มลูกค้าเครื่องมือวิทยาศาสตร์')
ON CONFLICT (code) DO NOTHING;

-- 3. เพิ่ม column group_id ใน customers
ALTER TABLE customers ADD COLUMN IF NOT EXISTS group_id INTEGER REFERENCES customer_groups(id);

-- 4. UPDATE ลูกค้า 672 รายที่เพิ่งเข้า (code เริ่มด้วย CRM-) → กลุ่ม ACC
UPDATE customers 
SET group_id = (SELECT id FROM customer_groups WHERE code = 'ACC')
WHERE code LIKE 'CRM-%';

-- 5. ดูผลลัพธ์
SELECT 
    cg.code as group_code,
    cg.name as group_name,
    COUNT(c.id) as customer_count
FROM customer_groups cg
LEFT JOIN customers c ON c.group_id = cg.id
GROUP BY cg.id, cg.code, cg.name
ORDER BY cg.code;

