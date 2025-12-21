-- SVS Stock: Import Employees from Excel
-- Generated: 2025-12-21

-- 1. Add new roles
INSERT INTO roles (code, name, description, is_active) VALUES ('SALES_STANDARD', 'Sales Standard', 'พนักงานขาย Accustandard/PT', true) ON CONFLICT DO NOTHING;
INSERT INTO roles (code, name, description, is_active) VALUES ('SALES_FORENSIC', 'Sales Forensic', 'พนักงานขาย นิติวิทยาศาสตร์', true) ON CONFLICT DO NOTHING;
INSERT INTO roles (code, name, description, is_active) VALUES ('SALES_TOOLLAB', 'Sales ToolLab', 'พนักงานขาย เครื่องมือวิทยาศาสตร์', true) ON CONFLICT DO NOTHING;
INSERT INTO roles (code, name, description, is_active) VALUES ('SALES_MAINTENANCE', 'Sales Maintenance', 'พนักงานขาย บำรุงรักษา', true) ON CONFLICT DO NOTHING;

-- 2. Add/Update users

-- นายวิศณุรักษ์ จันทร์สร้อย
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('visanurak.c', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นายวิศณุรักษ์ จันทร์สร้อย', 'visanurak.c@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นายวิศณุรักษ์ จันทร์สร้อย', email = 'visanurak.c@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'visanurak.c' AND r.code = 'SALES_MAINTENANCE' ON CONFLICT DO NOTHING;

-- นายสุเทพ ปานสิทธิ์
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('suthep.p', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นายสุเทพ ปานสิทธิ์', 'suthep.p@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นายสุเทพ ปานสิทธิ์', email = 'suthep.p@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'suthep.p' AND r.code = 'SALES_MAINTENANCE' ON CONFLICT DO NOTHING;

-- นางสายหยุด อาวรณ์คุม
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('เหิร', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสายหยุด อาวรณ์คุม', '', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสายหยุด อาวรณ์คุม', email = '', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'เหิร' AND r.code = 'VIEWER' ON CONFLICT DO NOTHING;

-- นายแสวง โพธิ์เย็น
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('sawaeng.p', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นายแสวง โพธิ์เย็น', 'sawaeng.p@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นายแสวง โพธิ์เย็น', email = 'sawaeng.p@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'sawaeng.p' AND r.code = 'MANAGER' ON CONFLICT DO NOTHING;

-- นายสมชาย อาวรณ์คุม
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('somchai.a', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นายสมชาย อาวรณ์คุม', 'somchai.a@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นายสมชาย อาวรณ์คุม', email = 'somchai.a@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'somchai.a' AND r.code = 'SALES_MAINTENANCE' ON CONFLICT DO NOTHING;

-- นายสุรเจตน์ แจ้งรอด
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('surajet.j', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นายสุรเจตน์ แจ้งรอด', 'surajet.j@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นายสุรเจตน์ แจ้งรอด', email = 'surajet.j@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'surajet.j' AND r.code = 'SALES_MAINTENANCE' ON CONFLICT DO NOTHING;

-- นายอรรถพล ไสญาติ
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('autthapol.s', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นายอรรถพล ไสญาติ', 'autthapol.s@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นายอรรถพล ไสญาติ', email = 'autthapol.s@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'autthapol.s' AND r.code = 'ADMIN' ON CONFLICT DO NOTHING;

-- นางสาวสุนิสา แก้ววิเศษ
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('sunisa.k', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาวสุนิสา แก้ววิเศษ', 'sunisa.k@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาวสุนิสา แก้ววิเศษ', email = 'sunisa.k@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'sunisa.k' AND r.code = 'SALES_STANDARD' ON CONFLICT DO NOTHING;

-- นางสาววิลาวรรณ โคตรสมบัติ
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('wilawan.k', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาววิลาวรรณ โคตรสมบัติ', 'wilawan.k@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาววิลาวรรณ โคตรสมบัติ', email = 'wilawan.k@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'wilawan.k' AND r.code = 'MANAGER' ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'wilawan.k' AND r.code = 'SALES_FORENSIC' ON CONFLICT DO NOTHING;

-- นางสาวฐิตรัตน์ เลิศเชาวยุทธ
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('titarat.l', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาวฐิตรัตน์ เลิศเชาวยุทธ', 'titarat.l@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาวฐิตรัตน์ เลิศเชาวยุทธ', email = 'titarat.l@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'titarat.l' AND r.code = 'VIEWER' ON CONFLICT DO NOTHING;

-- นางสาววราภรณ์ กีรติวิทยาภรณ์ 
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('waraporn.k', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาววราภรณ์ กีรติวิทยาภรณ์ ', 'waraporn.k@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาววราภรณ์ กีรติวิทยาภรณ์ ', email = 'waraporn.k@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'waraporn.k' AND r.code = 'SALES' ON CONFLICT DO NOTHING;

-- นางสาวกมลวรรณ  ขวาภักดี
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('kamonwan.k', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาวกมลวรรณ  ขวาภักดี', 'kamonwan.k@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาวกมลวรรณ  ขวาภักดี', email = 'kamonwan.k@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'kamonwan.k' AND r.code = 'SALES' ON CONFLICT DO NOTHING;

-- นายณัฐพงษ์  ตัดป่วง
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('natthapong.t', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นายณัฐพงษ์  ตัดป่วง', 'natthapong.t@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นายณัฐพงษ์  ตัดป่วง', email = 'natthapong.t@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'natthapong.t' AND r.code = 'SALES_MAINTENANCE' ON CONFLICT DO NOTHING;

-- นางสาวชลธิชา  อาวรณ์คุม
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('chonticha.a', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาวชลธิชา  อาวรณ์คุม', 'chonticha.a@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาวชลธิชา  อาวรณ์คุม', email = 'chonticha.a@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'chonticha.a' AND r.code = 'WAREHOUSE' ON CONFLICT DO NOTHING;

-- นายอติวิชญ์  แซ่เลื่อง
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('atiwich.s', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นายอติวิชญ์  แซ่เลื่อง', 'atiwich.s@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นายอติวิชญ์  แซ่เลื่อง', email = 'atiwich.s@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'atiwich.s' AND r.code = 'SALES_MAINTENANCE' ON CONFLICT DO NOTHING;

-- นางสาวอรวัณ  รัตนประทีป
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('orawan.r', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาวอรวัณ  รัตนประทีป', 'orawan.r@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาวอรวัณ  รัตนประทีป', email = 'orawan.r@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'orawan.r' AND r.code = 'ACCOUNTING' ON CONFLICT DO NOTHING;

-- นางสาวลำดวน โครตสมบัติ
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('lamduan.k', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาวลำดวน โครตสมบัติ', 'lamduan.k@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาวลำดวน โครตสมบัติ', email = 'lamduan.k@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'lamduan.k' AND r.code = 'ACCOUNTING' ON CONFLICT DO NOTHING;

-- นายสมุทร ขอถาวรวงศ์
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('smut.k', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นายสมุทร ขอถาวรวงศ์', 'smut.k@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นายสมุทร ขอถาวรวงศ์', email = 'smut.k@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'smut.k' AND r.code = 'MANAGER' ON CONFLICT DO NOTHING;

-- นางสาวนัทฐิภรณ์  ธวัชสุภา
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('nattiporn.t', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาวนัทฐิภรณ์  ธวัชสุภา', 'nattiporn.t@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาวนัทฐิภรณ์  ธวัชสุภา', email = 'nattiporn.t@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'nattiporn.t' AND r.code = 'SALES' ON CONFLICT DO NOTHING;

-- นางสาวนฤมล  บรรพตา
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('narumon.b', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาวนฤมล  บรรพตา', 'narumon.b@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาวนฤมล  บรรพตา', email = 'narumon.b@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'narumon.b' AND r.code = 'ACCOUNTING' ON CONFLICT DO NOTHING;

-- นางสาววิมลรัตน์ รักนา
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('wimonrat.r', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาววิมลรัตน์ รักนา', 'wimonrat.r@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาววิมลรัตน์ รักนา', email = 'wimonrat.r@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'wimonrat.r' AND r.code = 'SALES' ON CONFLICT DO NOTHING;

-- นางสาวจุฑากาญจน์ ถิ่นพฤกษ์งาม
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('juthakarn.t', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาวจุฑากาญจน์ ถิ่นพฤกษ์งาม', 'juthakarn.t@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาวจุฑากาญจน์ ถิ่นพฤกษ์งาม', email = 'juthakarn.t@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'juthakarn.t' AND r.code = 'SALES' ON CONFLICT DO NOTHING;

-- นายธัชพล มีมินท์
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('thatchaphon.m', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นายธัชพล มีมินท์', 'thatchaphon.m@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นายธัชพล มีมินท์', email = 'thatchaphon.m@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'thatchaphon.m' AND r.code = 'SALES' ON CONFLICT DO NOTHING;

-- นายณรงค์เดช แซ่ฮ่อ
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('Narongdej.s', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นายณรงค์เดช แซ่ฮ่อ', 'Narongdej.s@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นายณรงค์เดช แซ่ฮ่อ', email = 'Narongdej.s@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'Narongdej.s' AND r.code = 'SALES_MAINTENANCE' ON CONFLICT DO NOTHING;

-- นางสาวพิมพ์พิชชา ศรีวิสุทธิ์
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('pimpitcha.s', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาวพิมพ์พิชชา ศรีวิสุทธิ์', 'pimpitcha.s@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาวพิมพ์พิชชา ศรีวิสุทธิ์', email = 'pimpitcha.s@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'pimpitcha.s' AND r.code = 'VIEWER' ON CONFLICT DO NOTHING;

-- นางสาววรวลัญช์ อาวรณ์คุม
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('worrawalun.a', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาววรวลัญช์ อาวรณ์คุม', 'worrawalun.a@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาววรวลัญช์ อาวรณ์คุม', email = 'worrawalun.a@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'worrawalun.a' AND r.code = 'VIEWER' ON CONFLICT DO NOTHING;

-- นางสาวพรนภา ขวัญเมือง
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('admin', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาวพรนภา ขวัญเมือง', 'admin@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาวพรนภา ขวัญเมือง', email = 'admin@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'admin' AND r.code = 'WAREHOUSE' ON CONFLICT DO NOTHING;

-- นาย ธนพล ทิรอยรัมย์
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('thanapol.t', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นาย ธนพล ทิรอยรัมย์', 'thanapol.t@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นาย ธนพล ทิรอยรัมย์', email = 'thanapol.t@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'thanapol.t' AND r.code = 'SALES_MAINTENANCE' ON CONFLICT DO NOTHING;

-- นาย ณภัทร วีระกุล
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('napat.v', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นาย ณภัทร วีระกุล', 'napat.v@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นาย ณภัทร วีระกุล', email = 'napat.v@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'napat.v' AND r.code = 'SALES' ON CONFLICT DO NOTHING;

-- คุณมัลลิกา นาทบรรลือ
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('mallika.n', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'คุณมัลลิกา นาทบรรลือ', 'mallika.n@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'คุณมัลลิกา นาทบรรลือ', email = 'mallika.n@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'mallika.n' AND r.code = 'VIEWER' ON CONFLICT DO NOTHING;

-- นายจิรันธนิน บุญสุข
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('jiranthanin.b', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นายจิรันธนิน บุญสุข', 'jiranthanin.b@saengvithscience.co.th', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นายจิรันธนิน บุญสุข', email = 'jiranthanin.b@saengvithscience.co.th', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'jiranthanin.b' AND r.code = 'VIEWER' ON CONFLICT DO NOTHING;

-- นางสาวยลรดี สนคมิ
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('มะนาว', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นางสาวยลรดี สนคมิ', '', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นางสาวยลรดี สนคมิ', email = '', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'มะนาว' AND r.code = 'SALES' ON CONFLICT DO NOTHING;

-- นายบุญญฤทธิ์ ศรีจะบก
INSERT INTO users (username, password_hash, full_name, email, is_active) VALUES ('โต๋เต๋', '$2b$10$rQEY6iU3FMdK0Q5tMW0NLe5J8zL0xB8vMJ6XDxHBLQF8u8bZEQPHq', 'นายบุญญฤทธิ์ ศรีจะบก', '', true) ON CONFLICT (username) DO UPDATE SET full_name = 'นายบุญญฤทธิ์ ศรีจะบก', email = '', is_active = true;
INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'โต๋เต๋' AND r.code = 'VIEWER' ON CONFLICT DO NOTHING;
