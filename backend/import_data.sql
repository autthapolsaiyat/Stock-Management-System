-- ===========================================
-- SVS Stock Import Script
-- Generated: 2024-12-22
-- ===========================================

-- 1. ลบข้อมูลเก่า
DELETE FROM quotation_items;
DELETE FROM quotations;
DELETE FROM goods_receipt_items;
DELETE FROM goods_receipts;
DELETE FROM purchase_order_items;
DELETE FROM purchase_orders;
DELETE FROM sales_invoice_items;
DELETE FROM sales_invoices;
DELETE FROM stock_transactions;
DELETE FROM stock_balances;
DELETE FROM products;
DELETE FROM product_categories;
DELETE FROM units;
DELETE FROM suppliers;
DELETE FROM customers;
DELETE FROM warehouses;

-- 2. Reset sequences
ALTER SEQUENCE IF EXISTS products_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS product_categories_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS units_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS suppliers_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS customers_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS warehouses_id_seq RESTART WITH 1;

-- 3. คลังสินค้า (7 รายการ)
INSERT INTO warehouses (code, name, address, is_active) VALUES ('D2-1', 'ชั้น 2 – 1 (ในห้อง)', 'ตึก D (111/8)', true);
INSERT INTO warehouses (code, name, address, is_active) VALUES ('D2-2', 'ชั้น 2 – 2 (นอกห้อง)', 'ตึก D (111/8)', true);
INSERT INTO warehouses (code, name, address, is_active) VALUES ('D3-1', 'ชั้น 3 – 1 (ในห้อง)', 'ตึก D (111/8)', true);
INSERT INTO warehouses (code, name, address, is_active) VALUES ('D3-2', 'ชั้น 3 – 2 (นอกห้อง)', 'ตึก D (111/8)', true);
INSERT INTO warehouses (code, name, address, is_active) VALUES ('F2-1', 'ชั้น 2 ห้อง 1', 'ตึก F (111/12)', true);
INSERT INTO warehouses (code, name, address, is_active) VALUES ('G1-1', 'ตู้แช่', 'ตึก G (95/11)', true);
INSERT INTO warehouses (code, name, address, is_active) VALUES ('G1-2', 'ในห้อง', 'ตึก G (95/11)', true);

-- 4. หน่วยนับ
INSERT INTO units (code, name, is_active) VALUES ('EA', 'ชิ้น', true);
INSERT INTO units (code, name, is_active) VALUES ('BOX', 'กล่อง', true);
INSERT INTO units (code, name, is_active) VALUES ('BOTTLE', 'ขวด', true);
INSERT INTO units (code, name, is_active) VALUES ('SET', 'ชุด', true);
INSERT INTO units (code, name, is_active) VALUES ('PACK', 'แพค', true);
INSERT INTO units (code, name, is_active) VALUES ('ROLL', 'ม้วน', true);
INSERT INTO units (code, name, is_active) VALUES ('BAG', 'ถุง', true);
INSERT INTO units (code, name, is_active) VALUES ('KG', 'กิโลกรัม', true);
INSERT INTO units (code, name, is_active) VALUES ('GALLON', 'แกลลอน', true);
INSERT INTO units (code, name, is_active) VALUES ('VIAL', 'หลอด', true);
INSERT INTO units (code, name, is_active) VALUES ('PAIR', 'คู่', true);
INSERT INTO units (code, name, is_active) VALUES ('YEAR', 'ปี', true);
INSERT INTO units (code, name, is_active) VALUES ('LICENSE', 'License', true);
INSERT INTO units (code, name, is_active) VALUES ('CYL', 'ถัง', true);
INSERT INTO units (code, name, is_active) VALUES ('DR', 'Drum', true);
INSERT INTO units (code, name, is_active) VALUES ('ST', 'Sheet', true);
INSERT INTO units (code, name, is_active) VALUES ('เล่ม', 'เล่ม', true);
INSERT INTO units (code, name, is_active) VALUES ('รีม', 'รีม', true);
INSERT INTO units (code, name, is_active) VALUES ('ด้าม', 'ด้าม', true);
INSERT INTO units (code, name, is_active) VALUES ('ใบ', 'ใบ', true);
INSERT INTO units (code, name, is_active) VALUES ('แผ่น', 'แผ่น', true);
INSERT INTO units (code, name, is_active) VALUES ('เครื่อง', 'เครื่อง', true);
INSERT INTO units (code, name, is_active) VALUES ('ท่อ', 'ท่อ', true);
INSERT INTO units (code, name, is_active) VALUES ('แท่ง', 'แท่ง', true);
INSERT INTO units (code, name, is_active) VALUES ('เส้น', 'เส้น', true);
INSERT INTO units (code, name, is_active) VALUES ('กระป๋อง', 'กระป๋อง', true);
INSERT INTO units (code, name, is_active) VALUES ('กระปุก', 'กระปุก', true);
INSERT INTO units (code, name, is_active) VALUES ('ตู้', 'ตู้', true);
INSERT INTO units (code, name, is_active) VALUES ('คัน', 'คัน', true);
INSERT INTO units (code, name, is_active) VALUES ('ห่อ', 'ห่อ', true);
INSERT INTO units (code, name, is_active) VALUES ('ปี๊บ', 'ปี๊บ', true);
INSERT INTO units (code, name, is_active) VALUES ('BOLT', 'Bolt', true);

-- 5. หมวดหมู่สินค้า (47 รายการ)
INSERT INTO product_categories (name, description, is_active) VALUES ('AccuStandard', 'A.001', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Abraxis', 'A.002', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Amazon.com', 'A.015', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Arrowhead scientific', 'A.016', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('AB Sciex', 'A.017', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('ATEPE ARKAL', 'A.022', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('APP SYSTEMS SERVICES PTE LTD', 'A.024', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('AMK Glass', 'A.025', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('BVDA', 'B.002', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('BlueStar', 'B.003', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Bruker Singapore', 'B.007', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Charm', 'C.001', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Core-Lab', 'C.002', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Chemplex', 'C.003', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('CT Scientific', 'C.018', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Defsec global limited', 'D.003', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Digital Intelligence', 'D.004', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Digi-key', 'D.006', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Forensic', 'F.001', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Fume Care', 'F.003', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Gas', 'G.001', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Gold standard', 'G.002', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Horizon(Biotage)', 'H.002', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Hirox', 'H.004', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Hitachi High-Tech', 'H.007', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('InnoSpectra', 'I.007', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Im Chem', 'I.008', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Imtakt Corporation', 'I.009', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Impexron GmbH', 'I.010', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Kagaku Sobi', 'K.001', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Koehler', 'K.003', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Kurt J Lesker', 'K.004', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Leeds', 'L.003', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Leica', 'L.008', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('LIS', 'L.014', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Oxford', 'O.001', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Papillon', 'P.001', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Premier Lab', 'P.003', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Phenomenex', 'P.006', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Spex SamplePrep', 'S.001', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('SpexForensic', 'S.003', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('SCENESAFE', 'S.006', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Si-Ware', 'S.013', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Scientific Glass & Instruments Inc', 'S.014', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('Tri-Tech', 'T.001', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('ThermoFisher', 'T.004', true);
INSERT INTO product_categories (name, description, is_active) VALUES ('West Technology Forensics', 'W.003', true);

-- 6. ผู้จำหน่าย (295 รายการ)
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0001', ' Abraxis LLC.', '54 Steamwhistle Drive, Warminster PA 18974 US', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0002', ' AccuStandard, Inc.', '125 Market Street, New Haven CT 06513, USA', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0003', ' ATCC', '10801 University Blvd. Manassas VA 20110-2209 USA', '7033652700', 'sales@atcc.org', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0004', ' Ametek Commercial Enterprise (Shanghai) Co.,Ltd.', 'Part A, 1stFloor, No.460 North Fute Road, Waigaoqiao Free Trade Zone, 200131 Shanghai', '+862158685111', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0005', ' ATCC', '10801 University Boulevard, Manassas, Virginia 20110-2209 USA', '703-365-2700', 'sales@atcc.ort', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0006', ' Animation Supplies Ltd', 'Red Gable, Orchard Dell, Town West Chiltingtong, West Sussex, UK, Zip code RH20 2LB Contact name : Andrew Simmons', '+44(0) 1273 359356', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0009', ' American Oil Chemists Society', '2710 S.Boulder Dr Urbana IL61802-6996', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0010', ' ACELab Europe', 'Krizlkova 680/10b, Karlin, 186 00 Prague 8 the Czech Republic', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0011', ' Aoke Biology Research (HK) Co.,Limited', 'Room 1202, 12/F , OfficePlus@Prince Edward, 794-802 Nathan Road Mongkok, Kowloon, HongKong', '00852-30501808', 'sales@aokebio.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0012', ' AOAC International', '2275 Research Blvd, Ste 300 Rockkville,  MD 208500-3250 USA', '1-800-379-2622,+1-301-924-7077', 'customerservice@aoac.org', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0013', ' Axiom Test Equipment', '2610 Commetce Way Vista, CA 92081', '760-806-6600', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0014', ' Arvecon', 'Kiefernweg 4 69190 Walldorf', '+49 6227 6909170', 'info@arvecon.de', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0015', ' All Art Center', '56/30 ม.2 ถ.งามวงศ์วาน ต.บางเขน อ.เมืองนนทบุรี จ.นนทบุรี 11000', '02-9659269,081-6469618', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0016', ' Angel Beauty supply', '210/1-2 Lanluang Rd.Pomparb Bangkok Thailand 10100', '+662 6283632,+662 2827590', 'kpitaya@hotmail.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0017', ' ARMI/LGC', '276 Abby Road, Manchester NH 03103', '603 935 4100', 'emily.johnson@lgcgroup.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0018', ' Anton Paar Thailand', '90 CW Tower 39th Floor Unit NO A3902 Ratchadaphisek Road HuaiKhwang Sub-District HuaiKhwang District Bangkok 10310 Thailand', '02-1539785', 'info.th@anton-paar.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0019', ' Amazon', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0020', ' Aclmatic doo locks parts Expert', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0021', ' Arrowhead scientific', '11006 strang line rd lenexa ks 66215 US', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0022', ' AB Sciex(Distribution)', 'a division of AB Scix Pte Ltd Block 33 #01-03 Marsiling lndustrial Estate Road 3 Singapore 739256', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0023', ' www.alibaba.com', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0024', ' Apple South Asia(Thailand) Limited-Apple Iconsiam', '299 ถ.เจริญนคร แขวงคลองต้นไทร  เขตคลองสาน  กทม. 10600', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0025', ' Asian Star Trading Co., Ltd.', '582/12 Soi Sukhumvit 63 Ekamai Rd North Klongton Wattana Bangkok 10110', '02 3824000', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0026', ' Apical Scientific', '7-1 to 7-4 Jalan SP2/7 Tmn Serdang Perdana Seksyen 2 Seri Kembangan 43300 Malaysia', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0027', ' Agilent Technologies (Thailand) Ltd.(Head Office)', 'U Chu Liang Building 22/F Unit A D 968 Rama IV Road Silom Bangrak Bangkok 10500 Thailand', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0028', 'ร้าน A-care Gadget', '53/51 หมู่ 4 ตำบลบางพึ่ง อำเภอพระประแดง  จังหวัดสมุทรปราการ 10130', '0809355942', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0029', ' Apple South Asia(Thailand) Limited-Apple Central World', '999/9 rama 1 road Pathumwan Pathumwan Bangkok 10330', '', 'centralworld@apple.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0030', ' AB Sciex (Thailand) Limited', '252 SPE Tower 10th Floor Suite 1002 Phahonyothin Rd Samsen Nai Phaya Thai Bangkok 10400 Thailand', '', 'thaiinfo@phenomenex.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0031', ' Adorama Camera', '42 West 18th Street New York NY 10011', '', 'info@adorama.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0032', ' ASTA applied surface technology ascend', '16229 AICT Bldg 145 Gwanggyo-ro Yeongtong-gu Suwon-si Gyeonggi-do Republic of Korea', '', 'chhan@astams.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0033', ' www.acdsee.com', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0034', ' Absotec Co.,Ltd', '1/4 Mitrigit 9 Nimitmai Road Samwatawanoak Klongsaamwa Bangkok 10510 Thailand', '021908157', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0035', 'ร้าน ATOM TWENTY FAI CHAI', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0036', ' aCommerce Co Ltd', '689 Bhiraj Tower 33rd Floor Sukhumvit Road Klonglon Nua Wattana Bangkok 10110', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0037', ' Adobe Systems Software Ireland Ltd', '4-6 Riverwalk Citywest Eusiness Park Dublin 24 Irelend', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0038', ' ATEPE ARKAL', 'ZA DU BEL AIR 10 RUE MEGE MOURIES RAMBOUILLIT 78 78120', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0039', ' Applied Separations', '930 Hamiltion street allentown PA 18101 USA', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0040', ' APP SYSTEMS SERVICES PTE LTD', '11 Toh Guan Road East 03-01 APP EnterpriseBuilding Singapore 608603', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('A.0041', ' AMK Glass', '2880 Industrial way vineland NJ 08360 US', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0001', 'บริษัท พริมา ไซเอ็นติฟิค จำกัด', '', '02-4357434', 'inside_sales@primasci.com, sirichai@primasci.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0002', 'บริษัท บริษัท ออมนิซิสเตมส์ จำกัด', 'สํานักงานใหญ่ 10 ถ.สุทธิสารวนิจฉัย สามเสนนอก ห้วยขวางกทม. 10320', '', 'nipaporn@omni.co.th', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0003', 'SB Design Square SB Design Square Co., Ltd.', '126/150 หมู่ 1 ต.ปากเกร็ด อ.ปากเกร็ด จ.นนทบุรี 11120', '0-2832-4200', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0004', 'มาโคร บริษัท มาโครแคร์ จำกัด MACROCARE CO., LTD', 'สำนักงานใหญ่ 10/151 หมู่ 11 ซ.เพชรเกษม ต.อ้อมน้อย อ.ทุ่มกระแบน จ.สมุทรสาคร 74130', '0-2812-3515-19', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0005', 'บริษัท เจ.ไอ.บี. คอมพิวเตอร์ กรุ๊ป จำกัด', '99 ห้อง SB172 ชั้น 2 หมู่ 8 ถ.พหลโยธิน ถ.คูคต อ.ลำลูกกา จ.ปทุมธานี 12130', '0-2791-2000', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0006', 'บริษัท นิมเบิล คอปอเรชัน จำกัด บริษัท นิมเบิล คอปอเรชัน จำกัด', '933 อาคารรวมทนุไทย ชั้น10 ถ.มหาไชย แขวงวังบูรพาภิรมย์ เขตพระนคร กรุงเทพมหานคร 10200', '085-0703527,02-225-2430-1', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0007', 'Power Buy Power Buy', '7/1 ถนนบรมราชชนนี แขวงอรุณอมรินทร์ เขตบางกอกน้อย กรุงเทพ 10700', '02-904-2000', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0008', 'สยามภัทร สยามภัทร', 'แถวราชดำเนิน โรงแรมรัตรโกสินทร์', '02-622-2994,02-622-2949', 'rung.siampatra@gamail.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0009', 'แอ็คมี คอนซัลติ้ง เซอร์วิส จำกัด แอ็คมี คอนซัลติ้ง เซอร์วิส จำกัด', '116/60 ซ.ร่วมจิต ถ.รางน้ำ แขวง พญาไทย เขตราชเทวี กรุงเทพ 10400', '081-682-1555', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0010', 'น้องไนน์ รีโมท น้องไนน์ รีโมท', '', '081-488-9434,02-622-8980', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0011', 'มหาจักรคลองถม มหาจักรคลองถม (สำนักงานใหญ่)', '898 ถนนมหาจักร แขวงป้อมปราบ เขตป้อมปราบศัตรูพ่าย กรุงเทพ 10100', '0-2622-4477,0-2223-4236', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0012', 'บริษัท ราชวงศ์บรรจุภัณฑ์(1993) จำกัด บริษัท ราชวงศ์บรรจุภัณฑ์ จำกัด', '118-120 ถ.ราชวงศ์ (สำเพ็ง) แขวงจักรวรรดิ เขตสัมพันธวงศ์ กรุงเทพ 10100', '02-2245857,02-2245725', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0013', 'ร้านเพิ่มทรัพย์ (เจ๊จำลอง)', '', '02-4287100,02-224-4468', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0014', 'ห้างหุ้นส่วนจำกัด แสงเจริญซัพพลายส์ ห้างหุ้นส่วนจำกัด แสงเจริญซัพพลายส์', '400 ถนนมหาจักร แขวงป้อมปรายศัตรูพ่าย เขตป้อมปราบศัตรูพ่าย กรุงเทพ 10100 (ซอยข้างโรงหนังแค๊ปปิตอล คลอ', '02-221-6349,02-222-5572', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0015', 'T.N.C 1 GROUP ทีเอ็นซี 1 กรุ๊ป', 'คลองถมเซนเตอร์ ล๊อค 11-6. 1-7 ถ.เจ้าคำรพ แขวงป้อมปราบ เขตป้อมปราบศัตรูพ่าย กทม. 10100', '02-222-4889,096-265-6151', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0016', 'ร้านเจ๊บลคลองถมเซ็นเตอร์ ร้านเจ๊บลคลองถมเซ็นเตอร์', 'ล็อค E20-5,6 ถ.ยทราชสุขุม ป้อมปราบ กทม. 10100', '02-222-3812,02-224-7036', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0017', 'Inctech Metrological Center Co.,Ltd.  Inctech Metrological Center Co.,Ltd. (IMC)', '11/22  สายไหม 56/1  ถ.สายไหม  แขวงสายไหม เขตสายไหม  กรุงเทพฯ  10220', '02-909-8820-22,02-909-8823', 'mesa@imcinstrument.com, tae_imc@hotmail.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0018', 'Union Intersupply co.ltd. Union Intersupply co.ltd.', '9/50 หมู่ที่ 6 ซอยชินเขต 1/27 ถนนงามวงศ์วาน แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพ 10210', '0-2954-0771-2', 'wanpen@unionintersupply.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0019', ' Data Express Co., Ltd.', '635, 637 ถนนเจริญรัถ แขวงคลองสาม เขตคลองสาน กรุงเทพ 10600', '02-437-2697', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0020', 'บริษัท  เอส.ไอ.เทคโนโลยี จำกัด (สำนักงานใหญ่) S.I. Technology Co. Ltd', '10/414 ซ.คลองลำเจียก 12 แขวงนวลจันทร์ เขตบึงกุ่ม กรุงเทพ 101230', '0-2943-9542', 'sale.sitech.th@gmail.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0021', 'www.SICSTOCK.com www.SICSTOCK.com', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0022', 'บริษัท SPEED COMPUTER จำกัด', '604/3 ศูนย์การค้าพันธุ์ทิพย์พลาซ่า ชั้น 2 ห้อง 216-218 ถนนเพชรบุรี แขวงถนนเพชรบุรี เขตราชเทวี กรงเทพฯ 10400', '0-2656-6061', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0023', 'chemplex industries,lnc', '2820 sw 42nd Ave Palm City, FL34990 UNITED STATES', '(772)-283-2700', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0024', ' คลองถม', 'คลองถม แขวง สมเด็จเจ้าพระยา เขต คลองสาน  กรุงเทพมหานคร 10600', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0025', 'Test Test', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0026', ' ร้าน ซี.เค คาเมร่า', '152/1 ถ.ช้างคลาน ต.ช้างคลาน อ.เมือง จ.เชียงใหม่ 5100', '08-9413-4429,0-2909-8820-22', 'chollada_noi@hotmail.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0027', 'บริษัท ปภาวิน จำกัด (สำนักงานใหญ่)', '123 หมู่4 ถ.รายพฤกษ์ ต.มหาสวัสดี อ.บางกรวย จ.นนทบุรี 11130', '02-489-4949', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0028', 'บริษัท รุ่งอรุณแมชชีนเนอรี่ (1989) จำกัด (สำนักงานใหญ่)', '73/24-25 ถนนบรรทัดทอง แขวงถนนเพชรบุรี เขตราชเทวี กรุงเทพมหานคร 10400', '2143647,2142952', 'to_rama1989@yahoo.co.th , rungarune@gmail.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0029', 'บริษัท แลบแกแก๊ส(ประเทศไทย) จำกัด', '32/79 ซีพีพาร์คเลน ถ.นาลจันทร์ แขวงคลองกุ่ม เขตบึงกุ่ม  กรุงเทพฯ 10230', '0-2946-1694-8', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0030', 'บริษัท แพรกซ์แอร์ (ประเทศไทย) จำกัด', 'อาคารพรีเมียร์เพลช ชั้น 4 เลขที่ 2 ซอยพรีเมียร์ 2 ถนนศรีนครินทร์ แขวงหนองบอน เขตประเวศ กรุงเทพมหานคร 10250', '0-2715-1700,0-2706-1963', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0031', 'บริษํท บีแทค อินดัสเตรียล ออโดเมชั่น จำกัด', '115 ซ.สุขุมวิท 62/1 ถ.สุขุมวิท แขวงบางจาก เขตพระโขนง กรุงเทพฯ 10260', '02-332-5555,02-332-7901-9', 'CS15@btacia.co.th', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0032', ' Metrohm Siam Ltd.', '979/111-115 S.M. Tower 33rd Floor Phahonyothin Rd., Samsennai, Phyathai, Bangkok 10400', '+66-02 2980864', 'sales@metrohm.co.th', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0033', 'บริษัท แสงวิทย์ 2000 จำกัด', '66/701-702 หมู่ 5 ซอย จรัญสนิทวงศ์ 13 ถนนสายบางแวก แขวงคลองขวาง เขตภาษีเจริญ กรุงเทพฯ 10160', '02 861-9446-9,02 861-9451-4', 'saengvith@csloxinfo.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0034', 'บริษัท บิ๊ก คาเมร่า คอร์ปอเรชั่น จำกัด (มหาชน)', '115/1 ถนนสวัสดิการ 1 แขวงหนองแขม เจตหนองแขม  กรุงเทพฯ 10160', '0-2809-9956-65', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0035', 'บริษัท ซินโดม อิเลคทรอนิคส์ อินดัสตรี จำกัด', '66 ซอยประชาอุทิศ 59 แยก 3 แขวงบางมด เขตทุ่งครุ  กรุงเทพมหานคร 10140', '(662)872-6900', 'public@syndome.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0036', ' Scenesafe', 'Midas House 8 & 9 Burnham Business Park Springfield Road Burnham On Crouch, Essex CM0 8TE', '+44(0)1621 786654', 'sales@scenesafe.co.uk & finance@scenesafe.co.uk', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0037', ' ห้างหุ้นส่วนสามัญนิติบุคคล เพ็ชรรัตน์เภสัช สำนักงานใหญ่', '157/1,13-19 ถ.พรานนก แขวงศิริราช เขตบางกอกน้อย กรุงเทพมหานคร', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0038', 'บริษัท สุขศิริกู๊ดส์เซ็นเตอร์ จำกัด', 'ถนนเค้าค้ารพ แขวงป้อมปราบ เขตป้อมปราบศัตรูพ่าย กรุงเทพฯ 10100', '086-7768882,081-5584289', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0039', ' Jeab Lighter', 'ร้านติดถนนใหญ่ ปากซอบคลองถม ถนนเยาวราช ทางด้านโรงแรม', '026228230,0860360931', 'jeab_lighter@hotmail.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0040', ' http://www.bagfever.net/', '48/2 หมู่ 7 ต.คลองอุดมชลจร อ.เมือง จ.ฉะเชิงเทรา 24000', '085-918-9100', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0042', ' ชัชวาลย์', '', '02-2214144', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0043', ' Chiron Pharmasynth AS', 'Stiklestadveien 1 7041 Trondheim Norway', '+4773874490', 'sales@chiron.no', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('AP.0044', 'บริษัท อินเทรนด์ โปรเมด จำกัด', '48/173  ซอยสายไหม 84/4 ถ.สุขาภิบาล 5 แขวงสายไหม กรุมเทพมหานคร 10220', '02 992 8194', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0001', ' BLUESTAR', '16 Avenue De La Costa P.O.Box 246 Monte-Carlo 98005 Monaco', '+37797973177', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0002', ' BVDA  International BV', 'Emrikweg 31, 2031 BT HARRLEM. Postbus 2323, 2002, The Netherlands', '+310235424708', 'info@bvda.nl', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0003', ' Baruch Glattstein', '- -', '', 'info@identa-corp.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0004', ' BRUKER SINGAPORE PTE. LTD.', '11 BIOPOLIS WAY NO.10-10 THE HELIOS, SINGAPORE 138667', '6565007283', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0005', ' Bruker Optik GmgH', '76275 Ettlingen/Germany Rudolf-Plank-Str.27', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0006', 'Biopanda Reagents Biopanda Reagents', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0007', ' Bipea', 'CAP18 D19 - 189 rue dAubervilliers 75018 Paris - France', '+33(0)1 40 05 26 30', 'shipment@bipea.org', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0008', ' Biorbyt Ltd.', '5 Orwell Furlong, Cambridge, CB4 OWY United Kingdom', '+44 (0)1223 859 353', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0009', ' Bioscience.,inc', '2201 hangar place suite 200 allentown PA 18109', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0010', 'บริษัท บีตัสกรุ๊ป เทรดดิ้ง จำกัด', '170/160 soi phahonyothin 54/1 yak 4-10 tara klong thanon saimai bangkok 10220', '029668585', 'bgt@beatus.co.th', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0011', ' Bosch Corporation', ' 3-6-7 Shibuya, Shibuya-ku, Tokyo 150-8360, JAPAN', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0012', ' Bioinformatics Solutions lnc.', '204-470 Weber St.N Waterloo ON N2L 6J2 Canada', '5198858288', 'sales@bioinfor.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0013', 'ร้าน BB Easy', 'ชั้น B โซน A ห้างเซ็นทรัลปิ่นเกล้า 7/22 ถนนบรมราชชนนี แขวงอรุณอมรินทร์ เขตบางกอกน้อย กรุงเทพฯ 10700', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0014', ' Biosence Laboratory', '607/95 M.17 Bangsaothong Sub-District Bangsaothong Districe Samutprakarn 10570', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0015', ' Biotage Singapore Pte Ltd', '2 Venture Drive 24-01 Singapore 608526', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0016', ' Biotage LLC', 'Box 8 SE-751 03 Uppsala Sweden', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0017', ' Biotage Sweden AB', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('B.0018', ' Biocomma Limited', '104th FL.,Bldg.12,Zhonghaixin Park,Ganli 6th Rd .,Jihua St.,Longgang,shenzhen 518114,P.R.China', '', 'marketimg@biocomma.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0001', ' CrimeTech, Inc.', '11111 San Jose Blvd, Ste 70-200 Jacksonville, FL 32223', '904-880-9688', 'bsmith@crimetech.net', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0002', ' CHARM SCIENCES INC.', '659 Andover Street, Lawrence, MA 01843-1032, USA', '', 'info@charm.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0003', ' Core-Lab Refinery System', '19 Roszel Rd., Princeton, NJ 08540', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0004', ' Cambridge Isotope Laboratories, Inc.', '50 Frontage Road, Andover, MA 01810-5413 USA', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0005', ' Chemicals Evaluation and Research Institute', '1600, Shimo-takano, Sugito-machi Kitakatsushika-gun, Saitama, Japan', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0006', ' CHINA NATIONAL PUBLISHING INDUSTRY TRADING CORPORATION', 'NO.504, ANHUALI, ANDINGMENWAI BEIJING CHINA', '86-10-64243632,86-10-64257332', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0007', ' Council Of Europe / Conseil de I Europe', '7 allee Kastner CS 30026F - 67081 Strasbourg , France', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0008', ' CDN Isotopes', '88 Leacodk Street, Pointe-Claire, Quebec, Canada', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0009', ' Chem Service, Inc.', '660 Tower Lane, PO. Box 599 West Chester, PA 19380 USA', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0010', 'CST - Crime Science Technology CST - Crime Science Technology', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0011', ' Chemplex industries, inc', '2820 SW 42ND AVE Palm city FL 349905573 US', '17722832700', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0012', ' Chemical house & Lab instrument co.,LTD', '98 ramkhamhaeng 21 rd phlabphla wangthonglang Bangkok 10310 Thailand', '023190792-3,021844000', 'chemical@chemihouse.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0013', ' Cryotherm GMBH & Co.KG', 'AN DER B 62 57555 EUTENEUEN', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0014', ' Central JD Commerce (Head Office)', '9 G Tower Grand Rama 9 22-23 Floor Rama 9 road Huaykwang sub-District Huaykwang Disrtict Bangkok 10310', '020304200', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0015', ' CFR Engines lnc', 'N8 W22577 Johnson Dr Pewaukee WI 53186 United States of America', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0016', ' Crest Systems (M) Sdn Bhd', 'No 1 Jalan OP 1/2 One Puchong Business Park 47160 Puchong Selangor Malaysia', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0017', ' Coolbot', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0018', ' CK software', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0019', ' CT Scientific PTE LTD', 'BLK 1003 TOA PAYOH INDUSTRIAL PARK 02-1507  Singapore 319075', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0020', ' Cole-Parmer company', '65 Liberty street metuchen NJ 08840 US', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('C.0021', 'ร้าน CCTV&Tools', '88/31 หมู่ 12 ต.นาป่า อ.เมือง จ.ชลบุรี 20000', '0869345600', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('D.0001', ' Danish Fundamertal Metrology Ltd.', 'Matematiktorvet 307  DK-2800 Kgs. Lyngby', '+4545931144', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('D.0002', ' DSLRshop.net', '580/6 ลาดพล้าว112 แขวงพลับพลา เขตวังทองหลาง กรุงเทพฯ 10310', '02-934-5159,081-401-9912', 'dslrshop@hotmail.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('D.0003', ' Digilife Photo', '2203 2nd Floor Pantip Plaza,Pectchuri Rd., Ratchathevee Bangkok 10400', '088-4366303,086-4053820', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('D.0004', ' Daiso Sangyo (Thailand)', '1/7-9 Warehouse F,G,H Klongsongtonnoon Ladkrabang Bangkok 110520', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('D.0005', ' DWK Life Sciences Inc.', '1501 N 10TH Street Millville NJ 08332-2093  USA', '856 825 1100', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('D.0006', ' Defsec Global Limited', 'Unit 31C Stephenson s Way Formby L37 8EG Merseyside United Kingdom', '', 'vic@defsecglobal.co.uk', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('D.0007', ' Digital Intelligence Inc', '17165 West Glendale Drive New Berlin WI 53151-2737 US', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('D.0008', ' DiagnoCine LLC', '370 Golf Place Hackensack NJ07601', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('D.0009', ' Digi-Key electronics', '701 Brooks AVE South P.O. box 677 Thief river falls MN 567010677 US', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('E.0001', ' Elektron Technology UK Ltd.', 'Woodland Road, Torquay, Devon, TQ2 7AY United Kingdom', '+44(0)1803407701', 'europe@elektron-technology.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('E.0002', ' Eiken Chemical Co.,Ltd.', 'International Business Division, 4-19-9 Taito, Taito-Ku, Tokyo 110-8408, japan', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('E.0003', 'element 14 element 14', '15 Tai Seng Drive 05-01 Singapore 535220', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('E.0004', ' ET Enterprises Limited', '45 Riverside Way Uxbridge Middx UB8 2YF, UK', '+44(0)1895 200880', 'sales@et-enterprises.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('E.0005', ' Ebay.com', '', '', 'www.ebay.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('E.0006', ' European commission', 'Retieseweg 111,B-2440 Geel, Belgium', '+32 (0) 14 571 705', 'jrc-rm-distribution@ec.europa.eu', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('E.0007', ' Evident', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('E.0008', ' Edax', '91 mckee drive', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('E.0009', ' ET&IT Solution CO.,LTD', '120,122 Bangbon 3 Road Nongkhem Bangkok 10160', '097-2511681', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('E.0010', ' Everspry & Techonlogy LTD', 'Yinfeng BAI XiXian Street NO31 High-tech zone dalian 116000', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('E.0011', ' Eurofins abraxis INC', '124 railroad drive warminster pa 189741449 US', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('E.0012', ' Eurofins Food Testing (Thailand) Co., Ltd', '50 คณะวิทยาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์ ถนนงามวงศ์วาน ลาดยาว จตุจักร  กรุงเทพฯ 10900', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('E.0013', ' Eurofins Technologies Singapore Pte Ltd', '61 Science Park Rd 05-03/08 The galen Singapore Science Park II Singapore 117525', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('F.0001', 'ร้าน Final Tool Shop (สำนักงานใหญ่)', '67/1 ม.4 ต.ปากฉลุย อ.ท่าฉาง จ.สุราษฎร์ธานี 84150', '0843449433', 'finaltoolshop@gmail.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('F.0002', ' Fumecare Limited', 'Suite 8 Jubilee House Altcar Road Formby Merseyside L37 8DL United Kingdom', '', 'office@gumecare.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('F.0003', ' FUTURE AIR ELECTRIC', '5/269 ซ.โกสุมรวมใจ 43 แยก 16 ถ.โกสุมรวมใจ แขวงดอนเมือง เขตดอนเมือง กทม. 10210', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('G.0001', ' Gemological Research (Thailand) Co.,Ltd', '968 Rama IV Road Silom Bangrak Bangkok 10500', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('G.0002', ' Geminii 2518', '99 ม.8 ต.คูคต อ.ลำลูกกา จ.ปทุมธานี 12130', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('G.0003', ' Gold Standard Diagnostics Budapest', '61 Science park road 05-03/08 The galen Singapore 117525', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('H.0001', ' HAZTECH SYSTEMS, INC.', 'P.O. BOX 929 Mariposa, CA 95338', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('H.0002', ' Horizon Technology (biotage)', '16 Northwestern Drive, Salem, NH 03079', '603 893-3663', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('H.0003', ' Henso Medical (Hangzhou) Co.,Ltd.', 'No.789, Shenhua Rd, Xihu District, Hangzhou 310030, China', '+8657186043296', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('H.0004', ' Hirox Asia Ltd.', 'Unit 826, 8/F, Ocean Centre, Harbour City 5 Canton Rd., Tsimshatsui, Kowloon, Hong Kong', '+85281989679', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('H.0005', ' Health Sciences Authority', '11 Outram Road Singapore 169078', '65 6213 0838', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('H.0006', ' Health England', 'London Corporate Service Centre, CPB Services 2nd Floor,280 Bishopsgate London,EC2M 4 RB', '01980 619938', 'remittances@phe.gov.uk', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('H.0007', ' Hirox Co., Ltd.', '2-15-17 Koenji minami, Suginamiku TOKYO 166-0003 Japan', '+81-3-3311-9911', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('H.0008', ' Hitachi High-Tech Analytical Science Shanghai', 'No.129, Lane 150, Pingbei Rd.,  xinzhuang Industry Park,Minhang District Shanghai 201109', '+862164908280', 'china.orders@oxinst.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('H.0009', ' Harry Gestigkeit GMBH', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('H.0010', '  Hitachi High-Tech Analytical Science GmbH', ' Wellesweg 31, 47589  Uedem, Germany  Uedem Hub Germany', '', 'HHA.UEDOrders@hitachi-hightech.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('I.0001', ' INTERNATIONAL ATOMIC ENERGY AGENCY', 'PO Box 100, 1400 Vienna Austria', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('I.0002', ' Identa Company', 'Bethlehem Road 120 9342001 Jerusalem Israel', '972 +972-2-5872220', 'info@identa-corp.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('I.0003', ' IFM Qualityservices pty ltd', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('I.0004', ' IDES Canada lnc', 'Haddadi 431 Alden Rd, Unit 3', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('I.0005', ' IFBM Parc du Techncpole de', '7 rue du bois de la ChampelleBP 267, F-54512,  Vandeuvre-les-Nancy Cedex', '+33 0 (3) 83 44 88 00', 'contact@qualtech-groupe.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('I.0006', ' IKANO (THAILAND) LIMITED (IKEA)', '38 ม.6 ถ.บางนา-ตราด กม.8 ต.บางแก้ว อ.บางพลี  จ.สมุทรปราการ 10540', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('I.0007', 'ร้าน invadeIT', '60/22 Petchkasem Road ตำบลหัวหิน อำเภอหัวหิน ประจวบคีรีขันธ์ 77110', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('I.0008', ' InnoSpectra Corp', 'No 11 Li Hsin Rd Science Park Hsinchu Taiwan 300', '88635772000', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('I.0009', ' I J Walsh Limited', 'Unit 1 Southbrook Mews (I J Walsh Ltd) Southbrook Road SE12 8LG London United Kingdom', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('I.0010', ' Im Chem', '164 Avenue joseph kessel batiment 7 78960 Voisins le Bx', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('I.0011', ' IKA Works (Thailand) Co. Ltd.', '555/48 JW Urban Home Office Songprapha Road,  Don Mueng Sub-District 10210 Don Mueng District, Bangkok', '020594690', 'sales.lab-thailand@ika.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('I.0012', ' Imtakt Corporation', 'Kyoto Research park 134 chudoji-minami shimogyo  kyoto 66008813 JP', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('I.0013', ' Impexron GmbH', '72793 Pfullingen Baden-Wurt Germany', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('I.0014', ' Ion opticks pty LTD', '68-70 Hanover St Fitzroy VIC 3065  Australia', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('J.0001', ' Jinyin Bussiness Co.,Ltd.', '18, B ZUO, 171 GUANGYUAN M ROAD BAI YUN CHINA', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('J.0002', 'ร้าน J J Sound', 'ปากซอยทิพย์วารี ถ.พาหุรัด แขวงวังบูรพา เขตพระนคร กทม. 10200', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('J.0003', ' Just Great Software co.Ltd.', '165/3 Rawai Phuket 83130 Thailand', '', 'sales@jgsoft.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('J.0004', 'ร้าน JPJ JOTHA', '630/211 พาต้าปิ่นเหล้าด้านหลัง ติดร้านแว่นท๊อปเจริญ ถ.สมเด็จพระปิ่นเกล้า แขวงบางยี่ขัน เขตบางพลัด กรุงเทพฯ 10700', '0898950908,0988862158', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('K.0001', ' KAGAKU SOBI KENKYUSHO LTD.', '47-8, 2-Chome, Minamidai, Nakano-KU Tokyo, 164-0014 Japan', '0333826511', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('K.0002', ' King power duty free co.ltd', '222 Vibhabadi Rangsit Rd,Sanambin, donMueang Bangkok 10210', '+66 2134 8999', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('K.0003', ' Katanax', '2022 Lavoisier Suite 100 Quebec City QC GIN 4L5 Canada', '+1 (418) 657-6201', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('K.0004', ' Koehler', '85 Corporate Drive Holtsville, NY 11742-2007', '631-589-3800', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('K.0005', ' kiss industrial & scientific', '47/15 soi 23 phahonyothin road pak phriao mueang saraburi 18000 Thailand', '036212700-1', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('K.0006', ' Ksys Corp Co.,Ltd', '13 soi chan2 yak5 chan Rd Thungwaddorn Sathorn Bangkok Thailand 10120', '', 'info@ksys.co.th', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('K.0007', ' Kurt J Lesker', '1925 Route 51 Jefferson Hills PA 15025 United States', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('K.0008', 'Koehler', '1595 Sycamore Avenue Bohemai , NY  11716-1732', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('L.0001', ' LGC Standards GmbH', 'Mercatorstr.51 DE-46485 Wesel', '+49028198870', 'de@lgcstandards.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('L.0002', ' Leeds Forensic Systems, INC.', '17300 Medina Road, Suite 600 Minneapolis MN 55447 USA', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('L.0003', ' Labo America Inc.', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('L.0004', ' Labor Veritas AG', '', '0442832930', 'admin@laborveritas.ch', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('L.0005', ' Leica Geosystems Technologies Pte Ltd', '', '+65 6511 6511', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('L.0006', ' LND, INC', '3230 Lawson BLVD', '', 'info@lndinc.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('L.0007', ' www.lazada.co.th', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('L.0008', ' LGC Standards Proficiency Testing', '1 Chamberhall Business Park Chamberhall Green Bury Lancashire BL9 0AP UK', '+44 (0) 161 762 2500', 'ptcustomerservices@lgcgroup.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('L.0009', ' Lafayette Instrument Company ,Inc', '3700 Safamore Parkway North Lafayette IN 47904 USA', '(765) 423-1505', 'accounting@lafayetteinstrument.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('L.0010', ' LUOYANG JIN FENG OFFICE FURNITURE', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('L.0011', ' Labcenter', '21 Hardy Grange, Grassington, Skipton, North Yorkshire BD23 5Aj UK', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('L.0012', ' Laboratory instrument specialists', '9842 Glenoaks Blvd Sun valley CA 91352', '', 'info@LisSci.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('L.0013', ' Lenovo', '12th Floor AIA Capital Center 89 Ratchadaphisek Road Dindaeng Dindaeng Bangkok 10400', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('M.0001', 'MOUSER ELECTRONICS MOUSER ELECTRONICS', '10000 North Main Street Manfield, TX 76063', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('M.0002', 'Marche World (m) Sdn Bhd Marche World (m) Sdn Bhd', 'Wisma D Ruby, no 1-GD-C, Jalan 6 Selayang Pandang, 68100 Batu Caves, Selangor Darul Ehsan', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('M.0003', ' masterlab a Nutreco company', 'veerstraat 38 5831  JN Boxmeer The Netherlands', '+31 485 589 470', 'Masterlab@nutreco.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('M.0004', ' Music-BLVD.com', '383/34-35 Chakkaphatdiphong Rd Pomprab  Bangkok 10100 Thailand', '0834972227', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('M.0005', ' My AliExpress', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('M.0006', ' Mystaire', 'Post Office Box 825 Creedmoor NC 27522', '919-229-8511', 'Accountsreceivable@mystaire.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('M.0007', ' Mistral Security, Inc.', ' 7910 Woodmont Ave, Suite 820, Bethesda, MD 20814', '', 'opaz@mistralgroup.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('M.0008', ' Monera technologies corporation', '2201 Hangar Place Suite 200 Allentown PA 18109 USA', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('M.0009', ' MAY 7', '801/328 ม.8 ต.คูคต อ.ลำลูกกา จ.ปทุมธานี 12130', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('M.0010', 'ร้าน MEE ปกประกาศนียบัตร', '7/119 หมู่ 5 ต.บางใหญ่ อ.บางใหญ่ จ.นนทบุรี 11140', '093-4969446', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('M.0011', ' MAZUT INTERNATIONAL HK LIMITED', 'G/F13 SHEK KIP MEI STREET SHUI PO KOWLOON HONG KONG', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('M.0012', ' Microsoft Regional Sales Pte Ltd', '182 Cecil Street 13-01 Frasers Tower Singapore 069547', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('M.0013', ' MJC Shop', '5 ซอย 15 ศิริเกษม แขวงบางไผ่ เขตบางแค กรุงเทพฯ 10160', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('M.0014', ' Mohaned Aittaleb', 'Route de vallaire ouest c ecublens VD 1024 CH', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('N.0001', ' Standard Reference Materials', '100 Bureau Drive Gaithersburg, MD 20899-2300', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('N.0002', ' NU-CHEK-PREP, INC', '109 W MAIN ST ELYSIAN, MN 56028 UNITED STATEES', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('N.0003', ' NanoComposix Inc.', '4878 Ronson Ct.Ste.K San Diego CA92111 USA', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('N.0004', ' NSI Solutions Inc.', '7212 ACC Blvd. Raleigh, NC 27617', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('N.0005', ' Nexbio (Thailand) Co.Ltd', '600/15 บี าแควร์ พระราม 9 เหม่งจ๋าย ซอยรามคำแห่ง 39 (เทพลีลา1) แขวงวังทองหลาง เขตวังทองหลาง กรุงเทพฯ 10310', '+662-5307833,+662-5307839', 'info.thailand@nexbio.asia', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('N.0006', ' National Measurement Institute', '105 Delhi Road North Ryde, NSW 2113  Australia', '+61 2 9449 0111', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('N.0007', ' Nodal Ninja', '3454 N San Marcos Pl Ste#9 chandler AZ85225 United states', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('N.0008', ' N.T. Mobile', 'คลองถมเซ็นเตอร์ ล็อค D2-4/ D2-5', '02-2244782,084-0862288', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('N.0009', ' Ning auto', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('N.0010', ' Networking Hardwares LLC', '15375 Barranca Pkwy K-101 Irvine CA 92618 US', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('N.0011', 'ร้าน NC Tools Shop', 'Shopee', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('O.0001', ' Oxford Instruments (Shanghai) Co.,Ltd.', 'No.129, Lane 150, Pingbei Rd., Minhang District Shanghai, China 201109', '+862164908280', 'china.orders@oxinst.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('O.0002', ' Oxford Instruments Analytical Ltd.', 'Wellesweg 31, 47589 Uedem, Germany', '+4928259383105', 'ia-uedem-order@oxinst.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('O.0003', ' Oak Ridge National Laboratory', 'Post Office Box 2008 OAK RIDGE, Tennessee 37831-6158', '', 'nicholscj@ornl.gov', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('O.0004', ' Omega', '1 Kaki bukit view 05-29 Techview Lobby C Singapore 415741', '+65 6415 5353', 'info@sea.omega.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('O.0005', ' Oxford Instruments Magnetic Resonance', 'Tubney Woods, Abingdon, Oxon OX13 5QX UK', '+44 0 1865 393200', 'magres.shipping@oxinst.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('O.0006', ' Organic Wealth (Thailand) Co.,LTD', '212/61 Moo 3 Prekasamai Muangsamuthpakarn  Samuthpakarn 10280', '', 'cs@organic-wealth.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0001', ' Public Health England Culture Coleections', 'Porton Down, Salisbury sp4 ojg gREAT bRITAIN', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0002', ' Premier Lab Supply', '1982 S.W. Hayworth Avenue Port St Lucie, FL 34953 USA', '7728731700', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0003', ' PROOF-ACS GmbH', 'Hamburg 21079 Germany', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0004', ' Parts-People.com, Inc', '2929 Longhorn Blvd, Suite #101 Austin, TX787587514', '(512) 339-1990', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0005', ' PassMark Software Pty Ltd', 'Level 5 63 Foveaux St. Surry Hills, 2010 Sydney Australia', '+612 9281 7093', 'sales@passmark.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0006', 'ร้าน Projector PRO', '474 ศูนย์การค้าพันธุ์ทิพย์ ประตูน้ำ 604/3 ถ.เพชรบุรี เพชรบุรี ราชเทวี กทม.10400', '0-26566161', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0007', ' PU INK', '', '087-099-4479', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0008', ' Papillon Ao', ' Prospekt Makeeva 48, Miass, Chelyabinskaya Oblast, 456320, RUSSIA', ' +7(3513) 546433', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0009', ' ProTherapySupplies', 'L750 Breck nridge Pkwy Sule 200', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0010', 'ร้าน PPP Shop', '449 ตลาดคลองถมเซ็นเตอร์ ล๊อค E10-4 ถ.มหาจักร เขตป้อมปรามศัตรูพ่าย กทม 10100', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0011', ' Phenomenex', '411 Madrid Avenue Torranc, CA 90501 United States', '310-212-0555', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0012', ' P Camora จำหน่ายอุปกรณ์กล้อง', '44 ม.8 ต.สร้างปี่ อ.ราษีไศล จ.ศรีสะเกษ 33160', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0013', ' Promag Europe', 'HSBC US Dollar Sort 401276', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0014', ' Pall Corporation Filtration & Separations (Thailand) Ltd', '555 rasa tower 1 Unit 1602-1/1 16th floor Phahonyothin Rd Chatuchak Chatuchak bangkok 10900', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('P.0015', 'ร้าน PPP-Shop', '499 ตลาดคลองถมเซ็นเตอร์ ล็อต E10-4 ถนนวรจักร เขตป้อมปราบ กทม 10100', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('R.0001', ' Ransom International', '8301 E Pecos DR #D Prescott Valley AZ 86314', '928-778-7899', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('R.0002', ' RS Components Co.Ltd (Head Office)', '50 GMM Grammy Place 19th Floor Unit 1901-1904 Sukhumvit 21 Rd Klongtoey Nua Warrana Bangkok 10110', '026486868', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('R.0003', ' RAE BeNeLux', 'Aerial tronics DV BV S.Valentini Wassenaarseweg 75/1E 2223 LA Katwijk', '070-3223224', 'alex@aerialtronics.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('R.0004', 'ร้าน Rena Shop (Accessories)', '604/3 พันธุ์ทิพย์ประตูน้ำ ห้อง 205 ถ.เพชรบุรี เขตราชเทวี กทม 10400', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('R.0005', ' Regula LTD', '29 Kozlova Lane office 6 220037 Minsk Belarus', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('R.0006', ' Regula Baltija Ltd', '97 A.Pumpura street Daugavpils LV - 5404 Latvia', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0001', ' Spex SamplePrep', '203 Norcross Ave. Metuchen, NJ 08840', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0002', ' S & 2S MANAGEMENT CO.,LTD.', '36/106 หมู่ 9 ถ.ติวานนท์ ต.บางพูด อ.ปากเกร็ด จ.นนทบุรี 11120', '083-788-2525', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0003', ' Seishin trading co.,Ltd', '1-4-4, Minatojima-Minamimachi Chuo-ku, Kobe, 650-0047 Japan', '(81)78-303-3810', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0004', ' SCP science', '21800 Clark Graham Baie D Urfe QC H9X 4B6', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0005', ' STC Products Service Center Co.,Ltd', '646 Moo 4 Hoffen Bldg.1st Floor, Seri Thai Rd.,Khlong Kum, Bueng kum Bangkok 10240', '02-322-8999', 'disorn@stcpro.co.th', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0006', ' S.T.Japan', 'Leyendeckerstrasse 33 D-50825 Cologne Germany', '+49 (0) 2234 956372', 'contact@stjapan.eu', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0007', ' Salimetrics LLC', '101 Innovation Boulevard Suite 302 State College,PA 16803 USA', '814-234-7748', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0008', ' Sunflashlight.Blogspot.com', '50/6 ถ.อุดร-กุดจับ ต.บ้านเลี่อม อ.เมือง จ.อุุดรธานี 41000', '042-242775,042-130220', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0009', ' Super DRY Company Limited', '104/6 หมู่ 6 ต.นาเกลือ อ.บางละมุง  จ.ชลบุรี 20150', '038-411986-7', 'ar@superdry.co.th', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0010', 'www 11street', 'www.11street.com', '', 'mail@11street.co.th', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0011', ' Shopee', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0012', 'ร้าน SGC คลองถม 3M', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0013', ' Shenzhen Lvshiyuan Biotechnology Co.,Ltd', 'no2 binhai road dapeng shenzhen gu 518120 xhina CN', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0014', 'ร้าน Shoeyoursteps', '102/1 ซ.เจนพัฒนา เขตจตุจักร แขวงลาดยาว กทม. 10900', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0015', 'ร้าน Sci4kid', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0016', ' Simson pharma limited', 'b-307 sarita building prabhat industrial estate near dahisar toll dahisar east 400068 mumbai Maharashtra india', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0017', ' SATA applied surface technology ascend', '16229 AICT Bldg 145 Gwanggyo-ro Yeongtong-gu Suwon-si Gyeonggi-do Republic of Korea', '+82318930359', 'chhan@astams.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0018', ' Smartcopy ผู้นำเทคโนโลยีเครื่องทำสำเนา CD DVD', '1/74 ม.5 ต.บางเมือง อ.เมือง จ.สมุทรปราการ 10270', '', 'smartcopy@outlook.co.th', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0019', ' Shenzhen Reagent Technology', 'R7777 Hangcheng Wisdom Hangcheng street Bao an', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0020', ' Si-Ware Systems', '3360 Northwest 67th Avenue Suite 765 MIAMI  FL 33122 US', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0021', 'shopee Shenzhen KUAIQU Electronics Co Ltd', 'Pinghu Street Longgang District Shenzhen  Chian', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0022', ' Scientific glass & instruments INC', '2521 Fairway park DR STE 404 Houston TX 770927601 US', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('S.0023', ' SOFTVISION', '1723/58 ถ.จันทร์ แขวงทุ่งมหาเมฆ เขตสาธร กทม 10120', '024450147', 'info@softvisiononline.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('T.0001', ' TRITECH FORENSICS', '4019 Executive Park Blvd, Southport NC28461', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('T.0002', ' ThaiBBShop', '', '083-784-1287,098-439-3320', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('T.0003', ' ThermoFisher scientific', 'En vallaire Ouest C Case Postale CH-1024 Ecublens  Switzerland', '+41 (0) 21 694 71 11', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('T.0004', ' THONG LED', 'คลองถมเซ็นเตอร์ ล็อก D20-1-2 ถนนวรจักร  แขวงป้อมปราบ เขตป้อมปราบศัตรูพ่าย กทม. 10100', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('T.0005', ' Tara tech international co.,ltd', '265/2 Vanilla Moon Flr6th M604 Chan Rd Thung Wat Don Sathon Bangkok 10120', '02 6452752-3', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('T.0006', ' T-Mobile9', 'ชั้น 2 อาคารพันธุ์ทิพย์พลาซ่า ถนนเพชรบุรีตัดใหม่ เขตราชเทวี กทม 10400', '0854443684,0959587036', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('T.0007', ' The gypsun', '159/85 ถ.กัลปพฤกษ์ แขวงบางขุนเทียน เขตจอมทอง กทม 10150', '0819110147', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('T.0008', ' Thorlabs japan inc', '3-6-3 Kitamachi Nerima-ku  Tokyo 179-0081  Japan', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('T.0009', ' Thunder Optics', '1482 Rue du Professeur Joseph AAnglada A2 Montpellier 34090 FRANCE', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('T.0010', ' Thermo Fisher Scientific', ' Vlastimila Pecha 1282/12  Brno-?ernovice, 627 00, Czech Republic', '', ' CADbrobeacustomerservice@thermofisher.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('T.0011', ' TRITECH FORENSICS', '384 Internatinal Blvd.,unit 100 NC 28451', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('U.0001', ' U.S.Pharmacopeial Convention', '12601 Twinbrook Parkway Rockville, MD 20852-1790 USA', '+13018810666', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('U.0002', 'บริษัท ยูนิเวอร์แซล โปรดักส์ เทรดดิ้ง จำกัด', '73/137 ถนนบางแวก แขวงบางไผ่ เขตบางแค กรุงเทพฯ 10160', '66 -0-2496-0337,086-465-3010', 'bsc_1997@yahoo.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('U.0003', ' UA SPORTS (THAILAND) CO.,LTD', 'Slam Center Room 124 1st Floor 979 Rama 1 Road Pathumwan Bangkok 10330', '02-658-1711', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('U.0004', ' Uvison Technologies', '', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('V.0001', ' VIP INMAR', '411 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10320', '0927502184,0918242097', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('V.0002', ' VormVrij', 'Dorpsstraat 23 28851 AG Afferden', '', 'Yao@vormvrij.nl', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('W.0001', ' Wellington Laboratories Inc.', '345 Southgate Dr., Guelph, Ontario, Canada N1G 3M5', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('W.0002', ' Ward s Science', '5100 West Henrietta Road PO Box 92912 Rochester NY 14692-9102', '', 'wardscs@vwr.com', 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('W.0003', ' WI Tega', 'D-12489 Berlin Magnusstrasse 11 GF Dr. Andreas Rolfs AG Berlin-Charlottenburg HRB 49123', '030', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('W.0004', ' West Technology Systems Ltd,', 'Armstrong Way Greal Westem Business Park Yale', '', NULL, 30, true);
INSERT INTO suppliers (code, name, address, phone, email, payment_term_days, is_active) VALUES ('W.0005', 'ร้าน WW Computer', 'หน้าวิทยาลัยเทคนิคสมุทรสงคราม', '0894028800', NULL, 30, true);

-- 7. ลูกค้า (142 รายการ)
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('A.0001', ' ALS Laboratory Group (Thailand) Co.,Ltd. (Head Office)', '104 Phatthanakan 40, Phatthanakan Rd. Khwaeng Suan Luang, Khet Suan Luang, Bangkok 10250', '02-715-8700', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('A.0002', ' AZ Science (Thailand) Co.,Ltd.', '32 Pernpoom Bldg 3F, Soi Sukhumvit 87, Sukhumvit Rd., Bangjak, Phrakanong, Bangkok 10260', '02-311-4127', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('A.0003', ' Analytik Jena Far East (Thailand) Ltd. (Head Office)', '99/349 4th Floor Na-Nakorn Bldg., Chaengwattana Rd., Thungsonghong, Laksi, Bangkok 10210', '02-576-1920', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('A.0004', ' Absotec Co.,Ltd. (Head Office)', '70/26 Moo 5, Lumlugga Khong 6, Bungkumploy, Lumlugga, Pathumthani 12150 Thailand', '02-190-8157', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('A.0006', 'AVERY DENNISION AVERY DENNISION', '64/11 Moo. 4 Eastern Seaboard Induxtrial Estate Route no. 331, Pluak-Daeng District, Rayong 21140', '+66 38 954-588', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('A.0007', ' Am Spec', '1249 S.River Rd Suite 204 Cranbury NJ 08512', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('A.0008', ' ATC Industry (Thailand) Co.,LTD', '19/11 Netdee Rd Tambon saensuk amphur mueanchonburi chonburi province 20130', '038391919', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('A.0009', ' Almendra (Thailand) Ltd', '7/313 Moo6 Tumbol Mapyangporn Amphoe Pluakdaeng Rayong 21140', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('A.0010', ' Advance Solution Enterprise Co.,Ltd', '339/3 Soi Sinum ngurn Pracharaj 1 Rd Bangsue Bangkok 10800 Thailand', '', 'jitrakorn_Eti@hotmail.com', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('A.0011', 'บริษัท AB Sciex (ประเทศไทย) จำกัด', '252 อาคาร SPE Tower ชั้น 10 ถ.พหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('A.0012', ' Accelerating ddiscover of an efficacious Plasmodium vivax multivalent multi-stage vaccine', 'Laboratory room 603 6th floor Faculty of Medical Technology Mahidol University 999 Salaya Phutthamonthon District Nakhom Pathom Province 73170', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('A.0013', ' AmSpec (Thailand) Limited', 'PAV Building Unit B 6 Floor 72 Soi Klongnamkaew (Ladprao 42) Ladprao Road Samsaennok Huaykwang Bangkok 10310 Thailand', '0638018152', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('A.0014', ' American embassy bangkok', '120-122 wireless rd khet pathumwan ATTN GSO Procurement bangkok 10330', '022055610', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('AR.0001', ' มหาวิทยาลัยราชภัฏสวนสุนันทา', '1 ถนนอู่ทองนอก แขวงวชิระ เขตดุสิต กรุงเทพฯ 10300', '063-8369654', 'np_nature@yahoo.com', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('AR.0002', 'สถาบันฝึกอบรมและวิจัยการพิสูจน์หลักฐานตำรวจ สถาบันฝึกอบรมและวิจัยการพิสูจน์หลักฐานตำรวจ', 'สถาบันฝึกอบรมและวิจัยการพิสูจน์หลักฐานตำรวจ', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('AR.0003', 'ฝ่ายนิติเวชศาสตร์ โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย ฝ่ายนิติเวชศาสตร์ โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย', '1873 ถ.พระราม 4 แขวงปทุมวัน เขตปทุมวัน กทม. 10330', '02-256-4269#407', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('AR.0004', 'Ecolab Ecolab', '971, 973 Ploenchit Road, Lurnpini Pathumwan Bangkok 10330, Thailand', '+66 2126 9499', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('AR.0005', 'บริษัท ออคต้า เมมโมเรียล จำกัด', '44/80-82 ซ.รามอินทรา 65 ถ.รามอินทรา กม.6.5 แขวงท่าแร้ง เขตบางเขน กรุงเทพมหานคร 10230', '0-2945-8681-5', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('AR.0006', ' โรงพยาบาลชลบุรี', 'หมู่ 2 เลขที่ 69 ตำบลบ้านสวน อำเภอเมืองชลบุรี จังหวัดชลบุรี', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('AR.0007', ' สภ.ปากรอ', 'ม.6 ต.ปากรอ อ.สิงนคร จ.สงขลา 90300', '085-7458874', 'The-little_1345@hotmail.com', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('AR.0008', ' กองพิสูจน์หลักฐาน กลาง', 'สำนักงานตำรวจแห่งชาติ ถนนอังรีดูนังต์ แขวงวังใหม่ กทม. 10330', '084-4910811', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('AR.0009', 'บริษัท ออลซายน์ เทรดดิ้ง จำกัด', '187/173 หมู่ที่10 ถนนบางกลวย-ไทรน้อย ต.วัดชลอ อ.บางกรวย จ.นนทบุรี 11130', '02-0505512,081-826-2941', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('B.0001', ' Bayer Thai Co.,Ltd. (Head Office)', '130/1 North Sathon Road, Silom  Bangrak, Bangkok 10500', '02-232-7000', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('B.0002', ' Bio Molecular Laboratories (Thailand) Co.,Ltd.', '2301/2 New Petchburi Soi 47 (Soonvijai),  Bangkapi,Huaykwang, Bangkok 10310', '02-762-4048', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('B.0003', ' Bangpa-in Cogeneration Ltd. (Head Office)', '587 Sutthisarn Winitchai Rd., Dindaeng, Dindaeng, Bangkok 10400', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('B.0004', ' B.FOODS PRODUCT INTERNATIONAL CO.,LTD. (Branch 00004)', '39 Moo.5 Chongsalika, Pattananikom. Lopburi 15220', '036-436-333-47', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('B.0005', ' BLCP Power Limited (Head Office)', 'No.9, I-8 Road, Map Ta Phut Industrial Estate Tambon MaptaPhut, amphur Muang, Rayong 21150', '038-918-576', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('B.0006', ' Bureau veritas consumer products services (Thailand) ltd', '383 Soi Soonvijai 4 (Rama 9 Soi 13 ) Rama 9  Rd Bangkapi,Huai Khwang, Bangkok 10310', '+66-2-0170650', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('B.0007', ' Bureau Veritas (Thailand) Ltd', '2170 Bangkok Tower 16th Floor New Petchburi Road Bangkapi Huaykwang Bangkok 10310 Thailand', '02 670 4800', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('B.0008', ' bare snacks', '430 S Lemon Ave # 5475N Walnut CA 91789', '509 554-5540', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('B.0009', ' BNU Myanmar co.,ltd', 'M-57 thiri Yadana Wholesale Complex North Okkalapa Tsp Yangon Myanmar', '', 'sannaingwin@bunmyanmar.com', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('C.0001', ' CERNTEK CO.,LTD.', '257 Soi Phetkasem 102/2 Bangkae Sub-district,  Bangkae District, Bangkok 10160', '02-809-3050', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('C.0002', ' CARGILL SIAM LIMITED (Head Office)', '130-132 Sindhorn Building Tower 3, 18th Floor, Wittayu Rd., Lumpini, Patumwan, Bangkok 10330', '034-200-215-9,034-254-224-7', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('C.0003', ' Chulabhorn Research Institute (Arsenic-Vietnam)', '54 Kamphaeng Phet 6 Rd., Laksi Bangkok 10210', '02-553-8555', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('C.0004', ' Colgate-Palmolive (Thailand) Limited (Head Office)', '19 Off Na-Ranong Rd, Sunthornkosa Rd, Kwaeng Klongtoey, Khet Klongtoey, Bangkok 10110', '02-249-0451', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('C.0005', ' CELESTICA THAILAND LTD. (Head Office)', '49/18 Leam Chabang Ind. Est. Moo 5 Tungsukla, Siracha, Chonburi 20230', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('C.0006', ' Cerebos (Thailand) Ltd. (Branch 00016)', 'Pinthong Industrial Estate II, 150/50 Moo 9, T.Nongkham A. Sriracha, Chonburi 20110 Thailand', '038-318-777', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('C.0007', 'บริษัท  ซีพีเอฟ (ประเทศไทย) จำกัด (มหาชน)', '20/2 หมู่ที่ 3 ถนนสุวินทวงศ์ แขวงแสนแสบ เขตมีนบุรี กรุงเทพฯ 10510', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('C.0008', ' Clariant Plastics & Coatings (Thailand) Ltd.', '700/848 Moo1 Tambol  Phan Thong, Ampur Phan Thong Chonburi 20160 , Thailank', '02 109 8400', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('C.0009', ' Corn Products (Thailand) Co.,Ltd', '40/14 Moo 12 ,Bangna Tower C, 12th Floor Unit A, Bangna-Trad Road Bangkaew, Bangplee, Samutpradarn 10540 Thailand', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('C.0010', ' H.C.Starck', '5, I-3A road T.Map Ta Phut A.Muang Rayong Rayong 21150', '038 683077-84', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('C.0011', ' CHEMICAL HOUSE & LAB INSTRUMENT CO.,LTD', '98 soi Ramkhamhaeng 21 (Navasri) Ramkhamhaeng Rd Phlabphla Wangthonglang Bangkok 10310 Thailand', '021844000', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('D.0001', ' Danone Dairy (Thailand) Co.,Ltd.', '8th Floor, Unit 804, Abdulrahim Place, No.990 Rama IV Road, Silom, Bangrak, Bangkok 10500', '02-649-2999', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('D.0002', ' DELTA ELECTRONICS (THAILAND) PCL.', '909 Soi 9, Moo 4, Bangpoo Industrial Estate (EPZ) Pattana 1 Rd., Phraksa, A.Muang, Samutprakarn 10280', '02-709-2800', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('D.0003', ' Dow Chemical Thailand Ltd.', '14th & 15th Fl., White Group Building II 75 Soi Rubia, Sukhumvit 42, Prakanong Klongtoey Bangkok 10110', '02-365-7000', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('D.0004', ' Dynamic Scientific Co.,Ltd.', '432 Preah Monivong Blvd., Phnom Penh 12301 Cambodia', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('D.0005', ' Donaldson (Thailand) Ltd', '7/217 moo 6 ,soi pornprapa pluakdaeng, rayong 21140 thailand', '66 3865 0280', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('D.0006', ' DKSH TECHNOLOGY LIMITED (HEAD OFFICE)', '2533 Sukhumvit Road Bangchak Prakhanong Bangkok 10260', '026397000', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('E.0001', ' Enburg Food Thai Co.,Ltd.', '88/8 Mu 2 Tambol Tabluang, Amper Mueng Nakornpathom, Thailand 73000', '034-291-177', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('E.0002', ' Energy and Environmental Service Co.,Ltd. (Branch 00001)', '42/4 Moo 8, Bo-Win Sub-district, Sriracha District, Chonburi 20230 Thailand', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('E.0003', ' ExxonMobil Asia Pacific Pte Ltd.', '1 HarbourFront Place, #06-00 HarbourFront Tower One, Singapore 098633', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('E.0004', ' บริษัท อี.เอ็ม.ดี.เทคโนโลยี จำกัด', '52/173 ซ.กรุงเทพกรีฑา 15 ถ.กรุงเทพกรีฑา ม. 13 แขวง/เขตสะพานสูง กรุงเทพฯ 10250', '02-7360866, 02-7360691 ,081-4703993', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('E.0005', ' Eco consultant company Limited', '32/3-4 หมู่ 4 ตำบลท้ายเกาะ อำเภอสามโคก จังหวัดปทุมธานี 12160', '02-9044366-7', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('E.0006', 'บริษัท E.W.Nutrition จำกัด', '10/97 อาคารเดอะเทรนดี้ ชั้นที่ 6 ซอยสุขุมวิท 13 เขตวัฒนาคลองเตยเหนือ กรุงเทพฯ', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('E.0007', ' Eastern Seaboard Environmental Complex Co.,Ltd', '88 Moo 8 Tambol Bowin Amphur Sriracha  Chonburi 20230', '038346364', 'esbec@wms-thailand.com', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('E.0008', ' Eurofins Food Testing', '', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('F.0001', ' F&N Dairies (Thailand) Limited (Branch 00002)', '90 Moo.8 Mitapap Rd., Phayayen, Pakchong, Nakonratchasima 30320, Thailand.', '044-322-192-4', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('F.0002', ' F&N Dairies (Thailand) Limited (Branch 00005)', '668 Moo 4, Rojana Industrial Park Zone 2, U-Thai, U-Thai, Ayuthaya, 13210', '035-746-822', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('G.0001', ' Guardian Industries Corp Ltd.', '42 Moo 7 Nongplamoh, Nongkhae, Saraburi 18140', '036-373-373', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('G.0002', ' GOSHU KOHSAN CO.,LTD. (Head Office)', '70 Moo 5 Kingkaew Road, Rachatheva, Bangphli, Samutprakarn 10540 Thailand', '02-312-4159', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('G.0003', ' Griffith Foods Llmlted', '129/11 M.17 T.Bangsaothong A.Bangsaothong,  Samutprutprakarn 10540 Thailand', '(66) 2 705 3335,(66) 2 315 1567-9', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('G.0004', ' GFPT Nichirei (Thailand)', '77 mu 4 Hang sung, nong yai  Chonburi 20190 Thailand', '038-932900-98', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('G.0005', ' Gerater pharma manufacturing co.,LTD', '55/2,55/7,55/1 หมู่1 ถ.ศาลายา-นครชัยศรี ต.ศาลายา อ.พุทธมณฑล จ.นครปฐม 73170', '662 - 886 8190 - 9', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('G.0006', ' GC Styrenics Company Limited', '555/1 Energy Complex Building A 15th Floor Vibhavadi Rangsit Road Chatuchak Chatuchak  Bangkok 10900 Thailand', '022658400', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('H.0001', ' HON CHUAN (THAILAND) CO.,LTD.', '101/116 Moo 20 Tumbol Klongneung, Aumphur Klongluang, Pathumthani 12120', '02-529-3189', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('H.0002', ' Hutchinson Technology Operations (Thailand) Co.,Ltd. (Head Office)', '50 Moo 4, Rojana Industrial Park, Ph8 (FZ) T.U-Thai A.U-Thai, Ayutthaya 13210', '035-334-800-7350', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('H.0003', ' Hokkaido University', 'Kita 8 Nishi 5 Kita-ku Sapporo Hokkaido 060-0808 Japan', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('I.0001', ' Indorama Petrochem Limited (Branch 00001)', 'No.4, Moo 2, Asia Industrial Estate, T. Banchang, A.Banchang, Rayong 21130, Thailand', '038-689-081', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('I.0002', ' IWASE (Thailand) Co.,Ltd. (Head Office)', '33/4 The 9th Towers Grand Rama 9, 17th Floor, Room No.TNB04 Rama 9 Rd, Huai Khwang, Huai Khwang, Bangkok 10310', '02-959-3600', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('I.0003', ' Indorama Polyester Industries Public Co.,Ltd. (Branch 00001)', '6,I-2 Rd, T. Map Ta Phut, A.Muang Rayong Rayong 21150', '038-683-870-8', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('I.0004', ' IRPC Public company limited', '', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('I.0005', ' IRD - PHPT Research Group', '195 (3-4 Floors) Kaew Nawarat Road Wat Ked Muang Chiang Mai 50000', '053240910-2', 'secretary@phpt.org', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('I.0006', ' Institut de Recherche pour le Developpement (IRD)', '11th Floor Kasem Uttayanin Building Chulalongkorn University 254 Henri Dunant Rd Pathumwan bangkok 10330', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('J.0001', ' JICA Be-HoBiD Profect', 'Princess Chulabhorn 60th Birthday Anniversary Bldg Faculty of Science Kasetsart University 50 Ngamwongwan RD Chatuchak Bangkok 10900', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('K.0001', ' Kiss Industrial & Scientific (Asia) Co.,Ltd.', '8/4-6 Soi 5 Thesaban 4 Rd, Pakpreow, Muang, Saraburi 18000', '036-318-353-4', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('K.0002', ' K-LAB Co.,Ltd. (Head Office)', '173/1 Moo.5 Aumpang, Banpaew, Samutsakhon 74120, Thailand', '034-883-143', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('L.0001', ' Loparex Co.,Ltd.', '500/69 Moo 2, T.Tasit, A.Pluakdaeng, Rayong 21140', '038-953-600', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('L.0002', ' Lab System', '53/1 ซอย พหลโยธิน 44 ถนน พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900', '02 241 5600', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('M.0001', ' MATTEL BANGKOK LIMITED (Head Office)', 'Bangpoo Industrial Estate, Export Zone, No.683 Soi 9 Moo 4, T.Praekasa, A.Muang, Samutprakarn, Thailand', '02-324-0373-5', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('M.0002', ' MAX DEVELOPMENT INTERNATIONAL CO.,LTD. (Head Office)', '324, 1ST Floor, Soi Lardpraw 94 (Panjamitr), Lardpraw Rd., Phlabphla, Wangthonglang, BKK 10310', '02-530-3890-252', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('M.0003', ' Minor Cheese Limited', '9/1 Moo 6 Soi Subchampa, Mitrapap Road Klangdong Pakchong Nakornratchasima', '', 'wi_su@minornet.com', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('M.0004', ' Mix Lab Co.,Ltd', '10/95 อาคารเดอะเทรนดี้ ชั้น 6 ซ.สุขุมวิท 13(แสงจันทร์) แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110', '082-3658808', ' info.mixlab@gmail.com', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('M.0005', ' Mead Johnson Nutrition (Thailand) Ltd.,', '14th Flr., Exchange Tower 388 Sukhumvit Road Klongtoey Bangkok 10110', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('M.0006', ' Monsanto Thailand', '', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('M.0007', ' Mars Petcare (Thailand) Co.,Ltd', '799 Mu 4 Chantuk Pakchong Nakhon Ratchasima 30130 Thailand', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('M.0008', ' Medco Energi Thailand (Bualuang) Limited', 'Q house Lumpini Building 28th fl 1 south sathorn road Sathorn bangkok 10120', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('N.0001', ' Nestle (Thai) Ltd. (Head Office)', '999/9 Rama I Rd., Pathumwan,  Pathumwan, Bangkok 10330', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('N.0002', ' National Starch and Chemical (Thailand) Ltd. (Branch No.00002)', '41 Moo 7, Teenanont Road, Najarn, Mueng, Kalasin 46000', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('N.0003', ' Nutreco Asia Co.,Ltd. (Head Office)', '399 Interchange 21 Building Unit 13, Floor 22 Sukhumvit Road North-Klongtoey, Wattana, Bangkok 10110 Thailand', '02-611-2706-7', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('N.0004', ' N-Health', '', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('N.0005', ' Natural energy refinery holding Co.,Ltd', '88 Soi Bang Na-Trat 30 Debaratana Road Bang Na Tai Bang Na Bangkok', '023993838-411-412', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('O.0001', 'OMIC บริษัท รับตรวจสินค้าโพ้นทะเล จำกัด (OMIC)', '12-14 ซ.เย็นอากาศ 3 ถ.เย็นอากาศ ช่องนนทรี ยานนาวา กรุงเทพฯ 10120', '02-6783074', 'laborin.th@omicnet.com', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('P.0001', ' PTT Global Chemical Public Company Limited (Head Office)', '555/1 Energy Complex, Building A, 14th-18th Floor, Vibhavadi Rangsit Rd., Chatuchak, Chatuchak, Bangkok 10900', '02-265-8400', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('P.0002', ' Procter & Gamble Manufacturing (Thailand) Ltd.', '112 Moo 5 Bangsamark, Bangna-Trad Highway Km.36, A.Bangpakong, Chacheongsao 24180, Thailand', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('P.0003', ' PerkinElmer Ltd. (Head Office)', '290 Soi 17 Rama 9 Road, Khwang Bangkapi Khet Huay Kwang, Bangkok 10310 Thailand', '02-319-7901', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('P.0004', ' JAPAN ELECTRICAL TESTING LABORATORY(THAILAND) CO.,LTD.', '46/173 Moo 12, Nuanchan Rd., Klongkum, Bungkum, Bangkok 10230', '02-363-7767-9', 'customerservice@letthailand.co.th', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('P.0005', ' Pandora Production Co.,Ltd.', '88 Soi Sukhapiban 2 Soi 31, Kwaeng Dokmai, Khet Praves, Bangkok 10250', '02-728-7200', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('P.0007', ' P&P Trading (สำนักงานใหญ่)', '110 หมู่ 5 ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200', '082-339-4089', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('P.0008', 'ห้างหุ้นส่วนจำกัด ห้างหุ้นส่วนจำกัด พี.วี อินสตรูเม้นท์', '14/169  หมู่ที่ 2 ถ.1  เทศบาล 2 ต. พิมลรราช อ.บางบัวทอง  จ.นนทบุรี 11110', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('P.0009', ' PTT Public Company Limited', 'Phrakhanong Office Terinal 555 Ardnarong Roak, Klongtoey, Bangkok 10260', '02-239-7146', 'apiwat.i@pttplc.com & aree.p@pttplc.com', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('P.0010', 'บริษัท ปตท. น้ำมันและการค้าปลีก จำกัด (มหาชน)', '555/2 ศูนย์เอนเนอร์ยี่ตอมเพล็กซ์ อาคารบี ชั้นที่ 12 ถนนวิภาวดีรังสิต แขวงจตุจักร เขตจตุจักร กรุงเทพมหานคร 10900', '02-1695959', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('P.0011', ' PTT Exploration and Production Public Company Limited', '555/1 Energy Complex, Building A, 19h-36th Floor, Vibhavadi Rangsit Rd., Chatuchak, Chatuchak, Bangkok 10900', '6625374000', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0001', ' SGS (Thailand) Limited (Head Office)', '100 Nanglinchee Road, Chongnonsee Yannawa, Bangkok 10120', '02-294-7485', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0002', ' Star Petroleum Refining Public Company Limited (Head Office)', 'No. 1, I-3B Road, Map Ta Phut, Muang, Rayong 21150, Thailand', '038-699-000', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0003', ' SIAM SYNTHETIC LATEX CO.,LTD.', '75 Soi Sangchan-Rubia, Sukhumvit Rd.,  Prakanong, Klongtoey, Bangkok 10110', '02-365-7000', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0004', ' SciSpec Co.,Ltd. (Head Office)', '10 Kanchanapisek Rd., Soi 0010 2nd junction Bangkae, Bangkok 10160', '02-454-8533-4', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0005', ' Siam City Cement Public Company Limited (Branch 00001)', '99,219,301 Moo 5, Mitaparb, Tambon Tapkwung, Amphur Kangkhoi, Saraburi 18260 Thailand', '036-240-930', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0006', ' Somsak Kitmungsa', '399 Interchange 21 Building Unit 13, Floor 22  Sukhumvit Road Bangkok, 10110', '02-611-2706-7', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0007', ' SLP NAVANAKORN LTD.,PART', '54/80-82 Navanakorn Industrial Estate, Klong Nueng Klong Luang, Pathumthani 12120', '02-909-0201-5', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0008', ' SGS (Cambodia) Limitted', 'No. 1076A-C, Street 371, Sangkat Stung Meanchey, Khan Meanchey, Phnom Penh, Kingdom of Cambodia', '088523967888', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0009', ' SOPHEAR PHARMA CO.,LTD.', 'NO. 12EO, PHUM POBROK, SK.KAKAB, KH. DANGKOR, CAMBODIA', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0010', 'SPRC SPRC', '', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0011', 'บริษัท  เอส แอนด์ พี ซินดิเคท จำกัด (มหาชน)', ' เลขที่ 2034/100-107 ชั้น 23 อาคารอิตัลไทย ทาวเวอร์ ถนนเพชรบุรีตัดใหม่  แขวงบางกะปิ เขตห้วยขวาง กรุงเทพฯ 10310', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0012', ' Siam Chemical Industry CO., LTD', '159/34 serm-mit towet 20th floor, sukhumvit 20 road (asoke) kwang north klongtoey, khet wattana bangkok, 10110, thailand', '+66(0)22607400', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0013', ' S.P.S Consulting Service co.,Ltd', '7 Soi Phaholyothin 24 Phaholyothin Road., Jompol, Chatuchak Bangkok 10900', '0-2939-4370', 'jutamas@spscon.com', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0014', ' Siri Instrument Co.,Ltd', '77/145 Sukhaphiban 5 Rd., O Ngoen SaiMai Bangkok 10220 Thailand', '025401988', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0015', ' Sunjin Myanmar Co.,Ltd.ire', 'Room 207 Maha Land Center 56 Kabar Aye Pagoda Rd Yongon Myanmar', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('S.0016', ' Shipito Ltd', '21 4 Street Lammadaw Township Yangon Myanmar', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0001', ' TUV Rheinland Thailand Ltd. (Head Office)', '18/F, Tararom Business Tower, 2445/36-38 New Petchaburi Rd, Bangkapi, Huay Kwang, Bangkok 10320', '02-318-4862', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0002', ' TPT PETROCHEMICALS PUBLIC COMPANY LIMITED (Branch 00001)', '3,I-7 Map Ta Phut Industrial Estate Rd, Map Ta Phut, Muang, Rayong 21150', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0003', ' The Asia Foundation-Thailand', 'Q. House Convent Bldg., Floor 6D 38 Convent Road, Silom Bangkok 10500', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0004', ' THAI PLASTIC AND CHEMICALS PUBLIC COMPANY LIMITED', 'Rajanakarn Bldg., 14th-15th Floor, 183 South Sathorn Rd, Yannawa, Sathorn, Bangkok 10120 Thailand', '02-676-6000', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0005', ' Thai Toray Synthetics Co.,Ltd. (Brancd 00002)', '99 Moo 1 Hi-Tech Industrial Estate, Banpo,  Bangpa-in, Ayutthaya 13160', '035-350-027', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0006', ' Teijin polyester (thailand) Limited', '1/1 Moo 3, T.Klong Nueng, A.Klong Luang, Pathumthani 12120, Thailand', '(66)0-2516-8062', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0007', ' Thai Dairy', '99 Soi Rubia, Sukhumvit 42 Road, Phrakanong, Klongtoey Bangkok 10110', '02 649 2999', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0008', ' Trans Thai-Malaysia (Thailand) Limited', '181 Moo 8 Tumbol Talingchan Amphur Chana Songkhla 90130', '074-302700', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0009', ' Trouw nutrition', '591 UBC 2 Building Unit 1707-1708 17th Floor Sukhumvit 33 Road Khlong tan nuea Bangkok 10110', '02-6112706', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0010', ' Thai Toray Synthetics Co.,Ltd. (Brancd 00001)', '3 Soi Ladplakao 71 Anusawaree Bangkhen Bangkok 10220', '02-5221640-7', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0011', ' TAYCA (Thailand) Co.,Ltd.', '700/490 Moo 4 T.Bankao A.Panthong Chonburi 20160 Thailand', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0012', ' Tipco group of companies', 'อาคารทิปโก้ทาวเวอร์ 118/1 ถนนพระราม 6 พญาไท  กรุงเทพ 10400', '022736000', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0013', ' Thyssenkrupp Industrial Solutions (Thailand) Ltd', '450 Century Industrial Park Sukhumvit Road Huaypong  Rayong 21150 Thailand', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0014', ' Thai Petroleum & Trading Co.,LTD', '9-10th Floor TP&T Tower 1 soi Vibhavadee-Rangsit 19 Chatuchak Chatuchak  Bangkok 10900 Thailand', '029361801-30', 'sales@thaipet.com', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('T.0015', ' The Project for Development of the Duckweed Holobiont Resource Values Towards Thailand BCG Economy', '2nd floor The Princess Chulabhorn Science Research Center Faculty of Science Kasetsart University 50 Ngamwongwan RD Lat Yao Chatuchak Bangkok 10900', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('U.0001', ' Union Nifco Co.,Ltd. (Head Office)', '99/11 Moo 5 KM.38 Bangna-Trad Rd., Bangsamak, Bangpakong, Chachoengsao 24180', '038-842-130-5', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('U.0002', ' UBE Chemicals (Asia) Public Company Limited', '18th Floor, Sathorn Square Office Tower, No.98 North Sathorn Rd., Silom, Bangrak, Bangkok 10500', '02-206-9300', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('U.0003', ' Unisoft System Co.,Ltd.', '537/184 Sathupradit 37, Yannawa, Bangkok 10120', '02-682-4828', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('U.0004', ' URC (Thailand)', '1/123 mu 2  sub-district tha sai, Samutsakorn Samutsakorn 74000', '034-490031', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('V.0001', ' Viewpoint Service Co.,Ltd', '127/157 soi Vipawadee Rangsit 60 Yad 18-1-6, Talat Bangkhen, Laksi Bangkok 10210', '', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('V.0002', ' Vina chemistry biology science equipment co.,ltd', '45 Nguyen Thi Huynh St-Ward 8-Phu Nhuan District-HCMC - Vietnam', '84-83847 7024', 'sales@chemos.com.vn & purchasing@chemos.com.vn', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('W.0001', ' waste management siam Ltd.', '25th Floor Central City Tower1 589/142 Debaratana road kwang north bangna khet bangna bangkok 10260', '027456926-7', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('W.0002', ' Wiltech 168 Solution Co.,Ltd', '1171 Srinakarin Road Onnut Suanlaung  Bangkok 10250', '023200217-8', 'N', 30, true);
INSERT INTO customers (code, name, address, phone, email, credit_term_days, is_active) VALUES ('X.0001', ' XEKONG POWER PLANT CO.,LTD', 'Unit 15, Sithong Road Pakthang Village, Sikhottabong District P.O Box 1808 Vientiane Lao P.D.R', '', 'N', 30, true);

-- 8. สินค้า (2060 รายการ)
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '17800052', 'Single Channel 3x10 AF,PM,3x10 AR', 'AccuStandard', u.id, 3840.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '19091J-413', 'J&W HP-5 Column ,30m,0. 32mm ,0.25micrometer 7 inch cage', 'AccuStandard', u.id, 1.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2400001377855', 'T43002C ขาค้ำมีหมุดล็อค 2ชั้น 3TON MGH', 'AccuStandard', u.id, 1270.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '30579367', 'Pipette starter PL-LTS 2,20,200,1000 ulHU', 'AccuStandard', u.id, 35210.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '30596925', 'PIPETTE STAND FOR 4 SINGLE', 'AccuStandard', u.id, 900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '50147', 'Belt 3L 15inch', 'AccuStandard', u.id, 3898.27, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '5182-0714', 'Vial screw top clear certified, 2 mL, 100/pk.', 'AccuStandard', u.id, 806.25, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '80780334', 'ตุ้มน้ำหนัก แสตนเลส Class F1 10 mg with Cer.17025', 'AccuStandard', u.id, 4000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PN-PM-0002-01F', 'ปากกา Permanent Marker Faber Castell F ดำ', 'AccuStandard', u.id, 49.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-P6513-25G', '2-Phenylethylamine hydrochloride >=98% ""Sigma Aldrich"" 25G', 'AccuStandard', u.id, 4310.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-P7000-25G', 'Pepsin from porcine gastric mucosa  powder, >=250 units/mg solid ""Sigma-Aldrich"" 25 G', 'AccuStandard', u.id, 3150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SKU00118', 'LUTUM 5MD system', 'AccuStandard', u.id, 443509.78, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SNG-DS425PLUS', '4Bay Intel Celeron J4125 2GB DDR4 , M.2 slot built in, R/45 1Gbe 1 port , R/45 2.5Gbe 1 Port , 3Y', 'AccuStandard', u.id, 15200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TP-LINK TAPO P100', 'smart WiFi plug', 'AccuStandard', u.id, 284.25, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00001', '516428.55', 'AccuStandard', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '530610.3' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '50005D', 'Dilution Suspension, 250 mL.', 'Abraxis', u.id, 2346.56, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '50005E', 'Extraction Solution 500 ml', 'Abraxis', u.id, 3352.22, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00002', '5698.78', 'Abraxis', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '11397.56' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DE9075', 'ANTRobut 2 pack 12V 3.0Ah Replacement Battery for Dewalt DE9075', 'Amazon.com', u.id, 969.33, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00003', '969.33', 'Amazon.com', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '1938.66' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A-1503', 'Activated charcoal strips 100/bottle', 'Arrowhead scientific', u.id, 23335.59, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00004', '23335.59', 'Arrowhead scientific', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '23335.59' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '4465785', 'Solvent bottle cap. shimadzu (Individual)', 'AB Sciex', u.id, 1267.81, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '5077299', 'SCIEX Triple Quad 7500 System - QTRAP Ready', 'AB Sciex', u.id, 16655060.82, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00005', '16656328.63', 'AB Sciex', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '16658864.25' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '105109', 'KEY L', 'ATEPE ARKAL', u.id, 1479.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '105991', 'Gasket manifold', 'ATEPE ARKAL', u.id, 233.37, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '106625', 'Valve', 'ATEPE ARKAL', u.id, 9835.62, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '109350', 'Gasket, surge tank', 'ATEPE ARKAL', u.id, 2039.98, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '109352', 'FLANGE, MANIFOLD', 'ATEPE ARKAL', u.id, 4768.78, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '110165B', 'ROTATOR, VALVE', 'ATEPE ARKAL', u.id, 7649.92, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '110806', 'NOZZLE CAP NUT', 'ATEPE ARKAL', u.id, 3984.34, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '111346-BK', 'Oil Filter Element-Black', 'ATEPE ARKAL', u.id, 1111.42, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '111464C', 'Cetane meter pickup', 'ATEPE ARKAL', u.id, 74263.88, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '111465A', 'Pickup Ingection', 'ATEPE ARKAL', u.id, 72911.33, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '75976', 'Gasket carburetor float gauge', 'ATEPE ARKAL', u.id, 122.47, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A111418A', 'Coil Electrical IGN Ignition Coil', 'ATEPE ARKAL', u.id, 34662.21, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B5828', 'NUT HEX', 'ATEPE ARKAL', u.id, 174.21, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B7707', 'RING, RUBBER', 'ATEPE ARKAL', u.id, 81.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'O118263', 'Cable, ignition assembly', 'ATEPE ARKAL', u.id, 1375.99, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00006', '214695.38', 'ATEPE ARKAL', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '362399.52' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GE50A013102RMV020', 'MFC GE50A NITROGEN 10 SCCM', 'APP SYSTEMS SERVICES PTE LTD', u.id, 103773.94, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GE50A013201RMV020', 'MFC GE50A NITROGEN 20 SCCM', 'APP SYSTEMS SERVICES PTE LTD', u.id, 103773.94, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GE50A013501RMV020', 'MFC GE50A NITROGEN 50 SCCM', 'APP SYSTEMS SERVICES PTE LTD', u.id, 103773.94, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00007', '311321.82', 'APP SYSTEMS SERVICES PTE LTD', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '311321.82' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '29100', 'Fuel Measuring Buret 200ml clear', 'AMK Glass', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '29101', 'Fuel Measuring Buret 400ml clear', 'AMK Glass', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A 21000', 'Fingerprint ink BVDA tube 55g.', 'BVDA', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'VIAL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A 21100', 'Fingerprint ink BVDA Tube 100gr', 'BVDA', u.id, 852.79, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A21000', 'Finger Print Ink dacty ink BVDA (Art no. A21000) หมึกพิมพ์ลายนิ้วมือสีดำ ขนาด 55 กรัม', 'BVDA', u.id, 1026.77, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 12000', 'Footprint GEL LITFTERS, Black 13x36cm. แผ่นพิมพ์ลายนิ้วมือ', 'BVDA', u.id, 95.78, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 200000', 'Spurfix lifting tape, 5cm. x 5m.', 'BVDA', u.id, 158.82, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 47000', 'Magnetic Black, 200g.', 'BVDA', u.id, 606.93, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 51000', 'Fingerprint brush no.8', 'BVDA', u.id, 730.04, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 60100', 'Magnetic brush strong', 'BVDA', u.id, 769.33, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 78100', '1, 2 - IND 1 gram', 'BVDA', u.id, 1310.36, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 78110', '1,2 -IND 10 gram', 'BVDA', u.id, 12194.42, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 78150', '1,2 -IND 50 gram', 'BVDA', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 79025', 'Ninhydrin crystals, 25g.', 'BVDA', u.id, 4879.95, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 83000', 'Cyanoacrylate, 50 mL.', 'BVDA', u.id, 845.23, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 84600', 'Rhodamin 6G, 25 gram', 'BVDA', u.id, 1181.59, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 85250', 'Basic yellow 40 powder 25gr', 'BVDA', u.id, 1072.35, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 86000', 'SPR Black in a spray bottle, 500 mL.', 'BVDA', u.id, 684.08, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 86600', 'SPR White in a spray bottle, 500 ml.', 'BVDA', u.id, 681.37, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 89350', 'Wet Powder Black, 250 mL.', 'BVDA', u.id, 1352.72, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 89360', 'Wet Powder White, 250 mL.', 'BVDA', u.id, 1464.76, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B 89720', '5-Sulfosalicylic Acid 20g', 'BVDA', u.id, 719.23, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'C 1000', 'Silmark grey low viscosity, 150g.', 'BVDA', u.id, 624.71, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'C 101000', 'Micro filters for C 100000', 'BVDA', u.id, 162.67, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'C 1100', 'Silmark grey mdeium viscosity, 150g. (Silmark High Contrast silicone Gray)', 'BVDA', u.id, 624.71, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CM-MIK-W', 'Mikrosil Casting Putty Kit, White', 'BVDA', u.id, 1283.07, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'F 30000', 'Luminol set for 1 liter', 'BVDA', u.id, 8710.09, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'F 35000', 'Leuco Malachite green set for blood identification 50ml', 'BVDA', u.id, 1468.06, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'F 82300', 'Hemastix Reagent Strips for Urinalysis 50 strips per box', 'BVDA', u.id, 5242.67, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00008', '48742.5', 'BVDA', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '488525.37' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BL-504-TR', 'Bluestar forensic training (4 foils)', 'BlueStar', u.id, 2002.91, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BL-FOR-BLUEST', 'Blue star Forensic Kit', 'BlueStar', u.id, 2671.77, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BL-FOR-MAG', 'Bluestar forensic Magnum', 'BlueStar', u.id, 2379.73, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BL-FOR-TAB4', 'Bluestar Forensic Tablets (4 foils)', 'BlueStar', u.id, 2656.4, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BL-MD-KIT', 'BLUESPRAY(Unit+113ml pressure reservoir+container 125ml)', 'BlueStar', u.id, 2935.55, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BL-TR-BULK', 'Bluestar forensic bulk training  (24 foils)', 'BlueStar', u.id, 192.38, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HU-829', 'Hexagon Obti (24 tests) BLUESTAR ชุดตรวจเลือดมนุษย์', 'BlueStar', u.id, 4635.21, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'VD-HEM-24', 'Blue star Identi-Hem (24 test) made in france', 'BlueStar', u.id, 4061.3, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'VD-PSA-24', 'Bluestar Identi-PSA (24 tests) Made in france', 'BlueStar', u.id, 5257.71, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00009', '26792.96', 'BlueStar', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '509511.98' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1897267', 'BIBL ATR-FTIR EXPLOSIVES DATABASE', 'Bruker Singapore', u.id, 76017.88, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1918543', 'Luer plugs for omni cell (PKT 2)', 'Bruker Singapore', u.id, 2602.86, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A250/DII', 'Alpha II FT-IR Base Spectrometer without QuickSnap Sampling Module', 'Bruker Singapore', u.id, 1276051.55, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ALPHA-T', 'Alpha-T FT-IR Spectrometer Including accessories', 'Bruker Singapore', u.id, 3590161.83, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BRUKER-ALPHA-SYSTEM', 'ISYSALPHA ALPHA SYSTEM', 'Bruker Singapore', u.id, 1504575.27, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'I29179', 'Drying Medium IN 25L CAN Desiccant (molecular sieve) 250ml Box', 'Bruker Singapore', u.id, 2276.43, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ISYSINVENIO-S', 'Isysinvenio-s invenio-s system', 'Bruker Singapore', u.id, 2980261.09, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00010', '9431946.91', 'Bruker Singapore', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '12477846.76' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '160-0013', 'C2, LIGET SHIELD BOOT', 'Charm', u.id, 1265.81, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '5-MLT-BG', 'Pipet Tip/5000 ul, 500/bag', 'Charm', u.id, 3328.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AIIHM-100K', 'Chloramphenicol/Milk/100T', 'Charm', u.id, 47910.63, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AIIHM-20K', 'Chloramphenicol/Milk/20T', 'Charm', u.id, 12120.21, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ANC-1', 'ATBL Negative Control/100ML/1 bottle)', 'Charm', u.id, 1321.52, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ATP-PLUS-4', 'ATP POSITIVE CONTROL/KIT/4 TABLETS', 'Charm', u.id, 2027.66, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BUF-ADQ', 'AFQ Dilution buffer', 'Charm', u.id, 2584.08, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CARTRIDGE-ADAPTOR', 'CARTRIDGE ADAPTOR/1', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CARTRIDGE-C18-50', 'CARTRIDGE  C18  50/PK', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CRK-1000', 'Cork, 1000 ea/pack', 'Charm', u.id, 3284.39, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EIIG-100K', 'Macrolide/Feed&Grain/100 Kit', 'Charm', u.id, 26282.09, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'INC-CHEF', 'Incubator-Chef Test', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'INTERFACE-ADAPTER', 'NL2 Interface/Charger adapter', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-AFQ-FAST-100K', 'LF/Aflatoxin/3 MIN/Quantitative/Grain/100T', 'Charm', u.id, 22479.7, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-AFQ-WETS5-NUTR-40K', 'LF/AFLA/Wet/S5/Quantitative/Grain/40T', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-DONQ2-100K', 'LF/DON/2MIN/QUANTITATIVE/GRAIN/100', 'Charm', u.id, 25153.72, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-DONQ-WETS5-NUTR-40K', 'LF/DON/Wet/S5/Quantitative/Grain/40T', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-FUMQ-FAST5-100K', 'LF/FUMQ-FAST5/QUANTITATIVE/GRAIN/100T', 'Charm', u.id, 22614.53, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-FUMQ-WETS5-NUTR-40K', 'LF/FUM/WETS5/QUANTI/GRAIN/40T', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-INC4-5-45D', 'INCUBATOR/LF/4PL/5MIN/45DEG/W/DISPLAY', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-INC4-8-40D', 'Incubator/LF/4PL/8Min/40 DEG Time Dsply', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-OCHRAQ-G-100K', 'LF-OCHRA-QUANT-GRAIN-100 TEST KIT', 'Charm', u.id, 37901.15, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-OCHRAQ-G-NUTR-40K', 'LF/OCHRA/Quant/Grain/40T', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-ROSA-EZ-M', 'LF/READER/EZ/M', 'Charm', u.id, 128632.72, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-ROSA-EZ-M-SWAP', 'LF/READER/EZ/M-SWAP', 'Charm', u.id, 40314.86, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-ROSAREADER-3', 'Lateral Flow Reader', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-SLAFMQ-100K', 'LATFLOW/SL/AFLATOXIN 3 LINE/MILK/100 KIT', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-T2-HT2-100K', 'LF-T2HT2/QUANTITATIVE/GRAIN/100K', 'Charm', u.id, 45171.19, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-T2-HT2-NUTR-40K', 'LF-T2HT2/QUANTITATIVE/GRAIN/40K', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-WET-EXTS-50G-100', 'WETS5 EXTRACT BAGS/100 KIT/50G EXTR', 'Charm', u.id, 6924.84, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-ZEARQ-FAST5-100K', 'LF/ZEARALENONE/FAST5/GRAIN/100T', 'Charm', u.id, 34992.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-ZEARQ-WET-NUTR-100K', 'LF/ZEARALENONE/GRAIN/WET/100T', 'Charm', u.id, 33203.77, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LF-ZEARQ-WETS5-NUTR-40K', 'LF/ZEARALENONE/Grain/WETS5/40T', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LUMINATOR-T', 'Luminator-T version 4.01', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MA', 'Multi-Antimicrobial Standard/100ML/1 Bottle', 'Charm', u.id, 3331.68, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MM2-230', 'MAXI MIX II 230V (Thermo Scientifix) เครื่องเขย่า', 'Charm', u.id, 36843.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MMRL-100K', 'Macrolide/Milk/100 Kit', 'Charm', u.id, 34302.48, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MRL-MA-1', 'MRL-Multistandard/100mL. (1 Bottle/pack)', 'Charm', u.id, 3331.16, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MRL-MA-5', 'MRL-Multistandard/100mL. (5 Bottle/pack)', 'Charm', u.id, 13913.83, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NOVALUM', 'NL/W/USB&SERIAL CBLS/CHGR/CORD/SOFT CASE', 'Charm', u.id, 104069.68, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NOVALUM-II-X', 'NL2X/W/USB&Serial CBL/CHGR/CORD/SOFTCASE', 'Charm', u.id, 110849.86, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OPG', 'Optifluor Scintluid (1 gall)', 'Charm', u.id, 16452.42, 0, 'STANDARD', true
FROM units u WHERE u.code = 'GALLON' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PIIG-100K', 'BETALACTAM/GRAIN/100KIT', 'Charm', u.id, 27584.09, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'POCK-PLUS-25K', 'Pocket Swab Plus/ATP/25T (25 test/pack)', 'Charm', u.id, 2388.97, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PRN-C2-ADAP-THERMAL', 'C2/Thermal PKN/25 PIN MOD Adapter', 'Charm', u.id, 817.56, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PST-OC-120-WK', 'Organophosphate-Carbamate/Water/120T', 'Charm', u.id, 67122.42, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ROSA-INCUBATOR', 'ROSA-INCUBATOR', 'Charm', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ROSAREADER-MYC', 'LF READER//MYCOTOXIN/', 'Charm', u.id, 150000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SM', 'Sulfamethazine/10PPB/Standard/100ML/1 bottle', 'Charm', u.id, 2687.77, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SMIIHG-100K', 'Sulfa Drugs/Feed&Grain/100 Kit', 'Charm', u.id, 23155.55, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'STTBL-100K', 'Streptomycin/Milk/100Kit', 'Charm', u.id, 26253.14, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SULFAMRL-100K', 'Sulfonamide/Milk/MRL/100Kit', 'Charm', u.id, 23110.66, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TMRL-100K', 'Tetracycline/Milk/100K', 'Charm', u.id, 25886.37, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TST-1000', 'Test Tubes/Glass/13x100mm.', 'Charm', u.id, 6294.06, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZCS-1', 'Zero Control Standard / 1 Bottles', 'Charm', u.id, 1684.15, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00011', '1177592.62', 'Charm', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '3865783.72' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '105041', 'Shim, Cylinder Worm Shaft', 'Core-Lab', u.id, 308.54, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '105058', 'Valve, Carburetor Fuel', 'Core-Lab', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '105085', 'Gasket, Rocker Arm Cover', 'Core-Lab', u.id, 684.21, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '105088', 'Gasket, Cylinder Door', 'Core-Lab', u.id, 1260.13, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '105181', 'Gasket, Cylinder Base (0.021)', 'Core-Lab', u.id, 1008.42, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '105181A', 'Gasket, Cylinder base (0.015)', 'Core-Lab', u.id, 1008.42, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '105181B', 'Gasket, Cylinder Base (0.010)', 'Core-Lab', u.id, 1008.42, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '105181C', 'Gasket, Cylinder base (0.003"")', 'Core-Lab', u.id, 3237.34, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '105987A', 'Insert', 'Core-Lab', u.id, 4756.22, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '106137A', 'Bearing, conn.Rod', 'Core-Lab', u.id, 4939.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '106222B', 'Ring Piston, Comp, Chrom', 'Core-Lab', u.id, 2497.64, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '106424', 'Gasket cup', 'Core-Lab', u.id, 199.57, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '106625A', 'Valve, Exhaust', 'Core-Lab', u.id, 24019.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '106721', 'Gasket, lower CYL. Guide plate', 'Core-Lab', u.id, 309.44, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '106919', 'Gasket, Gear Tray', 'Core-Lab', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '109126', 'Plug Cylinder Sleeve Scr', 'Core-Lab', u.id, 2083.92, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '109345', 'Gasket, Carb 4-Bolt MTG (Thin)', 'Core-Lab', u.id, 2802.03, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '109346', 'Gasket, Carb 4-Bolt MTG (Thick)', 'Core-Lab', u.id, 2161.14, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '109421', 'Gasket, water inlet cap', 'Core-Lab', u.id, 119.71, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '109553', 'Gasket, oil screen', 'Core-Lab', u.id, 62.1, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '109612', 'Gasket, Crankcase Door', 'Core-Lab', u.id, 701.47, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '109687', 'Fuse Midget 10A 250 VAC', 'Core-Lab', u.id, 2783.99, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '109778', 'Gasket, Carb Air Bleed Tube', 'Core-Lab', u.id, 501.71, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '110158', 'Seal Oil', 'Core-Lab', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '110477', 'Gasket, Breather cup', 'Core-Lab', u.id, 69.46, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '110523', 'Gasket Exhaust Flange', 'Core-Lab', u.id, 1304.24, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '110670A', 'Valve Breather, disc', 'Core-Lab', u.id, 6158.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '111225', 'Bearing Race Thrust', 'Core-Lab', u.id, 288.4, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '111226', 'needle bearing', 'Core-Lab', u.id, 976.92, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '111342', 'Gasket, Pick up', 'Core-Lab', u.id, 154.92, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '111346', 'Oil Filter Element', 'Core-Lab', u.id, 5680.74, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '111406A', 'Washer, conn rod bolt lock', 'Core-Lab', u.id, 2736.16, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '111460', 'Spark plug, D16, Champion', 'Core-Lab', u.id, 1810.57, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '118013E', 'SEAL O RING, CONDENSER COVER', 'Core-Lab', u.id, 117.37, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '210852', 'Cable Det Pickup', 'Core-Lab', u.id, 35843.59, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '210875', 'Fuse, 5 AMP, XCP, Bussman', 'Core-Lab', u.id, 421.39, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '211196', 'O-ring 1.25x1.5x1.2', 'Core-Lab', u.id, 134.53, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '21291', 'SCREW, CAP HEAD, 1/4-20 X 2 LG', 'Core-Lab', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '212M', 'Pump fuel', 'Core-Lab', u.id, 22303.54, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '23065B', 'Plate, Cylinder guide', 'Core-Lab', u.id, 4519.07, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '23436B', 'Valve, Intake', 'Core-Lab', u.id, 107307.97, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '23505', 'Ring Piston Oil', 'Core-Lab', u.id, 1721.32, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '26800', 'Pin Intake Valve', 'Core-Lab', u.id, 59.61, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '44999J', 'Retainer Piston Ring', 'Core-Lab', u.id, 414.89, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '56372', 'CYL HEAD WRENCH/TORQUE ADAPTER', 'Core-Lab', u.id, 13848.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '75552A', 'Gasket, Gas Gauge', 'Core-Lab', u.id, 105.12, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '75690', 'Gasket, Condenser Body', 'Core-Lab', u.id, 80.56, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '75960G', 'Body Carburetor', 'Core-Lab', u.id, 71.66, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '75982A', 'GASKET, CARB FUEL VALVE  BODY', 'Core-Lab', u.id, 189.03, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '75983B', 'Tube, Carburetor Air Bleed', 'Core-Lab', u.id, 27039.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B10065', 'Washer 9/16 x 3/4 x .083', 'Core-Lab', u.id, 566.29, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B2544', 'Gasket, Upper Cylinder Guide Plate', 'Core-Lab', u.id, 309.44, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B2557', 'GASKET, EXH MANF', 'Core-Lab', u.id, 2132.09, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B3207', 'Carburetor Washer', 'Core-Lab', u.id, 295.61, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B4680', 'FELT, VALVE STEAM', 'Core-Lab', u.id, 335.61, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B5052', 'Washer gauge', 'Core-Lab', u.id, 92.87, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B5068', 'Condenser gauge wash upper', 'Core-Lab', u.id, 92.87, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B5096A', 'Gasket Water Pipe', 'Core-Lab', u.id, 226.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00012', '293862.58', 'Core-Lab', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '759500.28' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '090', 'Ultra-Polyester Film (1.5 micron)', 'Chemplex', u.id, 4189.6, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1330', 'XRF Sample Cup 30.7mm Dia x 22.9mm. High (Rotatable Shap-On) (100 ea/pack)', 'Chemplex', u.id, 54.59, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1430', 'XRF Sample Cup 31.0mm. Dia x 22.4mm. (Single Open-Ended) (100 ea/pack)', 'Chemplex', u.id, 54.59, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '427', 'Prolene 4um 2.5nich Circle 1k/pk 0.16mil thick 6.4cm dia', 'Chemplex', u.id, 10347.72, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '545', 'Aluminium pellet Cups (39.8mm. x 9.1mm.) (600 ea/pack)', 'Chemplex', u.id, 9917.31, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FILM-150', 'Mylar 3.6um 3 x 300 roll 0.14 mil thick 7.6cm x 91.4m long', 'Chemplex', u.id, 2982.4, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FILM-416', 'Prolene 4um 3x300 roll 0.16mil thick 7.6cm x 91.4m long', 'Chemplex', u.id, 5422.54, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00013', '32968.75', 'Chemplex', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '176719.82' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '110653', 'Tool Valve Guide Alignment', 'CT Scientific', u.id, 3574.11, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '23003', 'Extension Plug Removal spacer ( set of 2 )', 'CT Scientific', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '489392', 'LF Valve Guide Removal', 'CT Scientific', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '489394', 'LF Valve Guide Gauging Tool', 'CT Scientific', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '489395', 'LP Valve Seat Installation Tool', 'CT Scientific', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00014', '3574.11', 'CT Scientific', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '3574.11' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CA CHAMBER', 'CA Chamber wheels', 'Defsec global limited', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CA-001', 'Main carbon filter for CA Chamber', 'Defsec global limited', u.id, 7266.69, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CA-120-UV LIGHT', 'CA-120-UV Light', 'Defsec global limited', u.id, 7570.65, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CA5', 'Forensic Cyanoacrylate (Super Glue) กาวตู้อบซุปเปอร์กลู', 'Defsec global limited', u.id, 728.32, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CA-HOTPLATE', 'CA chamber Hot Plate Assembly Including Probe and Controller', 'Defsec global limited', u.id, 18610.13, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CA-HUMIDIFIER', 'CA Chamber RH Box with filter Humidifier Assembly', 'Defsec global limited', u.id, 28121.67, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CA-PCB SET', 'Control PCB Set LCD Display Relay PCB', 'Defsec global limited', u.id, 37345.91, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CA-PRE-FILTER', 'CA-Pre-Filter สำหรับ CA-120', 'Defsec global limited', u.id, 640.26, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CA-RH', 'CA-RH Humidifier Wick Filter', 'Defsec global limited', u.id, 1283.79, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CA-TUKM-HEATER', 'Heater Element for Hot Plate', 'Defsec global limited', u.id, 1888.12, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FAN07856ES', 'CA RH Fan', 'Defsec global limited', u.id, 3983.47, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FAN-120', 'Main purge fan for CA Chamber', 'Defsec global limited', u.id, 9879.51, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FAN-4656N', 'CA recirc fan Circulation fan', 'Defsec global limited', u.id, 6310.79, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'RH-SENSOR', 'RH-Sensor', 'Defsec global limited', u.id, 2497.87, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'RS-613-8202 MAGNET', 'Door reed Switch for CA Chamber', 'Defsec global limited', u.id, 1174.38, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TEC-RH SENSOR', 'CA-RH Sensor Asssembly', 'Defsec global limited', u.id, 4335.25, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TS-DOOR SEAL', 'Door seal for CA chamber', 'Defsec global limited', u.id, 868.49, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00015', '132505.3', 'Defsec global limited', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '616285.26' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A1645', 'PCIe FireWire Adapter kit', 'Digital Intelligence', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'X9086', '3-port USB3 Hub', 'Digital Intelligence', u.id, 2343.99, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00016', '2343.99', 'Digital Intelligence', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '7031.97' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CQNTRM-1.0-ND', 'FLUX REMOVER (NON-FLAMMABLE) IN', 'Digi-key', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SMD4300SNL10T5-ND', 'SLD PASTE LF WATER SOL T5 10CC', 'Digi-key', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0010201100000', 'Disposable Syringe (Plastic) 10 ML Luer Slip Nipro 100/box', 'Forensic', u.id, 250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '11-0027', 'Latent Print Dusting Brush Deluxe Camel hair Brush 7"" แปรงขนอูฐ', 'Forensic', u.id, 411.47, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '11-0151', 'Standard Magnetic Powder Applicator 14cm./5.5"" long แปรงแม่เหล็ก', 'Forensic', u.id, 895.15, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1120443', 'ปากกาเขียนแผ่นใสลบไม่ได้ 0.6 มม.น้ำเงิน F Faber -Castell', 'Forensic', u.id, 42.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ด้าม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2011170', 'เข็มทิศใหญ่ ขนาด 40มม', 'Forensic', u.id, 38.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2080700', 'มีดคัตเตอร์ 18 มม ตราช้าง R-1801', 'Forensic', u.id, 62.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8851552201016-00', 'ปากกาเคมี 2 หัว ตราม้า สีน้ำเงิน', 'Forensic', u.id, 11.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BLACK MAGNETIC_2', 'Black Magnetic Finger Print powder Black 60 ml  (ผงฝุ่นแม่เหล็กสีดำ) Silver Arrow', 'Forensic', u.id, 800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BV-017-05', 'ซองพลาสติก ขนาด 12x21 ซม. พิมพ์วัตถุพยาน ฝาปิดมีเทปกาว', 'Forensic', u.id, 3.2, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BV-017-06', 'ซองพลาสติก เทปกาว ขนาด 12x20 ซม. (4.5x8.5 นิ้ว) พิมพ์วัตถุพยาน', 'Forensic', u.id, 4.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BV-017-07', 'ซองพลาสติก ขนาด 31x49 ซม เก็บวัตถุพยาน เทปกาว', 'Forensic', u.id, 7.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BV-017-09', 'ซองพลาสติกเทปกาว ขนาด 31x46 ซม. พิมพ์วัตถุพยาน', 'Forensic', u.id, 5.35, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BV-017-16', 'ซองพลาสติก  ขนาด 40x60 ซม (15 x 24 นิ้ว) พิมพ์วัตถุพยาน ฝาปิดมีเทปกาว', 'Forensic', u.id, 10.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BV-017-18', 'ซองพลาสติกพิมพ์วัตถุพยาน ฝาปิดมีเทปกาว ขนาด 15x25 ซม (6x10 นิ้ว)', 'Forensic', u.id, 1.85, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BV-017-19', 'ซองพลาสติก เทปกาว  ขนาด 22x33 ซม พิมพ์วัตถุพยาน ฝาปิดมีเทปกาว', 'Forensic', u.id, 6.42, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BV-017-20', 'ซองพลาสติกพิมพ์วัตถุพยาน ฝาปิดมีเทปกาว ขนาด 22x31 ซม', 'Forensic', u.id, 7.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ELP-BE290189', 'Beaker low form with handle PP 1L,LP บีกเกอร์พลาสติก', 'Forensic', u.id, 140.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EM.002', 'เทปปิดวัตถุพยาน พลาสติก  2""x50 หลา ม้วนสีแดง Evidance Sealing Tape', 'Forensic', u.id, 65.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EPA-FOD-12.5', 'ปากคีบไม่มีเข้ียว DRESSING FORCEPS 12.5 cm', 'Forensic', u.id, 102.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EPA-SC-7103', 'ด้ามมีดผ่าตัด เบอร์ 3 Scalpel handle No.3 (7-103),(02-130)', 'Forensic', u.id, 320.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ETH-BR001', 'Brush No. 0 Dia 1cm. (7x11cm.) ไม่มีพู่', 'Forensic', u.id, 30.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GPY-T9820-16', 'Test Tube 16x100 MM 11ML (PYREX)', 'Forensic', u.id, 17.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LIGHTING POWDER', 'Lighting powder, Silver/Gray #1-3330 60 cc', 'Forensic', u.id, 342.47, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LP0674', 'แปรงขนอูฐ ปลายมน ขนาด 7นิ้ว', 'Forensic', u.id, 800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MAG 10X5MM R', 'แม่เหล็ก ทรงกลม ขนาด 10x5 mm', 'Forensic', u.id, 15.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ROLLER_0.5', 'Roller 0.5 (ไม้)', 'Forensic', u.id, 300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0006', 'แบบพิมพ์ลายนิ้วมือผู้ต้องหา (100 แผ่น/ห่อ) พิมพ์สีฟ้า', 'Forensic', u.id, 78.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ห่อ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0007', 'กระดาษห่อวัตถุพยาน สีน้ำตาล แบบม้วน', 'Forensic', u.id, 150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0008', 'ไม้บรรทัดฉาก 17x27ซม. สีขาว (ข้อความสำนักงานพิสูจน์หลักฐานตำรวจ)', 'Forensic', u.id, 14.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0011', 'ลูกกลิ้งยาง ขนาด 4 นิ้ว', 'Forensic', u.id, 71.84, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0011-10CM', 'ลูกกลิ้งหมึกพิมพ์มือ ขนาดเส้นผ่านศูนย์กลาง 5 ซม. ยาวประมาณ 10 ซม ด้ามจับเป็นโลหะยาว 11.5 กรอบโลหะยึดด้วยโลหะ', 'Forensic', u.id, 900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0054', 'วงแหวนครอบวัตถุพยาน สีเหลือง พลาสติก พิมพ์ข้อความ วัตถพยานห้ามเคลื่อนย้าย ขนาด 2 นิ้ว', 'Forensic', u.id, 23.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0064', 'ชุดป้ายหมายเลข 1-10 พื้นสีดำตัวเลขสีขาว พับเก็บได้ ขนาด 13x16 ซม.', 'Forensic', u.id, 800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0065', 'ชุดป้ายหมายเลข 11-20 พื้นสีดำตัวเลขสีขาว พับเก็บได้ ขนาด 13x16 ซม.', 'Forensic', u.id, 800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0073', 'สเกลวัดขนาดแบบสติ๊กเกอร์ ขนาด 5 ซม. (20 ชิ้นต่อแผ่น)', 'Forensic', u.id, 7.49, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0076', 'ซองกระดาษสีน้ำตาล พิมพ์ข้อความ ""วัตถุพยาน"" ขนาด 11 นิ้ว x 16 นิ้ว (28*40cm)', 'Forensic', u.id, 3.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0089', 'ไม้บรรทัด ขนาด 5cm. สีขาว ""สำนักงานพิศูจน์หลักฐานตำรวจ', 'Forensic', u.id, 3.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0091', 'ธงสีแดงพลาสติกพร้อมฐานทำด้วยโลหะกันสนิม ขนาด 2.5"" x 3', 'Forensic', u.id, 70.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0095-1', 'ซองกระดาษน้ำตาลขนาด 46x20x65 ซม. พิมพ์ ""วัตถุพยาน', 'Forensic', u.id, 21.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0099', 'ไม้บรรทัดฉาก สีขาว ขนาด ด้านละ 5 ซม.""สำนักงานพิศูจน์หลักฐานตำรวจ', 'Forensic', u.id, 5.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0100', 'เทปปิดวัตถุพยานแบบกระดาษ ม้วนสีแดง Evidance Sealing Tape พิมพ์ วัตถุพยาน EVIDENCE 100 ดวง/ม้วน', 'Forensic', u.id, 139.1, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0116', 'เทปกาวปิดวัตถุพยาน แบบกระดาษ พิมพ์โลโก้และข้อความ ""กลุ่มงานตรวจทางเคมีฟิสิกส์ (Chemistry Physics Sub-Division) 100 ดวง/ม้วน', 'Forensic', u.id, 50.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0117', 'ชุดป้ายหมายเลข 1-10 พื้นสีเหลือง ตัวเลขสีดำ พับเก็บได้ ขนาด 13x16 ซม.', 'Forensic', u.id, 800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0118', 'ชุดป้ายหมายเลข 11-20 พื้นสีเหลือง ตัวเลขสีดำ พับเก็บได้ ขนาด 13x16 ซม.', 'Forensic', u.id, 800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0122', 'สติ๊กเกอร์ PVC สีใสบาง ขนาด 5cm. x 50m. (2 นิ้ว) ยี่ห้อ ฟู่ซุ่น', 'Forensic', u.id, 134.43, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0124', 'ซองกระดาษ ขนาด 6x12"" (15x30cm) พิมพ์ข้อความวัตถุพยาน กระดาษ KA 125 แกรม', 'Forensic', u.id, 6.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0126', 'ซองกระดาษเก็บวัตถุพยาน ขนาด 5x10 นิ้ว (12.5 x25 ซม)', 'Forensic', u.id, 2.95, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0127', 'ซองกระดาษเก็บวัตถุพยาน ขนาด 7x10 นิ้ว (17.5 x25 ซม)', 'Forensic', u.id, 3.25, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0128', 'ซองกระดาษเก็บวัตถุพยาน ขนาด 10x13 นิ้ว (25 x 32.5 ซม)', 'Forensic', u.id, 3.95, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0129', 'ซองกระดาษ EVIDENCE สถาบัน มีหน้าต่าง ไม่ขยายข้าง เนื้อ KA 125 แกรม ขนาด 11.5x21.5 ซม.', 'Forensic', u.id, 17.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0130', 'ซองกระดาษ EVIDENCE สถาบัน มีหน้าต่าง ไม่ขยายข้าง เนื้อ KA 125 แกรม ขนาด 15.5x28 ซม.', 'Forensic', u.id, 19.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0131', 'กล่องเก็บก้านสำลี พิมพ์ 1 ด้าน 1 สี ""สถาบันนิติวิทยาศาสตร์"" ขนาด 3.7 x 17.5 x 2.5 ซม.', 'Forensic', u.id, 10.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0140', 'ซองกระดาษเก็บเขม่าปืน กระดาษ BA 110 แกรม ขนาด 4 1/2 x 9 1/4 นิ้ว (11.5 x 23.5 ซม)', 'Forensic', u.id, 3.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0148', 'สติ๊กเกอร์ PVC สีใสบาง ขนาด 7.5cm. x 50m. (3 นิ้ว) ยี่ห้อ ฟู่ซุ่น', 'Forensic', u.id, 181.39, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0159', 'บิลบันทึกการตรวจเก็บและส่งมอบวัตถุพยาน ( ขนาด 9"" x 12"" ) คาร์บอนในตัว 2 ชั้น (ขาว, เหลือง) หมึกพิมพ์สีดำ + กาวหัว + พิมพ์ปกหน้า + ปกในหลัง  1 เล่ม/50 ชุด', 'Forensic', u.id, 117.7, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เล่ม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0159 FIDS1', 'บิลบันทึกการตรวจเก็บและส่งมอบวัตถุพยาน ( ขนาด 9"" x 12"" ) คาร์บอนในตัว 2 ชั้น (ขาว, เหลือง) หมึกพิมพ์สีดำ + กาวหัว + พิมพ์ปกหน้า + ปกในหลัง  1 เล่ม/50 ชุด', 'Forensic', u.id, 74.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เล่ม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0159 FIDS2', 'บิลบันทึกการตรวจเก็บและส่งมอบวัตถุพยาน ( ขนาด 9"" x 12"" ) คาร์บอนในตัว 2 ชั้น (ขาว, เหลือง) หมึกพิมพ์สีดำ + กาวหัว + พิมพ์ปกหน้า + ปกในหลัง  1 เล่ม/50 ชุด', 'Forensic', u.id, 74.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เล่ม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0159 FIDS3', 'บิลบันทึกการตรวจเก็บและส่งมอบวัตถุพยาน ( ขนาด 9"" x 12"" ) คาร์บอนในตัว 2 ชั้น (ขาว, เหลือง) หมึกพิมพ์สีดำ + กาวหัว + พิมพ์ปกหน้า + ปกในหลัง  1 เล่ม/50 ชุด', 'Forensic', u.id, 70.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เล่ม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0159 FIDS-EDIT', 'บิลบันทึกการตรวจเก็บและส่งมอบวัตถุพยาน แบบแก้ไข ( ขนาด 9"" x 12"" ) คาร์บอนในตัว 2 ชั้น (ขาว, เหลือง) หมึกพิมพ์สีดำ + กาวหัว + พิมพ์ปกหน้า + ปกในหลัง  1 เล่ม/50 ชุด', 'Forensic', u.id, 70.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เล่ม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0162', 'แถบกั้นสถานที่เกิดเหตุชนิดพลาสติก ยาว 100 เมตร ""POLICE LINE-DO NOT CROSS"" ""ห้ามเข้าสถานที่เกิดเหตุ-คำสั่งเจ้าพนักงานตำรวจ"" พื้นสีเหลืองตัวสีดำ', 'Forensic', u.id, 550.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0168', 'แถบกั้นสถานที่เกิดเหตุชนิดพลาสติก ยาว 50 เมตร ""POLICE LINE-DO NOT CROSS"" ""ห้ามเข้าสถานที่เกิดเหตุ-คำสั่งเจ้าพนักงานตำรวจ"" พื้นสีเหลืองตัวสีดำ', 'Forensic', u.id, 350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0206', 'Single cardholder unit (ปะกับพิมพ์มือ) ไม่มียี่ห้อ', 'Forensic', u.id, 1123.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0208', 'กล่องเครื่องมือ NAZA สีดำฝาส้ม กระเป๋าเก็บอุปกรณ์ตรวจลายนิ้มือแฝง', 'Forensic', u.id, 80.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0209', 'กล่องเครื่องมือ TONE สีดำฝาเหลือง  กระเป๋าเก็บอุปกรณ์ตรวจลายนิ้วมือแฝง', 'Forensic', u.id, 80.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0215', 'Adhesive Evidence Scale 5  cm', 'Forensic', u.id, 30.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เล่ม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0217', 'Adhesive Evidence Scale 2.5  cm', 'Forensic', u.id, 30.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เล่ม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0218', 'ชุดจอบพับได้ อุปกรณ์ใส่ถุงลายทหาร', 'Forensic', u.id, 150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0222', 'ชุดบิดลูกประตู (กระเป๋าดำ + อุปกรณ์ ภาษาจีน)', 'Forensic', u.id, 300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0225', 'Finger Print Brush squirrel Brush Silver Arrow CSI Product แปรงขนกระรอก', 'Forensic', u.id, 642.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0234', 'ขวดแก้วใส พร้อมจุกสีเทา 10 ml เก็บวัตถุระเบิด', 'Forensic', u.id, 5.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0241', 'Impact Bullet Puller ""Frankford Arsenol Reloading tech"" ค้อนถอดกระสุนปืน', 'Forensic', u.id, 1200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0243', 'แผ่นเก็บลายนิ้วมือแฝงสีดำ (50 แผ่น/แพค) 11x19 cm', 'Forensic', u.id, 450.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0244-11X21', 'ซองกระดาษเก็บวัตถุพยาน ขนาด 11x21 ซม', 'Forensic', u.id, 4.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0244-12X20', 'ซองกระดาษเก็บวัตถุพยาน ขนาด 12x20 cm', 'Forensic', u.id, 4.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0247', 'ซองกระดาษพิมพ์วัตถุพยาน ขนาด 23 x33 ซม. (8 1/4*12 1/4"")', 'Forensic', u.id, 7.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0249', 'ซองกระดาษน้ำตาล พิมพ์ข้อความ ""วัตถุพยาน"" ขนาด 11.5x23.5 ซม (4 1/2 x 9 1/4"")', 'Forensic', u.id, 6.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0250', 'ซองกระดาษเก็บเขม่าปืน กระดาษ  ขนาด 4 x 8 1/2 นิ้ว (10 x 21 ซม)', 'Forensic', u.id, 3.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0261', 'ถุงกระดาษน้ำตาล  ขนาด 12x26x36 ซม. พิมพ์ ""วัตถุพยาน', 'Forensic', u.id, 9.63, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0263', 'ถุงซิป กว้างxยาว  30 x 40 ซม.  พร้อมสกรีนโลโก้สำนักงานพิสูจน์หลักฐานตำรวจ', 'Forensic', u.id, 430.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0265', 'กล่องเก็บสำลีตรวจ DNA  ประมาณ 4 x 20 x2.5 ซม.พิมพ์โลโก้ สพฐ. กล่องกระดาษ', 'Forensic', u.id, 3.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0272', 'แผ่นเก็บรอยลายนิ้วมือและ/หรือฝ่ามือแฝง สีขาว ขนาด A4 (100 แผ่น/แพค)', 'Forensic', u.id, 4.28, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0282', 'ชุดไขควง 32in1', 'Forensic', u.id, 330.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0287', 'แปรงทาสี (นินไฮดริน) ขนาด ขนแปรง 6 cm', 'Forensic', u.id, 16.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0288', 'แปรงทาสี (นินไฮดริน) ขนาด ขนแปรง 8 cm', 'Forensic', u.id, 16.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0316', 'แผ่นเก็บรอยลายนิ้วมือและ/หรือฝ่ามือแฝง สีดำ ขนาด A4 (50 แผ่น/แพค)', 'Forensic', u.id, 4.28, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0317', 'ไม้บรรทัดฉาก สีขาว ขนาด ด้านละ 8 ซม.""สำนักงานพิสูจน์หลักฐานตำรวจ', 'Forensic', u.id, 7.49, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0339', 'เอกสารยินยอมให้เก็บตัวอย่าง DNA (พันธุกรรม) แบบมีภาษามาลายู + ภาษาไทย', 'Forensic', u.id, 85.6, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เล่ม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0339-1', 'เอกสารยินยอมให้เก็บตัวอย่าง DNA (พันธุกรรม) แบบมีภาษามาลายู + ภาษาไทย ไม่มีรหัส', 'Forensic', u.id, 70.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เล่ม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0365', 'สติ๊กเกอร์ PVC สีใสบาง ขนาด 2.5cm. x 50m. (1 นิ้ว) ยี่ห้อ ฟู่ซุ่น', 'Forensic', u.id, 60.47, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0384', 'เอกสารยินยอมให้เก็บตัวอย่าง DNA (พันธุกรรม) ลายพิมพ์นิ้วมือ 10', 'Forensic', u.id, 85.6, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เล่ม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0384-1', 'เอกสารยินยอมให้เก็บตัวอย่าง DNA (พันธุกรรม) ลายพิมพ์นิ้วมือ 10 นิ้ว ฝ่ามือ สันมือ', 'Forensic', u.id, 105.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เล่ม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0421', 'ช้อนคนกาแฟ', 'Forensic', u.id, 0.24, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0435', 'ถุงกระดาษน้ำตาล ขนาด 10x12x36 ซม.พิมพ์ ""วัตถุพยาน', 'Forensic', u.id, 9.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0436', 'แผ่นเก็บลายนิ้วมือแฝงสีขาว ขนาด 11x19cm', 'Forensic', u.id, 2.68, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0437', 'แผ่นเก็บลายนิ้วมือแฝงสีดำ ขนาด 11x19cm (100 แผ่น/แพค)', 'Forensic', u.id, 3.75, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0438', 'ซองเก็บเขม่าปืด 100แผ่น/แพ็ค', 'Forensic', u.id, 3.74, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0458', 'ป้ายอักษร A-J', 'Forensic', u.id, 2140.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0459', 'ป้ายลูกศร 4 ทิศ', 'Forensic', u.id, 267.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0464', 'ชุดป้ายหมายเลข  1-30 ตัวเลขสีขาว พื้นหลังสีดำ', 'Forensic', u.id, 1819.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0494', 'สเปรย์หมอก Smoke Detector Test 2.5oz (71g)', 'Forensic', u.id, 214.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'กระป๋อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0507', 'เทปปิดวัตถุพยานแบบกระดาษเนื้อขาวมัน/AV ม้วนสีแดง Evidance Sealing Tape พิมพ์ วัตถุพยาน EVIDENCE 100 ดวง/ม้วน', 'Forensic', u.id, 139.1, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0556', 'แบบพิมพ์มือ 10 นิ้ว ฝ่ามือ สันมือ พิมพ์สีน้ำเงิน หน้าหลัง FIDS2', 'Forensic', u.id, 3.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0578', 'ประกับพิมพ์มือ ฐานไม้เนื้อแข็ง ขนาด ประมาณ 9*24 ซม แถมยึด Stainless Steel พร้อมท่อกลิ้ง PVC เส้นผ่านศูนย์กลาง 6 ยาว 22 ซม', 'Forensic', u.id, 950.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0578-1', 'ประกับพิมพ์มือ ฐานไม้เนื้อแข็ง ขนาด ประมาณ 9*24 ซม แถมยึด Stainless Steel พร้อมท่อกลิ้ง PVC เส้นผ่านศูนย์กลาง 6 ยาว 22 ซม พิมพ์ตรา บริษัท', 'Forensic', u.id, 950.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'UVLW-8230', 'EA-180/F 8 Watt UV Lamp (230V/50Hz)', 'Forensic', u.id, 8009.19, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00017', '30967.26', 'Forensic', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '2172860.06' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B28748-25G', 'ACID YELLOW: Acid Yellow Powder grade 50% 25g Pot', 'Fume Care', u.id, 3143.33, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CA-60-PRO-CF', 'Cyanoacrylate Fuming Chamber (Pro 0.66 m)', 'Fume Care', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'Z154857-1EA', '60mm Alliminum Disposal Top ID FOIL DISH in pack of 100', 'Fume Care', u.id, 14.22, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00018', '3157.55', 'Fume Care', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '20151.16' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CGA580-HE', 'Helium 99.999% (UHP) Gas Volume7 M3/Cyl CGA 580', 'Gas', u.id, 16200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ท่อ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GS-NTG-001-03', 'Nitrogen 99.99% (Giga) Gas volume 7M3/Cyl CGA 580 พร้อมถัง', 'Gas', u.id, 7900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ท่อ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'POC-AIR ZERO-7M3', 'AIR ZERO 7M3 (POC)', 'Gas', u.id, 3783.34, 0, 'STANDARD', true
FROM units u WHERE u.code = 'CYL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'POC-HELIUM-UHP-7M3', 'HELIUM (UHP) CYL 7M3 (POC)', 'Gas', u.id, 15783.34, 0, 'STANDARD', true
FROM units u WHERE u.code = 'CYL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST-006', 'Refill synthetics OXY 21 7M3', 'Gas', u.id, 3700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'CYL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST-028', 'Refill N2 UHP 7M3 CYL 47L 150 Bar', 'Gas', u.id, 2625.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'CYL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST-048', 'Helium ULTRA high purity 7M3 V 580', 'Gas', u.id, 15700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'CYL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST-137', 'Refill Argon UHP CYL 47L 7M3 ท่อCGS', 'Gas', u.id, 5700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'CYL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST-325', 'Refill synthetics OXY 21 CYL 47L 15 Cyl', 'Gas', u.id, 3725.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'CYL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00019', '75116.68', 'Gas', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '131950.04' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '500082', 'Glyphosate sample Diluent 100mL', 'Gold standard', u.id, 2994.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '500089', 'Glyphosate ELISAA 96-test AOAC', 'Gold standard', u.id, 26566.14, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '520011', 'Microcystins/Nodularins (ADDA)(EPA ETV)(EPA Method 546) ELISA 96-test', 'Gold standard', u.id, 20647.29, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '520032', 'Microcystins/Nodularins PP2A (EPA ETV) Plate 96-Test', 'Gold standard', u.id, 21160.25, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '541070', 'E coli O157 H7 Latex agglutination Test (LAT) 50-test', 'Gold standard', u.id, 7923.22, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM1001', 'Buffered Peptone Water 500g', 'Gold standard', u.id, 1238.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM1201', 'Tryptic Soy Broth 0.5kg', 'Gold standard', u.id, 901.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM1301', 'Tryptic Soy Agar 500g', 'Gold standard', u.id, 2260.68, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM1310', 'Tryptic Soy Agaar 10kg', 'Gold standard', u.id, 23342.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM2001', 'Standard Mehods Plate Count Agar 0.5kg', 'Gold standard', u.id, 2305.17, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM3405', 'Potato Dextrose Agar 5Kg', 'Gold standard', u.id, 11099.94, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM4501', 'Macconkey agar 500mg', 'Gold standard', u.id, 2246.95, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM4801', 'EX Medium 500g', 'Gold standard', u.id, 1210.78, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM5001', 'Xyline Lysine Deoxycholate Agar 500g', 'Gold standard', u.id, 4026.26, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM5601', 'Brain Heart Infusion Broth 500g', 'Gold standard', u.id, 3190.74, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM6001', 'Nutrient Broth 500g', 'Gold standard', u.id, 2071.17, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM6101', 'Nutrient Agar 500g', 'Gold standard', u.id, 2468.2, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM6201', 'LB Broth Lennox 500g', 'Gold standard', u.id, 1498.17, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM9101', 'Tryptone (Casein Peptone) 500g', 'Gold standard', u.id, 1775.19, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM9401', 'Yeast Extract 500g', 'Gold standard', u.id, 3377.34, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM9701', 'Agar BBBacteriological 500g', 'Gold standard', u.id, 5296.48, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EIAREAD002', 'GSD Absorbance 96 ELISA Reader', 'Gold standard', u.id, 138741.91, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00020', '286342.84', 'Gold standard', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '485345.42' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '02-1984SP', 'Check Valve tool', 'Horizon(Biotage)', u.id, 2518.86, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '03-1588-01', '200 ml Evaporation Tube 1 ml Tip DryVap', 'Horizon(Biotage)', u.id, 2679.3, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '03-2693', 'Separatory Funnel, 125 mL, 24/40', 'Horizon(Biotage)', u.id, 8753.32, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '14-961-27', 'Test Tube, 13x100 mm, disposable Case (250 pcs/pack)', 'Horizon(Biotage)', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1664-100-PHT', 'Pacific Disk Premium 100mm', 'Horizon(Biotage)', u.id, 5935.19, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '22-0025-02', 'Cap, Kynar 1/16"" Non-Rotating', 'Horizon(Biotage)', u.id, 117.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '414964', 'TurboVap LV Multi Rack (48 Positions, 10-20 mm Tubes)', 'Horizon(Biotage)', u.id, 31390.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '415000', 'TurboVap LV', 'Horizon(Biotage)', u.id, 403857.39, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '47-2346-02', 'Atlantic  C-18 Disks 47mm', 'Horizon(Biotage)', u.id, 10608.72, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '48-2605', 'Sample Collect Check Valves (KIT)', 'Horizon(Biotage)', u.id, 11645.62, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '48-3103', 'Kit 3100 Collection adapter', 'Horizon(Biotage)', u.id, 6149.93, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '48-3503', 'Liquid Level Thermistor', 'Horizon(Biotage)', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '48-5401-06', 'Service Kit Water Level Sensor', 'Horizon(Biotage)', u.id, 3530.87, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '49-5406', 'Nozzle Kit (10 pk)', 'Horizon(Biotage)', u.id, 1284.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '49-5408', 'Nozzle Port Caps (50 pk)', 'Horizon(Biotage)', u.id, 1129.15, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '49-5410-04', 'KIT, RACK, 200mL, 6 POS', 'Horizon(Biotage)', u.id, 22429.41, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '49-5410-50', '54 pos adjustable rack.xcelvap', 'Horizon(Biotage)', u.id, 18883.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '50-0051-03', 'Water Vacuum manifold 4-Port', 'Horizon(Biotage)', u.id, 7621.99, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '50-021-HT', 'O&G STD Snip and Pour,40mg', 'Horizon(Biotage)', u.id, 3853.39, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '50-0472', 'VALVE, SAMPLE INLET 3100', 'Horizon(Biotage)', u.id, 30847.81, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '530-0050-B', 'ISOLUTE? SCX 500 mg/3 mL (50 ea/pack)', 'Horizon(Biotage)', u.id, 5484.27, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '532-0020-B', 'ISOLUTE SCX-2 200 mg 3ml', 'Horizon(Biotage)', u.id, 4952.77, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '610-0006-BX', 'EVOLUTE EXPRESS ABN 60 mg/3mL', 'Horizon(Biotage)', u.id, 4121.71, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '610-0015-CXG', 'EVOLUTE EXPRESS ABN 150 mg 6mL (Tabless)', 'Horizon(Biotage)', u.id, 5871.33, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '610-006-BX', 'Evolute Express ABN 60 mg 3mL', 'Horizon(Biotage)', u.id, 5141.07, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '611-0015-CXG', 'EVOLUTE Express CX 150 mg /6 mL (Tabless)', 'Horizon(Biotage)', u.id, 5671.53, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '612-0015-CXG', 'EVOLUTE Express WCX 150 mg /6 mL (Tabless)', 'Horizon(Biotage)', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '820-0055-B', 'ISOLUTE SLE+400 uL Sample Volume', 'Horizon(Biotage)', u.id, 4813.3, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '820-0140-C', 'ISOLUTE? SLE+ 1 mL Sample Volume (30 Ea/Pk)', 'Horizon(Biotage)', u.id, 2805.1, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '904-0030-H', 'ISOLUTE Multimode 300mg 10mL 50ea/pack', 'Horizon(Biotage)', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FFP-90-HT', 'Fast Flow Prefilter 90 BX50', 'Horizon(Biotage)', u.id, 4725.17, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PPM-A48-1275', 'Collection Rack 12 x 75 mm', 'Horizon(Biotage)', u.id, 18579.24, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'Q0035-0020-BG', 'ISQLUTE EN General 200 mg/3 mL (Tabless)', 'Horizon(Biotage)', u.id, 3292.07, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'Q0080-0030-BG', 'ISOLUTE? EN Pigment 300 mg/3 mL (Tabless)', 'Horizon(Biotage)', u.id, 3292.07, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'Q0090-0050-BG', 'Q0090-0050-BG  ISOLUTE? EN High Pigment 500 mg/3 mL (Tabless)', 'Horizon(Biotage)', u.id, 4519.63, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'VMD-0250', 'VacMaster Disk', 'Horizon(Biotage)', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'XCV-5400', 'KIT XCEL VAP', 'Horizon(Biotage)', u.id, 293825.24, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00021', '940332.21', 'Horizon(Biotage)', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '1891868.28' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HS-SL7', 'Metal Halide Lamp for KH-1300M KH-7700', 'Hirox', u.id, 31664.83, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00022', '31664.83', 'Hirox', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '31664.83' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '10001146', 'TWINX/LABX HELIUM PCB ASSY', 'Hitachi High-Tech', u.id, 49835.39, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '10003525', '11090 SAFETY SWITCH & ACTUATOR', 'Hitachi High-Tech', u.id, 8011.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-10001172', 'Re-usable sample cup outer (AI) standard size from april 2007', 'Hitachi High-Tech', u.id, 12981.29, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-10001440', 'Sample spinner', 'Hitachi High-Tech', u.id, 40988.16, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-10011618', 'X-Supreme8000', 'Hitachi High-Tech', u.id, 1523189.65, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-9000302', 'Printer KIT Lab-X5000', 'Hitachi High-Tech', u.id, 32259.98, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-C-LX5000', 'Lab-x-5000 63*53*36 cm 25KG', 'Hitachi High-Tech', u.id, 900710.17, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-L79', 'Poly-S2 High Performance XRF Sample Film', 'Hitachi High-Tech', u.id, 3177.65, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-LX6912-1', '35 MM Sample Cutter PS10', 'Hitachi High-Tech', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00023', '2571153.34', 'Hitachi High-Tech', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '17065676.34' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NIR-A-R2LI', 'Integration rod round to linear fiber 600um 3 1M', 'InnoSpectra', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NIR-RM-2', 'White reference material-2 15x11x15mm', 'InnoSpectra', u.id, 13366.58, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00024', '13366.58', 'InnoSpectra', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '13366.58' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '15046-5-SH-C18EX', 'Shaper C18 Extreme 100A 5?m 150x4.6mm', 'Im Chem', u.id, 16361.74, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '25046-2.6-SHPP-C18UI', 'Shaper Partially Porous 100A C18UI 2.6?m, 250 x 4.6mm', 'Im Chem', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '5021-1.7-SH-HYB-C18', 'Shaper Hybrid column 1.7 ?m C18, 50 x 2.1 mm', 'Im Chem', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'G-1.7RP-5-21', 'imChem U-HPLC guard catridge 1.7?m RP, 5 x 2.1 mm, 3 units', 'Im Chem', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'G1046-5-SH-C18EX', 'Guard HPL columns Shaper C18 Extreme 100A 5um 10x4.6mm 3-pk', 'Im Chem', u.id, 5397.18, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'G5X346-2.6-SHPP-C18UI', 'Shaper Partially Porous 100A C18UI 2.6?m, G5x3 x 4.6mm', 'Im Chem', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'G-HOLDER-5', 'imChem U-HPLC Guard holder for 5mm cartridges', 'Im Chem', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HGSHAPER', 'Holder for 10x2.1mm 10x3.0mm 10x4.0mm 10x4.6mm Shaper guard columns', 'Im Chem', u.id, 4311.03, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS26503', 'coupler blur peek', 'Im Chem', u.id, 2176.68, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SHPP-G5', 'Shaper Partially Porous Guard Holder 5 mm', 'Im Chem', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00025', '28246.63', 'Im Chem', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '56493.26' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WAA32', 'Intrada Amino Acid 50 x 3 mm', 'Imtakt Corporation', u.id, 24503.54, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WAA34', 'Intrada Amino Acid 100 x 3 mm', 'Imtakt Corporation', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00026', '24503.54', 'Imtakt Corporation', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '24503.54' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '22955', 'Viton Seal Set SEAL SET Parker Balston 22955', 'Impexron GmbH', u.id, 7757.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00027', '7757', 'Impexron GmbH', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '116355' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ALL_CLEANER', 'Super All Cleaner waterless KS 50 g', 'Kagaku Sobi', u.id, 63.61, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-ALUMINIUM-100G', 'Aluminum powder, 100g. KS', 'Kagaku Sobi', u.id, 834.28, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-BLACK-100', 'ผงฝุ่นดำ ขนาด 100 กรัม ยี่ห้อ KS ; Japan', 'Kagaku Sobi', u.id, 424.16, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-BLACK-30', 'ผงฝุ่นดำ ขนาด 30 กรัม ยี่ห้อ KS', 'Kagaku Sobi', u.id, 133.97, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-BLACK-60', 'ผงฝุ่นสีดำ ชนิดความละเอียดสูง ขนาด 60 กรัม', 'Kagaku Sobi', u.id, 208.25, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-BLACK-70', 'ผงฝุ่นดำชนิดความละเอียดสูง สีดำ ขนาด 70 กรัม', 'Kagaku Sobi', u.id, 330.25, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-F1-1', 'แผ่นเจลลาตินลอกฝ่ามือ ขนาด 12x14cm. สีดำ Gelatin film (25แผ่นต่อ1แพค)', 'Kagaku Sobi', u.id, 1107.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-F1-1/1', 'แผ่นเจลลาตินลอกฝ่ามือ ขนาด 12x14cm. สีดำ Gelatin film (1แพค)', 'Kagaku Sobi', u.id, 44.3, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-F1-2', 'แผ่นเจลลาตินลอกฝ่ามือ ขนาด 12x14cm. สีขาว Gelatin film', 'Kagaku Sobi', u.id, 823.25, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-F1-2/1', 'แผ่นเจลลาตินลอกฝ่ามือ ขนาด 12x14cm. สีขาว Gelatin film', 'Kagaku Sobi', u.id, 32.93, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-F23-2', 'RUBITT BRUSH (แปรงขนกระต่าย)', 'Kagaku Sobi', u.id, 306.94, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-F23-5', 'RUBITT BRUSH  CONTAINER  (ONLY BOX) กล่องเก็บแปรงขนกระต่าย', 'Kagaku Sobi', u.id, 313.18, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-F24-4', 'Brush Without Metal Clip Width 30mm. (แปรงทานินไฮดริน)', 'Kagaku Sobi', u.id, 271.43, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-F5-5', 'Fingerprint Ink  Police Mate TYPE3, 192g 6 นิ้ว หมึกพิมพ์มือชนิกตลับ', 'Kagaku Sobi', u.id, 1408.58, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-G1-3', 'แผ่นเจลลาตินลอกฝ่าเท้า ขนดา 14 x32 cm. สีเทา Foot Print 14 x 32 cm KS KAGAKUSOBI 25 ST 121124 Size L สีเทา', 'Kagaku Sobi', u.id, 2818.75, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-HSBRUSH', 'แปรงขนม้า ยาว 16.5 ซม.', 'Kagaku Sobi', u.id, 206.45, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-MAG-BLACK-30', 'Black Magnetic Latent Print powder 30g. (50cc.) (ผงฝุ่นแม่เหล็กสีดำ ขนาด 30กรัม', 'Kagaku Sobi', u.id, 89.27, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-MAG-WHITE-60', 'Fingerprint white magnetic powder 60g/50cc Bottle', 'Kagaku Sobi', u.id, 741.55, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-WHITE-30', 'ผงฝุ่นสีขาว ชนิดความละเอียดสูง ขนาด 30 กรัม', 'Kagaku Sobi', u.id, 127.23, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-WHITE-70', 'ผงฝุ่นสีขาว ชนิดความละเอียดสูง ขนาด 70 กรัม', 'Kagaku Sobi', u.id, 280.54, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00028', '10566.42', 'Kagaku Sobi', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '217880.83' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '036-104-00N', '1/4 MPT N/P Needle valve', 'Koehler', u.id, 4279.93, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '042-108-02B', '1/8 FPT 3-WAY Brass Ball Valve', 'Koehler', u.id, 6937.56, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '225-230-003', 'Heater 1250W 230V', 'Koehler', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '250-000-05C', 'Thermometer astm 5C Above item is not restricted per special provision A69', 'Koehler', u.id, 1625.14, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '250-000-07C', 'Thermometer ASTM 7C', 'Koehler', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '250-000-08C', 'ASTM Thermometer 8C (-2C to +400C)', 'Koehler', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '250-000-09C', 'ASTM 9CThermometer', 'Koehler', u.id, 3647.91, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '250-000-10C', 'ASTM 10CThermometer', 'Koehler', u.id, 4473.85, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '250-000-37C', 'Thermometer ASTM 37C', 'Koehler', u.id, 12317.32, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '332-002-003', '100ml Graduated cylinder', 'Koehler', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '332-002-006', '400ML Flared pyrex beaker', 'Koehler', u.id, 2627.89, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '332-003-001', 'Distillation Flask, Type B, 125 mL', 'Koehler', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '334-002-001', 'Top silicone plug, Pack of 10 For Type A, B, and D Flasks', 'Koehler', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '334-002-002', 'Side silicone plug, Pack of 10', 'Koehler', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '380-150-002', 'Alum oxide cloth 150gr pkg50', 'Koehler', u.id, 11433.04, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '380-240-002', 'Alum oxide cloth 240gr pkg50', 'Koehler', u.id, 12081.49, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AS568-032', 'O-Ring BUNA ""N', 'Koehler', u.id, 490.07, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AS568-113', 'O-Ring', 'Koehler', u.id, 588.08, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AS568-210', 'O-Ring BUNA N', 'Koehler', u.id, 588.08, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K00300-03230', 'Assembly Motor 230V 50/60 1/2HP wired comes with mounting instuctions', 'Koehler', u.id, 14562.04, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K11201', 'Vapor Pressure cylinder LPG', 'Koehler', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K11420-1', 'CU BOX SET', 'Koehler', u.id, 13989.54, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K17984', 'Plastic jar with cover', 'Koehler', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K18296', 'WATER SPPRAY APP DIGITAL 220-240/50', 'Koehler', u.id, 345493.47, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K190-0-5', 'Cone Assembly', 'Koehler', u.id, 19596.46, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K194EC', 'Cup support', 'Koehler', u.id, 995.54, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K19520', 'Lightweight plunger 15-GRAM', 'Koehler', u.id, 13592.2, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K19553', 'Calibration kit 3pc metric W/C', 'Koehler', u.id, 8511.13, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K20200', 'Half-size penetrometer cone', 'Koehler', u.id, 33553.84, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K20210', 'Half-Scale grease worker', 'Koehler', u.id, 60494.44, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K20670-00000', 'Needle Stainless Steel with 220-240V 50/60Hz', 'Koehler', u.id, 9428.16, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K26150', 'Pressure Hydrometer Cylinder', 'Koehler', u.id, 58340.27, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K26150-0-6', 'Neoprene cushion', 'Koehler', u.id, 490.07, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K30101', 'Rust rest spec W #2 PTFE HOLD', 'Koehler', u.id, 4744.91, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K30130', 'Chuck and locknut', 'Koehler', u.id, 13719.65, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K30165', 'RST PRV CHR OIL BTH 220-240/50', 'Koehler', u.id, 447595.17, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K30180', 'Drive motor 220-240V 50HZ', 'Koehler', u.id, 48081.76, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K45290', 'Group 4 Front View Distillation, Right-Hand Model, 220-240V, 50/60Hz', 'Koehler', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K45420', 'Flask Support Board, Type B, 1 ?” Diameter Hole', 'Koehler', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K45601-03014', 'Tube Cleaner Ass’y', 'Koehler', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K60092-ST', 'Oiltest Cntrfuge 230V shortube unit includes', 'Koehler', u.id, 493982.74, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K71000', 'Auto pmcc flash point analyzer 100-240v', 'Koehler', u.id, 525267.62, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K71000-03015', 'Stirrer ASSY', 'Koehler', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K71000-03046', 'Thermocouple flash assembly', 'Koehler', u.id, 2456.47, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K71000-03048', 'RTD PT100-Class A', 'Koehler', u.id, 2876.66, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K71000-23021', 'IGNITER Assembly', 'Koehler', u.id, 19490.16, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K71000-23026', 'Primary fan assembly', 'Koehler', u.id, 5694.52, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K71000-23035', 'CUP Assembly', 'Koehler', u.id, 14674.18, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K95300', 'LOW TEMP GREASE FLOW TESTTER 110-230', 'Koehler', u.id, 1071602.51, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K95590-00000', 'Digital Penetrometer 220-240V 50/60Hz รวม Cel', 'Koehler', u.id, 293734.32, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KD6278-CRM', 'Shear Stability Ref fluid RL233 1L', 'Koehler', u.id, 5271.02, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KO-250-000-91C', 'Thermometer Astm 91C', 'Koehler', u.id, 2977.33, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00029', '3592306.54', 'Koehler', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '4376190.26' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SKU0117161', 'Silver Target Ag 99.99% Pure 3.00 Diameter x 0.250 thick +/-0.010 ALL', 'Kurt J Lesker', u.id, 24146.94, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00030', '24146.94', 'Kurt J Lesker', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '72440.82' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '100-FC-12429', 'Fanless 5700K Led cube illuminator light source LED light source for use with a fiber optic light guide', 'Leeds', u.id, 57611.59, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '107-LS-09582', 'Microscope Light', 'Leeds', u.id, 27614.74, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '183-MA-03585', 'Hydraulic legs for lcf Levitech 2-leg lift 16 T - 16 Strokeelectric for XT Tables 500Lbs capacit 1 Tubes 90 1tube 60', 'Leeds', u.id, 84787.7, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'L246', 'EKE 21V 150W halogen reflector bulb for fiber optic illuminator', 'Leeds', u.id, 890.82, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LCF3-FLRKIT', 'Fluorescent light kit for LCF3 station w/articulating arms Fluorescent light pairs 13W 5000K 900 lumens energy efficient Double U-Tube quad bar design lamp', 'Leeds', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00031', '170904.85', 'Leeds', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '176249.77' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6012196', 'Cyclone WORKFLOW CCP 1yr', 'Leica', u.id, 13502.2, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6018134', 'Cyclone REGISTER 360 PLUS CCP 1yr', 'Leica', u.id, 54849.22, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00032', '68351.42', 'Leica', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '68351.42' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '159875', 'CEM: Smart Trac - Film', 'LIS', u.id, 27109.19, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'IF700', 'Sample Pads Insulators (L : 300 W : 5 700squares', 'LIS', u.id, 13064.1, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LIS4X4', 'Sample Pads  LIS 4""x4"" Square (400/Box)', 'LIS', u.id, 3370.57, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00033', '43543.86', 'LIS', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '210978.16' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '270065', '10 ML electrolysis bottle', 'LIS', u.id, 14968.46, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '270066', '25 ML electrolysis bottle', 'LIS', u.id, 24589.81, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AP10DB', 'Ampulmatic 10 drive belt', 'LIS', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00034', '39558.27', 'LIS', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '39558.27' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-CK100', 'Consumable Kit (100 ea/box), Dispasable Inners and Lid', 'Oxford', u.id, 2882.6, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-CP1057', 'Paper Roll for Thermal Printer For Lab X-3500 (copy ในตัว)', 'Oxford', u.id, 452.43, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-L229', 'Paper Stage-Light Element', 'Oxford', u.id, 10127.79, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-L242', 'Sample cells standard size (10 ea/box)', 'Oxford', u.id, 12647.88, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-L341', 'Turntable servo assy LX3000', 'Oxford', u.id, 20778.89, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-L70', 'Mylar film 6 microns thick (100m./roll)', 'Oxford', u.id, 3738.27, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-L72', 'Hostaphan High Performance XRF 3.5 micron (100m./roll)', 'Oxford', u.id, 2582.72, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-L73', 'Poly 4"" Film 4 micron (100m. x 75mm.)', 'Oxford', u.id, 3681.04, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-L76', 'Poly C"" Film 5 micron (100m. x 75mm.)', 'Oxford', u.id, 3374.77, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-L77', 'Poly M"" High Performance XRF Sample  Film 2.5 micron (100m.)', 'Oxford', u.id, 7110.39, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-LA1034-5', 'X-ray warning lamp bulbs for ED-2000', 'Oxford', u.id, 129.44, 0, 'STANDARD', true
FROM units u WHERE u.code = 'VIAL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-LA1049-5', 'Lamp Type B26 240V,25W', 'Oxford', u.id, 1811.71, 0, 'STANDARD', true
FROM units u WHERE u.code = 'VIAL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-LX1011/100', 'Disposable Inners for L240 Sample cups (X-ray Cup) (100 ea/box)', 'Oxford', u.id, 1788.55, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-LX1012/100', 'Lid for L240 Sample Cup Disposable Inners', 'Oxford', u.id, 1437.52, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-LX1015/100', 'Butter Sample Caps 100 OFF', 'Oxford', u.id, 1192.65, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-LX1032', 'Sample Holder, Sample cell rack', 'Oxford', u.id, 2672.38, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-LX1054', 'Window Assembly jig for L240', 'Oxford', u.id, 2605.03, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-LX320', 'Safety window assy jig', 'Oxford', u.id, 5976.24, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-LX5101', 'Printer Ribbon Black & Red for Lab-X3000 (กล่องเขียว)', 'Oxford', u.id, 299.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-LX5102', 'Printer Paper for Lab-X1000/3000 (CR54)', 'Oxford', u.id, 112.14, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-LX5105', 'Nylon fabric cassette lasting impression black/Red', 'Oxford', u.id, 936.24, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-LX6879-2', 'Secondary Safety Window (new design)', 'Oxford', u.id, 283.16, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-LX6913-1', '(PS10) 100 Blades/5 mat kit', 'Oxford', u.id, 6276.29, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-OR1007/100', 'O-ring L240 sample cups (100 ea/pack)', 'Oxford', u.id, 579.51, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-PR1023', 'Vacuum Grease, 50g. (กล่องสีเขียว)', 'Oxford', u.id, 3572.95, 0, 'STANDARD', true
FROM units u WHERE u.code = 'VIAL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '54-Q59', 'Sample Holder', 'Oxford', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '59-MD3571', '18mm Test Sample (Oil Standard test Oxford Mode MQC)', 'Oxford', u.id, 3127.37, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'L70', 'Mylar Film 6 micron thick (250m. / roll)', 'Oxford', u.id, 4189.6, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0227', 'OXFORD warining LED', 'Oxford', u.id, 500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'THERMAL 58 G', 'กระดาษ Thermal 58 gram CASIO', 'Oxford', u.id, 30.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00035', '104896.61', 'Oxford', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '1369789.24' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DS-30NM', 'Livescan Fingers Print Service เครื่อง scan ลายนิ้วมือพร้อม Notebook DELL', 'Papillon', u.id, 300000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PMNK178.59.070', 'End-capping llnear sensor', 'Papillon', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PMNK178.61.000', 'Board External PCI-E (PC)', 'Papillon', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00036', '300000', 'Papillon', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '300000' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TF-125', 'Mylar XRF Thin Film 3"" x 300m.', 'Premier Lab', u.id, 2256.15, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TF-135', 'Premier Thin Film Mylar Continuous Roll Gauge 3.5u(0.14mil) 3in wide x 300 long(76mm x 91.4 m)', 'Premier Lab', u.id, 3412.85, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TF-160', 'Premier Thin Film TF-160 Mylar Continuous Roll Gauge', 'Premier Lab', u.id, 1951.26, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TF-240', 'X-Ray Film Polypropylene Continuous Roll', 'Premier Lab', u.id, 3276.82, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TF-260', 'Polypropylene Film', 'Premier Lab', u.id, 2412.35, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00037', '13309.43', 'Premier Lab', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '83398.94' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '00B-4742-AN', 'Luna Omega 1.6 um C18 100 A LC Column 50 x 2.1 mm', 'Phenomenex', u.id, 9408.48, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '00D-4251-B0', 'Luna 3 um C18(2) 100 A LC Column 100 x 2 mm', 'Phenomenex', u.id, 18312.24, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '00F-4249-E0', 'Luna? 5 ?m C8(2) 100 ? LC Column 150 x 4.6 mm', 'Phenomenex', u.id, 12623.89, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '00F-4336-E0', 'Synergi 4 um Polar-RP 80 A LC Column 150 x 4.6mm', 'Phenomenex', u.id, 9597.11, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '00F-4435-E0', 'Gemini? 5 ?m C18 110 ? LC Column 150 x 4.6 mm', 'Phenomenex', u.id, 18124.82, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '00F-4462-AN', 'Kinetex 2.6 um C18 100 A LC Column 150 x 2.1 mm', 'Phenomenex', u.id, 11987.16, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '00F-4462-E0', 'Kinetex 2.6 um C18 100 A LC Column 150 x 4.6 mm', 'Phenomenex', u.id, 11947.85, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '00F-4622-E0', 'Kinetex 2.6 Biphenyl 100 A LC Column 150 x 4.6 mm', 'Phenomenex', u.id, 11824.62, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '00G-4435-E0', 'Gemini? 5 ?m C18 110 ? LC Column 250 x 4.6 mm', 'Phenomenex', u.id, 13045.16, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '00G-4627-E0', 'Kinetex? 5 ?m Biphenyl 100 ? LC Column 250 x 4.6 mm', 'Phenomenex', u.id, 11645.28, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '7HG-G001-22', 'Zebron ZB-1 GC cap Column 30 m x 0.25 mm x 100 um', 'Phenomenex', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '7MG-G033-10', 'Zebron ZB-FAME GC Cap Column 100m x 0.25mm x 0.2um', 'Phenomenex', u.id, 21576.18, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8B-S008-EAK', 'Strata? SAX (55 ?m, 70 ?) 100 mg / 1 mL, Tubes (100/pk)', 'Phenomenex', u.id, 4252.48, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8B-S008-EAK-S', 'Strata? SAX (55 ?m, 70 ?) SAMPLE 101 mg / 1 mL, Tubes (Sample) (5/pk)', 'Phenomenex', u.id, 134.63, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8B-S010-HBJ', 'Strata? SCX (55 ?m, 70 ?) 500 mg / 3 mL, Tubes (50/pk)', 'Phenomenex', u.id, 179.51, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8B-S010-HBJ-S', 'Strata? SCX (55 ?m, 70 ?) 500 mg / 3 mL, Tubes (SAMPLE) (5/pk)', 'Phenomenex', u.id, 3459.89, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8B-S012-HCH-S', 'Strata SI-1 Silica (55 um ,70A) 500mg 6mL Tubes (SAMPLE)', 'Phenomenex', u.id, 8607.26, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8B-S016-HCH', 'Strata Screen-C (55 um 70 A) 500 mg 6 ml Tubes', 'Phenomenex', u.id, 2017.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8B-S016-HCH-S', 'Strata Screen-C (55 um 70 A) 500 mg 6 ml Tubes (SAMPLE)', 'Phenomenex', u.id, 890.84, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8B-S123-TAK', 'Strata-X-A 33 um Polymeric Strong Anion', 'Phenomenex', u.id, 4489.37, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8B-S129-TBJ', 'Strara -X-Drug N 100u Polymer RP 30mg/3mL', 'Phenomenex', u.id, 3640.17, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AC1-1545', 'SecurityCAP Waste Starter Kit 5-port GL/DIN45 Cap and 6-month Exhaust Filter', 'Phenomenex', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AC1-1561', 'SecurityCAP? Waste Starter Kit, 5-port DIN60/S61 Cap and 6-month Exhaust Filter', 'Phenomenex', u.id, 4977.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AC2-4345', 'SecurityCAP Mobile Phase Starter Kit 3-port GL45 Caps (x4) and 6-month Safety Filter(x4)', 'Phenomenex', u.id, 9044.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AF0-8497', 'KrudKatcher ULTRA HPLC In Line Filter 2.0 um Depth Filter x 0.004in ID', 'Phenomenex', u.id, 5573.16, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AF8-6102-12', 'CLARIFY-PTFE 25mm Syringe Filters (Hydrophobic) 0.45u, Non-Sterile, Luer/Slip', 'Phenomenex', u.id, 2117.19, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AF8-6107-12', 'CLARIFY-NY 25mm Syringe Filters 0.45u, Non-Sterile, Luer/Slip', 'Phenomenex', u.id, 2117.19, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AF8-6109-12', 'CLARIFY-PVDF 25mm Syringe Filters (Hydrophobic) 0.45u, Non-Sterile, Luer/Slip', 'Phenomenex', u.id, 2219.73, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AF8-6707-12', 'CLARIFY-NY 25mm Syringe Filters 0.22u, Non-Sterile, Luer/Slip', 'Phenomenex', u.id, 2117.19, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AF8-7102-12', 'CLARIFY-PTFE 13mm Syringe Filters (Hydrophobic) 0.45u, Non-Sterile, Luer/Slip', 'Phenomenex', u.id, 1845.76, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AF8-7109-12', 'CLARIFY-PVDF 13mm Syringe Filters (Hydrophobic) 0.45u, Non-Sterile, Luer/Slip', 'Phenomenex', u.id, 1628.61, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AF8-7702-12', 'CLARIFY-PTFE 13mm Syringe Filters (Hydrophobic) 0.22u, Non-Sterile, Luer/Slip', 'Phenomenex', u.id, 1845.76, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AF8-7706-12', 'CLARIFY-PVDF 13mm Syringe Filters (Hydrophilic) 0.22u, Non-Sterile, Luer/Slip', 'Phenomenex', u.id, 2447.4, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AF8-7709-12', 'CLARIFY-PVDF 13mm Syringe Filters (Hydrophobic) 0.22u, Non-Sterile, Luer/Slip', 'Phenomenex', u.id, 1707.49, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AG2-3B13-05', 'Zebron PLUS Liner for Shimadzu 17A, 3.4mm ID Single Taper Z-Liner?', 'Phenomenex', u.id, 6991.7, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AG6-1020', 'Zebron Gas Management - Filter Gas Filter Moisture', 'Phenomenex', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AJ0-4287', 'SecurityGuard? Cartridges C18 4 x 3.0mm ID 10/pk', 'Phenomenex', u.id, 13346.43, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AJ0-4287-S', 'SecurityGuard? Cartridges C18 4 x 3.0mm ID (SAMPLE) 2/pk', 'Phenomenex', u.id, 408.24, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AJ0-4290-S', 'SecurityGuard Cartridges C8 4 x 3.0mm ID(SAMPLE)', 'Phenomenex', u.id, 1177.16, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AJ0-7600', 'SecurityGuard Cartridges Polar C18 4 x 2.0mm ID', 'Phenomenex', u.id, 13000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AJ0-8329-S', 'SecurityGuard Cartridges HILIC 4 x 3.0mm ID(SAMPLE)', 'Phenomenex', u.id, 882.87, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AJ0-8782', 'SecurityGuard? ULTRA Cartridges UHPLC C18 2.1mm ID Columns, 3/Pk', 'Phenomenex', u.id, 14053.74, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AJ0-9000', 'SecurityGuard ULTRA Holder, for UHPLC Columns 2.1 to 4.6mm ID', 'Phenomenex', u.id, 4120.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AJ0-9296', 'SecurityGuard ULTRA cartridges for ENO-C18 UHPLC sub-2um and core-shell columns with 4.6 mm internal diameters (ID)', 'Phenomenex', u.id, 13518.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AJ0-9502', 'SecurityGuard ULTrA Cartridges UHPLC Fully Porous C18 for 2.1 mm ID Columns', 'Phenomenex', u.id, 6259.79, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AR0-3711-12', 'Verex Vial Crimp 2mL Amber 51 w Patch', 'Phenomenex', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AR0-5760-12', 'Verex Seal 11mm Dia Crimp PTFE/Sil/PTFE Silver', 'Phenomenex', u.id, 1497.44, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AR0-9921-13', 'Verex Vial Kit 9mm 2mL Clear 33 w/Patch + PTFE/Silicone 1000/pk', 'Phenomenex', u.id, 16487.61, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AR0-9921-13-U', 'Verex Vial Kit 9mm 2mL Clear 33 w/Patch + PTFE/Silicone', 'Phenomenex', u.id, 16.49, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AR0-9922-13-U', 'Verex Vial Kit 9mm 2ml Amber 51 w Patch + PTFE/Silicone', 'Phenomenex', u.id, 18.41, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KJ0-4282', 'SecurityGuard? Guard Cartridge Kit', 'Phenomenex', u.id, 10872.08, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00038', '343269.43', 'Phenomenex', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '755330.67' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1660', 'Cryoblock 2ml', 'Spex SamplePrep', u.id, 11433.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1666', 'Cryo Block 15mL CON', 'Spex SamplePrep', u.id, 11900.99, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1680', 'Foam Holder for 2 mL vials', 'Spex SamplePrep', u.id, 1902.07, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1685', '15 ml foam block MiniG 15ml vial holder x12 well foam', 'Spex SamplePrep', u.id, 765.77, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1686', '50 ml foam block MiniG 50ml vial holder x6 well foam', 'Spex SamplePrep', u.id, 765.77, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1690', 'Mini G Clamp Assembly', 'Spex SamplePrep', u.id, 37015.54, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1690T', 'Nesting plate Mini G Titer tray nesting plate', 'Spex SamplePrep', u.id, 2311.03, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2010-230', 'Geno-Grinder (230V 50Hz Operation)', 'Spex SamplePrep', u.id, 607698.38, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2012T', 'Nesting Tray SET of 2 nesting trays and 1 bottom plate for use with titer', 'Spex SamplePrep', u.id, 2693.65, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2100', 'Grinding Ball Dispensor', 'Spex SamplePrep', u.id, 9430.79, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2150', 'Grinding Balls 5/32"" (44mm.) Bag of 5000 (แบ่งขายแพคละ 1000 เม็ด)', 'Spex SamplePrep', u.id, 26021.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2151', 'Grinding Balls 1/8"" (3 mm), Bag of 1000', 'Spex SamplePrep', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2154', '1/4 SS Balls PK of 100', 'Spex SamplePrep', u.id, 8498.72, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2155', 'Packed 100 per bag must be double bagged to avoid breaking', 'Spex SamplePrep', u.id, 6803.45, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2156', 'Grinding Balls, 7/16"" Stainless Steel', 'Spex SamplePrep', u.id, 6708.76, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2189', 'Large Clamp Assembly', 'Spex SamplePrep', u.id, 67662.84, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2193', '15 mL Short vial holder', 'Spex SamplePrep', u.id, 1370.71, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2196-16-PE', 'Foam holder for 50mL Vial Polyethylene foam Block Holds 16 stand for use with large capacity clamps for G/G', 'Spex SamplePrep', u.id, 1972.82, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2197', 'Foam 15ML tube holder for 2195 large capacity clamp', 'Spex SamplePrep', u.id, 1475.93, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2200', '96-well titer-Plates 2.4 ML Capacity', 'Spex SamplePrep', u.id, 644.19, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2201', 'Cap-mats case', 'Spex SamplePrep', u.id, 1069.57, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2210', '96 well Round wells titer plats', 'Spex SamplePrep', u.id, 396.93, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2211', 'Cap Mat for 2210 Titer Plates', 'Spex SamplePrep', u.id, 300.6, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2251-PC', '15mL Short Polycarbonate Vial Set (100 ea/ case)', 'Spex SamplePrep', u.id, 9394.18, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2252-PC-30', '15mL Polycarbonate Cryovial with Screw on Cap (30 ea/Bag)', 'Spex SamplePrep', u.id, 3073.03, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2253-PC-48', '50mL Polycarbonate Cryovial with Screw on Cap (48 ea/Bag)', 'Spex SamplePrep', u.id, 8348.71, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2300', 'Foam holder for 2 mL Tubes foam holder for 2010 holds 48 2mL tubes 40355', 'Spex SamplePrep', u.id, 2376.75, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2302-1400AW', 'Pre-Filled Tubes 1.4 mm Zirconia Beads', 'Spex SamplePrep', u.id, 9079.38, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2304-100AW', 'Pre-Filled Tubes 100 ?m Silica Beads (600 mg) Pack of 100', 'Spex SamplePrep', u.id, 9079.38, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2665', 'Cryo block 96 WELL', 'Spex SamplePrep', u.id, 13190.42, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3112', '3/8 Methlcrylate Balls (100 ea/pack)', 'Spex SamplePrep', u.id, 975.04, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '33297', 'CLAMPRETAINING SPRING(A CLAMP RETAINING SPRING(ASSY)', 'Spex SamplePrep', u.id, 13789.52, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3511', 'Film of Other Polyester', 'Spex SamplePrep', u.id, 2105.84, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3517', 'Mylar Film 1/4 Mil 92m. x 64mm.', 'Spex SamplePrep', u.id, 1078.27, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3520', 'Polyprop Film, 0.2 mil', 'Spex SamplePrep', u.id, 1795.14, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3617M', 'Spec-Cap 9x38mm. DIA (1000ea/pack)', 'Spex SamplePrep', u.id, 7463.18, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3619M', 'Spec-Cap 9x30mm. DIA (1000 ea/pack)', 'Spex SamplePrep', u.id, 744.07, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3642-450', 'PREP-AID 3642 CELLULOSE, PREP-AID 3642 CELLULOSE ,450 GRAMS', 'Spex SamplePrep', u.id, 2817.48, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '40266-01', 'Lock assy', 'Spex SamplePrep', u.id, 25673.87, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6133PC', 'Polycarbonate Vial with Sop-On cap, 3/4 x 2 in', 'Spex SamplePrep', u.id, 2540.37, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6135', 'Poiypropylene Vial with Attached Cap Bag og 100', 'Spex SamplePrep', u.id, 3573.97, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6751', 'Grinding Vial for use in 6770/6870', 'Spex SamplePrep', u.id, 10272.93, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6751C20', 'Small Poly cabonate center for 6751 (20 ea/pack)', 'Spex SamplePrep', u.id, 15561.22, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6754', 'Extractor and vial opener for 6751 6753 6761 6771 Vials', 'Spex SamplePrep', u.id, 14694.65, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6775-230', 'Freezer/mill 230V 6775-230', 'Spex SamplePrep', u.id, 262491.14, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6781S', 'Stainless steel grinding vial set', 'Spex SamplePrep', u.id, 18792.18, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6801', 'Grinding Vial set large grinding vial for 6870', 'Spex SamplePrep', u.id, 31640.48, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6801C20', 'Large Polycarbonate Center Cylinders for 6801 and 6871, Bag of 20', 'Spex SamplePrep', u.id, 34785.98, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6804', 'Extractor 6800 (ASSY)', 'Spex SamplePrep', u.id, 17879.43, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6805', '6801 Vial Rack', 'Spex SamplePrep', u.id, 3528.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8000-13', 'Rubber-Lined coil springs', 'Spex SamplePrep', u.id, 2360.38, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8004A', 'Tungsten Carbide Ball, 7/16 in.', 'Spex SamplePrep', u.id, 1139.35, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '986546', 'Scintillation vial, with urea cap poly seal cone lined size 20 mL. ""Wheaton"" (100pcs/pack)', 'Spex SamplePrep', u.id, 2900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0226', 'Poly carbonate film roll 100 m/m x 250m w/o 2280', 'Spex SamplePrep', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00039', '1341988.75', 'Spex SamplePrep', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '1979662.42' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3117', 'Harden Steel Vial', 'SpexForensic', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3127', 'Hardened Steel Vial Set', 'SpexForensic', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0248', 'Vial 12 ml, clear, E-C sample with rubber line cap. ""Wheaton"" (200 pcs/pack)', 'SpexForensic', u.id, 2000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00040', '2000', 'SpexForensic', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '6000' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K1248', 'L-Shaped Scale 150mm x 300mm - L6-3880-(with 150mm straight scale) UOM per set of 2 scales ไม้บรรทัดฉาก สีดำ 30 ซม', 'SCENESAFE', u.id, 176.67, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K1249', 'ABFO No.2 Bitemark Scale 50mm x 50mm - B22831 - U.O.M per scale ไม้บรรทัดฉาก สีดำ 5ซม', 'SCENESAFE', u.id, 87.35, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K3022', 'D40709 Tyvek overboot with ties ref TYVO-UOM per pair ถุงคลุมเท้า แบบยาว', 'SCENESAFE', u.id, 49.68, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00041', '313.7', 'SCENESAFE', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '2960.33' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '10145', 'Transflectance accessory (0.25 mm)', 'Si-Ware', u.id, 3222.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '10146', 'Transflectance accessory (0.5 mm)', 'Si-Ware', u.id, 3222.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '10147', 'Transflectance accessory (1 mm)', 'Si-Ware', u.id, 3222.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '10157', 'Transflectance accessory (2 mm)', 'Si-Ware', u.id, 3222.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '10167', 'Transflectance accessory (5 mm)', 'Si-Ware', u.id, 3222.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '7010.90.50', 'Powder sample dish - high precision', 'Si-Ware', u.id, 1667.09, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '9027.30.80', 'NeoSpectra Scanner with podwer analysis kit and sample grinder', 'Si-Ware', u.id, 357034.54, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '9027.30.80.80-1', 'NeoSpectra Scanner Bundle PSK SG', 'Si-Ware', u.id, 364168.25, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '9027.30.80.80-2', 'NeoSpectra Scanner Bundle PAK', 'Si-Ware', u.id, 196962.6, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '9027.90.64', 'Powder dish calibration tile', 'Si-Ware', u.id, 1481.86, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '9027.90.64.00', 'Powder analysis kit', 'Si-Ware', u.id, 6979.71, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NAX00037', 'Vials x186', 'Si-Ware', u.id, 7633.32, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NAX10110', 'Scanner vial holder', 'Si-Ware', u.id, 2035.55, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NAX10129', 'Rotator Donut Cup', 'Si-Ware', u.id, 14418.49, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NEO10102', 'Handheld Near InfraRed(NIR) Spectrometer', 'Si-Ware', u.id, 425993.79, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NST10111', 'Rotator', 'Si-Ware', u.id, 33077.72, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NST10121', 'Saucer', 'Si-Ware', u.id, 11874.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00042', '1439441.77', 'Si-Ware', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '1673703.05' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3310-B-CRT', 'Refernce fuel buret 200ML straight type with 3 Point factory volume certification', 'Scientific Glass & Instruments Inc', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3320-B-CRT', 'Refernce fuel buret 400ml With 3PT Factory volume', 'Scientific Glass & Instruments Inc', u.id, 27397.71, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00043', '27397.71', 'Scientific Glass & Instruments Inc', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '136988.55' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'APP-MAG1', 'Retractable Magnetic Powder Wand แปรงแม่เหล็ก', 'Tri-Tech', u.id, 627.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'APP-MAG2', 'Retractable Pocket Magnetic Powder Wand', 'Tri-Tech', u.id, 682.1, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'APP-MAG3', 'TEX Ultra light retractable magnetic powder wand', 'Tri-Tech', u.id, 233.7, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOXK16X3X2', 'Knife Collection Storage Boxes (กล่องกระดาษเก็บมีด)', 'Tri-Tech', u.id, 70.11, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOXR51X9X3', 'Rifle Collection Storage Boxes (กล่องกระดาษเก็บปืนไรเฟิล)', 'Tri-Tech', u.id, 152.67, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BR-C-1.5', 'Brush, Flat Camel Hair 4.5"" (แปรงขนอูฐ)', 'Tri-Tech', u.id, 174.29, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BR-C-1.5(6)', 'Brush, Flat Camel Hair 6"" (แปรงขนอูฐ)', 'Tri-Tech', u.id, 542.63, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BR-G-1.875', 'Black Goat Hair Latent Print Brush', 'Tri-Tech', u.id, 245.01, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BR-G-2-7', 'Brush, Flat Black Goat Hair 7', 'Tri-Tech', u.id, 448.01, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BR-P-2.125', 'Brush, Flat pony hair 7', 'Tri-Tech', u.id, 346.53, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BR-S-1.25', 'Brush squirrel Hair Latent Print Brush 6.375 long 1 3/4  (แปรงขนกระรอก), brush  Black Kazan Squirrel Hair Latent Print', 'Tri-Tech', u.id, 688.01, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BR-S-1.75', 'Brush squirrel Hair Latent Print Brush 6 3/4 long 1 3/4 brush  (แปรงขนกระรอก) Kazan Squirrel Hair Latent Print , Black', 'Tri-Tech', u.id, 641.77, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BT-PL', 'Barrier Tape W/O Box ""POLICE LINE"" ขนาด กว้าง 3 นิ้ว ยาว 300 เมตร', 'Tri-Tech', u.id, 1144.85, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CH-1', 'Single cardholder unit (ปะกับพิมพ์มือ) ยี่ห้อ Tri-Tech', 'Tri-Tech', u.id, 886.69, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CHE-5111', 'Bullet hole examintation kit', 'Tri-Tech', u.id, 7855.64, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CM-MIK-B', 'Mikrosil Casting Putty Kit, Black', 'Tri-Tech', u.id, 1868.85, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CM-MIK-G', 'Mikrosil Casting Putty Kit, Gray', 'Tri-Tech', u.id, 2549.58, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EDMDT', 'Electronic Distance Measuring Device W/Target', 'Tri-Tech', u.id, 2512.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FP-BOT16G', '16 oz Glass maber bottle', 'Tri-Tech', u.id, 79.57, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FP-SPRAY-16', 'White fingertip Sprayer 7-5/8 DIP TUBE', 'Tri-Tech', u.id, 32.76, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MAG-FLD', 'Folding Magnifier 6x Magnification', 'Tri-Tech', u.id, 448.57, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MAG-FM5', '5X Fingerprint Magnifier', 'Tri-Tech', u.id, 5741.97, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PF30040-15ML', 'Phenolphthalein Forensic Set 15ML', 'Tri-Tech', u.id, 2737.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PMT-CH', 'Post Mortem Card Holder (ช้อนพิมพ์มือศพ)', 'Tri-Tech', u.id, 586.72, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PSA-LL', '3"" x 2"" Adhesive L-Shaped Photo Scales, 100 scales/roll', 'Tri-Tech', u.id, 590.88, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PSA-LS', '2"" x 1 3/4"" Adhesive L-Shaped Photo Scales, 100 scales/roll', 'Tri-Tech', u.id, 590.88, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PSP-ABFO', 'Authorized ABFO No.2 Photomacrographic Scale (1-8 cm.)', 'Tri-Tech', u.id, 510.94, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PSP-BUR', 'bureau Reference Scale, 2 Piece set', 'Tri-Tech', u.id, 249.03, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PSP-VAR', 'Vinyl Photo Scales, Asst. Color 12/pk (6 สี)', 'Tri-Tech', u.id, 282.88, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SC-CAR', 'Carbide tip evidence scriber', 'Tri-Tech', u.id, 325.45, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SC-DIA', 'Daimond Tip Evidence Scriber', 'Tri-Tech', u.id, 601.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SPR-BULB', 'Latent Print Powder mister ลูกยางสีฟ้า', 'Tri-Tech', u.id, 1141.02, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0223', 'LATENT print powder Feather Dustless 9"" Tritech แปรงขนนก', 'Tri-Tech', u.id, 300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TWZPLA', 'Plastic Disposable Tweezers (ปากคีบพลาสติก)', 'Tri-Tech', u.id, 34.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'UVA-C-O', 'CS EYE Orange uv Googles แว่นตา เลยส์ส่ง กัน UV', 'Tri-Tech', u.id, 544.68, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'UVLSW-5B', 'UV-5NF Long/Short wave 5 watt UV', 'Tri-Tech', u.id, 2873.4, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'UVLW-4B', 'B-14N LONG WAVE BATTERY UV LAMP', 'Tri-Tech', u.id, 10904.09, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00044', '50246.19', 'Tri-Tech', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '274601.22' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1217158', 'Mainten update kit 9900', 'ThermoFisher', u.id, 34805.63, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1217159', 'Mainten update kit PfX', 'ThermoFisher', u.id, 3781.97, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1217160', 'Main update kit OptX V2', 'ThermoFisher', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1226018', 'Mainter update kit Optx V1', 'ThermoFisher', u.id, 18818.11, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8542399000', 'Board X-ray on lamp neos EQ', 'ThermoFisher', u.id, 8010.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S500240', 'MOTOR WITH PULLEY Z_AXIS', 'ThermoFisher', u.id, 60937.48, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S703832', 'Board XQIM XRAY QUANT IN T MAST', 'ThermoFisher', u.id, 265841.62, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S704362', 'START and EMERGENCY STOP', 'ThermoFisher', u.id, 11498.45, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S704723', 'MOTOR EC45 WITH PULLEY', 'ThermoFisher', u.id, 67295.81, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S704789', 'BOARD,X-RAY ON LAMP,NEOS', 'ThermoFisher', u.id, 3603.26, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S704816', 'WATER_PUMP_NEOSEQ', 'ThermoFisher', u.id, 89551.24, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S704871', 'BOARD,NEOSEQ,Y AXIS,INTE', 'ThermoFisher', u.id, 5563.67, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S705053', 'CABLES MAGAZIN XY,KIT,PE', 'ThermoFisher', u.id, 35343.56, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'X8100-7410', 'ASY SAMPLE TRAY DRIVE TE STED', 'ThermoFisher', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'XH-X52-AL-1700', 'Kit Single Mono Al for 9900 Adjunction of one entire single Al monochromator for 9900 instrument.', 'ThermoFisher', u.id, 576777.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00045', '1181829.5', 'ThermoFisher', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '1591625.17' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3402119090', 'Sprint v2 Cleaning fluid 2 lt', 'West Technology Forensics', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '50005', 'Gold/Silver Evaporation Boats 10ea/pk', 'West Technology Forensics', u.id, 7266.15, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '50006', 'Zinc Evaporation Boats 10ea/pk', 'West Technology Forensics', u.id, 7882.67, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '71069200', 'Silver wire 0.5MM(100pc)', 'West Technology Forensics', u.id, 3026.28, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '71069200-1', 'Sterling Silver wire 0.5MM(100pc)', 'West Technology Forensics', u.id, 2744.33, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '7108130', 'Gold wire 0.25MM (100pc)', 'West Technology Forensics', u.id, 6503.69, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '79040000F', 'ZINC Shots 15 GMS (100 PCS APPROX)', 'West Technology Forensics', u.id, 3496.2, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00046', '30919.32', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '129787.62' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0110046', 'กระดาษถ่ายเอกสาร IDEA MAX 70G A4 (500 แผ่น)', 'West Technology Forensics', u.id, 94.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'รีม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0110059', 'กระดาษถ่ายเอกสาร Double A A4 80 แกรม', 'West Technology Forensics', u.id, 130.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'รีม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0129042', 'ซองเอกสารสีน้ำตาล เนื้อBA ยี่ห้อ 555 ขนาด 4 1/2 x 7 นิ้ว (50 ซอง/แพค)', 'West Technology Forensics', u.id, 55.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0131053', 'แล็บ ป้ายสติ๊กเกอร์ ตราช้างA4, 16x21 มม.', 'West Technology Forensics', u.id, 35.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0215000', 'ปากกาเคมี/มาร์คเกอร์ ตราม้า 2 หัว สีน้ำเงิน', 'West Technology Forensics', u.id, 16.33, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0215001', 'ปากกาเคมี/มาร์คเกอร์ ตราม้า 2 หัว สีดำ', 'West Technology Forensics', u.id, 10.75, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0215002', 'ปากกาเคมี/มาร์คเกอร์ ตราม้า 2 หัว สีแดง', 'West Technology Forensics', u.id, 11.14, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ด้าม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0414004', 'ลวดเสียบกระดาษ ตราม้า  เบอร์ 1 เหลี่ยม', 'West Technology Forensics', u.id, 60.99, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0418011', 'กรรไกร ตราช้าง พรีเมี่ยม OFP ขนาด 8 นิ้ว', 'West Technology Forensics', u.id, 67.58, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0519020', 'สก๊อตเทปใส OPP ขนาด 48มม. x 40ม ยี่ห้อ สก๊อต', 'West Technology Forensics', u.id, 31.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '12145', 'เทป OPP 2 นิ้ว น้ำตาล 100 หลา', 'West Technology Forensics', u.id, 40.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1749', 'กรรไกร 3M Scotch 8นิ้ว รุ่น 1428', 'West Technology Forensics', u.id, 71.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1845', 'ใบมีดตัดเตอร์ ตราช้าง 1845 (18 มม) 45 องศา', 'West Technology Forensics', u.id, 290.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2000276', 'ใบมีดตัดเตอร์ 30 องศา ตราช้าง 930 S-901 902', 'West Technology Forensics', u.id, 180.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '206962', 'พานาโซนิค ถ่านอัลคาไลน์ AA  4ก้อน/แพ็ค', 'West Technology Forensics', u.id, 69.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '206963', 'พานาโซนิค ถ่านอัลคาไลน์ AAA 4ก้อน/แพ็ค', 'West Technology Forensics', u.id, 60.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2071811', 'กรรไกร 8 นิ้ว สก็อตช์ Multi Purpose', 'West Technology Forensics', u.id, 70.36, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2081950', 'ELEPHANT มีดคัตเตอร์ รุ่น S-902 สีเงิน', 'West Technology Forensics', u.id, 28.04, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2089', 'คัดเตอร์ S-1801 ตราช้าง 45 องศา (ใช้มีด 18 มม)', 'West Technology Forensics', u.id, 47.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2091290', 'ใบมีดคัดเตอร์ 9 มม หลอด6ใบ ตราช้าง 945', 'West Technology Forensics', u.id, 23.36, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '2398', 'เทป OPP 3M 3609 2นิ้ว x 40 ม ใส', 'West Technology Forensics', u.id, 51.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3612', 'เทปโอพีพี 3M 3609 2นิ้ว x 40 ม น้ำตาล OPP', 'West Technology Forensics', u.id, 48.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '5005881', 'กระดาษกรอสซี่อิงค์เจ็ท A4 130 แกรม (แพ็ค 100 แผ่น) SAVE MORE SMGL', 'West Technology Forensics', u.id, 200.93, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8888336027760', 'สก็อตต์คลีนแคร์ 3 ชั้น 2XL x24 ม้วน', 'West Technology Forensics', u.id, 373.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '927529', 'เฟเบอร์-คาสเทลล์ ปากกาเน้นข้อความ คละสี 4+1', 'West Technology Forensics', u.id, 119.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0119923', 'Power Bar TOSHINO ET-914 (3M)', 'West Technology Forensics', u.id, 400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A014083', 'เก้าอี้กลมพับอเนกประสงค์ 20C สีขาว', 'West Technology Forensics', u.id, 271.03, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A015883', 'เก้าอี้สำนักงาน เฟอร์ราเดค Miley สีดำ', 'West Technology Forensics', u.id, 2327.1, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AA3000X8-1.5V', 'แบตเตอรี่ Palo 1.5V AA ชาร์จได้', 'West Technology Forensics', u.id, 731.33, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ACD-DJI561', 'แอร์ Eminent ตั้งแขวน18,000 บีทียู (ท่อไม่เกิน 4.00 ม.) รื้อ+ติดตั้ง', 'West Technology Forensics', u.id, 43000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AL-PD-0002-0200', 'Alsoff Alcohol pad 200 pc/box', 'West Technology Forensics', u.id, 271.97, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AL-PD-0004-0100', 'Brocare Alcohol pad 75% 100 pc/box', 'West Technology Forensics', u.id, 78.4, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BAG-3D', 'เป้หลัง 3D', 'West Technology Forensics', u.id, 420.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BLN75-C-B0.5', 'ปากกาหมึกเจล เพนเทล น้ำเงินเข้ม BLN75TL-CA  0.5มม', 'West Technology Forensics', u.id, 42.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แท่ง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BLN-C-B0.5', 'ไส้ปากกา เพนเทล BLN  0.5 น้ำเงิน', 'West Technology Forensics', u.id, 17.76, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แท่ง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOX-4113-S18', 'กล่องเก็บอุปกรณ์ Size S 18 Ltr', 'West Technology Forensics', u.id, 269.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BR-CG-0001-0005', 'แปรงล้างเครื่องแก้ว No. 0.5', 'West Technology Forensics', u.id, 31.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BR-CG-0001-0015', 'แปรงล้างเครื่องแก้ว No. 1.5', 'West Technology Forensics', u.id, 26.61, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BR-CG-0001-0040', 'แปรงล้างเครื่องแก้ว No. 4', 'West Technology Forensics', u.id, 27.62, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BT-5000C', 'Brother ink cartridge (Cyan) for DCP-T500W', 'West Technology Forensics', u.id, 200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BT-5000M', 'Brother ink cartridge (Magenta) for DCP-T300 DCP-T500W', 'West Technology Forensics', u.id, 200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BT-5000Y', 'Brother ink cartridge (Yellow) for DCP-T300 DCP-T500W', 'West Technology Forensics', u.id, 200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BT-D60BK', 'ตลับหมึก สีดำ (Dye ink) สำหรับเครื่องอิงค์เจ็ทรุ่น DCP-T31', 'West Technology Forensics', u.id, 250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BT-HIP12V', 'BATTERY UPS HIP 12V 7AH VDC', 'West Technology Forensics', u.id, 1000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CG4-AA3000', 'เครื่องชาร์จแบตเตอรี่ PALO USB 4 ช่อ ไม่มี่ถ่าน', 'West Technology Forensics', u.id, 157.33, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CH-A014794', 'เก้าอี้สำนักงาน เฟอร์ราเดค Mermaid สีดำ', 'West Technology Forensics', u.id, 2607.48, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CH-GIANT-BK-2169', 'Giant เก้าอี้สำนักงานผู้บริหาร สีดำ', 'West Technology Forensics', u.id, 6569.51, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CH-I27-CR603', 'เก้าอี้บาร์', 'West Technology Forensics', u.id, 1500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CI690S', 'FINGER SCAN HIP CI690S (เครืองสแกนลายนิ้วมือ)', 'West Technology Forensics', u.id, 11260.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CL-57', 'Canon CL-57 Color ตลับหมึกอิงค์เจ็ท 3 สี', 'West Technology Forensics', u.id, 550.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'COMPUTER_SET-MD', 'คอมพิวเตอร์ ประกอบเอง พร้อมจอ', 'West Technology Forensics', u.id, 18500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CSI250-PNA', 'ตัวรองแขน', 'West Technology Forensics', u.id, 900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CSI250-PNH', 'หูฟัง', 'West Technology Forensics', u.id, 3300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CTB-EV-001-100', 'สำลีก้าน ตรา Evergreen 100ก้าน ขนาดปกติ', 'West Technology Forensics', u.id, 8.75, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CTB-EV-003-100', 'สำลีก้าน ตรา Evergreen กระปุก100ก้าน', 'West Technology Forensics', u.id, 24.3, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CT-P-AMB-50GM', 'AMB สำลีแผ่นรีดข้าง 50 GM', 'West Technology Forensics', u.id, 30.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DELI-0001', 'Deli แฟ้มหนีบ A4 PP สีดำ แฟ้มเอกสาร คลิปบอร์ด กระดานรองเขียน  แฟ้มหนีบเอกสาร ที่ใส่เอกสาร', 'West Technology Forensics', u.id, 79.2, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DS-23S13QL', 'เครื่องเย็บกระดาษ ตราช้าง DS-23S13QL', 'West Technology Forensics', u.id, 516.31, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DT100G3', 'Flash drive kingston 64GB USB 3.0 5-Y', 'West Technology Forensics', u.id, 740.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ELP-PT23004', 'Elephant กระดาษโน๊ต กระดาษโน๊ตมีกาว สีนีออน/สีพาสเทล จำนวน 1 แพ็ค', 'West Technology Forensics', u.id, 124.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ET-916', 'ปลั๊กไฟ Toshino ET-916', 'West Technology Forensics', u.id, 444.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EV-WH666-9/125AA', 'ซองขาวยาว(ครุฑ) 9/125AA (666)', 'West Technology Forensics', u.id, 0.58, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FAU-2X25F-DI', 'ไดมอนด์อลูมิเนียมฟอยด์ 12in x  25ฟุต', 'West Technology Forensics', u.id, 66.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FILTER-1', 'COLOR FILTER-1 ( Orange)', 'West Technology Forensics', u.id, 800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FILTER-1-1', 'COLOR FILTER-1 ( Orange) สำหรับกล้องถ่ายรูป', 'West Technology Forensics', u.id, 3738.32, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FILTER-2', 'COLOR FILTER-2 ( Yellow)', 'West Technology Forensics', u.id, 800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FILTER-2-1', 'COLOR FILTER-2 ( Yellow) สำหรับกล้องถ่ายรูป', 'West Technology Forensics', u.id, 3738.32, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'F-JPX-ST20', 'พัดลม Camping JPX Super Terbo 20 นิ้ว สายไฟ 4 เมตร ประกัน 3ปี', 'West Technology Forensics', u.id, 2135.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GCH-RE-WCL1', 'Reagent bottle clear wide mouth 1L', 'West Technology Forensics', u.id, 120.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GL-PET20', 'ถังน้ำ PET 20 ลิตร Qline พร้อมก็อก (ฟ้าใส)', 'West Technology Forensics', u.id, 256.08, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ถัง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HE124-100', 'HI-JET Extra 2000 Paper 120G A4 100แผ่น', 'West Technology Forensics', u.id, 217.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HH-207P', 'ถังขยะฝาสวิง 25 ลิตร DKW 28x34.3x51 CM', 'West Technology Forensics', u.id, 269.16, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HPI-MLT-D203S', 'Samsung MLT-D203S Black', 'West Technology Forensics', u.id, 2897.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HPI-SL-M3820ND', 'Samsung Pro SL-M3820ND Laser MONO', 'West Technology Forensics', u.id, 8530.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'INK-FG-SKU231T-120', 'SEARCH Fingerprint Ink 4 oz tube 120ml SKU 231T ยี่ห้อ Sirchie ประเทศ สหรัฐอเมริกา', 'West Technology Forensics', u.id, 750.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'VIAL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'JCJ-5113', 'กล่องอเนกประสงค์พร้อมล้อและฝาล็อค 45 ลิตร Fiona KASSA HOME 57.5x39.6x28.5 ซม. ขาว', 'West Technology Forensics', u.id, 203.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'JJ-2X3540', 'ชั้นวางจานสเตนเลส 2 ชั้น', 'West Technology Forensics', u.id, 1859.81, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KC-SCT-23', 'สก๊อต อินเตอร์โฟลด์ 250 แผ่น ทิชชู่แบบพับ', 'West Technology Forensics', u.id, 71.53, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ห่อ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KSG-120-LW334', 'ตู้บานเลื่อนกระจก Luckyworld ขนาด  รุ่น KSG-120 118.8 x40.8x87.7 cm แผ่นเหล็กวางชั้น 2 แผ่น', 'West Technology Forensics', u.id, 3990.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ตู้' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-462LXBK', 'Black inkBrother ตลับหมึกอิงค์เจ๊ท สีดำ', 'West Technology Forensics', u.id, 660.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-462LXC', 'Cyan inkBrother ตลับหมึกอิงค์เจ๊ท สีฟ้า', 'West Technology Forensics', u.id, 570.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-462LXM', 'Magenta inkBrother ตลับหมึกอิงค์เจ๊ท สีม่วงแดง', 'West Technology Forensics', u.id, 570.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-462LXY', 'Yellow inkBrother ตลับหมึกอิงค์เจ๊ท สีเหลือง', 'West Technology Forensics', u.id, 570.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LRN5-C-B0.5', 'ไส้ปากกา เพนเทล LRN5-C 0.5 น้ำเงิน', 'West Technology Forensics', u.id, 23.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แท่ง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'M185-DARK', 'Logitech Mouse Wireless M185 - Dark', 'West Technology Forensics', u.id, 590.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MAX10-1M-24', 'MAX แม็กซ์ ลวดเย็บกระดาษ เบอร์ 10-1M x 24', 'West Technology Forensics', u.id, 185.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MAX35-1M-24', 'MAX แม็กซ์ ลวดเย็บกระดาษ เบอร์ 35 1ม x 24', 'West Technology Forensics', u.id, 289.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MG-189P36', 'M & G 4สี0.7มม. แบบกดปากกาลูกลื่นสีดำ/ สีแดง/สีฟ้า/สีเขียวอุปกรณ์สำนักงานปากกาหลายสี', 'West Technology Forensics', u.id, 27.2, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MP-KM-P8', 'แผ่นรองเมาท์ AUKEY', 'West Technology Forensics', u.id, 556.12, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NIKON D7500', 'Nikon D7500 (wi fi NFC) AF s DX Nikkor 18-140 mmF/3.5-5 6G BD VR [KIT SET]', 'West Technology Forensics', u.id, 54900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OF-FO-OFMA010213', 'เก้าอี้สำนักงาน สีดำ เฟอร์ราเดค Kayla', 'West Technology Forensics', u.id, 1766.36, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OF-TP-2436-3-500', '3M เทปใส No.500 แกน 3 นิ้ว24 มม.x 36 มม', 'West Technology Forensics', u.id, 30.31, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OF-TP-2690-2433-1-600', '3M เทปใส No.600 แกน 1 นิ้ว24 มม.x 33 มม', 'West Technology Forensics', u.id, 90.65, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OF-TP-4840-3-500', '3M เทปใส No.500 แกน 3 นิ้ว 48 มม.x 40 มม', 'West Technology Forensics', u.id, 41.67, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'P06901913', 'DIRECT THERMAL LABEL 5.0X2.5 CM. 1 ดวง/แถว ชนิด 10 ปี 200 ดวง/ม้วน แกน PVC 12 mm', 'West Technology Forensics', u.id, 50.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'P-AU-001-34X48CM', 'ถาดอะลูมิเนียยม ตราจระเข้ 34*48 ซม', 'West Technology Forensics', u.id, 176.64, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PCD-EI140S-BK', 'ปากกาเขียน CD edding 140S ลบไม่ได้ สีดำ', 'West Technology Forensics', u.id, 40.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แท่ง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PG-47', 'Canon CL-57 Color ตลับหมึกอิงค์เจ็ท สีดำ', 'West Technology Forensics', u.id, 320.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'P-GR-001-1113.2X8.9X2-2.8', 'ถาดแก้ว 13.2x8.9inch ลึก 2inch 2.8 ลิตร', 'West Technology Forensics', u.id, 751.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PK-PP-KA125-6X9C', 'ซองกระดาษ KA 125 gsm 6x9 CM', 'West Technology Forensics', u.id, 9.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PN-PM-0002-04S', 'ปากกาเอนก permanent Faber S 0.4 MM สีน้ำเงิน', 'West Technology Forensics', u.id, 32.71, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ด้าม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PNSN-CG-ELAA2000-4', 'PANASONIC Chager ENELOOP AA mAh 2000 4 ช่อง', 'West Technology Forensics', u.id, 831.78, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PNSN-CG-ELAA2550-4', 'PANASONIC ENELOOP Pro AA mAh 2550 4 ช่อง พร้อมถ่าน', 'West Technology Forensics', u.id, 1500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PNSN-ELAA2550-4', 'PANASONIC ENELOOP Pro AA mAh 2550 แพ๊ค 4 ก้อน', 'West Technology Forensics', u.id, 650.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PN-WB-001-1', 'ปากกาเขียนไวท์บอร์ด สีน้ำเงิน', 'West Technology Forensics', u.id, 27.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PN-WB-001-2', 'ปากกาเขียนไวท์บอร์ด สีน้ำแดง', 'West Technology Forensics', u.id, 17.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PP-AS-47.8-31-43IN', 'กระดาษบรู๊ฟ ออสเตเลีย 48.8G 31x43 in', 'West Technology Forensics', u.id, 1.4, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PP-BR-KII125G-35X47', 'กระดาษน้ำตาล KII 125G 35x47ince', 'West Technology Forensics', u.id, 4.4, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PP-BR-SB110G-35X47', 'กระดาษน้ำตาล SB 110G 35x47ince', 'West Technology Forensics', u.id, 4.2, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PP-MML-A4-130G-50', 'กระดาษพีวีซี A4 130 แกรม 50 แผ่น (มาร์ชเมลโลว์)', 'West Technology Forensics', u.id, 144.86, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PP-PSP-80-31-43IN', 'กระดาษปอนด์ SMART-PRINT  80 แกรม 31x43 นิ้ว', 'West Technology Forensics', u.id, 2.55, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PS-RL-1M-P3', 'ไม้บรรทัด 1 เมตร  พับ 3 ทบ', 'West Technology Forensics', u.id, 220.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PS-TACB2-3', 'POWER SUPPLY HIP TACB2-3 902-3C 12V DE 3A', 'West Technology Forensics', u.id, 2600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PWB-ESG65W-20K', 'Essager 65W Power Bank Fast Charging 20000Mah', 'West Technology Forensics', u.id, 1043.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-0-20-BK-21', 'สติ๊กเกอร์ 0-20 สีดำ 21 ดวง ต่อ แผ่น', 'West Technology Forensics', u.id, 12.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-1-20-BK-SQ', 'สติ๊กเกอร์ 1-20 สีดำ 20 ดวง ต่อ แผ่น 1x1 นิ้ว', 'West Technology Forensics', u.id, 10.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-1-3-BK-RTG', 'สติ๊กเกอร์ 1-3 สีดำ ขนาด 1x2 นิ้ว', 'West Technology Forensics', u.id, 10.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-2CM-BK-50', 'สติ๊กเกอร์สเกล 2 เซนติเมตร สีดำ 50 ดวง ต่อ แผ่น', 'West Technology Forensics', u.id, 15.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-5CM-BK-50', 'สติ๊กเกอร์สเกล 5 เซนติเมตร สีดำ 50 ดวง ต่อ แผ่น', 'West Technology Forensics', u.id, 35.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-AML-GB20', 'สติ๊กเกอร์ วัตถุพยานกระสุนปืน และลูกกระสุนปืน (Ammunition Label) มีข้อความ ""วัตถุพยานกระสุนปืนและลูกกระสุนปืน AMMUNITION  EVIDENCE', 'West Technology Forensics', u.id, 10.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-CAPE-PB20', 'สติ๊กเกอร์ มีข้อความ ""วัตถุพยานส่งตรวจกลุ่มงานเคมี - ฟิสิกส์ (CHEMISTRY AND PHYSICS EVIDENCE) (พื้นสีชมพู ตัวอักษรสีดำ 20 ดวง/แผ่น)', 'West Technology Forensics', u.id, 10.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-DNA-GB20', 'สติ๊กเกอร์ วัตถุพยานดีเอ็นเอ (DNA Label) มีข้อความ ""วัตถุพยานดีเอ็นเอ DNA EVIDENCE""  (พื้นหลังสีเขียว ตัวอักษรสีดำ 20 ดวง/แผ่น)', 'West Technology Forensics', u.id, 10.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-L3CM-BK-21', 'สติ๊กเกอร์สเกลวัดขนาดแบบฉาก ขนาด 3 ซม.', 'West Technology Forensics', u.id, 15.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-LFE-BB20', 'สติ๊กเกอร์ วัตถุพยานลายนิ้วมือแฝง (Latent Fingerprint Label) มีข้อความ "" วัตถุพยานลายนิ้วมือแฝง LATENT FINGERPRINT EVIDENCE"" (พื้นฟ้า ตัวอักษรสีดำ 20 ดวง/แผ่น)', 'West Technology Forensics', u.id, 10.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-NB0-9-1', 'สติ๊กเกอร์ตัวเลข 0-9', 'West Technology Forensics', u.id, 25.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-NB-1-26-2X2', 'สติ็กเกอร์ตัวเลข 1-26 ขนาด 2x2 cm', 'West Technology Forensics', u.id, 10.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-NB1-5', 'สติ๊กเกอร์ตัวเลข 1-5', 'West Technology Forensics', u.id, 35.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-NCE-OB20', 'สติ๊กเกอร์ มีข้อความ ""วัตถุพยานส่งตรวจกลุ่มงานยาเสพติด (NARCOTICS EVIDENCE)"" (พื้นสีส้ม ตัวอักษรสีดำ 20 ดวง/แผ่น)', 'West Technology Forensics', u.id, 10.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SL-C480', 'Printer Samsung Multi Laser SL-C480', 'West Technology Forensics', u.id, 9800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SNS34MT002', 'Computer PC Dell Optiplex 3046MT คอมพิวเตอร์สำนักงาน 18.5N', 'West Technology Forensics', u.id, 25000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SP-201LS-BK', 'Ricoh SP 201LS Black ตลับหมึกโทนเนอร์ สีดํา ของแท้ (407257)', 'West Technology Forensics', u.id, 2690.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SRK-24YYS-W1', 'Mitsubishi Heavy duty inverter แบบติดผนัง รุ่น SRK-24YYS-W1 3ดาว พร้อมติดตั้ง รับประกัน อะไหล่ 5 ปี คอม 5 ปี', 'West Technology Forensics', u.id, 50600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0095-20X46X65', 'ซองกระดาษน้ำตาล ขนาด 20x46x65 ซม. พิมพ์ข้อความ ""วัตถุพยาน', 'West Technology Forensics', u.id, 21.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0191', 'แล็บป้ายสติ๊กเกอร์ ตรา DHA siam walla  A14, 50x50มม. (180 ป้าย/แพค)', 'West Technology Forensics', u.id, 30.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0192', 'แล็บป้ายสติ๊กเกอร์ ตรา DHA siam walla  A5, 13x38มม. (840 ป้าย/แพค)', 'West Technology Forensics', u.id, 30.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0434', 'เทปใส 3M #500 แกน 3 นิ้ว ขนาด 1นิ้ว 36หลา', 'West Technology Forensics', u.id, 24.17, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'STK01', 'สติ๊กเกอร์รันตัวเลข 0001-2000', 'West Technology Forensics', u.id, 1300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'STL-04-M', 'Staedtler 4 ด้าม permament เบอร์ M', 'West Technology Forensics', u.id, 163.66, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'STP-23/10-H', 'ลวดเย็บ ลูกแม็ก เบอร์ 23/10-H ตราช้าง', 'West Technology Forensics', u.id, 44.22, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T00V100', 'Epson 003 black ink tank 65ML', 'West Technology Forensics', u.id, 200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T00V200', 'Epson 003 Cyan ink tank 65ML', 'West Technology Forensics', u.id, 194.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T00V300', 'Epson 003 magenta ink tank 65ML', 'West Technology Forensics', u.id, 194.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T00V400', 'Epson 003 Yellow ink tank 65ML', 'West Technology Forensics', u.id, 194.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-60150', 'โต็ะพับอเนกประสงค์ ONE A012900', 'West Technology Forensics', u.id, 1224.3, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-80X120X80CM', 'โต๊ะวางเครื่อง ขนาด 80X120X80CM', 'West Technology Forensics', u.id, 20000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-80X140X80CM', 'โต๊ะวางเครื่องมือ ขนาด 80X140X80 ซม', 'West Technology Forensics', u.id, 16875.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-80X150X86CM', 'โต๊ะวางเครื่องมือ ขนาด 80x150x86 ซม', 'West Technology Forensics', u.id, 14500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TAC-09CPA-SL2', 'แอร์เคลื่อนที่ TCL TAC-09CPA SL2', 'West Technology Forensics', u.id, 7934.58, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TAPE-G30X20Y1X3-SC', 'Scotch เทปกระดาษกาวย่น 36มมx20y1x1', 'West Technology Forensics', u.id, 42.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TEEPOL3600', 'น้ำยาทำความสะอาด ทีโพล์ 3600 มล', 'West Technology Forensics', u.id, 164.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-MD900-60X150CM', 'โต๊ะประชุม TMD900 ขนาด 60x150 ซม หน้าโต๊ะสีบีชโครงเทา', 'West Technology Forensics', u.id, 3200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TOA-EPC-AU', 'TOA พัดสี ทีโอเอ รุ่นใหม่ TOA พัดสี Expert  (ปกอลูมิเนียม)', 'West Technology Forensics', u.id, 1027.1, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TS-BB-80', 'ทิชชู่เปียก 80 แผ่น BABY Wipes', 'West Technology Forensics', u.id, 110.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ห่อ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TS-K620-B', 'เซลล็อกซ์ เดคอร์ กระดาษเช็ดหน้า 135 แผ่น', 'West Technology Forensics', u.id, 43.33, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TS-KC-KEN-911', 'คลีเน็กซ์ 170 แผ่น ต่อ กล่อง', 'West Technology Forensics', u.id, 52.14, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TS-MXMO-P85-6', 'แม๊กซ์โม่แบบแผ่น 85 แผ่น แพ็ค 6', 'West Technology Forensics', u.id, 182.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TS-SB-S110-4P', 'สก๊อตต์ ซอฟท์บ๊อกซ์ กระดาษเช็ดหน้า 110 แผ่น 4ห่อ/แพ็ค', 'West Technology Forensics', u.id, 85.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TS-SK-100-WA', 'ผ้าเปียก Sekure 100 pcs Wipes Adult', 'West Technology Forensics', u.id, 120.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ห่อ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TTS-H62-DE', 'Health Impact Cleansing Wipes ทิชชู่เปียก ขนาดใหญ่พิเศษ Size XL (50แผ่น/100 แผ่น) 1ห่อ', 'West Technology Forensics', u.id, 124.4, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ห่อ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'VI-122406', 'เฉพาะขวด Vial สีชา ขนาด 60 ml (dia 27 x สูง 140 mm) 100 ขวด/แพ็ค ยี่ห้อ Cei Expert', 'West Technology Forensics', u.id, 1900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'VP008738', 'กล่องพลาสติกขนาดใหญ่ K-1500', 'West Technology Forensics', u.id, 450.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WBH-C1000', 'Hi Chalk ชอล์กสี/ชอล์กขาว ชอล์คเขียนกระดาน 1กล่อง จำนวน 60 แท่ง', 'West Technology Forensics', u.id, 61.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'YA19942', 'ตู้เก็บเอกสาร บานปิดทึบมือจับบิด มอก. เพรสซิเด๊นท์ LK', 'West Technology Forensics', u.id, 6728.97, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ตู้' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'YB60052', 'กระเป๋าซองซิปตาข่ายใส่เอกสาร ขนาด 28x38 ซม NO Brand', 'West Technology Forensics', u.id, 46.73, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZILK-S-24', 'กระดาษชำระม้วนเล็ก ซิลค์คอนตอน 24 ม้วน', 'West Technology Forensics', u.id, 105.61, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP-PE-25-30', 'ถุงเย็น PE 25x30 cm (10x12inch)', 'West Technology Forensics', u.id, 180.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP-SC-010-3045', 'ถุงพลาสติกซิปล๊อคพิมพ์โลโก้ ขนาด 30x45 cm', 'West Technology Forensics', u.id, 1250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP-SC-010-6070', 'ถุงพลาสติกซิปล๊อคพิมพ์โลโก้ ขนาด 60x70 cm', 'West Technology Forensics', u.id, 1063.32, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZL102-WBP', 'ลิควิด Pentel ด้ามอ้วน', 'West Technology Forensics', u.id, 42.06, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00047', '367210.22', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '1259293.31' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0003725000', 'T 25 digital', 'West Technology Forensics', u.id, 74000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0009015900', 'C-MAG HS 7 Package Magnetic stirrers with heating', 'West Technology Forensics', u.id, 25500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0009024700', 'T 18 digital ULTRA-TURRAX Package Disper', 'West Technology Forensics', u.id, 92500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0010004858', 'T 25 digital / S25N-25G Package 1', 'West Technology Forensics', u.id, 123090.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0020011210', 'IKA Pette vario 0.1 - 2 ?l Pipette single channel variable', 'West Technology Forensics', u.id, 3720.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0020011213', 'IKA Pette vario 2 - 20 ?l Pipette single channel variable', 'West Technology Forensics', u.id, 3720.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0020011214', 'IKA Pette vario 10 - 100 ? Pipette single channel variable', 'West Technology Forensics', u.id, 3720.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0020011218', 'IKA Pette vario 1-10 ml Pipette single channel variable', 'West Technology Forensics', u.id, 3720.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0020017831', 'IKA Tip xl bag Pipette tip 10ml transparent', 'West Technology Forensics', u.id, 702.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0020017945', 'IKA PETTE multi 8 x 20-200 ?l', 'West Technology Forensics', u.id, 15350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0020114634', 'IKA Tip 10 ?l bag (1.000 pcs.)', 'West Technology Forensics', u.id, 480.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0020114635', 'IKA Tip 200 ?l bag (1,000 pcs.)', 'West Technology Forensics', u.id, 360.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0020114636', 'IKA Tip 1000 ?l bag (1,000 pcs)', 'West Technology Forensics', u.id, 360.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0020116857', 'IKA Tip 10 ?l box 96 pcs/box', 'West Technology Forensics', u.id, 189.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0020116858', 'IKA Tip 200 ?l box 96 pcs/box', 'West Technology Forensics', u.id, 189.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0020116859', 'IKA Tip 1000 ?l box 60 pcs/box', 'West Technology Forensics', u.id, 149.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0025005927', 'RCT basic Magnetic stirrer with heation voltge 120v Frequency 50/60 Hz power connector europe', 'West Technology Forensics', u.id, 21061.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0030 000.765', 'epTIPS Standard 0.5 - 10 ul (2 bags of 100 tips = 200tips)', 'West Technology Forensics', u.id, 2160.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '01-CK-5M-1.5X2M', 'แผ่นยางเชคเกอร์ หน้ากว้าง 1.5 เมตร หนา 5 มม ยาว 2 เมตร', 'West Technology Forensics', u.id, 633.33, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ตร' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '01RS510-30', 'Rack stainless for test tube dia 30mm (50ช่อง)', 'West Technology Forensics', u.id, 380.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '06-1006-1', 'วัสดุดูดซับสารเคมีสีเหลือง PAD-HOS-320S', 'West Technology Forensics', u.id, 3500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '07061-42', 'Gast DOA-P504-BN High-Capacity VACuum Pump With Gauge Regulator and Relicf 1.0 cfm 24Hg 220 VAC', 'West Technology Forensics', u.id, 30000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1-00-08-002-3', 'ไซริ้ง Triviwat ขนาด 2 ซีซี', 'West Technology Forensics', u.id, 140.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1-00-08-003-0', 'ไซริ้ง Triviwat ขนาด 10 ซีซี', 'West Technology Forensics', u.id, 180.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1005084', 'ผ้าเช็ดกาวซิลิโคน ยี่ห้อ Kleentech 68252  33*35cm', 'West Technology Forensics', u.id, 187.62, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '115.203.03', 'Burette PTFE Amber Scale A w/Cert Lot 50ML (GLASSCO)', 'West Technology Forensics', u.id, 887.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '120406', 'Septa Red PTFE/White Silicone 13 x 1.5mm 100/pk', 'West Technology Forensics', u.id, 420.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '120903', '2ml screw neck ND9 wial with Marking spot Clear pk/10', 'West Technology Forensics', u.id, 287.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '120910', 'Septa Red PTFE/White Silicone 9 x 1mm 100/pk', 'West Technology Forensics', u.id, 280.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '121122', 'Insert Vial for Autosampler amber crimp top 250 ?L, 12 ? 32 mm, 100/pk', 'West Technology Forensics', u.id, 1000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1213769', 'Filter Disk NY 0.22um 47mm 100/PK', 'West Technology Forensics', u.id, 1790.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1213776', 'Filter Disk NY 0.45um 47mm 100/PK', 'West Technology Forensics', u.id, 890.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '121802', '20ml preclsion sorew thread ND18 vial Clear Round Bottom PK/100', 'West Technology Forensics', u.id, 1050.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '121803', '18mm Magentio screw cap silver 8mm center hole with blue PTFE/White Silicone septa PK/10', 'West Technology Forensics', u.id, 1390.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '122002', '20ml Headspace crimp neck ND20 vial clear flat bottom pk/100', 'West Technology Forensics', u.id, 616.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '122014', '20mm Aluminium Crimp Cap centre hole with NaturePTFE/Nature Silicone septa pk/100', 'West Technology Forensics', u.id, 850.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '139.203.01A', 'Cylinder Hex Base Amber Scale A w/Cert Lot 10ML (GLASSCO)', 'West Technology Forensics', u.id, 205.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '139.203.02A', 'Cylinder Hex Base Amber Scale A w/Cert Lot 25ML (GLASSCO)', 'West Technology Forensics', u.id, 234.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '139.253.04A', 'Cylinder Hex Base Amber Scale A w/Cert Lot 100ML (GLASSCO)', 'West Technology Forensics', u.id, 260.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '149.202.04', 'Separating Funnel w/PTFE Key 250ML (Glassco)', 'West Technology Forensics', u.id, 1001.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '149.202.05', 'Separating Funnel w/PTFE Key 500ML (Glassco)', 'West Technology Forensics', u.id, 1006.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '152023.0001', 'Chromolith(r) HighResolut1 PC RP-18e 150-4.6 HPLC colum', 'West Technology Forensics', u.id, 28000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1603000', 'หูฟัง Head phone set สำหรับเครื่องตรวจโลหะ ใต้พื้นดิน รุ่น CSI 250 Model 1603000 ยี่ห้อ Garrett', 'West Technology Forensics', u.id, 3300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '16X150-1', 'Testtube BORO3.3 16x150 mm 1PC (Triviwat Thai)', 'West Technology Forensics', u.id, 10.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '183057', 'DMA 35 EX Petrol Portable Density Meter', 'West Technology Forensics', u.id, 230000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '186004801', 'Acquity uplc beh Amide 1.7um 2.1x100mm', 'West Technology Forensics', u.id, 48000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1917185', 'BAF2 0.05 MM SEALED UNIT OMNI ROHS COMPL', 'West Technology Forensics', u.id, 50987.19, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '202-3362', 'Concoa regulator singie stage Model 202-3362', 'West Technology Forensics', u.id, 12000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '212-3362', 'Concoa regulator two stage Model 212-3362', 'West Technology Forensics', u.id, 16000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '22390', 'Kuaiqu SPS-C3010 DC Power Supply', 'West Technology Forensics', u.id, 2224.3, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '292270902', 'Screw Cap with aperture from PBT red GL 25 DURAN', 'West Technology Forensics', u.id, 240.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '292400806', 'Plastic Screw-Caps Closed red PBT GL 14 Duran', 'West Technology Forensics', u.id, 160.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '293-180-30', 'Micrometer Mitutoyo 293-180-30', 'West Technology Forensics', u.id, 8325.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '293-343-30', 'Micrometer Mitutoyo 293-343-30', 'West Technology Forensics', u.id, 7678.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '30100602', 'เครื่องชั่ง 4 ตำแหน่ง รุ่น AX224 Cap.220gx0.0001g', 'West Technology Forensics', u.id, 107100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '30684698', 'เครื่องชั่ง 2 ตำแหน่ง 150 กิโลกรัม i-D33P150B1L2', 'West Technology Forensics', u.id, 68000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '30718-010-117/010P', 'Trustec diesel bheck fuel high', 'West Technology Forensics', u.id, 170000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '356604SP', 'Accessory Kit, Vacuum pump ME1C Extrahera & Alstra', 'West Technology Forensics', u.id, 4632.56, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3710027200', 'Peri pump tubes PVC black/black 12/pack', 'West Technology Forensics', u.id, 1652.25, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3710027300', 'Peri pump tubes PVC purple/black 12/pack', 'West Technology Forensics', u.id, 1652.25, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '413282', 'Test Tubes (16 x 75 mm)', 'West Technology Forensics', u.id, 15002.36, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '413640SP', 'Column Rack 24 x 6 mL (Tabless)', 'West Technology Forensics', u.id, 10084.72, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '414023SP', 'Calibration Pin', 'West Technology Forensics', u.id, 11652.67, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '414141', '1000 ?L Clear Tips', 'West Technology Forensics', u.id, 3905.6, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '414169SP', 'Column Rack 24 x 1 mL', 'West Technology Forensics', u.id, 10084.72, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '414174SP', 'Column Rack 24 x 3 mL', 'West Technology Forensics', u.id, 10084.72, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '414254SP', 'Sample Rack 16 x 100 mm, 24 Positions', 'West Technology Forensics', u.id, 10084.72, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '414579', 'Solvent Safety Kit Includes GL45 Caps, Filters and Bottles', 'West Technology Forensics', u.id, 40695.24, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '415489', 'TurboVap LV Multi Rack (48 Positions, Mini Vials)', 'West Technology Forensics', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '415555SP', 'Sample/Collection Rack 12 x 75 mm, 48 Positions', 'West Technology Forensics', u.id, 8614.18, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '415556SP', 'Column Rack 48 x 3 mL (Tabless)', 'West Technology Forensics', u.id, 9412.41, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '415585', 'Sample/Collection Rack 16 x 75 mm, 24 Positions', 'West Technology Forensics', u.id, 9229.48, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '5043-1196', 'Waste can GL45 6Liter', 'West Technology Forensics', u.id, 1833.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '50-5405', 'ASSY,XCELVAP,CONTROL PANEL', 'West Technology Forensics', u.id, 7715.43, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '5190-9064-1PK', 'Vial clr crmp 2ml 100cs  agilent USA', 'West Technology Forensics', u.id, 220.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '5190-9066-100', 'Cap 11mm crimp PTFE/Red sil 100ea/pk agilent USA', 'West Technology Forensics', u.id, 160.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '528.303.08', 'Evaporating Dish 75MM (70ml) 1000C (GLASSCO)', 'West Technology Forensics', u.id, 118.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '528.303.11', 'Evaporating Dish 100MM (150ml) 1000C (GLASSCO)', 'West Technology Forensics', u.id, 145.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '5350029', 'All glass filter holder 47mm Filtration assembly 1000ml (BOROSIL)', 'West Technology Forensics', u.id, 7850.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '5610103400', 'Mercury - Hg Coded HC Lemp 1/pk', 'West Technology Forensics', u.id, 17842.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '564.303.10', 'Watch Glass Nautral Glass 100MM (GLASSCO)', 'West Technology Forensics', u.id, 44.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '564.303.12', 'Watch Glass Nautral Glass 150MM (GLASSCO)', 'West Technology Forensics', u.id, 83.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '606272251', 'Filter PM for Nitrogen generator Model LCMS20-1', 'West Technology Forensics', u.id, 54200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '685775-924', 'InfinityLab Poroshell 120 HILIC-Z 2.1 x 100mm 2.7um Agilent USA', 'West Technology Forensics', u.id, 49870.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '7605031', 'Energizer Industrial AA/LR06', 'West Technology Forensics', u.id, 26.22, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '80780346', 'ตุ้มน้ำหนัก แสตนเลส Class F1 100 g with Cer.17025', 'West Technology Forensics', u.id, 6000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '808401', 'Dremel 290 ปากกาไฟฟ้า 220VAC', 'West Technology Forensics', u.id, 1150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '80880336', 'ตุ้มน้ำหนัก แสตนเลส Class F1 50 mg with Cer.17025', 'West Technology Forensics', u.id, 4000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '81217', 'Hamilton Syringe 1750L TN 500uL (22/2 /2)', 'West Technology Forensics', u.id, 3215.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '821725-947', 'InfinityLab Poroshell 120 HILIC-Z 2.1 mm 2.7um UHPLC guand 3/pk Agilent USA', 'West Technology Forensics', u.id, 23544.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '940203-1EA', 'Finntip 5 mL. 1ea', 'West Technology Forensics', u.id, 5.1, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A37122919', 'Vacuum PUMP ""EDWARDS"" E2M1.5', 'West Technology Forensics', u.id, 97175.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ADC19-26-C14', 'Adapter cone 19/26 with screw cap GL 14 พร้อมฝา ชนิดไม่เจาะรู', 'West Technology Forensics', u.id, 650.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AGSP-5191-4108', 'Collection rack 16x100mm tubes PPM-48', 'West Technology Forensics', u.id, 24470.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AH0-1566', 'FilterSys Filtration Glassware 300mL Funnel w/ 1L Flask 47mm Base Ea', 'West Technology Forensics', u.id, 10440.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AI-08018-M100', 'Micro-volume Quartz Cuvette with black wall 100 ul', 'West Technology Forensics', u.id, 6000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AISI304-15X15X15', 'ตะกร้าตะแกรงสแตนเลสสี่เหลี่ยม 304 2 handles ก15 x ย15 x ส15 ซม', 'West Technology Forensics', u.id, 1195.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A-K1664', 'Aspiration bottle (ทรงกระบอก) 25 ลิตร ยี่ห้อ Kartell italy', 'West Technology Forensics', u.id, 2340.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AZ-WGW537', 'wash bottle for acetone 500ml ยี่ห้อ Azlon', 'West Technology Forensics', u.id, 366.67, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B-0075', 'Brush of flask dia 5 cm ใช้ล้างขวด ขนาด 100x500ml', 'West Technology Forensics', u.id, 35.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BALT24AM112/24', 'เครื่องครวจพิสูจน์ยาเสพติด Gas chromatograph GC รุ่น GC-2030 ยี่ห้อ Stimadzu', 'West Technology Forensics', u.id, 2616822.43, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BEAT-5', 'Bottle Top Dispenser w/Re-Circulation Valve, 0.5-5ml', 'West Technology Forensics', u.id, 4012.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BEH-M500/0/DECK-GEB', 'Disposible sample cups frand Grabner austria', 'West Technology Forensics', u.id, 65.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOTTLE-ETHANOL500ML', 'Wash bottle for Ethanol 500 ml ""Nalgene"" U.S.A', 'West Technology Forensics', u.id, 280.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BRA4630151', 'Dispensette S Organic Analog DE-M2.5-25 ml with reclrculation valve 1pk', 'West Technology Forensics', u.id, 18800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BR-FG6-B2', '6 inch  Fiberglass Brush แปรงใยแก้ว 6 นิ้ว ขนแปรงยาว 2 นิ้ว', 'West Technology Forensics', u.id, 580.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BR-GL', 'แปรงแต่งหน้า', 'West Technology Forensics', u.id, 79.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BRUSHBL', 'แปรงล้างเครื่องแก้วขนาดกลางขนหางม้า (Thai) ขนยาว50*180 MM แปรงยาว 450MM', 'West Technology Forensics', u.id, 47.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BRUSHM', 'แปรงล้างเครื่องแก้วขนาดกลางขนหางม้า (Thai) ขนยาว 30x150MM แปรงยาว 350MM', 'West Technology Forensics', u.id, 22.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BRUSHS', 'แปรงล้างเครื่องแก้วขนาดเล็กขนหางม้า (Thai) ขนยาว 15x120MM แปรงยาว 250MM', 'West Technology Forensics', u.id, 20.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BX-ST-F-001', 'กรอบหล่อรอยเท้า', 'West Technology Forensics', u.id, 800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'C0000133', 'ฝาสำหรับขวดไวแอล Black 8-425 Open Top Screw Cap with 8mm Red PTFE/White Silicone Septa 1.5mm (0.060) thick (8-SP2001 + 8-SP1006) 100PCs ALWSCI', 'West Technology Forensics', u.id, 685.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'C44651', 'Test Tubes (12 x 75 mm)', 'West Technology Forensics', u.id, 5772.88, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'C-9100275', 'Capillary tube สีแดง', 'West Technology Forensics', u.id, 80.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'VIAL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAG-30004', 'CAMAG UV Cabinet', 'West Technology Forensics', u.id, 110000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAP-122414', 'cap for vial  screw cap 20/30/40/60 ml สีดำ (100pcs/pack) ยี่ห้อ Cei Expert', 'West Technology Forensics', u.id, 550.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAR-TYT-GDH322R', 'รถตู้ TOYOTA GDH322R-EDTDYT/B2', 'West Technology Forensics', u.id, 1297509.36, 0, 'STANDARD', true
FROM units u WHERE u.code = 'คัน' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CD024', 'Cadenza CD-18 100 x 2 mm', 'West Technology Forensics', u.id, 19647.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'C-D-22MM', 'ฝาดอฟเฟอร์ 22mm', 'West Technology Forensics', u.id, 8.68, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CEF50W050KD24040', 'Centrifugal Filter 50 ml White 50KD 24ps/boc 4box/case', 'West Technology Forensics', u.id, 4080.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CELCUMG011000105', 'Serological pipettes 25ml Indepedent paper packing Sterile 25pcs/pk 250pcs/cs', 'West Technology Forensics', u.id, 2270.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'C-JTG-30ML', 'ฝาจุกหลอดแก้ว จุกยางดำ ขนาด 30 mL', 'West Technology Forensics', u.id, 11.2, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CL220', 'Holder  Clamp  Clip  CL220  for Temp Probe DH.WHP503012', 'West Technology Forensics', u.id, 1250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CLS2572-20EA', 'Corning(R) Stripwell (TM)', 'West Technology Forensics', u.id, 2210.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CLS2592-25EA', 'Corning(R) 96 Well Stripw', 'West Technology Forensics', u.id, 9970.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CN0025A', 'Thermo Scientific Oxoid CampyGen 2.5 L Sachet', 'West Technology Forensics', u.id, 3000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'COIL ACE 9X12', 'Coil ACE จานตรวจ 9*12 นิ้ว', 'West Technology Forensics', u.id, 4000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'COL-34105-25', 'Developing rack stainless steel capacity Six 20 x 20 cm plates', 'West Technology Forensics', u.id, 26000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CQTE-06V', 'VACUUM GAUGE -30-0 inHg with Stainless Base&toggle Clamp', 'West Technology Forensics', u.id, 10000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CRM-FAGO', 'Paragon CRM-FAGO certified Reference Material Fatty Acid Methyl Ester (FAME) Standard Diesel (nominal 6.5%) 250ml', 'West Technology Forensics', u.id, 24500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CSI-250-GR', 'เครื่องตรวจจับโลหะใต้พื้นดิน รุ่น CSI 250 ยี่ห้อ GARRETT ประเทศสหรัฐอเมริกา', 'West Technology Forensics', u.id, 15000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CSI250-PCB', 'แผง PCB Assy Spare', 'West Technology Forensics', u.id, 6200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CSI250-PNF', 'Panel Front (ฝาครอบ)', 'West Technology Forensics', u.id, 800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CS-P-S3', 'Consumable Part Pre Filter Carbon Filter Hepa Filter', 'West Technology Forensics', u.id, 11000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CTB-S-6IN-VP', 'ไม้พันสำลี 6"" S (1ก้าน) (100Packs/bag)view pack', 'West Technology Forensics', u.id, 250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CVEG-48X73.5X15.7CM', 'แผ่นบังเครื่องขนาดภายในกว้าง 48x73.5x15.7cm', 'West Technology Forensics', u.id, 2500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DFH9615N', 'Ductless Filter Hood size 0.90x0.65x1.15m', 'West Technology Forensics', u.id, 105000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DISTO-D5-LC', 'เครื่องวัดระยะทางด้วยเลเซอร์ Leica DISTO Laser Distance Meter รุ่น D5', 'West Technology Forensics', u.id, 26100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DN4026', 'Slot for reagent (Reservoir) PP 50 ml Autoclavable DGen  5 Pcs/Pkg', 'West Technology Forensics', u.id, 160.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DOX-0002', 'DehumidifierDiLigentDX-990D cap90L/D Area 70-120 Sqm DiLigent Made in China', 'West Technology Forensics', u.id, 23200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DPS-7MM', 'จุกบีบดอปเปอร์ 7mm', 'West Technology Forensics', u.id, 6.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'D-PVC-B51-10', 'D-PVC Suction Black ความยาวม้วนละ 10 เมตร ขนาด 51mm', 'West Technology Forensics', u.id, 3120.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DS2208-SR7U2100SGW', 'Zebra Scanner DS2208-SR BLACK (WITH STAND) USB KIT: DS2208-SR00007ZZWW SCANNER CBA-U21-S07ZBR SHIEL', 'West Technology Forensics', u.id, 2800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'E-0085', 'Evaporating flask ขนาด 2000 ML joint 29/32 ยี่ห้อ Duran Germany', 'West Technology Forensics', u.id, 1700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EAX-T300', 'Tip Clear Micro 0.5-10ul ; 1000 ea/pack', 'West Technology Forensics', u.id, 800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EJA-TI008', 'Timer digital model HS-70W casio', 'West Technology Forensics', u.id, 1870.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ELP-PA135030', 'หลอดหยด (Dropper) พลาสติก ขนาด 3 mL. Pasture pipette PE 3 ml/Total 7 ml 500 EA/box  (LP -135030)', 'West Technology Forensics', u.id, 1.1, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ELP-PA137030-1', 'หลอดหยด (Dropper) พลาสติก ขนาด 1ml Total 5 mL.', 'West Technology Forensics', u.id, 1.3, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ELP-WA100500', 'Wash Bottle LDPE White 500 mL. , LP-100500', 'West Technology Forensics', u.id, 80.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EME-CO001-2', 'COVER GLASS .18X18 (200EA/BOX) , (5BOX/PACK) MENZEL', 'West Technology Forensics', u.id, 580.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ENA-W2425-0501', 'WASH BOTTLE LDPE/ACETONE 500 ML (2425-0501 NALGENE/USA)', 'West Technology Forensics', u.id, 370.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ENI-SY003', 'Syringe DIS 5 ML WITH OUT Needle (100 EA/BOX)', 'West Technology Forensics', u.id, 180.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ENI-SY004', 'Syringe Dis.10 ml with out needle (100 ea/box) ""NIPPRO', 'West Technology Forensics', u.id, 267.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ES01-A002A', 'Mesh inlet filter 15u (5 pcs)', 'West Technology Forensics', u.id, 6700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ETH-BR001-0', 'Brush No.0.5 Dia. 1.3cm. (5x17cm.) แปรงล้างหลอดทดลอง', 'West Technology Forensics', u.id, 30.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ETH-BR006', 'Brush No.5 DIA.5 cm (10x17cm.)', 'West Technology Forensics', u.id, 35.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ETH-RA201', 'TEST TUBE RACK STAINLESS 25 MM (5x10)', 'West Technology Forensics', u.id, 300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ETH-RU040', 'RUBBER RED FOR DROPER (PASTURE PIPETTE)', 'West Technology Forensics', u.id, 5.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ETH-SP002', 'Spoon dispensing set, paper pack  ช้อนตักสารแบบพลาสติก (3 อัน/กล่อง)', 'West Technology Forensics', u.id, 45.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EUS-PA011', 'ParaFilm M, 4"" x 125', 'West Technology Forensics', u.id, 900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EWH-F1001090', 'Filter Paper No.1 Dia. 9cm. (100 ea/box) ""Whatman"" กระดาษกรองเบอร์ 1 ยี่ห้อ whatman เส้นผ่าศูนย์กลาง 90 mm.', 'West Technology Forensics', u.id, 260.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EWH-F1001110', 'Filter Paper No.1 DIA 11cm. (100 ea/box) ""Whatman', 'West Technology Forensics', u.id, 300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EWH-F1001125', 'Filter paper No.1 dia 12.5cm. (100 ea/box) (กระดาษกรอง เบอร์ 1 เส้นผ่าศูนย์กลาง 12.5 ซม.)', 'West Technology Forensics', u.id, 310.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EWH-F1004090', 'Filter paper NO 4 DIA 9  CM 100ea Whatman', 'West Technology Forensics', u.id, 370.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EWH-F1004125', 'Filter Paper No.4 DIA 12.5cm. (100 ea/box) ""Whatman', 'West Technology Forensics', u.id, 530.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EWH-S67681302', 'Syringe Filter Nylon 13mm. Size 0, 2um, 100 ea/box', 'West Technology Forensics', u.id, 2461.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FA2-352098', '50ML TUBE CONICAL PP STR 25/RACK 500/CS', 'West Technology Forensics', u.id, 4900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FB-M', 'Hirox Focus Block Manual', 'West Technology Forensics', u.id, 27853.75, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FC-IR-0011-0013', 'Sterile plastic forcep green 13 cm', 'West Technology Forensics', u.id, 9.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FJ13BNPNY004AH01', 'SYRINGE FLTR 13MM FLL/MLS PP NY 0.45UM CLR 100/PK', 'West Technology Forensics', u.id, 1320.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FLK-2AC-90-1000', 'Fluke 2AC 90-1000V Non-Contact Voltage Tester ACV Detector 90-1000V ENG C FRN SPN', 'West Technology Forensics', u.id, 1574.77, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FLPFGFAS103A', 'Fully Autoclavable Single-channel adjustable volume 2- 20?l', 'West Technology Forensics', u.id, 2450.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FLPFGFAS106A', 'Fully Autoclavable Single-channel adjustable olume 20- 200?l', 'West Technology Forensics', u.id, 2450.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FLPFGFAS107A', 'Fully Autoclavable Single-channel adjustable volume 100-1000?l', 'West Technology Forensics', u.id, 2400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FLPPPC10010000', 'FLAME Filler - LCD displays battery status and pipetting speed', 'West Technology Forensics', u.id, 3750.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FLUKE-175', 'Egkct trms multimeter eng JPN KOR CHI', 'West Technology Forensics', u.id, 13138.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FP090DXF04QALC01', 'Paper filter disc diam 90mm extra fast grade 040 100/pk', 'West Technology Forensics', u.id, 235.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FP125DXF04QALC01', 'Filter Paper Disk 125mm Low ash-Very Fast Grade 04 100/PK', 'West Technology Forensics', u.id, 280.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'G1030-5-SUC18P', 'Guard HPLC columns Surf C18 Polar 100A 5um 10x3.0mm 3pk', 'West Technology Forensics', u.id, 5146.44, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'G-8IN-24', 'ตะแกรงพัดลมระบายความร้อน  (24 ชิ้น)', 'West Technology Forensics', u.id, 904.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GAN-PE15-100', 'Petri Dish 15-100 mm, Anumbra(จานเพาะเชื้อแก้ว)', 'West Technology Forensics', u.id, 36.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GCCD0S', 'Guard Cartridge CD-18', 'West Technology Forensics', u.id, 7200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GCH01S', 'Guard Holder', 'West Technology Forensics', u.id, 10935.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GEM-P9250101', 'PASTURE PIPETTS GLASS 15 CM, 250 EA/BOX', 'West Technology Forensics', u.id, 380.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GFA-CY-A0100', 'Cylinder Glass 100 mL. Class A (P813225; FAVORIT)', 'West Technology Forensics', u.id, 210.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GFA-VO0100', 'Volum Flask Class A 100 mL. PE Stopper', 'West Technology Forensics', u.id, 250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GPY-T9820-16XX', 'Test tube 16x150 mm 20ML (9820-16XX)(Pyrex)', 'West Technology Forensics', u.id, 20.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'G-S-100ML', 'แท่งแก้ว 100 ml', 'West Technology Forensics', u.id, 6.58, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GSC-LA2180636', 'Laboratory Bottle Screwcap brown 250 mL. (Blue Cap; 2180636), SCHOTT', 'West Technology Forensics', u.id, 530.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GSC-LA2180644', 'Laboratory Bottle Screwcap brown 500 mL. (Blue Cap; 2180644) SCHOTT', 'West Technology Forensics', u.id, 600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GSI-CY0010', 'Cylinder glass 10 ML', 'West Technology Forensics', u.id, 300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HCA050U040X02072KA', 'C18-WP Guard Cartridge Kit5ym4.0 x 20mm', 'West Technology Forensics', u.id, 6400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HCA050U046X15072A', 'C18-WP HPLC Column,4.6 x 150mm,5um', 'West Technology Forensics', u.id, 11700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HET-1 1800', 'Benchtop centrifuge model EBA 200 with angle rotor 8x15 ml', 'West Technology Forensics', u.id, 67000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HET-1A 1054-A', 'Adapter 1x5 ml (12x75mm)', 'West Technology Forensics', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HSX-5000', 'Batery 12V สำหรับไฟฉายหลายความถี่', 'West Technology Forensics', u.id, 1800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'IEG-HO0220', 'Hot plate E.G.O. 2000W 220MM เตาไฟฟ้าทรงสูง ใหญ่ Germany', 'West Technology Forensics', u.id, 3700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'INDICATOR_5-10', 'pH indicator strips 5-10, ""EMD', 'West Technology Forensics', u.id, 240.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'INK-FG-CD-4OZ', 'Fingerprint Black Ink 4 oz tube 120ml  Smithville Mo', 'West Technology Forensics', u.id, 672.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'VIAL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ISYSALPHA', 'ALPHA SYSTEM', 'West Technology Forensics', u.id, 1892848.84, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'JIPOE-206/3', 'Evaporating dish ขนาด 140 mL dia 94 มม สูง 42 มม ยี่ห้อ Jipo Germany', 'West Technology Forensics', u.id, 450.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'JP-V', 'JAPAN เวอร์เนี่ยคาลิปเปอร์ติจิจิทัล สเดนเลส ความแม่นผ่าสูง 0-150 200 300 มม. สไดล์ญี่ปุ่น ส่าหรับรถบรรรรทุก (แมดเดลรี Mitoyo', 'West Technology Forensics', u.id, 949.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K17990', 'Corrosion preventive 90-240V47', 'West Technology Forensics', u.id, 288731.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KNH-0001-0003', 'ด้ามมีด “FEATHER” No.3', 'West Technology Forensics', u.id, 441.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KNH-0002-0003', 'ด้ามใบมีดผ่าตัด#3', 'West Technology Forensics', u.id, 120.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS0-8909', 'roQ QuEChERS Extraction Full Kit 4.0g MgSO4 1.0g NaCI 1.0 SCTD 0.5g SCDS Weight per UOM 0.05 kg', 'West Technology Forensics', u.id, 6827.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-DAILY-LABOR', 'Labor daay for troubleshooting', 'West Technology Forensics', u.id, 21600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-DAILY-THL', 'Daily Travel Hotel and Living expenses', 'West Technology Forensics', u.id, 3500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KS-MOBE', 'Domestic Mobillization', 'West Technology Forensics', u.id, 10800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LBI.L-CMP7', 'Economical Palm Micro Centrifuge รุ่น L-CMP7  7000 rpm ยี่ห้อ LABGIC', 'West Technology Forensics', u.id, 1214.02, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LGW.73500-13100', 'Test Tube Disposable 13 x 100 mm ยี่ห้อ Kimax USA', 'West Technology Forensics', u.id, 3.51, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LGW.D810', 'Glass Pasteur Pipettes 150mm ยี่ห้อ Volac', 'West Technology Forensics', u.id, 36.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LGW.Q21001050', 'Glass funnels short stem 50mm ยี่ห้อ QUALICOLOR Czech Republic', 'West Technology Forensics', u.id, 141.12, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LGW.Q21001076', 'Glass Funnels short stem 75mm ยี่ห้อ QUALICOLOR Czech Republic', 'West Technology Forensics', u.id, 178.08, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LPP02362403', '3ML Luber -silp Plastic Disposa HSW', 'West Technology Forensics', u.id, 7.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LS-1202007', 'Percision thermometers stem form ASTM 7 C IP 5 C Low Distillation caapillaries', 'West Technology Forensics', u.id, 3000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LS-15020-130P', 'miniPCR mini16 thermal cycler', 'West Technology Forensics', u.id, 35000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MAH-3ALU', 'MAH Mobile AArm Exhaus', 'West Technology Forensics', u.id, 80000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MC104-R00', 'Regulator + Gauge CAMOZZI : MC104-R00 PT 1/4', 'West Technology Forensics', u.id, 1700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MC55ZV1S', 'เครื่องฟอกอากาศ ไดกิ้น MC55ZV1S', 'West Technology Forensics', u.id, 9065.42, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MER-105554-20X20', 'TLC Aluminium sheets silica gel60 f254 (20x20)(25pc/PK)', 'West Technology Forensics', u.id, 4600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MEW.201-03', 'ช้อนตักสารสแตนเลส เบอร์ 3 ยาว 21cm (ช้อน 15 มม / พาย 7 มม)', 'West Technology Forensics', u.id, 117.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MFLX31304-02', 'CPC? Quick-Disconnect Fitting Push-to-Connect Coupling Body Acetal Valved 3/8 OD 25/PK', 'West Technology Forensics', u.id, 1800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MFLX31304-32', 'CPC Quick-Disconnect Fitting Push-to-Connect Insert Acetal Valved 3/8 OD 25/PK', 'West Technology Forensics', u.id, 1600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MI-02-014', 'Forceps สแตนเลส ปากคีบมีเขี้ยวปลายตรง 30cm Mira', 'West Technology Forensics', u.id, 225.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MI-05-019', 'Semken Forceps ปลายแหลม 16cm Mira', 'West Technology Forensics', u.id, 135.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MI-07-022', 'Meriam Tweezer 16cm Mira', 'West Technology Forensics', u.id, 145.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MVC-300', 'ACTIVATED CARBON FILTER FOR MVC-3000', 'West Technology Forensics', u.id, 14500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NP100553', 'Petri dish PS 90x15mm Sterilized GVS 500ea/cs', 'West Technology Forensics', u.id, 1100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NS20801304', 'Nylon syring filter 13mm 0.45um PK/100', 'West Technology Forensics', u.id, 666.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NS20802504', 'Nylon syringe filter 25mm 0.45um pk/100', 'West Technology Forensics', u.id, 1176.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'O1-ON176', '(# 8050140013) MS-M-S10 10-Channel Classic Magnetic Stirrer stainless steel plate with silicone film เครื่องกวนสารละลายด้วยแม่เหล็ก-สามารถวางสารบนแท่นได้ 10', 'West Technology Forensics', u.id, 35425.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'O-CEI2519', 'Prochrono Debris Shield', 'West Technology Forensics', u.id, 794.39, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'O-CEI3820', 'Compet Elec Prochono DLX', 'West Technology Forensics', u.id, 5940.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'O-CEI4100', 'Prochrono LED Light Setup', 'West Technology Forensics', u.id, 2327.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'O-CEI4715', 'Prochrono Carrying Case', 'West Technology Forensics', u.id, 1080.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ORING-3', 'O-Ring W/Lock 3 in. Aluminium (Mr.Clamp Thai)', 'West Technology Forensics', u.id, 85.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ORING-4', 'O-Ring W/Lock 4 in. Aluminium (Mr.Clamp Thai)', 'West Technology Forensics', u.id, 85.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OVG203AP', 'Vanguard Espod CX 203AP tripod', 'West Technology Forensics', u.id, 1782.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OVH-DP-K19', 'Doublepow 9V Rech Batt and Adapter', 'West Technology Forensics', u.id, 1140.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'P-001-2', 'ชุดถ่ายไนโตรเจนเหลว ยี่ห้อ IC Biomedical ประเทศสหรัฐอเมริกา', 'West Technology Forensics', u.id, 45000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'P-0040', 'Pestle & Mortar dia 100mm', 'West Technology Forensics', u.id, 115.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'P-0089', 'Pegboard drying rack ขนาด 52 x 68 cm ตากได้ 56 ช่อง ยี่ห้อ LP italy', 'West Technology Forensics', u.id, 3700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'P-009-35LD', 'ตะกร้าล้อเลื่อนสำหรับถังรุ่น 35LD', 'West Technology Forensics', u.id, 4000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PCH-MO005', 'Mortar with spout and peatle 16 CM (โกร่งบทยา 26 ซม)', 'West Technology Forensics', u.id, 220.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'P-D35', 'ตะกร้าล้อเลื่อนสำหรับถังรุ่น D35', 'West Technology Forensics', u.id, 4000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PHX00D-4498-AN', 'Kinetex 1.7 ?m XB-C18 100 ?  LC Column 100 x 2.1 mm', 'West Technology Forensics', u.id, 34320.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PKTC-19-26-OD6', 'Pocket thermometer cone 19/26 พร้อมท่อแก้ว OD 6 mm ยาว 7.5 cm หัวท้ายเปิด พร้อมฝา GL 14 ชนิดเจาะรู', 'West Technology Forensics', u.id, 650.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'POCK-PLUS-1000K', 'POCKSWB-PLUS/ATP MONITORING/40x25TESTS', 'West Technology Forensics', u.id, 70948.69, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'POLILGHT PL500', 'เครื่องกำเนิดแสงหลายความถี่ขนาดแสง 500 วัตต์รุ่น Polilght PL500 ยี่ห้อ Rofin ประเทศ ออสเตรเลีย', 'West Technology Forensics', u.id, 1448598.13, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PSD1200W-PG', 'Power supply deepcool 1200W PX1200G 80 PLUS Gold', 'West Technology Forensics', u.id, 7590.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'RACK-W-38X40X25-5.6', 'ที่วางหลอดทดลองทำจากไม้สักขนาด ก 38 ซม ส 40 ซม ลึก 25 ซม ขนาดหลุมกว้าง 5.6 ซม', 'West Technology Forensics', u.id, 4000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'RBO1000', 'New micropipette variable volume, 100-1000 UI', 'West Technology Forensics', u.id, 3000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'RCS-C', 'Recessed cup', 'West Technology Forensics', u.id, 8000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'RD200', 'Stand Rod RD200 Stainless-steel 1.5p screw', 'West Technology Forensics', u.id, 950.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S-0015', 'Syringe disposable 3 mL (100 อัน/กล่อง) ยี่ห้อ Nipro', 'West Technology Forensics', u.id, 260.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S-0016', 'Syringe disposable 5 mL (100 อัน/กล่อง) ยี่ห้อ Nipro', 'West Technology Forensics', u.id, 190.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S-0325', 'Test sieve ขนาดรู 4.75  mm. (mesh no.4) dia. 8 นิ้ว สูง 2 นิ้ว Stainless ยี่ห้อ Endecotts', 'West Technology Forensics', u.id, 6600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S-0326', 'Test sieve ขนาดรู 4.00 mm. (mesh no.5) dia. 8 นิ้ว สูง 2 นิ้ว Stainless ยี่ห้อ Endecotts', 'West Technology Forensics', u.id, 6700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S-0328', 'Test sieve ขนาดรู  2.80 mm. (mesh no.7) dia. 8 นิ้ว สูง 2 นิ้ว Stainless ยี่ห้อ Endecotts', 'West Technology Forensics', u.id, 5100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S-0330', 'Test sieve ขนาดรู 2.00 mm. (mesh no.10) dia. 8 นิ้ว สูง 2 นิ้ว Stainless ยี่ห้อ Endecotts', 'West Technology Forensics', u.id, 5100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S-0334', 'Test sieve ขนาดรู 1.00 mm. (mesh no.18) dia. 8 นิ้ว สูง 2 นิ้ว Stainless ยี่ห้อ Endecotts', 'West Technology Forensics', u.id, 5100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S-0359', 'Lid for test sieve (ฝาครอบ) dia. 8 นิ้ว Stainless ยี่ห้อ Endecotts, England', 'West Technology Forensics', u.id, 2600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S-0360', 'Receiver test sieve (จานรอง) dia. 8 นิ้ว Stainless ยี่ห้อ Endecotts', 'West Technology Forensics', u.id, 3800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S-0361', 'แปรงทำความสะอาดตะแกรงร่อน ยี่ห้อ  Endecotts', 'West Technology Forensics', u.id, 900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S2725QS', 'Dell Monitor S2725QS', 'West Technology Forensics', u.id, 8682.24, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SC-3340', 'Sample cup double open ended with cap for ARL OPTIM X', 'West Technology Forensics', u.id, 49.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SC-3340 T', 'Sample cup double open ended with cap for ARL PERFORM X', 'West Technology Forensics', u.id, 49.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SEN5934360K', 'SENATOR Black aluminium tool case', 'West Technology Forensics', u.id, 3288.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SGB-0001-0011', 'ใบมีดผ่าตัด FEATHER  No.11 (100 ชิ้น/กล่อง)', 'West Technology Forensics', u.id, 750.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SGB-0001-0012', 'ใบมีดผ่าตัด FEATHER  No.12 (100 ชิ้น/กล่อง)', 'West Technology Forensics', u.id, 690.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SGB-0001-0020', 'ใบมีดผ่าตัด FEATHER  No.20 (100 ชิ้น/กล่อง)', 'West Technology Forensics', u.id, 690.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SGB-CB-0001-0010', 'ใบมีด คาร์บอน Techno Cut 100pc', 'West Technology Forensics', u.id, 369.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-85605-5G', 'Spermine tetrahydrochloride BioUltra for molecular biology 99.5% (AT) Sigma Aldrich""= 5G', 'West Technology Forensics', u.id, 13840.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIG-F7253-0025', 'FAST BLACK K SALT SIGMA #F7253', 'West Technology Forensics', u.id, 2650.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-00030', 'Evaporating Tube 200 ml', 'West Technology Forensics', u.id, 2675.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-00033', 'Seperatory funnel with Glass Stopper Joint 24/40, 100 ml Duran', 'West Technology Forensics', u.id, 1605.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SKU-VEC200A', 'Sexual Assault Victim Evidence Collection Kit SKU VEC200A Sirchie', 'West Technology Forensics', u.id, 3500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SLBC183200', 'C18 SPE 200mg/3ml', 'West Technology Forensics', u.id, 1287.12, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SMHS-3', 'MULTI-HOTPLATE STIRRERS MODEL : SMHS-3 #DH.WMH03503', 'West Technology Forensics', u.id, 28000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SNB60', 'Stand and Base ฐานตั้งเหล็ก สูง 60 cm (Thai)', 'West Technology Forensics', u.id, 262.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SP12HOLE', 'จานหลุมกระเบื้อง (Porcelain Spot Plate) จำนวน 12 หลุม', 'West Technology Forensics', u.id, 64.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SPA-003', 'Spatula Stainless One Spoon/One Flat No. 3 (L21/W2cm)', 'West Technology Forensics', u.id, 87.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SPE-0001', 'เครื่องเครียมตัวอย่างของเหลวด้วยเทคนิค (Solid Phase Extraction)', 'West Technology Forensics', u.id, 4607476.64, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SP-S S NO1', 'Spoon and spatula stainless NO.1', 'West Technology Forensics', u.id, 145.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SP-S S NO1-1', 'Spoon and spatula stainless NO.1-1', 'West Technology Forensics', u.id, 150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SP-S S NO24', 'Spoon and spatula stainless NO.24', 'West Technology Forensics', u.id, 145.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SPS-C1203', 'NICE-Power เพาเวอร์ซัพพลาย ดิจิตอล 0-120V 0-3A', 'West Technology Forensics', u.id, 2004.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SRC-PS-2.4X3.9MM', '2.4mm x 3.9mm Plastic Straight Reducing Connectors For Garden Watering Hose Micro Irrigation System', 'West Technology Forensics', u.id, 12.92, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SRC-PS-3X4MM', '3mm x 4mm Plastic Straight Reducing Connectors For Garden Watering Hose Micro Irrigation System', 'West Technology Forensics', u.id, 12.15, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SRM-0001', 'Syringe 2 CC. Metal Luer Lock (Clear Barrel)', 'West Technology Forensics', u.id, 160.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SS-0009+ZG-0004', 'Silicone stopper no.9 (dia บน x dia ล่าง x สูง) 23 x 18 x 30 mm เจาะรู จุกยางซิลิโคน 1 รู dimension 6 มม.', 'West Technology Forensics', u.id, 102.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SS500', 'Temp Probe SS500 Stainless-steel DAIHAN', 'West Technology Forensics', u.id, 2050.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0034', 'ช้อนตักสารเคมี สเตนเลส ขนาดเล็ก', 'West Technology Forensics', u.id, 120.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0035', 'ช้อนตักสารเคมี สเตนเลส ขนาดกลาง', 'West Technology Forensics', u.id, 280.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0069', 'แว่นขยาย เส้นผ่าศูนย์กลาง 90mm. Magnifying glass id 90 mm', 'West Technology Forensics', u.id, 75.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0072', 'ช้อนตักสาร พลาสติก ขนาดใหญ่', 'West Technology Forensics', u.id, 23.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0351', 'Porcelain spotting plate 12หลุม (จานหลุมกระเบื้อง)', 'West Technology Forensics', u.id, 74.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0357', 'ถุงมือป้องกันของมีคม', 'West Technology Forensics', u.id, 95.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0376', 'กระดาษชั่งสาร ขนาด 10x10 cm. (450 แผ่น/กล่อง)', 'West Technology Forensics', u.id, 128.4, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-105-35LD', 'ถังเก็บไนโตรเจนเหลว รุ่น 35LD ยี่ห้อ IC Biomedical พร้อมคู่มือประกอบการใช้งาน', 'West Technology Forensics', u.id, 54000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ถัง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-60X85X80CM', 'โต๊ะวางเครื่อง ขนาด 60x85x80cm', 'West Technology Forensics', u.id, 9750.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-80X80X80CM', 'โต๊ะวางเครื่อง ขนาด 80X80X80CM', 'West Technology Forensics', u.id, 10250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-9820-16X', 'Test tube 16 x 125 mm 15ml ยี่ห้อ Pyrex USA', 'West Technology Forensics', u.id, 18.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TB-2X4-FG', 'ท่อสายางซิลิโคน ขนาด 2x4 mm ฟูดเกรด', 'West Technology Forensics', u.id, 86.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TB-NITROGEN-1M-PSM80', 'สายถ่ายไนโตรเจนความยาว 1 เมตร พร้อม Phase Separator model 80  จำนวน 1 อัน', 'West Technology Forensics', u.id, 7000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เส้น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-C-2X4MM-1M-FOG', 'สายยางซิลิโคน 2x4 MM ยาว 1 M ฟูดเกรด', 'West Technology Forensics', u.id, 45.09, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-D35', 'ถังเก็บไนโตรเจนเหลว รุ่น D35 พร้อมคู่มือประกอบการใช้งาน', 'West Technology Forensics', u.id, 45000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TE-2000-2Y', 'UPS (เครื่องสำรองไฟฟ้า) SYNDOME TE2000 รับประกัน 2 ปื', 'West Technology Forensics', u.id, 18000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TME-PH-109535', 'pH paper 0-14, GRAD 1 (100T) ""MERCK', 'West Technology Forensics', u.id, 495.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TNL2545', 'Nylon syringe filter with pre filter 25 mm 0.45 um pk/100', 'West Technology Forensics', u.id, 875.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TVW-ROD12', 'แท่งแก้วคนสาร (Stirring rod) ยาว 12 นิ้ว', 'West Technology Forensics', u.id, 19.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TVW-ROD6', 'แท่งแก้วคนสาร (Stirring rod) ยาว 6 นิ้ว', 'West Technology Forensics', u.id, 13.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TVW-ROD8', 'แท่งแก้วคนสาร (Stirring rod) ยาว 8 นิ้ว', 'West Technology Forensics', u.id, 14.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-WB1-200X75X85CM', 'โต๊ะปฏิบัติการติดผนัง ขนาม 200x75x85 cm', 'West Technology Forensics', u.id, 60000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-WB2-220X75X80CM', 'โต๊ะปฏิบัติการติดผนัง ขนาด 220x75x80 cm', 'West Technology Forensics', u.id, 62000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TWZPLA-PP10.5-B', 'ปากคีบพลาสติก สีน้ำเงิน ขนาด 10.5x2.5ซม 100อัน', 'West Technology Forensics', u.id, 230.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TWZPLA-PP7.5-WH', 'ปากคีบพลาสติก สีขาว ขนาด 7.5 ซม 100อัน', 'West Technology Forensics', u.id, 153.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'UF110', 'OVEN Model:UF110 MEMMERT Oven single display forced air 108L TEMP : 300 C', 'West Technology Forensics', u.id, 96500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'VACAM-300C', 'Desiccator Vacuum w/Lid Porcelain 300MM (China)', 'West Technology Forensics', u.id, 2650.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'VER-C0801-7027', 'CAPILLARY TUBE MICROCAP 1.0 UL (100/PKG) VERTICAL', 'West Technology Forensics', u.id, 1600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'VER-C0801-7057', 'Capillary tube microcap 5.0 UL 100/PK Vertical 0801-7057', 'West Technology Forensics', u.id, 1400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'VER-C-SMALL', 'หลอดคาปิลลารี่ (หลอดรูเล็ก) capillary tube สีน้ำเงิน 100อัน/หลอด', 'West Technology Forensics', u.id, 110.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'VGT-1613T', 'VGT-1613T Ultrasonic cleaner 1.3 L', 'West Technology Forensics', u.id, 3650.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'W-93106', 'Diamond weighing boats plastic สีขาว 100 ml 250/pk ยี่ห้อ B-EZ', 'West Technology Forensics', u.id, 850.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'W-93110', 'Diamond weighing boats plastic ขนาด 5ml 1000pcs/pk ยี่ห้อ B-EZ china', 'West Technology Forensics', u.id, 750.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WLP-0002', 'ขวดฉีดน้ำกลั่น 500 ml มีสเกล ยี่ห้อ LP italy', 'West Technology Forensics', u.id, 130.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WSO00300', 'Shaker digital orbital OB2', 'West Technology Forensics', u.id, 30180.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ST' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WSO604110', 'Rubber Ma Platform w295xd295mm DAIHAN', 'West Technology Forensics', u.id, 1880.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'X-RAY SAMPLE CUP ARL', 'Sample Cup ARL x-ray', 'West Technology Forensics', u.id, 1200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'X-RAY SAMPLE CUP ARL - 2', 'Sample Cup ARL x-ray Size เล็ก', 'West Technology Forensics', u.id, 1440.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZKCG063-0-10BAF', 'เกจวัดแรงดันน้ำประปา 100 psi เกลียวสแตนเลส แบบมีน้ำมัน หน้าปัด 2.5นิ้ว ออกล่าง (0-10 bar)', 'West Technology Forensics', u.id, 980.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZQ63-ABWAB04-00', 'ZEBRA DT Printer ZQ630 Plus English Thai Vietnamese fonts Dual 802 11AC / BT4 x Linered platen', 'West Technology Forensics', u.id, 26500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZSG264100-04BP0GSHNL', 'Two Stage Pressure Reducing Regulator Inlet & Outlet Pressure 4500 & 0.125 PSIG CV 0.06 Body SS316', 'West Technology Forensics', u.id, 27259.2, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00048', '15446462.8', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '19800335.97' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '120907', '9mm PP screw thread cap, Blue center hole', 'West Technology Forensics', u.id, 620.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '121117', '11mm Alu Crimp Cap clear lacquered centre hole with Red PTFE/White Silicone pk/100', 'West Technology Forensics', u.id, 415.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '130.203.07', 'Volumetric Flask Amber scale A w Cert Lot 250ml (Glassco)', 'West Technology Forensics', u.id, 300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '139.203.03A', 'Cylinder Hex Base Amber Scale A w/Cert Lot 50ML (GLASSCO)', 'West Technology Forensics', u.id, 216.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BT-AB-120-J-BK', 'ขวดสีชาพร้อมฝา ขนาด 120 มล.', 'West Technology Forensics', u.id, 3.69, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BT-AM-60-0001', 'ขวดสีชา 60ML ฝาเกลียวสีดำหร้อมจุก', 'West Technology Forensics', u.id, 10.7, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GCH-RE-WAL1', 'Reagent bottle amber wide mouth 1 L', 'West Technology Forensics', u.id, 120.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GPY-B1000-2000', 'Beaker low form with spout 2L (Pyrex)', 'West Technology Forensics', u.id, 640.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GS-CDSSP30-24/29', 'Condenser ไส้เกลียว ยาว 30 ซม Joint 24/29', 'West Technology Forensics', u.id, 1800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GSC-LA2180654', 'Laboratory Bottle Screwcap brown 1 L  (Bluecap 2180654) Schott', 'West Technology Forensics', u.id, 960.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'V-0083-1', 'Vial สีชา ขนาด 10 ml ฝ่าเกลียวสีดำ ยี่ห้อ Thai', 'West Technology Forensics', u.id, 9.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'VI-10-1', 'Vial screw cap สีใส ฝาเกลียวสีดำ ขนาด 10 ml ยี่ห้อ Thai', 'West Technology Forensics', u.id, 7.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'VI-10-1-2', 'Vial  สีใส ขนาด 10 ml ฝาจุกกด', 'West Technology Forensics', u.id, 3.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00049', '5105.19', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '80028.18' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '20-ST-09306', 'ชุดไขควง ปากแบน แฉก 8 ตัว SATA 09306', 'West Technology Forensics', u.id, 680.7, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '30-496-180THN', 'ตลับเมตร stanley 5m 30-496-180TH', 'West Technology Forensics', u.id, 163.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '30-496N', 'ตลับเมตร stanley 5m 30-496N', 'West Technology Forensics', u.id, 185.98, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '30-696', 'ตลับเมตร5 เมตร 30-696 Stanley tylontape 19มม ดำ-เหลือง', 'West Technology Forensics', u.id, 288.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '30-696N-20-159', 'Stanley ตลับเมตรพลาสติกสีดำ-เหลือง 5ม Tylon Tape (SPE)', 'West Technology Forensics', u.id, 379.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '33-231', 'STANLEY ตลับ เมตร POWERLOCK รุ่น 33-231 สีเงิน-เหลืองขนาด 3 เมตร', 'West Technology Forensics', u.id, 261.68, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '34-263-50M', 'เทปวัดที่สายไฟเบอร์กลาส Handman STANLEY รุ่น 34-263 ขนาด 50 ม. สีเหลือง', 'West Technology Forensics', u.id, 663.09, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '5100-200', 'Digital Vernier Caliper 0-200mm IP54 SHAHE', 'West Technology Forensics', u.id, 2300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '662003483', 'Maintenance Kit For 60627 2253 ชุดหัว compressor nitrogen', 'West Technology Forensics', u.id, 32000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6943913163841', 'ค้อนหงอนด้ามไฟเบอร์PUMPKIN 2913427 มม. ส้ม-ดำ', 'West Technology Forensics', u.id, 231.78, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6952062695769', 'ค้อนยางด้ามไฟเบอร์GIANT KINGKONG PRO KKP25502 16 ออนซ์น้ำเงิน', 'West Technology Forensics', u.id, 119.63, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8852198043497', 'คีมล๊อคปากตรง SOLO 2000 10 นิ้ว เงิน', 'West Technology Forensics', u.id, 228.97, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8854368011756', 'คีมตัดปากเฉียงคอสั้น Stanley Maxgrip84-027 6 นิ้ว เหลือง-ดำ', 'West Technology Forensics', u.id, 253.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8854368011817', 'คีมปากแหลม STANLEY MAXGRIP84-0316 นิ้ว เหลือง-ดำ', 'West Technology Forensics', u.id, 222.43, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '9003851', 'STANLEY ตลับเมตร TYLON TAPE รุ่น 30-696N 5 เมตร', 'West Technology Forensics', u.id, 228.97, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOS-0002', 'Deli ชุดเครื่องมือช่าง เครื่องมืออุปกรณ์ช่าง 21 ชิ้น', 'West Technology Forensics', u.id, 744.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CBDW-50X60X70CM', 'ตู้ลิ้นชักมีล้อเลื่อนขนาด 50x60x70 cm', 'West Technology Forensics', u.id, 5600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ตู้' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CLX224X1', 'ชุดสว่านไร้สาย 12 โวลท์ มากีด้า กล่องอลูมิเนียม', 'West Technology Forensics', u.id, 5050.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CR-V', 'ชุดไขควง 8ขึ้น ชุดไขควงกระเป้า เหล็ก CR-V ด้ามจับยาง หัวแม่เหล็ก ชุดไขควง ไขดวง ไขควงต่ามทะลุ หัวเเบน หัวแฉก', 'West Technology Forensics', u.id, 333.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CTA-4-S316', 'SS316 Union Tee OD 1/4 inch', 'West Technology Forensics', u.id, 871.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CWT-991-32', 'DELTON 2in1 บล็อกแบต & สว่าน 199V แบตเตอรี่ 2 ก้อน XR Series รุ ่น CWT-991-32 แถมฟรี! อุปกรณ์ เครื่องมือช่าง รวม 32 ชิ ้น', 'West Technology Forensics', u.id, 1841.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'D020500026', 'กล่องเครื่องมือเหล็ก 19นิ้ว ถาด 2 ชั้น', 'West Technology Forensics', u.id, 2250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCD7781D2A', 'สว่านกระแทกไร้สาย 20V พร้อมแบต DEWALT', 'West Technology Forensics', u.id, 6160.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DWMT45184', 'ชุดบล็อค 184 ชิ้น DEWALT', 'West Technology Forensics', u.id, 4990.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FD-518', 'ไฟฉายชาร์จซูม Flashlight รุ่น 518 แบบพกพา', 'West Technology Forensics', u.id, 119.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FD-C6', 'ไฟฉาย Fenix C6', 'West Technology Forensics', u.id, 1500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GST90A15-P1M', 'MEAN WELL Desktop AC Adapters 90W 15V 6A', 'West Technology Forensics', u.id, 910.75, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KB-T-306S', 'คีมปากแหลม ขนาด 6 นิ้ว made in japan', 'West Technology Forensics', u.id, 412.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KEW5711', 'ปากกาทดสอบแรงดันไฟฟ้า KEW 5711AC 20-1000V', 'West Technology Forensics', u.id, 1350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KNF-00074', 'มีดพับ', 'West Technology Forensics', u.id, 191.7, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ML-T6-UTF518', 'MaxLight ไฟฉาย T6 สว่างมาก ไฟฉายแรงสูง Zoomได้ ส่องไกล รุ่น Ultrafire 518 ไฟ 3 Mode ไฟฉายชาร์จUSB', 'West Technology Forensics', u.id, 267.29, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PL-518', 'ไฟฉาย UltraFire PL-518 รุ่น 25000W Flashlight 10000 Lumen', 'West Technology Forensics', u.id, 243.69, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'R-RF-SET-BS', 'เชือกสะท้อนแสง สมอบกพร้องถุงเก็บและตัวล็อคเชือก  อุปกรณ์ ขึง ดึงเสาเต็นท์ สีน้ำเงิน / สมอเงิน', 'West Technology Forensics', u.id, 204.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SC-CG-001-Y', 'ไขควงวัดไฟ สีเหลือง', 'West Technology Forensics', u.id, 30.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SN-PP-0001-1000', 'กระดาษทรายน้ำ TOA เบอร์ 1000 (60 แผ่น/แพ็ค)', 'West Technology Forensics', u.id, 31.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TOSD-010-002', 'Xiaomi Mijia Electric Screwdriver Kit Precision ไขควงไฟฟ้า 24 in 1', 'West Technology Forensics', u.id, 932.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TOSD-66-120-5X7.5-Y', 'ไขควงลองไฟ Stanley 66-120 5 มม x 7.5 นิ้ว เหลือง', 'West Technology Forensics', u.id, 88.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TP3M-170-BK10M', 'เทปพันสายไฟหนา สีดำ ขนาด 10M 3M รุ่น 170 (แทนตัวเดิม 1710 แพ็ค 10 ม้วน )', 'West Technology Forensics', u.id, 209.67, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TT-KE-2-7', 'คีมปอกสายไฟ NO 887  7นิ้ว', 'West Technology Forensics', u.id, 142.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WKT-216PCS', 'InnTech King Tools เครื่องมือช่าง ประแจ ชุดบล็อก 216 ชิ้น (ชุดใหญ่) ชุดประแจ ผลิตจากเหล็ก CR-V แท้ รุ่น WKT-216PCS', 'West Technology Forensics', u.id, 2216.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'Y091453', 'เทปวัดที่สายไฟเบอร์ GIANT KINGKONG PRO สีน้ำเงิน ขนาด 50 ม', 'West Technology Forensics', u.id, 533.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'YA31193', 'CLINTON คีมตัดปากเฉียงด้ามจับหุ้มยาง  FER-DCP6 6 นิ้ว', 'West Technology Forensics', u.id, 144.86, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'Z00-0000003', 'แหวนข้างปากตาย ASH 14 ตัว 8-24 มิลทั้งชุด', 'West Technology Forensics', u.id, 3210.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00050', '78782.24', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '175407.15' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOX-20X30X7-C+KT10', 'กล่องหีบห่อวัตถุพยาน 3 ชั้น ขนาด 20x30x7cm ลอน C พิมพ์ 1 สี พร้อมเคเบิ้ลไทร์ 10นิ้ว 8เส้น', 'West Technology Forensics', u.id, 82.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOX-25X35X15-C+KT10', 'กล่องหีบห่อวัตถุพยาน 3 ชั้น ขนาด 25x35x15 cm ลอน C พิมพ์ 1 สี พร้อมเคเบิ้ลไทร์ 10นิ้ว 8เส้น', 'West Technology Forensics', u.id, 117.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOX-30X120X12-C+KT10', 'กล่องหีบห่อวัตถุพยาน 3 ชั้น ขนาด 30x120x12cm ลอน C พิมพ์ 1 สี พร้อมเคเบิ้ลไทร์ 10นิ้ว 8เส้น', 'West Technology Forensics', u.id, 188.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PK-CA-PP-CG-KA-F2-10X12X36CM', 'ซองกลุ่มตรวจชีววิทยาและดีเอ็นเอ ขนาด 10 x 12 x 36 ซม.', 'West Technology Forensics', u.id, 13.95, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PK-CA-PP-CG-KA-F2-11X21CM', 'ซองกลุ่มตรวจชีววิทยาและดีเอ็นเอ ขนาด 11 x 21 ซม.', 'West Technology Forensics', u.id, 6.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PK-CA-PP-CG-KA-F2-20X46X65CM', 'ซองกลุ่มตรวจชีววิทยาและดีเอ็นเอ ขนาด 20 x 46 x 65 ซม.', 'West Technology Forensics', u.id, 32.72, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PK-CA-PP-CG-KA-F2-26X12X36CM', 'ซองกลุ่มตรวจชีววิทยาและดีเอ็นเอ ขนาด 26 x 36 x 12 ซม.', 'West Technology Forensics', u.id, 15.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PK-PP-11.5X21CM-KA120BR-SM', 'ซองเก็บเขม่าปืน ขนาด 11.5x21 CM กระดาษน้ำตาล KA120แกรม สีดำ2ด้านฝาซองกาวแห้ง', 'West Technology Forensics', u.id, 4.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-LBOBWA4', 'สติ๊กเกอร์ฉลากซองวัตถุพยาน ขนาด A4', 'West Technology Forensics', u.id, 15.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-LBOBWA5', 'สติ๊กเกอร์ฉลากซองวัตถุพยาน ขนาด A5', 'West Technology Forensics', u.id, 15.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-LOGO-BOX', 'สติ๊กเกอร์ใส โลโก้ ติดกล่องเก็บวัตถุพยานตำรวจ', 'West Technology Forensics', u.id, 35.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'แผ่น' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-SG2CMNB-SET', 'สติ๊กเกอร์สเกล 1x2 ซม. 1 ชุด', 'West Technology Forensics', u.id, 60.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0384-2', 'ตราใหม่ เอกสารยินยอมให้เก็บตัวอย่าง DNA (พันธุกรรม) ลายพิมพ์นิ้วมือ 10 นิ้ว ฝ่ามือ F-CS-27', 'West Technology Forensics', u.id, 70.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เล่ม' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TAP-PS-B-5X100', 'เทปปิดผนึกหีบห่อวัตถุพยาน (Evidence Sealing Type) ชนิดพลาสติก สีน้ำเงิน (กลุ่มชีววิทยาและ DNA) เทปหน้ากว้าง 5 ซม. พื้นฟ้า โลโก้ 2 สี สีดำ+ขาว ยาว 100 เมตร ( แนวดึงซ้าย)', 'West Technology Forensics', u.id, 94.66, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00051', '750.33', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '398672.2' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '120901', '2ml screw neck ND9 viat, Clear, pk/100', 'West Technology Forensics', u.id, 217.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '930565', 'ถุงขยะ แชมเปี้ยน สีดำ 26 x 34 นิ้ว 18ใบ', 'West Technology Forensics', u.id, 55.14, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BAG-01', 'กระเป๋าใส่ป้ายหมายเลข สีดำ สกรีนโลโก้พิสูจน์หลักฐานตำรวจ', 'West Technology Forensics', u.id, 600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BAG-KMS', 'เป้หลัง KMS', 'West Technology Forensics', u.id, 850.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BAG-NBYE-01', 'กระเป๋าใส่ป้ายหมายเลข 1-30 พื้นเหลืองตัวหนังสือแดง ลูกศรชี้ 4 ทิศ อักษร A-J บรรจุในกระเป๋าสีดำพร้อมสกรีนโลโก้สำนักงานพิสูจน์หลักฐานตำรวจ', 'West Technology Forensics', u.id, 3240.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BAG-NBYE-02', 'กระเป๋าใส่ป้ายหมายเลข 1-30 พื้นเหลืองตัวหนังสือแดง ลูกศรชี้ 4 ทิศ อักษร A-J บรรจุในกระเป๋าสีดำพร้อมสกรีนโลโก้สำนักงานพิสูจน์หลักฐานตำรวจ', 'West Technology Forensics', u.id, 3240.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BAG-NBYE-03', 'กระเป๋าใส่ป้ายหมายเลข 1-30 พื้นเหลืองตัวหนังสือแดง ลูกศรชี้ 4 ทิศ อักษร A-J สกรีน ศพฐ10 ตัวอักษรแดงพื้นหลังขาว ไม่มีกระเป๋า', 'West Technology Forensics', u.id, 2640.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BO-CL50C-001', 'กระปุก 50g พร้อมฝา', 'West Technology Forensics', u.id, 9.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'กระปุก' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BO-CL50C-001-SI', 'กระปุก 50g พร้อมฝาสีเงิน', 'West Technology Forensics', u.id, 11.55, 0, 'STANDARD', true
FROM units u WHERE u.code = 'กระปุก' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOTTLE_1000ML_AMBER', 'Duran Lab bottle with cap Amber size 1000 ml', 'West Technology Forensics', u.id, 1050.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOTTLE_1000ML_CLEAR', 'Duran Lab bottle with cap Clear size 1000 ml', 'West Technology Forensics', u.id, 205.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOTTLE_1000ML_CLEAR_SCHOTT', 'Laboratory bottle screwcap clear 1 L bluecap', 'West Technology Forensics', u.id, 200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOTTLE_100ML_AMBER', 'Duran Lab bottle with cap Amber size 100 ml', 'West Technology Forensics', u.id, 480.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOTTLE_2000ML_CLEAR', 'Duran Lab bottle with cap Clear size 2000 ml', 'West Technology Forensics', u.id, 350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOTTLE_250ML_AMBER_BOROSIL', 'Borosil Lab bottle with cap Amber size 250 ml', 'West Technology Forensics', u.id, 400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOTTLE_250ML_CLEAR', 'Duran Lab bottle with cap Clear size 250 ml', 'West Technology Forensics', u.id, 170.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOTTLE_500ML_AMBER_SCHOTT', 'Schott Lab bottle with cap Amber size 500 ml', 'West Technology Forensics', u.id, 700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOTTLE_500ML_CLEAR', 'Duran Lab bottle with cap Clear size 500 ml', 'West Technology Forensics', u.id, 210.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOX-R-60L', 'กล่องพลาสติก 60 L สีแดง', 'West Technology Forensics', u.id, 166.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BT-DP-PS10-001', 'ขวดหยด พลาสติก 10ml', 'West Technology Forensics', u.id, 3.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BT-DP-PS15-001', 'ขวดหยด พลาสติก 15ml', 'West Technology Forensics', u.id, 2.1, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BT-DP-PS30-001', 'ขวดหยด พลาสติก 30ml', 'West Technology Forensics', u.id, 3.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BTGL-250026', 'แกลลอน 2 ลิตร 121 สีขาวใส', 'West Technology Forensics', u.id, 25.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAN-A-10.5X13', 'กระป๋องโลหะเก็บวัตถุพยาน ขนาด กว้าง 10.5 สูง 13 ซม.1/4gl', 'West Technology Forensics', u.id, 40.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAN-A-13.5X15', 'กระป๋องโลหะเก็บวัตถุพยาน ขนาด กว้าง 13.5 สูง 15 ซม.1/2gl', 'West Technology Forensics', u.id, 50.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAN-A-16.5X19', 'กระป๋องโลหะเก็บวัตถุพยาน ขนาด กว้าง 16.5 สูง 19 ซม.1 gl', 'West Technology Forensics', u.id, 55.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAN-A-8.5X10.5', 'กระป๋องโลหะเก็บวัตถุพยาน ขนาด กว้าง 8.5 สูง 10.5 ซม.1/8gl', 'West Technology Forensics', u.id, 32.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ELP-WA100250', 'Wash Bottle LDPE White 250 mL. (ขวดบรรจุน้ำกลั่น ขนาด 250 mL.)', 'West Technology Forensics', u.id, 70.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ENA-B2006-0001', 'Bottle PP NARROW MOUTH 30 ML. (2006-0001, NALGENE/USA)', 'West Technology Forensics', u.id, 25.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ENA-B2006-0002', 'Bottle PP NARROW MOUTH 60 ML. (2006-0001, NALGENE/USA)', 'West Technology Forensics', u.id, 30.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ENA-B2006-0004', 'Bottle PP NARROW MOUTH 125 ML. (2006-0001, NALGENE/USA)', 'West Technology Forensics', u.id, 35.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ENA-B2006-0005', 'Bottle PP NARROW MOUTH 10 ML. (2006-0001, NALGENE/USA)', 'West Technology Forensics', u.id, 10.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ENA-W2425-0502', 'Wash Bottle LDPE/Ethanol 500 mL. (2425-0502, Nalgene;USA)', 'West Technology Forensics', u.id, 280.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ENA-W2425-0503', 'Wash Bottle LDPE/Methanol 500 mL. (2425-0503, Nalgene;USA)', 'West Technology Forensics', u.id, 280.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EVI-CY651-941', 'Cylinder PP 500 ML 651-941 (Vitlab)', 'West Technology Forensics', u.id, 278.2, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FG-800-WH', 'Foggy ฟ็อกกี้ กระบอดฉีดน้ำ ดิวดี้ สีขาว800 มล', 'West Technology Forensics', u.id, 72.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GB-ST18X20IN/BK', 'ถุงขยะพลาสติกขนาด 18X20 นิ้ว สีดำ มาตรฐาน', 'West Technology Forensics', u.id, 51.73, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GB-ST18X20IN/R', 'ถุงขยะพลาสติกขนาดมาตรฐาน 18X20 นิ้ว สีแดง', 'West Technology Forensics', u.id, 55.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GB-ST24X28IN/BK', 'ถุงขยะพลาสติกขนาดมาตรฐาน 24X28 น้ิว สีดำ', 'West Technology Forensics', u.id, 48.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GB-ST28X36IN/BK', 'ถุงขยะพลาสติกขนาดมาตรฐาน 28x36IN สีดำ', 'West Technology Forensics', u.id, 42.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GB-ST28X36IN/R', 'ถุงขยะพลาสติกขนาดมาตรฐาน 28x36IN สีแดง', 'West Technology Forensics', u.id, 48.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GB-ST30X40IN/BK', 'ถุงขยะพลาสติกขนาด 30X40 น้ิว สีดำ มาตรฐาน', 'West Technology Forensics', u.id, 52.73, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GB-ST30X40IN/R', 'ถุงขยะพลาสติกขนาดมาตรฐาน 30X40 น้ิว สีแดง', 'West Technology Forensics', u.id, 62.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GCH-RE-WC0060', 'Reagent bottle clear wide mouth 60ml', 'West Technology Forensics', u.id, 50.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GFA-CY-A500', 'Cylinder glass 500ml Class A (P813235; Favorit)', 'West Technology Forensics', u.id, 570.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GFA-VO0010', 'Volum Flask Class A 10 ML PE Stopper/P809008 (Favorit)', 'West Technology Forensics', u.id, 130.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GL-5L-1', 'แกลลอน เหลี่ยม 5 ลิตร ขุ่นใส พร้อมฝาเกลี่ยว', 'West Technology Forensics', u.id, 30.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GL-R20L-OIL', 'ถังน้ำมัน สีแดง 20ลิตร', 'West Technology Forensics', u.id, 994.67, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ถัง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GPY-B1000-0010', 'Beaker low form with spout 10 mL. 1000-10 (PYREX)', 'West Technology Forensics', u.id, 135.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GPY-B1000-0030', 'Beaker low form with spout 30 ML 1000-30(Pyrex)', 'West Technology Forensics', u.id, 90.95, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GPY-B1000-0050', 'Beaker low form with spout 50 mL. 1000-50 (PYREX)', 'West Technology Forensics', u.id, 110.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GPY-B1000-0100', 'Beaker Low Form With Spout 100 mL. 1000-100 (PYREX)', 'West Technology Forensics', u.id, 130.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GPY-B1000-0250', 'Beaker Low Form With Spout 250 mL. 1000-250 (PYREX)', 'West Technology Forensics', u.id, 140.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GPY-B1000-0600', 'Beaker Low form with spout 600 mL. ""PYREX', 'West Technology Forensics', u.id, 123.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GPY-B1000-1000', 'Beaker Low Form with spout 1L (PYREX)', 'West Technology Forensics', u.id, 330.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GPY-E4980-0125', 'Erlenmeyer flask 125 ML ขวดรูปชมพู่ 125 มม', 'West Technology Forensics', u.id, 155.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GPY-E4980-0250', 'Erlenmeyer flask 250 ML ขวดรูปชมพู่ 250 มม', 'West Technology Forensics', u.id, 150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GSC-LA21801545', 'Laboratory bottle screwcap clear 1L (Blue CAP ) Schott', 'West Technology Forensics', u.id, 340.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GTH-DRB030', 'Dropping Bottle Brown 30 mL. (ขวดสีชาพร้อมหลอดหยด ขนาด 30 mL.)', 'West Technology Forensics', u.id, 15.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GTH-DRB060', 'Dropping Bottle Brown, 60 mL. (ขวดแก้วสีชา พร้อมหลอดหยด 60 mL.)', 'West Technology Forensics', u.id, 16.05, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GTH-ST060-08-1', 'STIRRING ROD 6 MM X 8  20 CM.', 'West Technology Forensics', u.id, 50.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LPP18 08 0913', '18mm PE Snap Cap, 19.8x5.2mm, trans, closed top, 100/pk', 'West Technology Forensics', u.id, 117.7, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LPP18 08 0913 -1', '18mm PE Snap Cap, 19.8x5.2mm, trans, closed top, 1ea', 'West Technology Forensics', u.id, 1.2, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LPP18 09 0907', '10ml Snap Cap Vial ND18, 50x22mm, clear glass, 3rd hydrolytic class, 100/pk ขวดเก็บวัตถุระเบิด', 'West Technology Forensics', u.id, 535.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LPP18 09 0907 -1', '10ml Snap Cap Vial ND18, 50x22mm, clear glass, 3rd hydrolytic class, 1ea ขวดเก็บวัตถุระเบิด', 'West Technology Forensics', u.id, 5.35, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PK-GS-C5SG-184-100ML', 'ขวดแก้วใส่ ขนาด 100ML พร้อมจุก NO-5SG-184 ฝา', 'West Technology Forensics', u.id, 3.48, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PK-TN-0385', 'ถัง 20 ลิตร ทรงเหลี่ยม สีขาวใส-ฝาสีขาว', 'West Technology Forensics', u.id, 146.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PP-PE40-60IN', 'ถุงเย็น PE 40x60 inch', 'West Technology Forensics', u.id, 130.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'R585-C', 'กล่องพลาสติกใส 20x6cm ทริปเปิ้ลทรี ความจุ 19 ลิตร', 'West Technology Forensics', u.id, 67.29, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SAIL-COVER', 'กระจกปิดสไลด์ Cover Glass18x18 mm. 100pc/box (Sail,China)', 'West Technology Forensics', u.id, 34.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0112', 'Dropper Glass Size 9"" (250 ea/box)', 'West Technology Forensics', u.id, 450.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0160', 'ขวดพลาสติกแบบสเปรย์ ขนาด 150 mL.', 'West Technology Forensics', u.id, 17.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0197', 'ขวดสีชา ใหญ่ 200 ml', 'West Technology Forensics', u.id, 20.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0232', 'ขวดพลาสติกขาว พร้อมฝาดำ G.P. 135 cc', 'West Technology Forensics', u.id, 15.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0341', 'ขวดเก็บปัสสาวะ ฝาเหลือง', 'West Technology Forensics', u.id, 1.6, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0454', 'กระปุกเจล 100g ขวดใส ฝาใส สูง 5 ซม เส้นผ่าศูนย์กลาง 6 ซม', 'West Technology Forensics', u.id, 4.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'กระปุก' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0455', 'ขวดรูปชมพู่ใส ฝาสเปรย์ 250ml', 'West Technology Forensics', u.id, 17.12, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'V0201100', 'Vial Glass (clear) 8mm. Screw Cap, 2 mL.', 'West Technology Forensics', u.id, 3.34, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP PE 15X22', 'ถุงซิปพลาสติก กันไฟฟ้าสถิตย์ ขนาด 15X22 ซม', 'West Technology Forensics', u.id, 374.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP PE 8-12', 'ถุงซิปพลาสติก กันไฟฟ้าสถิตย์ ขนาด 8x12 ซม', 'West Technology Forensics', u.id, 374.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP TAB 10X15 CM', 'ถุงพลาสติกใส มีซิป คาดขาว ขนาด 10x15cm', 'West Technology Forensics', u.id, 160.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP TAB 15X23 CM', 'ถุงพลาสติกใส มีซิป คาดขาว ขนาด 15X23 cm', 'West Technology Forensics', u.id, 160.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP TAB 8X12 CM', 'ถุงพลาสติกใส มีซิป คาดขาว ขนาด 8x12cm', 'West Technology Forensics', u.id, 150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP10-15CM', 'ถุงซิป ขนาด 10ซม x 15ซม', 'West Technology Forensics', u.id, 160.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP12-17CM', 'ถุงซิป ขนาด 12ซม x 17ซม', 'West Technology Forensics', u.id, 145.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP15-23CM', 'ถุงซิป ขนาด 15ซม x 23ซม', 'West Technology Forensics', u.id, 120.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP20-30CM', 'ถุงซิป ขนาด 20ซม x 30ซม', 'West Technology Forensics', u.id, 280.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP23-35CM', 'ถุงซิป ขนาด 23ซม x 35ซม', 'West Technology Forensics', u.id, 162.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP25-38CM', 'ถุงซิป ขนาด 25ซม x 38ซม', 'West Technology Forensics', u.id, 150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP30-46CM', 'ถุงซิป ขนาด 30ซม x 46ซม', 'West Technology Forensics', u.id, 130.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP4-6CM', 'ถุงซิป ขนาด 4ซม x 6ซม', 'West Technology Forensics', u.id, 120.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP6-8CM', 'ถุงซิป ขนาด 6ซม x 8ซม', 'West Technology Forensics', u.id, 120.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP8-12CM', 'ถุงซิป ขนาด 8ซม x 12ซม', 'West Technology Forensics', u.id, 145.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP9-13CM', 'ถุงซิป ขนาด 9ซม x 13ซม', 'West Technology Forensics', u.id, 150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZIP-SC-010-3040', 'ถุงพลาสติกซิปล๊อคพิมพ์โลโก้ ขนาด 30x40 cm', 'West Technology Forensics', u.id, 1300.74, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00052', '25776.59', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '236305.95' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PG-MAGNET WILNESS1', 'โปรแกรมตรวจพิสูจน์กล้องวงจรปิด แบบที่ 1 - Magnet Wilness', 'West Technology Forensics', u.id, 1300000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'LICENSE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PG-MAGNETAXIOM3', 'โปแกรมตรวจพิสูจน์หลักฐานคอมพิวเตอร์ แบบที่ 3 Magnet AXIOM', 'West Technology Forensics', u.id, 650000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'LICENSE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00053', '1950000', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '1950000' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AL-BT-001-70-450CC', 'แอลกอฮอล์ 70%, 450cc. ศิริบัญชา (Ethylalcohol)', 'West Technology Forensics', u.id, 45.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'COT-C-200G', 'สำลีม้วนตรารถพยาบาล 200กรัม', 'West Technology Forensics', u.id, 65.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ROLL' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'COT-CG-100', 'สำลีก้าน ตรา รถพยาบาล 100 ก้าน', 'West Technology Forensics', u.id, 19.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'COT-CG-100-BIG', 'สำลีก้าน ตรา รถพยาบาล 100 ก้าน หัวใหญ่', 'West Technology Forensics', u.id, 20.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CT611V1S', 'สำลีพันไม้ปลอดเชื้อ 6""Size S (100 อัน/กล่อง) V1', 'West Technology Forensics', u.id, 150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GAUZE 3X3 12PLY', 'GAUZE pad 3X3in 12PLY', 'West Technology Forensics', u.id, 190.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GAUZE 4X4 12PLY', 'GAUZE pad 4X4in 12PLY', 'West Technology Forensics', u.id, 332.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OCH-T6-8X', 'น้ำมันระกำ คุณภาพเกรด A ขนาดบรรจุ 1000 ML (Methyl Salicylate)', 'West Technology Forensics', u.id, 315.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S611S', 'สำลีพันไม้ปลอดเชื้อ 6""Size S (100 อัน/กล่อง)', 'West Technology Forensics', u.id, 150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0017', 'หน้ากากอนามัย 3 ชั้น ยี่ห้อ DURA (50 ชิ้น/กล่อง)', 'West Technology Forensics', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00054', '1287.7', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '215613.9' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0003300500', 'Aniline 99.5%, AR,500 ml, LOBA#0003300500', 'West Technology Forensics', u.id, 1180.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '00071-100ML', 'Acetaldehyde, Reagentplus, 99.0%, 100 mL.', 'West Technology Forensics', u.id, 1620.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0223-0301', 'VertiClean Nylon Syringe Filters 25mm 0.45um, 100/PK', 'West Technology Forensics', u.id, 2247.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0457600100', 'Mercury iodide red solid 99% AR/ACS 100g PL Loba CAS:7774-29-0 [RT] DIW 3', 'West Technology Forensics', u.id, 1650.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0480500010', 'N-1-Naphthyl ethylene diamine dihydrochloride  AR/ACS 10G  (LOBA)', 'West Technology Forensics', u.id, 1700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '100997.2500', '1-Propanol for analysis EMSURE ACS Reag Ph Eur Merck 2.5L', 'West Technology Forensics', u.id, 8940.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '101097.5000', 'Aluminium Oxide 90 Standa 5 Kg. for Column Chromatogr', 'West Technology Forensics', u.id, 4500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '104391.4000', 'n-Hexane for liquld chromatography LIChrosolv R 4L', 'West Technology Forensics', u.id, 3200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '10-TH56-03', 'Hexane 18L (13 kg)(TX-101)น้ำหนักรวมปี๊ป commercial', 'West Technology Forensics', u.id, 1200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ปี๊บ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '152025.0001', 'Chromolith HighResolutio 1Kit 5-4.6 Guard Kit', 'West Technology Forensics', u.id, 8500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '152032.0001', 'Chromolith(r) guard 1 pc holder 5-4.6mm', 'West Technology Forensics', u.id, 12000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1791-5KG', 'โซเดียม ไฮโปคลอไรท์ 10% Sodium Hypochlorite 10% 5ลิตร', 'West Technology Forensics', u.id, 291.43, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '221473-500G', 'Potassium hydroxide ACS reagent 85% pellets 500g', 'West Technology Forensics', u.id, 2660.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '237329-50G', '1-Chioro 2,4-dinitrobenzene 99% 50g', 'West Technology Forensics', u.id, 6870.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '398128-50G', 'Ammonium matavanadate ACS reagent 99.0% 50g', 'West Technology Forensics', u.id, 4400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '51474-250ML', 'Phosphorus Standard for AAS', 'West Technology Forensics', u.id, 2720.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '5190-8544', 'Tin 1000 ug/ml 500ml', 'West Technology Forensics', u.id, 5203.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '9300-0311', 'Snoop Check Leak Detector ขนาด 8 oz.', 'West Technology Forensics', u.id, 599.2, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A456-4_K', 'Methanol, Optima LC/MS grade, 4L, GL (Fisher Chemical) CAS:67-56-1 [RT]', 'West Technology Forensics', u.id, 2400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A955-4_K', 'Acetonitrile Optima LC/MS grade 4L GL Fisher chemical CAS:75-05-8 RT', 'West Technology Forensics', u.id, 3000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ACR-150741000', 'Diphenylamine, 99%, pure CAS 122-39-4 100 g', 'West Technology Forensics', u.id, 2560.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ACR-193501000', 'Mercury(II) iodide, ACS reagent, red CAS 7774-29-0  100 g', 'West Technology Forensics', u.id, 5530.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ACR-229650250', 'Eosin B pure high purity biological stain 25g CAS 548-24-3', 'West Technology Forensics', u.id, 2150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ACR-350851000', 'Diphenhydramine hydrochlorlde 99% 100gr', 'West Technology Forensics', u.id, 3100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ACR-447261000', 'Ammonium metavanadate, ACS reagent(100 g)', 'West Technology Forensics', u.id, 2970.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AJA-G1400-0100', 'Grease high vacuum', 'West Technology Forensics', u.id, 1050.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ALF-043283.LV', 'n-Hexadecane 95% CAS 544-76-3', 'West Technology Forensics', u.id, 9900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ALF-B23460.18', 'Cobalt (II) thiocyanate 98+% CAS 3017-60-5  50g', 'West Technology Forensics', u.id, 11880.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B0394-1KG', 'Botic acid 1KG', 'West Technology Forensics', u.id, 9160.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B0394-500G', 'Boric acid 500g', 'West Technology Forensics', u.id, 4450.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'C472057', 'Potassium Hydroxide pellets RPE 1000g', 'West Technology Forensics', u.id, 460.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'C472087', 'di-Potassium Hydrogen Phosphate Anh. RPE-ACS 1000g,', 'West Technology Forensics', u.id, 1690.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-AN001', 'P151156 Aniline (Phenylamine) 99% 1L Lab(Panreac)', 'West Technology Forensics', u.id, 2000.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-BA002-2', 'Barium Chloride 2 Hydrate 500GM AR (KEMAUS)', 'West Technology Forensics', u.id, 400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-CO011-1', 'KA168 Copper (II) Chloride 2 Hydrate 500 GM,AR', 'West Technology Forensics', u.id, 1260.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-ET002-1', 'KA212 ETHYL ACETATE 2.5 L,AR (CHEMOS)', 'West Technology Forensics', u.id, 856.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-HA154', 'Hydrogen Peroxide30% 2.5 LT, AR(Chem-supply)', 'West Technology Forensics', u.id, 1900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-HE004', 'N-Hexane 95% 2.5 L,AR (AJAX)', 'West Technology Forensics', u.id, 1540.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-HE004-1', 'KS2058 N-HEXANE 99 % 2.5 L,AR (KEMAUS)', 'West Technology Forensics', u.id, 1100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-ME004', '313 Mercuric Iodide RED', 'West Technology Forensics', u.id, 1650.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-ME020-1-2', 'KA1137-2 METHYLENE BLUE 100 GM,LAB ( KEMAUS )', 'West Technology Forensics', u.id, 1150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-NA002-1', 'N-1 (Naphthyl) -Ethylenediamine-Dihydrochloride 5 GM AR (Panreac)/Spai', 'West Technology Forensics', u.id, 1800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-PO024-2', 'Potassium Hydroxide Pellets 1 KG AR (Kemaus)', 'West Technology Forensics', u.id, 420.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-PO024-3', 'Potassium Hydroxide Pellets 1 KG AR (Kemaus)', 'West Technology Forensics', u.id, 400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-PO027-01', 'KA409 Potassium Iodied 500 GM AR', 'West Technology Forensics', u.id, 1870.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-PO029', 'Potassium Nitrate 500g. GM, AR Grade ""AJAX', 'West Technology Forensics', u.id, 420.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-PR001-1', 'KA424 1-propanol (N-propanol) 2.5 L AR  (KEMAUS)', 'West Technology Forensics', u.id, 990.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-PR002-1', '2-Propanol 2.5 LT(Isopropyl Alcohol),AR(KEMAUS)', 'West Technology Forensics', u.id, 720.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-SI007-1', 'Silver nitrate 25gm (POCH)', 'West Technology Forensics', u.id, 2000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-SU004-1', 'Sulphanilic Acid 100 GM AR (Kemaus)', 'West Technology Forensics', u.id, 600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAJ-ZI005-1', 'KAI687 ZINC CHLORIDE ANHYDROUS 500 GM,AR (KEMAUS)', 'West Technology Forensics', u.id, 470.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CCO-AC-TO01-1', 'Acetone 99.5% 15 KG Japan (COM.GRADE)', 'West Technology Forensics', u.id, 1200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'GALLON' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CCO-DI001-M1', 'Distill Water 20L น้ำกลั้นพร้อมถังสีขาว', 'West Technology Forensics', u.id, 300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'GALLON' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CDJ-CO-001', '2585-4405 COPPER(II)CHLORIDE DIHYDRATE 500GM,EXRA PURE(DAEJUNG)', 'West Technology Forensics', u.id, 700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CGC10-125ML', 'Carbon for ICP Standard 10000ppm 125ml', 'West Technology Forensics', u.id, 4700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CHM.L0404100025', 'Loba Chemie? 1-HEPTANE SULPHONIC ACID , SODIUM SALT ANHYDROUS 99%, 25 กรัม.', 'West Technology Forensics', u.id, 5685.98, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CH-PL032', 'Polyvinyl alcohol (P,V,A,) Lab grade 500g ยี่ห้อ Chem supply', 'West Technology Forensics', u.id, 950.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CKE-TR-001', 'KA348 2 2 4 - Trimethylpentane 2.5L (Kemaus)', 'West Technology Forensics', u.id, 2100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CLA-AC005-2', 'LC1005 Acetonitrile 2.5 LT HPLC (RCT-Labscan)', 'West Technology Forensics', u.id, 1400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CLA-AC005-3', 'ACETIONITRILE 2.5 LT,AR (RCI LABSCAN)', 'West Technology Forensics', u.id, 960.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CLA-AC008-2', 'LC1003-2.5g Acetone 2.5 L HPLC (RCI-Labscan)', 'West Technology Forensics', u.id, 980.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CLA-CH003-2', 'Chloroform 2.5 LT,AR (RCI LABSCAN)', 'West Technology Forensics', u.id, 802.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CLA-HE004-1', 'Hexanes 95%, 2.5L, LT,AR ""RCI Labscan', 'West Technology Forensics', u.id, 984.4, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CLA-HE009-1', 'Hexanes 99%, 2.5L, LT,HPLC ""RCI Labscan', 'West Technology Forensics', u.id, 1180.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CLA-LC1380', 'LC1380 ETHANOL ABSOLUTE HPLC 2.5 LT', 'West Technology Forensics', u.id, 1270.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CLA-ME001-2', 'Methanol 2.5L, LT,HPLC ""RCI Labscan', 'West Technology Forensics', u.id, 695.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CLA-SI001-1', 'AR1246-P25G SILVER NITRATE AR 25GM (RCI LABSCAN)', 'West Technology Forensics', u.id, 1650.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CLA-TO001-1', 'Toluene 2.5 L,AR (RCI LABSCAN)', 'West Technology Forensics', u.id, 992.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CME-AC003', '100063.2500 Acetic Acid 100%, 2.5L ""MERCK', 'West Technology Forensics', u.id, 900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CME-AC005', 'Acetone 2.5L (AR Grade), ""MERCK', 'West Technology Forensics', u.id, 759.7, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CME-AM006-1', '105432.2511 AMMONIA SOLUTION 25% 2.5 L  AR(MERCK)', 'West Technology Forensics', u.id, 660.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CME-CR003', '809691.0500 m-Cresol 500ML SYN (MERCK)', 'West Technology Forensics', u.id, 2450.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CME-ET001', 'Ethanol Absolute 2.5Lt. AR Grade ""MERCK', 'West Technology Forensics', u.id, 1016.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CME-ET005', 'Ethyl acetate 2.5Lt. AR Grade ""MERCK', 'West Technology Forensics', u.id, 2200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CME-HE004', 'N-Hexane 2.5 LT MERCK 104367.2500', 'West Technology Forensics', u.id, 2600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CME-ME014', 'Methanol 2.5Lt. AR Grade ""MERCK', 'West Technology Forensics', u.id, 750.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CME-ME016', 'Methamnol 2.5 LT HPLC (Merck)', 'West Technology Forensics', u.id, 1250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CME-NI006', '100456.2500 Nitric Acid 65%, 2.5L, AR Grade (MERCK)', 'West Technology Forensics', u.id, 790.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CME-SU009', 'Sulfuric acid 95-97%, 2.5L. AR Grade ""MERCK', 'West Technology Forensics', u.id, 660.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CQR-A108444001', 'A1084-4-4001 ACETONE 4 L IIPLC', 'West Technology Forensics', u.id, 1270.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CQR-A502312501', 'Ammonia Solution 28% 2.5L AR ขวดแก้ว (Q-REC/NEWZELAND)', 'West Technology Forensics', u.id, 400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CQR-C505710500', 'C5057-1-0500 COPPER (II) CHLORIDE 2 HYDRATE 500 G AR (Q-REC/NEWZELAND)', 'West Technology Forensics', u.id, 730.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CQR-E702512502', 'E7025-1-2501 Ethanol Absolute 99.9% 2.5L AR 2.5L (Q-REC NEWZELAND)', 'West Technology Forensics', u.id, 700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CQR-E710012501', 'Ethyl acetate 2.5 L AR ขวดแก้ว Q-Rec/Newzeland', 'West Technology Forensics', u.id, 660.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CQR-N305712501', 'N3057-1-2501 N-Hexane 99% 2.5 L AR (Q-REC NEWZELAND)', 'West Technology Forensics', u.id, 860.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CQR-N311512501', 'N3115-1-2501 Nitric Acid 65% 2.5 L AR (Q-REC NEWZELAND)', 'West Technology Forensics', u.id, 440.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CQR-P516801000', 'Potassium hydroxide,Soultion0.5 MOL/L 1L  (Q-REC/Newzeland)', 'West Technology Forensics', u.id, 550.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CQR-S305210101', 'S3052-1-0101 Silver nitrate 100 GM AR (Q-Rec/Newzeland)', 'West Technology Forensics', u.id, 4650.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CQR-S528110500', 'Sodium Sulfate Anhydrous AR 500 GM (Q-REC/Newzeland)', 'West Technology Forensics', u.id, 350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CQR-T503112501', 'T5031-1-2501 TOLUENE 2.5 LT AR (Q-REC/NEWZELAND)', 'West Technology Forensics', u.id, 660.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CUSIL1M6', 'Clean-Up Silica Acid Washed 1000mg 6mL 30box', 'West Technology Forensics', u.id, 3600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'D3630-100G', 'Diphenhydramine HCL, 100g.', 'West Technology Forensics', u.id, 6770.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DAE-2585-4405', 'Copper(II) chloride 2H2O Extra Pure10125-13-0', 'West Technology Forensics', u.id, 630.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DAE-5578-4140', 'Methylene blue 100gm 7220-79-3', 'West Technology Forensics', u.id, 930.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCM2401', 'Lauryl Sulfate Broth, 500 g', 'West Technology Forensics', u.id, 1070.18, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DT-S-WH-1KG', 'Dental Stone เดนทัลสโตน 1 กิโล สีขาว (ปูนทันตกรรม)', 'West Technology Forensics', u.id, 60.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'F7253.0025', 'Fast Black K salt Sigma 25g', 'West Technology Forensics', u.id, 1670.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FG-A-998-004', 'L PURE 99.8 (อื่น ๆ ) :- ถัง 18 ลิตร', 'West Technology Forensics', u.id, 1775.7, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FIS-A/0080/08', 'Acetaldehyde extra pure SLR 500ml', 'West Technology Forensics', u.id, 1300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FIS-E/0903/17', 'Ethyl acetate 99.8+% for residue analysis Distol 2.5L', 'West Technology Forensics', u.id, 1800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FIS-M/4056/17', 'Methanol for HPLC Cas 67-56-1 2.5 L', 'West Technology Forensics', u.id, 370.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FIS-P/77500/17', 'Isopropanol 99.8% for analysis (2-propanol) 2.5L', 'West Technology Forensics', u.id, 500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FIS-S/1280/48', 'Silver nitrate for analysisCas 7761-88-8 100g', 'West Technology Forensics', u.id, 3200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'G0259-1G', 'D-Glucosaminic acid ?98% 1 g (Sigma-Aldrich)', 'West Technology Forensics', u.id, 13630.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'G6691A', 'ADM Flow Meter', 'West Technology Forensics', u.id, 31482.71, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'H0377-100MG', 'DL-5-Hydroxylysine hydrochloride, 100 mg (Sigma-Aldrich)', 'West Technology Forensics', u.id, 3710.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'H9523-100MG', 'Serotonin hydrochloride-powder, 100 Mg (Sigma-aldrich)  5-Hydroxytryptamine Hydro chloride', 'West Technology Forensics', u.id, 8890.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HFE-7100', 'HFE Carrier solvent ขนาด 15 ลิตร', 'West Technology Forensics', u.id, 45500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ถัง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HFE-7100-20', 'HFE Carrier solvent ขนาด 20 ลิตร', 'West Technology Forensics', u.id, 63000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ถัง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HIM-RM7003-0025', 'Fast blue B salt HI-MEDIA RM7003', 'West Technology Forensics', u.id, 700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ISO-OCTANE140', 'ISO-OCTANE140 kgs/DR', 'West Technology Forensics', u.id, 88450.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'DR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'N6877-5G', 'L-Norleucine ?98% (TLC) 5 g  (Sigma-Aldrich)', 'West Technology Forensics', u.id, 12530.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NI-05-20', 'Nitric acid 5 %  20 ml', 'West Technology Forensics', u.id, 50.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OCH-T6-10X', 'น้ำมันก๊าดแท้ (Kerosene)', 'West Technology Forensics', u.id, 325.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OCH-T6-9X', 'Ocean ทินเนอร์ 3A น้ำมันสน กอฮอร์ ทินเนอร์อะคริลิค โอเชี่ยน ขนาด 1 แกลลอน น้ำมันผสมสีเคลือบ ทินเนอร์ล้างแปรง ขนาดแกลลอน', 'West Technology Forensics', u.id, 197.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OIL-SONAX200ML', 'Sonax น้ำมันครอบจักรวาล / น้ำมันอเนกประสงค์  200   ML ไล่สนิม ขจัดความชื้น โซแนกซ์', 'West Technology Forensics', u.id, 92.17, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OIL-SONAX300ML', 'Sonax น้ำมันครอบจักรวาล / น้ำมันอเนกประสงค์  300   ML ไล่สนิม ขจัดความชื้น โซแนกซ์', 'West Technology Forensics', u.id, 135.51, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PHXKS0-8909', 'roQ? QuEChERS Extraction Full Kit 4.0g MgSO4 1.0gNaCl 1.0g SCTD 0.5g SCDS 50/pkg', 'West Technology Forensics', u.id, 7225.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PHXKS0-9506', 'roQ? QuEChERS dSPE Kit - 2mL CT150mg MgSO4 25mg PSA 7.5mg GCB 100/pkg', 'West Technology Forensics', u.id, 6715.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PS-1KG', 'ปูนปลาสเตอร์ 1 กิโลกรัม', 'West Technology Forensics', u.id, 14.02, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'QR-A1084-1-2500', 'Acetone (ขวด PE) AR grade 2.5 ลิตร ยี่ห้อ Qrec Newzealand', 'West Technology Forensics', u.id, 650.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'QR-BU103-1-2501', '1-Butanol (N-Butyl alcohol) AR grade 2.5L ยี่ห้อ Qrec Newzealand', 'West Technology Forensics', u.id, 1200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'REV-0001', 'roQ? QuEChERS dSPE Kit -2mL CT150mg MgSO4  25mg PSA 100/Pkg (PHXKS0-9503)', 'West Technology Forensics', u.id, 6120.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'REV-0001-PHXKS0-9505', 'roQ? QuEChERS dSPE Kit -2mL CT150mg MgSO4  25mg PSA 2.5mg GCB 100/pkg (PHXKS0-9505)', 'West Technology Forensics', u.id, 6375.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'S3-SM060', '(# TP1000) ExcelTaq Taq DNA Polymerase 5 U/ul 500 U', 'West Technology Forensics', u.id, 1057.3, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-247006-500G', '5-Sulfosalicylic acid dihydrate ACS reagent >=99% Sigma-Aldrich', 'West Technology Forensics', u.id, 13400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOLT' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-33220-10G-F', 'Cadaverine dihydrochloride 99.0% (AT) ""Sigma-Aldrich"" 10 G', 'West Technology Forensics', u.id, 8890.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-436143-100G', 'Sodium dodecyl sulfate ACS reagent >=99.0% Sigma-Aldrich 100G', 'West Technology Forensics', u.id, 9810.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-79760-5G', 'Phthaldialdehyde for fluorescence, ?99.0% (HPLC) ""Sigma-Aldrich"" 5G', 'West Technology Forensics', u.id, 33870.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-85578-5G', 'Spermidine trihydrochloride BioXtra, 99.5% (AT) Sigma-Aldrich 5G', 'West Technology Forensics', u.id, 10830.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-A7127-5G', 'Agmatine sulfate salt 97% (TLC) powder ion channel blocker ""Sigma-Aldrich"" 5G', 'West Technology Forensics', u.id, 11670.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-B0394-500G', 'Boric acid ACS reagent, >=99.5% ""Sigma-Aldrich"" 500G', 'West Technology Forensics', u.id, 4290.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-B4184-100ML', 'Brij L23 solution 30 % (w/v) in H2O ""Sigma-Aldrich"" 100ML', 'West Technology Forensics', u.id, 3800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-H7250-5G', 'Histamine dihydrochloride >=99% (TLC), powder ""Sigma-Aldrich"" 5G', 'West Technology Forensics', u.id, 3600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-H9523-100MG', 'Serotonin hydrochloride powder ""Sigma-Aldrich"" 100MG', 'West Technology Forensics', u.id, 8560.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-M1753-100ML', '1-Thioglycerol >=97% ""Sigma-Aldrich"" 100ML', 'West Technology Forensics', u.id, 8850.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-N6877-5G', 'L-Norleucine 98% (TLC) Sigma-Aldrich 5G', 'West Technology Forensics', u.id, 13090.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-O8380-100G', '1-Octanesulfonic acid sodium salt ~98% ""Sigma-Aldrich"" 100G', 'West Technology Forensics', u.id, 20200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-P5780-5G', 'Putrescine dihydrochloride powder BioReagent suitable for cell culture ""Sigma-Aldrich"" 5G', 'West Technology Forensics', u.id, 1930.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-V7754-4MG', 'V5 Peptide 97% (HPLC) lyophilized powder Sigma-Alddrich 4MG', 'West Technology Forensics', u.id, 15840.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SRF0.2-13MM-1000', '13mm 0.22um Nylon Syringe Filter membrane', 'West Technology Forensics', u.id, 370.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'กระปุก' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0120-1', 'แอลกอฮอล์ 70%, 450 ml. แอลซอฟท์ (Ethylalcohol)', 'West Technology Forensics', u.id, 30.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0344', 'น้ำกลั่น 5ml 1x50amps ยี่ห้อ Amanta', 'West Technology Forensics', u.id, 150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0391', 'น้ำมันก๊าด 240cc', 'West Technology Forensics', u.id, 17.07, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T0625-25G', 'TAURINE SYNTHETIC >=99%', 'West Technology Forensics', u.id, 2640.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TNL1345', 'Syringe Filter Nylon 13mm. Size 0, 45um, 100 ea/box', 'West Technology Forensics', u.id, 483.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'V1104-100G', 'Vanillin Reagentplus 99%', 'West Technology Forensics', u.id, 3100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'W6-4_K', 'Water Optima LC/MS grade 4L GL Fisher chemical CAS:7732-18-5 RT', 'West Technology Forensics', u.id, 1400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WD-40-360', 'น้ำมันอเนกประสงค์ หล่อลื่น ไล่ความชื่น และป้องกันสนิม สีใส ไม่มีกลิ่นฉุ่น ขนาด360ml', 'West Technology Forensics', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00055', '701730.23', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '1032481.25' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'UNI-T UTP1306', 'เพาเวอร์ซัพพลาย ดิจิตอล เครื่องจ่ายไฟ 32V 6A เครื่องควบคุมแรงดันไฟฟ้า Switching DC Power Supply 1306S', 'West Technology Forensics', u.id, 2200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00056', '2200', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '2200' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '07-1000-04', 'CL151B แว่นตานิรภัยเลนส์ใส กรอบน้ำเงิน', 'West Technology Forensics', u.id, 80.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1006194', 'แว่นครอบตา V-MAXX', 'West Technology Forensics', u.id, 190.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '10SNSANP-9-NS-Y', 'หมวกนิรภัย SYNOS สีเหลือง ปรับหมุน 6 จุดพร้อมสายรัดคาง', 'West Technology Forensics', u.id, 175.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ใบ' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '21417290', 'ถุงมือผ้าถัก 700g Savepak ขอบแดง', 'West Technology Forensics', u.id, 9.92, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '21SNSTK-763A#L', 'ถุงมือ cut 5 ฝ่ามือเคลือบไนไตร สีดำ เบอร์ 8/L', 'West Technology Forensics', u.id, 106.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '29KSSKV20#10', 'รองเท้าบู๊ทหัวเหล็กและพื้นเหล็ก KINGS รุ่น KV20 เบอร์ 10', 'West Technology Forensics', u.id, 685.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '29KSSKV20#5', 'รองเท้าบู๊ทหัวเหล็กและพื้นเหล็ก KINGs รุ่น KV20 เบอร์ 5', 'West Technology Forensics', u.id, 685.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '29KSSKV20#6', 'รองเท้าบู๊ทหัวเหล็กและพื้นเหล็ก KINGs รุ่น KV20 เบอร์ 6', 'West Technology Forensics', u.id, 685.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '29KSSKV20#7', 'รองเท้าบู๊ทหัวเหล็กและพื้นเหล็ก KINGs รุ่น KV20 เบอร์ 7', 'West Technology Forensics', u.id, 685.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '29KSSKV20#8', 'รองเท้าบู๊ทหัวเหล็กและพื้นเหล็ก KINGS รุ่น KV20 เบอร์ 8', 'West Technology Forensics', u.id, 685.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '33179', 'Battery EWAVE GB12-7.2 (D12V7.2AhV0)', 'West Technology Forensics', u.id, 480.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '33180', 'Battery EWAVE GB12-7.5 SN12V7.5Ah', 'West Technology Forensics', u.id, 480.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '3M-8210-N95', 'หน้ากากป้องกันสารพิษ N95 ยี่ห้อ 3M รุ่น 8210', 'West Technology Forensics', u.id, 34.75, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6603M9502V+P2', '9502V+P2 หน้ากากกันฝุ่นแบบพับได้ มี  วาล์ว สายคลอ้งศรีษะ', 'West Technology Forensics', u.id, 34.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '66PDG86-CT/2P', 'ผ้าปิดจมูก COTTON 2 ชั้นเสริมเส้นใยกันฝุ่น', 'West Technology Forensics', u.id, 45.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6800-3M', '3M 6800 Full Face Mask ชุดหน้ากากเต็มหน้าพร้อมตลับกรอง6003 ครบชุด', 'West Technology Forensics', u.id, 1549.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '9092626', 'ถุงมือยางธรรมชาติกันความเย็น TOWA 169 2L', 'West Technology Forensics', u.id, 327.1, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0135933', 'Power supply (80+ Platinum) 1200W Asus rog thor 1200p 10y', 'West Technology Forensics', u.id, 12336.45, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BE-SS-BKG-L', 'เข็มขัด Sector seven สีดำ-เขียว Size L', 'West Technology Forensics', u.id, 300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BI-311', 'ชุดกาวน์ทางการแพทย์สีขาว SMS (เว้าหลัง) รุ่น BI-311', 'West Technology Forensics', u.id, 45.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'B-SL-2', 'ซองไฟฉาย เบอร์ 2', 'West Technology Forensics', u.id, 80.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CPE-FREE', 'ชุด CPE สีฟ้า Free size HAKUZO', 'West Technology Forensics', u.id, 18.33, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CV-L-PBLUE', 'ถุงคลุมเท้าพลาสติกสีน้ำเงิน แบบยาว leg cover', 'West Technology Forensics', u.id, 20.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DPT9425', 'Tyvex Barrierman ชุดหมีป้องกันฝุ่น-สารเคมี Size-L', 'West Technology Forensics', u.id, 245.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DUPONT TYVEX_L', 'Tyvex ชุดป้องกันสารเคมี Dupont Size L', 'West Technology Forensics', u.id, 185.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DUPONT TYVEX_M', 'Tyvex ชุดป้องกันสารเคมี Dupont Size M', 'West Technology Forensics', u.id, 185.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DUPONT TYVEX_XL', 'Tyvex ชุดป้องกันสารเคมี Dupont Size XL', 'West Technology Forensics', u.id, 178.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DUPONT TYVEX_XXL', 'Tyvex ชุดป้องกันสารเคมี Dupont Size XXL', 'West Technology Forensics', u.id, 168.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DURA-M3-W50', 'หน้ากากอนามัย ยี่ห้อ Dura 3 ชั้น สีขาว', 'West Technology Forensics', u.id, 150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EA901-G3A', 'UPS 1K Single phase model with true-online double conversion technology 12v 7 Ah 3 pcs power 1000 va/900 watt', 'West Technology Forensics', u.id, 15500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EA902PSBT', 'UPS 2KVa 1800 W Single-phase models with on-line double conversion techmology 12V 7Ah 6pcs power', 'West Technology Forensics', u.id, 29500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ECO II-1000-LCD', 'เครื่องสำรองไฟ รุ่น ECO II-1000-LCD Blacy2y', 'West Technology Forensics', u.id, 2607.48, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ECO II-1000-LED', 'เครื่องสำรองไฟ รุ่น ECO II-1000-LED', 'West Technology Forensics', u.id, 2100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ET-SA1520', 'ล้อเก็บสายไฟ 4 ช่อง 3600 วัตต์ 20 M', 'West Technology Forensics', u.id, 1485.98, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FBCW-DURA-100', 'หมวกคลุมผม สีขาว White Dura 100 ชิ้นต่อห่อ', 'West Technology Forensics', u.id, 110.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FBCW-DURA-50', 'หมวกคลุมผม สีขาว White Dura 50 ชิ้นต่อห่อ', 'West Technology Forensics', u.id, 85.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FSHPEB', 'ถุงคลุมเท้า สีฟ้า พลาสติก CPE สีฟ้า', 'West Technology Forensics', u.id, 2.59, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GL-7080012', 'ถุงมือยางสังเคราะห์ไนไตร สีฟ้า  ขนาด XL  4.5 กรัม', 'West Technology Forensics', u.id, 99.07, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GL-NT-SR-VO-XS', 'ถุงมือไนไตร แบบไร้แป้ง ผิวหยาบ ขนาด XS สีม่วง', 'West Technology Forensics', u.id, 250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GLOVE_SRI TRANG_BLUE_L', 'Sri Trang ""L"" blue สีฟ้า (50 คู่/กล่อง) Examination Latex Nitrile Glove Powdered  FIDS', 'West Technology Forensics', u.id, 343.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GLOVE_SRI TRANG_BLUE_M', 'Sri Trang ""M"" blue สีฟ้า (50 คู่/กล่อง)  Examination Latex Nitrile Glove Powdered', 'West Technology Forensics', u.id, 509.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GLOVE_SRI TRANG_BLUE_S', 'Sri Trang ""s"" blue สีฟ้า (50 คู่/กล่อง)  Examination Latex Nitrile Glove Powdered', 'West Technology Forensics', u.id, 509.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GLOVE_SRI TRANG_VL_L', 'Sri Trang ""L""Violet สีม่วง (50 คู่/กล่อง)  Examination Latex Nitrile Glove Powdered', 'West Technology Forensics', u.id, 122.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GLOVE_SRI TRANG_WHITE_L', 'Sri Trang Examination Latex Glove White ""L"" (50 คู่/กล่อง) แบบไม่มีแป้ง', 'West Technology Forensics', u.id, 166.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GLOVE_SRI TRANG_WHITE_M', 'Sri Trang Examination Latex Glove White ""M"" (50 คู่/กล่อง)', 'West Technology Forensics', u.id, 160.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GLOVE_SRI TRANG_WHITE_S', 'Sri Trang Examination Latex Glove White ""S"" (50 คู่/กล่อง)', 'West Technology Forensics', u.id, 176.55, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GLOVE-NT100R-BL-XL', 'ถุงมือยางสังเคราะห์ไนไตรสีฟ้า ขนาด XL', 'West Technology Forensics', u.id, 96.26, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GNTBLBOL0001', 'Nitrile Glove (Blue) ""L"" (ถุงมือไนไตร ไซส์ L)', 'West Technology Forensics', u.id, 135.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GNTBLBOM0001', 'Nitrile Glove (Blue) ""M"" (ถุงมือไนไตร ไซส์ M)', 'West Technology Forensics', u.id, 135.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GOG-OR', 'Orange Goggles', 'West Technology Forensics', u.id, 2700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GW-LS-J-L', 'เสื้อกาวน์แขนยาว ปลายแขนจั้ม Size L', 'West Technology Forensics', u.id, 510.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GW-LS-J-M', 'เสื้อกาวน์แขนยาว ปลายแขนจั้ม Size m', 'West Technology Forensics', u.id, 510.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GW-LS-J-XL', 'เสื้อกาวน์แขนยาว ปลายแขนจั้ม Size XL', 'West Technology Forensics', u.id, 510.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HPF-96S32', 'IST รุ่น FIRE RAID ถุงมือดับเพลิงกู้ภัย', 'West Technology Forensics', u.id, 1440.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ICT-1000', 'UPS iPower ICT 1000 VA ICT-1000', 'West Technology Forensics', u.id, 2500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'IPOWER-3T-2Y', 'UPS TWAVE 3K 2y warranty', 'West Technology Forensics', u.id, 18000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'JT5-5M', 'รางปลั๊ก 5 ช่อง 5 สวิตซ์ 5ม.', 'West Technology Forensics', u.id, 842.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LB-2305', 'ถุงคลุมเท้าแบบยาว รุ่น LB-2305 สีขาว', 'West Technology Forensics', u.id, 30.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LB-230S', 'ถุงคลุมเท้าแบบยาวสีขาว YMD รุ่น LB-230S', 'West Technology Forensics', u.id, 39.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'M-CB-50', 'หน้ากากอนามัยคาร์บอน Carbon Face mask (1 กล่อง บรรจุ50ชิ้น)', 'West Technology Forensics', u.id, 145.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PS-2000-2Y', 'Cleanline UPS 2000VA 2y', 'West Technology Forensics', u.id, 10500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PTT-G4V20703', 'หน้ากาก มีรูระบายอากาศ 4 ช่อง', 'West Technology Forensics', u.id, 100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PWB-0001-25000', 'Powerbank 25,000 mHA รุ่น K1 ยี่ห้อ SUNSKY', 'West Technology Forensics', u.id, 2140.19, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SH-SOLOMON', 'รองเท้า solomon', 'West Technology Forensics', u.id, 1650.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SH-SS-BK-F', 'รองเท้า ซัดสัน สีดำ', 'West Technology Forensics', u.id, 1150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SH-V-POLICE-F', 'เสื้อกั๊ก พิสูจน์หลักฐานตำรวจ', 'West Technology Forensics', u.id, 850.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SK-090042', 'สนับเข่า-ศอก 9 mm', 'West Technology Forensics', u.id, 350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0082', 'ถุงมือผ้าอย่างดี (งานจราจร)', 'West Technology Forensics', u.id, 10.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0195', 'ถุงคลุมเท้า ใยสังเคราะห์ (แบบกระดาษ สีฟ้า) (50 คู่/แพค)', 'West Technology Forensics', u.id, 250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0408', 'ถุงมือหนังเชื่อม (ถุงมือกันไฟ)', 'West Technology Forensics', u.id, 95.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PAIR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-1000', 'Cleanline UPS 1kVA 2y', 'West Technology Forensics', u.id, 14600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-1000-3Y', 'Cleanline UPS 1kVA 3y', 'West Technology Forensics', u.id, 15600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-1000-5Y', 'Cleanline UPS 1kVA 5y', 'West Technology Forensics', u.id, 22500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-3000', 'Cleanline UPS 3kVA 2Y', 'West Technology Forensics', u.id, 30000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TE-1000-2Y', 'UPS Model TE-1000; Rated Power 1000VA / 800Watt รับประกัน 2 ปี', 'West Technology Forensics', u.id, 9500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TE-3000-2Y', 'UPS Model TE-3000; Rated Power 3000VA / 2400Watt 2year', 'West Technology Forensics', u.id, 23500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TE-6K-2Y', 'Model TE-6000 ; Rated Power 6000VA / 6000Watt', 'West Technology Forensics', u.id, 58000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TGV01-100', 'แว่นตาครอบนิรภัยเลนส์ใส 3M TGV01-100', 'West Technology Forensics', u.id, 121.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TRS-5.11', 'กางเกงยุทธวิถี 5.11', 'West Technology Forensics', u.id, 1200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TRS-FREE', 'กางเกงยุทธวิธี Free', 'West Technology Forensics', u.id, 950.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TRS-PAVE', 'กางเกงยุทธวิถี ผ้าร่ม PAVE', 'West Technology Forensics', u.id, 850.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TRS-ST7', 'กางเกงยุทธวิถี setor 7', 'West Technology Forensics', u.id, 1300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TS-BG1-BK-1X10-F', 'กางเกง BOGIE.1 TACTICAL สีดา รุ่น IX10', 'West Technology Forensics', u.id, 1150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TY400M', 'ชุด Tyvek 400 Size M', 'West Technology Forensics', u.id, 200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00057', '298733.07', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '2900166.91' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '00F-4496-AC', 'Kinetex 2.6um XB-C18 100A,LC Colum 150X0.3 mm,EA', 'West Technology Forensics', u.id, 25000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '101-2601-6', 'Vernier Caliper 6"" เวอเนีย หรือเกย์วัด', 'West Technology Forensics', u.id, 280.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '106570', 'สก๊อดซ์-ไบรต์ แผ่นใยขัดพร้อมฟองน้ำเล็ก 3x4 นิ้ว', 'West Technology Forensics', u.id, 129.91, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1096', 'เทปใส 3M No.600 24 มม. X 66 ม. แกน 3นิ้ว', 'West Technology Forensics', u.id, 205.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1103378', 'กล่องอเนกประสงค์มีล้อ 75L No.5114 สีขาว', 'West Technology Forensics', u.id, 336.6, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '14-G126-VW-46', 'เสื้อกาวร์ แขนยาวผ้าวาเลนติโน่ M', 'West Technology Forensics', u.id, 436.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '14-G126-VW-48', 'เสื้อกาวร์ แขนยาวผ้าวาเลนติโน่ L', 'West Technology Forensics', u.id, 436.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '14-G126-VW-52', 'เสื้อกาวร์ แขนยาวผ้าวาเลนติโน่ 2XL', 'West Technology Forensics', u.id, 486.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '19JRE8930021', 'ตู้เก็บสารเคมี สีฟ้า 30 แกลลอน', 'West Technology Forensics', u.id, 32560.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '215401', 'ไลปอนเอฟ น้ำยาล้างจาน 10ล', 'West Technology Forensics', u.id, 372.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'GALLON' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '365', 'Cryo Speed Nitrogen Top Up De-War', 'West Technology Forensics', u.id, 79.49, 0, 'STANDARD', true
FROM units u WHERE u.code = 'KG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '5182-0717', 'Cap screw blue PTFE/red silicone septum, 100/pk.', 'West Technology Forensics', u.id, 879.75, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '853576', 'คิเรอิ คิเรอิ โฟมล้างมือ 250 มล.', 'West Technology Forensics', u.id, 60.75, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8850046426218', 'แม็กซ์โม่พิคยัวร์ไซส์ 6 ม้วน', 'West Technology Forensics', u.id, 139.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8850046426218-1', 'แม็กซ์โม่พิคยัวร์ไซส์ 1 ม้วน', 'West Technology Forensics', u.id, 52.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '9013.80.2000', 'Battley disc for fm5 & fm5/L', 'West Technology Forensics', u.id, 5856.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '9913V', '3M :9913V(P1)หน้ากาป้องกันฝุ่นละออง กลิ่นจืดจางไอระเหย', 'West Technology Forensics', u.id, 94.35, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0124782', 'Cable POWER AC (1.8M) TOP TECH 3 รูแบน', 'West Technology Forensics', u.id, 43.93, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0133339', '64GB Flash Drive KINGSTON Data Traveler Exodia (DTX) Black', 'West Technology Forensics', u.id, 115.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AB-08', 'หินเจียรนัยแกน 3 mm. AS-816 (8x16 mm) หัวกลม', 'West Technology Forensics', u.id, 23.54, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AS-816', 'หินเจียรนัยแกน 3 mm. AS-816 (8x16 mm) หัวทรงกรวย', 'West Technology Forensics', u.id, 23.54, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ATM-C-NO.A10', 'สเปรย์แลคเกอร์สำหรับเคลือบเงา HARDWARE ATM สีสเปรย์  สีใสเคลือบเงา (Clear) No.A10 ขนาด270กรัม', 'West Technology Forensics', u.id, 205.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ATX24 XH-M229', 'บอร์ดโมดูลทดสอบพาวเวอร์ซัพพลาย พร้อมเคส', 'West Technology Forensics', u.id, 110.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BA-40', 'OPTIK Handheld Reflectometer model BA-40', 'West Technology Forensics', u.id, 3700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BOX HDD', 'กล่องฮาร์ดิส', 'West Technology Forensics', u.id, 55.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CC-0001', 'กระดานนอน ขนาด 36 นิ้ว รองนอนซ่อมรถ กระดานล้อเลื่อน  รองนอนซ่อมใต้ท้องรถ', 'West Technology Forensics', u.id, 443.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CLA-WA001-2', 'LC1210G Water HPLC 2.5L (RCI Labscan)', 'West Technology Forensics', u.id, 520.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CM-A3-3MM-G', 'แผ่นรองถ่ายวัตถุพยานสีเขียว ขนาด A3 หนา 3mm', 'West Technology Forensics', u.id, 302.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DELI-CS-0001', 'Deli ไขควงไฟฟ้า สว่านไขควงไร้สาย ไขควงไฟฟ้าไร้สาย 3.6V สว่านไฟฟ้า Cordless Screwdriver', 'West Technology Forensics', u.id, 483.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DW20010000', 'Dwyer A-126  Fluoresceiw green color', 'West Technology Forensics', u.id, 640.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EC-PHTEST30', 'Waterproof pH Tester 30 (Eutech)', 'West Technology Forensics', u.id, 3745.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EN-EL14', 'Nikon Battery NIKON EN-EL 14a', 'West Technology Forensics', u.id, 1700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EN-EL15C', 'Nikon Battery EN-EL15C', 'West Technology Forensics', u.id, 2400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ENELOOP 2A', 'ถ่าน ENELOOP 2A (ชาร์จได้) 4 ก้อน/แพค PANASINIC', 'West Technology Forensics', u.id, 500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ENELOOP 3A', 'ถ่าน ENELOOP AAA (ชาร์จได้) 4 ก้อน/แพค PANASINIC', 'West Technology Forensics', u.id, 450.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ENELOOP 3A-2', 'ถ่าน ENELOOP AAA (ชาร์จได้) 2 ก้อน/แพค PANASINIC', 'West Technology Forensics', u.id, 388.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ENELOOP 3A-4', 'ถ่าน ENELOOP AAA (ชาร์จได้) 4 ก้อน/แพค PANASINIC', 'West Technology Forensics', u.id, 173.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ENELOOP-BK-3A-4', 'ถ่าน ENELOOP AAA (ชาร์จได้) 4 ก้อน/แพค BK-4MCCE/2NT', 'West Technology Forensics', u.id, 899.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EPSON-V39II', 'V39II,A4 Flatbed Colour Image Scanner,4,800 4,800 dpi,USB 2.0', 'West Technology Forensics', u.id, 2493.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ETH-ZZ061-1', 'กระดาษเช็ดทำความสะอาด Size 11x21 cm  Kimwipes#34120 (Kimberly-clark)', 'West Technology Forensics', u.id, 12.86, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FE-BLUE-S', 'เสื้อโปโลปักพิสูจน์หลักฐานสีฟ้า ผู้หญิง Size S', 'West Technology Forensics', u.id, 365.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FF-SI402', 'ที่ตักน้ำแข็งด้ามกลาง', 'West Technology Forensics', u.id, 91.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GPR-H20-0014OZ', 'Propane Gases Contents: 14 OZ/EA', 'West Technology Forensics', u.id, 856.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HI-LIGHT-225AU', 'Hi-light/LE HL-225/H-30 22 Aluminum 5 Section Tripod', 'West Technology Forensics', u.id, 2500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HT-0001-GREASE', 'จารบี เทรน HT 0.5กก เนื้อใส จาระบี ทนความร้อน trane super ht', 'West Technology Forensics', u.id, 103.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'IPOWER-2T', 'True On-Line UPS Double Conversion Power Rating 2000VA / 1800W', 'West Technology Forensics', u.id, 20000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K25100', 'Copper Strip Color Standard', 'West Technology Forensics', u.id, 900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'L3250', 'Epson printer set', 'West Technology Forensics', u.id, 5130.84, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LED-T40', 'หลอดไฟ ทรงยาว แบบขุ่น หลอดLEDรุ่นT40 ขนาด 18W แสงขาว ขั้วหลอด E27', 'West Technology Forensics', u.id, 202.75, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MA-BLACK-L', 'เสื้อโปโลปักพิสูจน์หลักฐานสีดำ ผู้ชาย Size L', 'West Technology Forensics', u.id, 200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MA-BLACK-M', 'เสื้อโปโลปักพิสูจน์หลักฐานสีดำ ผู้ชาย Size M', 'West Technology Forensics', u.id, 200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MA-BLACK-XL', 'เสื้อโปโลปักพิสูจน์หลักฐานสีดำ ผู้ชาย Size XL', 'West Technology Forensics', u.id, 200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MA-BLACK-XXL', 'เสื้อโปโลปักพิสูจน์หลักฐานสีดำ ผู้ชาย Size XXL', 'West Technology Forensics', u.id, 200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MA-BLUE-L', 'เสื้อโปโลปักพิสูจน์หลักฐานสีฟ้า ผู้ชาย Size L', 'West Technology Forensics', u.id, 265.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MA-BLUE-M', 'เสื้อโปโลปักพิสูจน์หลักฐานสีฟ้า ผู้ชาย Size M', 'West Technology Forensics', u.id, 265.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MA-BLUE-XL', 'เสื้อโปโลปักพิสูจน์หลักฐานสีฟ้า ผู้ชาย Size XL', 'West Technology Forensics', u.id, 265.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MA-BLUE-XXL', 'เสื้อโปโลปักพิสูจน์หลักฐานสีฟ้า ผู้ชาย Size XXL', 'West Technology Forensics', u.id, 265.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NIKON NC 67MM', 'NIKON NC 67MM', 'West Technology Forensics', u.id, 1290.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OF-TP-1096FO', 'เทปใส 3M No.600 24 มม. X 66 ม. แกน 3นิ้ว', 'West Technology Forensics', u.id, 205.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PA 120 AJ', 'แอร์เคลื่อนที่ เอเจ ขนาด 12,000 BTU รุ่น PA-120', 'West Technology Forensics', u.id, 8900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PAU-3X1.21/2X15-NB', 'แผ่นอลูมิเนียม 3มม x 1 21/2 x 15 ซม พร้อมตอกตัวเลข', 'West Technology Forensics', u.id, 102.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PHILIP-LIGHTING-18W', 'หลอดจินนี่ 18w day Philips', 'West Technology Forensics', u.id, 126.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PN-PM-0002-02F', 'ปากกา Permanent Marker Faber Castell F น้ำเงิน', 'West Technology Forensics', u.id, 41.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PN-PM-0002-03F', 'ปากกา Permanent Marker Faber Castell F แดง', 'West Technology Forensics', u.id, 41.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PP-71-QI-915-ANL ASTM D4294 ED', 'แผ่นพลาสติก 71-QI-915-ANL ASTM D4294 EDX', 'West Technology Forensics', u.id, 1000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PS-1/4X1.21/2X15-NB', 'แผ่นเหล็ก1/4 x 1 21/2 x 15 ซม พร้อมตอกตัวเลข', 'West Technology Forensics', u.id, 102.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PT-0001-GS', 'เสาอากาศวิทยุชนิดโครงสร้างสามเหลี่ยม แบบ Guyed-Support ความสูง 200 ฟุต พร้อมติดตั้ง 1 ชุด', 'West Technology Forensics', u.id, 1387850.47, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PT-0002', 'อุปกรณ์โครงการเพิ่มประสิทธิภาพการควบคุมระยะไกลเพื่อการบริหารจัดการน้ำลุ่มน้ำชี้เขื่อนระบายน้ำ 4 แห่ง', 'West Technology Forensics', u.id, 4037383.17, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'RU-SD85X200', 'Roll Up รุ่นมาตรฐาน 85x200', 'West Technology Forensics', u.id, 1150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SB-5000', 'Nikon Flash sb-5000 speed light for nikkon d5', 'West Technology Forensics', u.id, 17900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SHB-CC471', 'ฟองน้ำกันกระแทก แบบพับได้ 35x27x5 cm', 'West Technology Forensics', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SHB-CC472', 'ฟองน้ำกันกระแทก แบบพับได้ 41x25x8 cm', 'West Technology Forensics', u.id, 194.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIA-246557-5G', 'Spermidine trihydrochloride BioXtra, 99.5% (AT) Sigma-Aldrich 5G', 'West Technology Forensics', u.id, 3340.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SOLO-005N', 'SOLO ไขควงชุด 5 ตัว ไขควงด้ามทะลุ No. 005N แบบพกพาทำงานฟลัดไลท์ไฟชาร์จUSB', 'West Technology Forensics', u.id, 123.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SOLO-603-7', 'SOLO แปรงลวดทองเหลือง 3 ตัวชุด', 'West Technology Forensics', u.id, 52.67, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SPOA-WR', 'สูบน้ำมันมือบีบ SPOA หัวแดง ขาว-แดง', 'West Technology Forensics', u.id, 44.86, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0164', 'Dental Stone สีเขียว (1 กก/ถุง)', 'West Technology Forensics', u.id, 267.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BAG' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0242', 'Powerjet 2435 ""SIEVERT', 'West Technology Forensics', u.id, 2500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0527', 'แท่งจำลองแบบแนววิถีกระสุนปืนทำจากอลูมิเนียม เส้นผ่าศูนย์กลาง 5มม. ยาว 75 ซม. (15 อัน/ชุด)', 'West Technology Forensics', u.id, 2250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST.0553', 'Step Ring Rise (UK) 62mm - 52mm Nikon', 'West Technology Forensics', u.id, 300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'STKY1000400', 'ฮาร์ดดิสพกพา (External Harddisk) ความจุ 1 TB', 'West Technology Forensics', u.id, 2050.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SWAP_L_6', 'Cotton swap size L 6"" สำลีพันไม้ปลอดเชื้อ (100 อัน/แพค) Thai Gauze', 'West Technology Forensics', u.id, 40.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-74X74X70CM', 'โต๊ะวางเครื่องขนาด 74x74x70 cm', 'West Technology Forensics', u.id, 12000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T-90X120X80CM', 'โต๊ะวางเครื่องมือ ขนาด 90X120X80 CM', 'West Technology Forensics', u.id, 12000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TIS515-3M', 'ปลั๊กไฟ Toshino 5 ช่อง 3 เมตร TIS515', 'West Technology Forensics', u.id, 750.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00058', '5610845.98', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '5815014.57' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '0745883788569', 'CAB002bt1MBK Nylon Braided 3A/12W A to C', 'West Technology Forensics', u.id, 551.4, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1604020000', 'Printer (เครื่องพิมพ์) Canon Pixma Tr150 With Battery (black)', 'West Technology Forensics', u.id, 9813.08, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '1AC-A1-II', 'FLU1AC-A1-II NO /ACV DETECTOR 90-1000V,ENG,L.A.SPN', 'West Technology Forensics', u.id, 1721.9, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '20197', 'Connector Ugreen USB-C Multi port hub SIN11', 'West Technology Forensics', u.id, 738.32, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '20223', 'UGREEN รุ่น CR104 USB 2.0 to RS232 DB9 Serial Cable Male A Converter Adapter with PL2303 Chipset', 'West Technology Forensics', u.id, 287.22, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '20255', 'Adapter ugreen USB 3.0 To lab 10/100/1000 Mbps [ABS] 2Y', 'West Technology Forensics', u.id, 690.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '21KC0077TH', 'ThinkPad X1 Carbon G12', 'West Technology Forensics', u.id, 63177.77, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '21L1CTO1WW', 'ThinkPad L14 Gen5', 'West Technology Forensics', u.id, 29528.45, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '21L3CTO1WW', 'ThinkPad L16 Gen 1', 'West Technology Forensics', u.id, 36100.68, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '44574303', 'Drum OKI-44574303 30,000 DRUM for B411/431/B412/431/512/MB472/MB461/MB492 (30K)', 'West Technology Forensics', u.id, 2950.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '45487347379SF', 'Sony SD 64GB UHS-II R270/W45 S.ILCE-7', 'West Technology Forensics', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '4548736106369-3Y', 'Sony DSC RX100M7/PK1+ประกัน 3 ปี', 'West Technology Forensics', u.id, 42668.22, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '4905524885880', 'Sony battery NP-BX1 CE', 'West Technology Forensics', u.id, 1859.81, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '4X91M39043', 'Cable_bo Power cord C13-TH', 'West Technology Forensics', u.id, 0.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '4XD1M80020', 'Lenovo Wireless VoIP Headset', 'West Technology Forensics', u.id, 0.94, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '4Y51J62544', 'Lenovo Professiona', 'West Technology Forensics', u.id, 0.94, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '50857', 'UGREEN รุ่น 50857 Hard drive Docking Station USB 3.0 to SATA', 'West Technology Forensics', u.id, 1156.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '50966', 'Switch ugreen HDMI 2 to HDMI 4K 50966', 'West Technology Forensics', u.id, 373.83, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '5803000172', 'Wireless Usb Adapter (ยูเอสบีไวไฟ) Tp-link Archer T3u Ac1300 Mini Wireless Mu-mimo Usb Adapter', 'West Technology Forensics', u.id, 750.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '6944326367321', 'Fotopro Tripod X-GO Gecko E2', 'West Technology Forensics', u.id, 3074.77, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '843367134144', 'Lexar Slver Plus SDXC 256GB UHS-I V30 R205/W150', 'West Technology Forensics', u.id, 1485.98, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '8858683112907', 'แผ่นกันรอย OSKA DC AC ANTI fingerprint screen 4.3 inch', 'West Technology Forensics', u.id, 271.03, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '9200000157', 'Thermal grease (ซิลิโคน) Arctic MX-4 4G', 'West Technology Forensics', u.id, 271.03, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT '9318041817', 'Thermaltake CT140 Black (2-Fan pack)', 'West Technology Forensics', u.id, 925.23, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0073666', 'FD 32GB Sandisk (SDCZ50) Cruzer Blade', 'West Technology Forensics', u.id, 107.48, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0073667', 'FD 64GB Sandisk (SDCZ50) Cruzer Blade', 'West Technology Forensics', u.id, 116.82, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0073865', 'Brother FAX-2950', 'West Technology Forensics', u.id, 7200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0077843', 'BROTHER BT-5000 C', 'West Technology Forensics', u.id, 182.24, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0077844', 'BROTHER BT-5000 M', 'West Technology Forensics', u.id, 182.24, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0077845', 'BROTHER BT-5000 Y', 'West Technology Forensics', u.id, 182.24, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0091142', 'Router TP-LINK (TL-WR802N) Wireless N300 Nano', 'West Technology Forensics', u.id, 740.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0092164', 'อุปกรณ์ทดสอบสัญญาณสาย Cable Tester GLINK (GLT-104)', 'West Technology Forensics', u.id, 340.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0095101', 'Mouse PAD (แบบผ้า) Nubwo NP004 คละสี', 'West Technology Forensics', u.id, 20.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0109684', 'BROTHER BT-D60 BK', 'West Technology Forensics', u.id, 224.3, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0123854', 'UPS 800 VA ADVIC Smart LED', 'West Technology Forensics', u.id, 1680.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0124632', 'Note Book DDR4(2666) 8GB Kingston', 'West Technology Forensics', u.id, 1350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0126256', 'Wireless USB Adapter TP-LINK(Archer T3U)', 'West Technology Forensics', u.id, 710.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0127083', 'Wireless USB Adapter TP-Link (Archer T2U V3) AC600 Dual Band', 'West Technology Forensics', u.id, 490.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0127550', '2in1 Wireless logitech (MK470) Graphite', 'West Technology Forensics', u.id, 1820.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0128864', 'EXT 2.5 1TB WD My Passport Black (WDBYVG0010BBK)', 'West Technology Forensics', u.id, 1937.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0131330', 'Webcam OKER HD868', 'West Technology Forensics', u.id, 915.89, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0131353', 'MOUSE LOGITECH G102 LIGHTSYNC GAMING BLACK', 'West Technology Forensics', u.id, 570.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0133341', '128GB Flash Drive KINGSTON Data Traveler Exodia (DTX) Black', 'West Technology Forensics', u.id, 202.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0133589', 'FD 256GB Sandisk (SDCZ73) ULTRA Flair USB 3.0', 'West Technology Forensics', u.id, 574.77, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0134085', 'EXT SSD 1 TB 5Y Sandisk Extreme', 'West Technology Forensics', u.id, 2964.49, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0135709', 'Ink All-in-one Brother DCP-T220 + Ink Tank', 'West Technology Forensics', u.id, 3265.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0136909', 'Gigabit Switching Hub 5 Port MERCUSYS MS105G (4"")', 'West Technology Forensics', u.id, 245.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0137501', 'Cable DP TO DP (3M) Ugreen 10212', 'West Technology Forensics', u.id, 287.85, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0138899', 'FD 512GB Sandisk (SDCZ73) ULTRA Flair USB 3.0', 'West Technology Forensics', u.id, 1168.22, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0139866', 'Ink (All-in-one) EPSON L3250 + Ink Tank', 'West Technology Forensics', u.id, 4242.99, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0140605', 'Windows 11 Pro 64 Bit ENG OEM (FQC-101528) 03307377249084', 'West Technology Forensics', u.id, 5190.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0142617', 'Drum OKI B411 B412', 'West Technology Forensics', u.id, 3290.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0143883', '240 GB SSD SATA WD GREEN (WDS240G3G0A)', 'West Technology Forensics', u.id, 585.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0144994', 'Micro SD Card 256GB SANDISK Extreme Pro', 'West Technology Forensics', u.id, 1117.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0145000', '64GB SD Card SANDISK Extreme Pro SDSDXXU-064G-GN4IN (200MB/s.)', 'West Technology Forensics', u.id, 420.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0145808', 'Ink (All-in-one) Brother MFC-J35440DW', 'West Technology Forensics', u.id, 14588.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0146611', 'Micro SD Card 64GB Sandisk ULTRA SDSQUAB-064G-GN6MN(140MB)', 'West Technology Forensics', u.id, 187.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0146667', 'RAM DDR4 (2666) 8GB HYNIX 8 CHIP', 'West Technology Forensics', u.id, 615.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0146671', 'SATA-III 3Y 4TB Seagate IronWolf 256MB 5400RPMST4000VN006', 'West Technology Forensics', u.id, 3971.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0149610', 'Enclosure M.2 CM-400 (10902) UGREEN', 'West Technology Forensics', u.id, 878.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0149701', 'Smart IP Camera XIAOMI C200', 'West Technology Forensics', u.id, 880.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0150158', 'RAM DDR4 (2666) 16GB ADATA 8 CHIP', 'West Technology Forensics', u.id, 1014.02, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0151120', 'Cable HDD SERIAL SATA 3.0 3.0 AWM 2725 (มีที่ล็อค)', 'West Technology Forensics', u.id, 65.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0151686', 'Total Protection 1 Devices 3Year McAfee', 'West Technology Forensics', u.id, 1699.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0152081', '(AIO) Acer Aspire C24-1300-R38G0T23MiT001 (23.8) DQ BKRST.001', 'West Technology Forensics', u.id, 14476.64, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0154501', 'Monitor 23.8 MSI PRO MP2412 (VA HDMI DP) 100Hz', 'West Technology Forensics', u.id, 2423.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0154634', 'USB-C to Lightning Adapter MUQX3ZAA', 'West Technology Forensics', u.id, 1112.15, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0157208+R', 'NBgame Acer AN515-58-59GMT00Q Obsidian Black+ram', 'West Technology Forensics', u.id, 23469.16, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0157286', 'Desktop HP Pro Tower 280 G9', 'West Technology Forensics', u.id, 12420.56, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0158535', 'Lightning to USB Cable (1m) MUQW3ZAA', 'West Technology Forensics', u.id, 790.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0159267', 'Cable HDMI 8K (V.2.1) M/M (2M) UGREEN 25910', 'West Technology Forensics', u.id, 330.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0159357', 'NB DELL Inspiron 5645-OIN5645301201GTH 16.0 Platinum Silver', 'West Technology Forensics', u.id, 28462.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0159744', 'คอมประกอบ Advice  Computer Set', 'West Technology Forensics', u.id, 18750.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0160922', 'Monitor 23.8 Dell P2425H (IPS HDMI DP) 100Hz', 'West Technology Forensics', u.id, 4971.96, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0161674', 'iPhone EarPods with 3.5 mm Headphone Plug (MWU53ZAA)', 'West Technology Forensics', u.id, 738.32, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0162130', 'Notebook DELL Inspiron 5440-OIN5440200101GTH (Ice Blue Plastic Cover)', 'West Technology Forensics', u.id, 26158.88, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0163396', 'MS Office Home 2024 FPP EP2-06811', 'West Technology Forensics', u.id, 2962.62, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0163448', 'Monitor 23.8 DELL SE2425H VA VGA HDMI FreeSync 75 Hz', 'West Technology Forensics', u.id, 3305.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0163997', 'PC Dell Insplron OID 3030S 301901GTH-SF-Bk-W', 'West Technology Forensics', u.id, 27654.21, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0164010', '60W USB-C Charge Cable (1 m) MW493ZAA', 'West Technology Forensics', u.id, 738.32, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0165055', '8 TB HDD SEAGATE IRONWOLF PRO (7200RPM, 256MB, SATA-3, ST8000NT001)', 'West Technology Forensics', u.id, 7860.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0169470', 'PC Acer Altos VX2690GT001 (DT.VYYST.001)', 'West Technology Forensics', u.id, 8635.52, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A0170335', 'NB MSI Prestige 13 AI+Evo A2VMG-031TH (13.3) Stellar Gray', 'West Technology Forensics', u.id, 40551.4, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'A1-S500TER-514400002W', 'PC intel core i5-14400 processor 2.5GHz 8GB DDR5 U-DIMM 512GB M.2 2280NVMe', 'West Technology Forensics', u.id, 17058.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ABLEREX-GR1000', 'GR 1000 1000va/630w with LCD display, RJ11/RJ45 ABLEREX', 'West Technology Forensics', u.id, 2150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AC553-A1-A', 'Audo-technica ATH-M50xBT2 - Black', 'West Technology Forensics', u.id, 8317.76, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ACR-NHQN9ST001', 'ANV15-51-52MC i5-13420H 15g 512g V6 W11 - bag', 'West Technology Forensics', u.id, 22780.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ACR-NHQNNST009', 'PHN16-72-98J4 i9-14900HX 16G V8 W11 Notbook Acer + Backpack 18', 'West Technology Forensics', u.id, 52000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AD-3P-1000-3.0', 'UGREEN USB 3.0 Adapter 3 PORT 10/100/1000 Mbps', 'West Technology Forensics', u.id, 388.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ADS-3300W', 'เครื่องสแกนแบบตั้งโต๊ะ ความเร็ว 40 แผ่น/นาที', 'West Technology Forensics', u.id, 18139.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ADT-SS-F45W-B', 'Samsung Accessory Adapter Fast charge 45W w cable Black', 'West Technology Forensics', u.id, 1252.34, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ALTS-0063', 'เครื่องทำความสะอาดอัลตราโซนิก 6L 180W', 'West Technology Forensics', u.id, 3993.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ARCHER-T3U', 'Wireless usb adapter TP-LINK (ArcherT3U) AC1300 MINI Wireless MU-MMO USB Adapter', 'West Technology Forensics', u.id, 650.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ARCHER-T4U', 'AC 1300 Dual Band Wireless USB Adapter Realtek 2T2R 867Mbps at 5Ghz + 300Mbps', 'West Technology Forensics', u.id, 761.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ARCHER-TX20UH', 'AX1800 High Gain Dual Band Wi-Fi 6 USB Adapter SPEED: 1201 Mbps at 5 GHz + 574 Mbps at 2.4 GHz', 'West Technology Forensics', u.id, 1057.09, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AX1600I', 'Corsair AX1600i Digital ATX Power Supply 1600 Watt 80 Plus Titanium Certified', 'West Technology Forensics', u.id, 20177.57, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BB-WC05R-WHITE', 'อะแดปเตอร์ Blue Box Wall Charger 1 USB-A / 2 USB-C White', 'West Technology Forensics', u.id, 831.78, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BT-EGZ-1.5V-4P', 'ถ่านไฟฉาย AA Energizer แบตเตอรี่อัลคาไลน์ 1.5 V  4 pcs', 'West Technology Forensics', u.id, 68.67, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BTH-ADS-4300N', 'Scanner 40PPM Duplex-ADF80P Wired-USB', 'West Technology Forensics', u.id, 22950.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BTH-DCP-T520W', 'Ink Tank 3-in-1, Print/Copy/Scan', 'West Technology Forensics', u.id, 4365.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BTH-DCP-T720DW', 'Printer Inktank T720W MPC 30 26PPM WIFI', 'West Technology Forensics', u.id, 7500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BTH-HL-L3240CDW', 'Colour LASER Printer 26PPM Duplex NW', 'West Technology Forensics', u.id, 9240.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'BW-16D1HT-PRO/BLK/G/AS', 'ASUS internal blu-ray ultra-fast 16X Blu-ray burner with M-DISC support for lifetime data backup', 'West Technology Forensics', u.id, 3220.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CAB001BT1MBK', 'Boost charge USB A to C Cable 1M Black', 'West Technology Forensics', u.id, 364.49, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CA-W96V', 'แอร์เคลื่อนที่ในรถ TCL TAC-12CPA/RPV', 'West Technology Forensics', u.id, 9336.45, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CB966-T9-B', 'UAG Metropolis SE เคส Galaxy Tab S9+ - Mallard', 'West Technology Forensics', u.id, 2310.28, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CE285A', 'Toner IIP Cartridge PRINT CE28SA', 'West Technology Forensics', u.id, 2620.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CF210A HP', '131A Black Toner Cartridge 1600p', 'West Technology Forensics', u.id, 2650.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CF213A HP', '131A Magenta Toner Cartridge 1800p', 'West Technology Forensics', u.id, 3250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CF500A HP', 'HP 202A BLACK LASERJET TONER CARTRIDGE', 'West Technology Forensics', u.id, 2390.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CM219', 'USB 3.0 Hub Ugreen 4 in 1 5Gbps 4xUSB 3.0 สาย ยาว 100cm', 'West Technology Forensics', u.id, 350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'CM3286-50-KITAC', 'Clamp Power Meter with Z3', 'West Technology Forensics', u.id, 32900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'COM-I7-7700', 'เครื่อง PC i7-7700', 'West Technology Forensics', u.id, 11900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DCP-T200-INT', 'Ink (All-in-one) Brother DCP-T220 + Ink Tank', 'West Technology Forensics', u.id, 3600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DEL-7020MT18502526', 'OP 7020MT i5-14500 32GB 512GB 2TB W11P', 'West Technology Forensics', u.id, 44600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DELI-0001-PLUG', 'Deli ปลั๊กสามตา Power Socket  3 ช่อง 3 เมตร กำลังไฟ 2300W ปลั๊กไฟ สีชมพู สีเทา  แยกสวิตช์ มี มอก. ประกัน 3ปี', 'West Technology Forensics', u.id, 293.75, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DELL-7010', 'Dell OptiPlex Small Form Factor 7010', 'West Technology Forensics', u.id, 31000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DEL-P2723D', 'Dell 27 Monitor - P2723D', 'West Technology Forensics', u.id, 10050.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DEL-SNSE2425HS', 'Dell 24 Monitor - E2425HS', 'West Technology Forensics', u.id, 3777.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DEL-SNSP2723QE', 'Dell Professional Monitor P2723QE  27"" 3840x2160 HW LBL Ultrathin bezel', 'West Technology Forensics', u.id, 12945.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DEL-SNSU2424H', 'dell UltraSharp 24inch Monitor U2424H', 'West Technology Forensics', u.id, 7500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DJI M 2 FLY', 'ใบพัด DJI MAVIC 2 ENTERPRISE ADVANCED 4ใบต่อชุด', 'West Technology Forensics', u.id, 1690.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DJI MINI 2 SE', 'DJI Mini 2 SE Single Drone With RC-N1 Remote Controller (ประกันศูนย์)', 'West Technology Forensics', u.id, 8234.58, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DJI-0001', 'DJI Mavic 2 Enterprise Battery', 'West Technology Forensics', u.id, 10100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'DS425NAS', 'NAS Synology DS425 + 4-Bay DiskStation', 'West Technology Forensics', u.id, 16840.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EAP610-VER3.0', 'AX1800 Ceiling mount dual-band Wi-Fi 6 Access Point', 'West Technology Forensics', u.id, 2858.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'EHTK0023', 'Hantek DSO5102P 2CH Benchtop Oscilloscope 100MHz', 'West Technology Forensics', u.id, 11000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'FTPRO B+W 46MM', 'B+W F-Pro 007 Clear MRC 46mm (1069110)', 'West Technology Forensics', u.id, 1200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GI-790BK', 'หมึกอิงค์เจ็ท Black Canon', 'West Technology Forensics', u.id, 350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GI-790C', 'หมึกอิงค์เจ็ท Cyan Canon', 'West Technology Forensics', u.id, 239.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GI-790M', 'หมึกอิงค์เจ็ท Magenta Canon', 'West Technology Forensics', u.id, 239.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GI-790Y', 'หมึกอิงค์เจ็ท Yellow Canon', 'West Technology Forensics', u.id, 239.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOTTLE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'GR-RT624WE-PMT(60)', 'ตู้เย็น 2 ประตู 16.3 คิว Toshiba', 'West Technology Forensics', u.id, 13790.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HC-50L', 'Sirui ตู้ดูดความชื้น 50L', 'West Technology Forensics', u.id, 6800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'ตู้' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HIOKI DT4252', 'True RMS (10A Direct input)', 'West Technology Forensics', u.id, 6990.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HPI-7KW64A', 'HP Color Laser Jet Pro M255dw', 'West Technology Forensics', u.id, 8920.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HP-MS-II-WI', 'หูฟังไร้สาย Marshall Monitor II ANC Wireless Headphone', 'West Technology Forensics', u.id, 8402.8, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'HS5I-SG', 'Yamaha HS5i (Single) ลำโพงเดี่ยว', 'West Technology Forensics', u.id, 8411.22, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'INK EPSON 003-BK', 'INK EPSON 003 T00V100 FOR L3110,L3150 (BLACK)', 'West Technology Forensics', u.id, 250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'INK EPSON 003-C', 'INK EPSON 003 T00V100 FOR L3110,L3150 (Cyan)', 'West Technology Forensics', u.id, 250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'INK EPSON 003-M', 'INK EPSON 003 T00V100 FOR L3110,L3150 (Magenta)', 'West Technology Forensics', u.id, 250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'INK EPSON 003-Y', 'INK EPSON 003 T00V100 FOR L3110,L3150 (Yellow)', 'West Technology Forensics', u.id, 250.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'IPC-HFW1230TL-A-IL2.8MM', 'กล้อง Dahua รุ่น IPC-HFW1230TL-A-IL2.8MM ความคมชัด 2MP Smart Dual Light HDCV1 พร้อมติดตั้ง', 'West Technology Forensics', u.id, 37465.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'IRX108BT', 'JBL Powered 8-Inch Portable PA Loudspeaker with bluetooth', 'West Technology Forensics', u.id, 15794.4, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'IT-PD18W', 'Yoobao H5 black 50000mAh 185Wh 3.7V PD18W', 'West Technology Forensics', u.id, 1690.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'IT-PWB-PD65W', 'Yoobao EN1 46200mAh 220V PD65W', 'West Technology Forensics', u.id, 3092.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'JBL WIRELESS MIC', 'JBL Wireless Mic Set', 'West Technology Forensics', u.id, 4196.27, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'JBL-HP-100', 'JBL Quantum 100 หูฟังเกมมิ่ง', 'West Technology Forensics', u.id, 803.34, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K580', 'คีย์บอร์ดไร้สาย Logitech K580 Multi Device Wireless Keyboard White', 'West Technology Forensics', u.id, 1363.55, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KF01.137', 'K&F Filter Slim MC CPL 62mm', 'West Technology Forensics', u.id, 560.75, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KIT-LNV-83NC0019TA', 'Lenovo 16-inch  Laptop IPS5-14IAH10 U5-225H 24G 512G + Backpack B210Black', 'West Technology Forensics', u.id, 24300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KIT-SNG-RS2423P1', '12bay rackryzen V1780B 4C 8GB ddr4 3y + Rail kit sliding', 'West Technology Forensics', u.id, 74020.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'SET' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K-KJ55MCC40T', 'เครื่องซาร์จ+ถ่านEneloop AAx4 Panasonic K-K-KJ51MCC20T K-KJ55MCC40T ของuvi จากไทย', 'West Technology Forensics', u.id, 1394.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'K-KJ55MC-CC40T', 'เครื่องซาร์จ+ถ่านEneloop AAx4 Panasonic K-K-KJ51MCC20T K-KJ55MCC40T ของuvi จากไทย', 'West Technology Forensics', u.id, 1394.5, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'KM5221W-PRO', 'Dell KM5221W Pro Wireless Keyboard and mouse', 'West Technology Forensics', u.id, 1340.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'L3250/2YEARS', 'Print, Copy, Scan Copy speed Up to 7.7 ipm / 3.8 ipm  (Black/Colour), Resolution 600 x 600 dpi,', 'West Technology Forensics', u.id, 3990.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'L8050', 'PRINT,4A,5760 x 1440 dpi (with Variable-Sized Droplet  Technology) Up to 22 ppm / 22 ppm,CD/DVD', 'West Technology Forensics', u.id, 10520.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-3617BK', 'หมึก brother LC-3617  3619 สีดำ', 'West Technology Forensics', u.id, 350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-3617C', 'หมึก brother LC-3617 , 3619 สีฟ้า', 'West Technology Forensics', u.id, 350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-3617M', 'หมึก brother LC-3617  3619 สีชมพู', 'West Technology Forensics', u.id, 350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-3617Y', 'หมึก brother LC-3617 , 3619 สีเหลือง', 'West Technology Forensics', u.id, 350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-3619XL-BK', 'Brother black INK LC-3619XL-BK', 'West Technology Forensics', u.id, 590.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-3619XL-C', 'Brother CYAN INK MFC-J3530', 'West Technology Forensics', u.id, 510.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-3619XL-M', 'Brother MAGENTA INK MFC-J3530', 'West Technology Forensics', u.id, 520.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-3619XL-Y', 'Brother Yellow INK MFC-J3530', 'West Technology Forensics', u.id, 520.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-462BK', 'Black ink for MFC-J2340DW MFC-J2740DW MFC-J3540DW MFC-J3940DW (550 PAGES ISO 24711)', 'West Technology Forensics', u.id, 334.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-462C', 'CYAN ink for MFC-J2340DW MFC-J2740DW MFC-J3540DW MFC-J3940DW (550 PAGES ISO 24711)', 'West Technology Forensics', u.id, 334.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-462M', 'Magenta ink for MFC-J2340DW MFC-J2740DW MFC-J3540DW MFC-J3940DW (550 PAGES ISO 24711)', 'West Technology Forensics', u.id, 334.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LC-462Y', 'Yellow ink for MFC-J2340DW MFC-J2740DW MFC-J3540DW MFC-J3940DW (550 PAGES ISO 24711)', 'West Technology Forensics', u.id, 334.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LCR-ST1', 'มัลติมิเตอร์ชนิดแหนบ  Fnirsi LCR-ST1 Mini Smart Tweezer  LCR SMD ESR เครื่องทดสอบความต้านทานความจุเหนี่ยวนําไดโอดทดสอบเครื่องมือวัด', 'West Technology Forensics', u.id, 936.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LG-G213', 'K/B LOGITECH G213 PRODIGY (MEMBRANE) (RGB LED) (EN/TH)', 'West Technology Forensics', u.id, 1350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'LG-G413', 'Keyboard Logitech G413 SE (Blue Switch)', 'West Technology Forensics', u.id, 1850.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'M155A', 'HP Color Laser fet pro M155a', 'West Technology Forensics', u.id, 14600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MCS-T5D-03302', 'Office Home and Business 2019 English APAC EM', 'West Technology Forensics', u.id, 6100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MFC-T920DW', 'Ink Tank 4 in 1 Print copy scan fax', 'West Technology Forensics', u.id, 9244.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MIC-12M-XLR(D)', 'DIVA AUDIO Microphone XLR Cable 12 M. (male+Female)', 'West Technology Forensics', u.id, 607.48, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MIS045', 'Logitech Brio 4K', 'West Technology Forensics', u.id, 5317.78, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MNT-24-LECGM4K', '4K LED Gaming monitor165HZ หน้าจอโค้ง 24 นิ้ว ไร้กรอบ', 'West Technology Forensics', u.id, 2046.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MNT-MSI24IN100HZ', 'จอ MSI 24 นิ้ว 100hz', 'West Technology Forensics', u.id, 3500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'MT-27DELLU2723QE', 'Monitor 27 Dell IPS U2723QE 4K USB-C 3Y', 'West Technology Forensics', u.id, 16074.77, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NB T817-60', 'North Bayou Mastersat ขาแขวนโปรเจคเตอร์ แบบอเนกประสงค์ ติดเพดาน Universal Profecrot Ceiling Mount 360 Swivel Tilt', 'West Technology Forensics', u.id, 690.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NIKON-BD-Z6IIBK', 'กล้อง Nikon Z6II BK SG  Body', 'West Technology Forensics', u.id, 62000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NIKON-LEN Z 24-200', 'Nikon Z 24-200/4-6.3VR', 'West Technology Forensics', u.id, 29800.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NIKON-LEN Z MC50/2.8', 'Nikon Z MC 50/2.8', 'West Technology Forensics', u.id, 22200.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'NP-32V10A-BK', 'NICE-POWER 32V 10A  dc power supply', 'West Technology Forensics', u.id, 1649.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OEBT2250U702', 'Computer PC Dell Tower Plus EBT2250 UP DDR5 32GB', 'West Technology Forensics', u.id, 57990.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OF-PFP-2016', 'Office Professional Plus 2016', 'West Technology Forensics', u.id, 1149.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OF-PFP-2019', 'Office Professional Plus 2019', 'West Technology Forensics', u.id, 1500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OF-PFP-2021-FPP', 'Office Professional Plus 2021 full package FPP', 'West Technology Forensics', u.id, 3644.86, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OID3030S301101GTH_I3030SF_BK_W', 'Dell PC 14th Gen processor i5-14400/10 cores 16 Threads 20.00M/8GB 4400MT 512GB', 'West Technology Forensics', u.id, 17600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OKA-G62D', 'เครื่องฟอกอากาศในรถ', 'West Technology Forensics', u.id, 3261.68, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'OKI-45807103', 'OKI-45807103 Black 3,000 Toner for B412DN,B432DN.B512D,MB472,MB492,MB562 (3K)', 'West Technology Forensics', u.id, 2030.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'P24Q-30', 'ThinkVision P24q-30  23.8""  Monitor', 'West Technology Forensics', u.id, 514.02, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PANASONIC AA', 'PANASONIC ENELOOP AA mAh 2000 แพ๊ค 4 ก้อน', 'West Technology Forensics', u.id, 434.63, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PANASONIC AAA', 'PANASONIC ENELOOP AAA mAh 800 Iเพ็ค 4 ก้อน', 'West Technology Forensics', u.id, 434.63, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PG-65229979', 'Creative Cloud ALL Apps 100GB', 'West Technology Forensics', u.id, 12828.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'YEAR' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'PW513-3Y', 'Webcam avermedia 4K USB 3.0 PW513 3-y', 'West Technology Forensics', u.id, 4943.93, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'QCAM-C922', 'Full HD 1080P VDO HD720P 10MP (S/W Enhanced)', 'West Technology Forensics', u.id, 3129.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'QNP-TS-873A-SW5T', 'AMD RyzenV1500B 2.5GbE M.2', 'West Technology Forensics', u.id, 34000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'RESISTOR-0001', 'ตัวต้านทานฟิล์มคาร์บอนชุดกล่อง 1R ~ 10M ตัวต้านทาน DIY  ชุดอิเล็กทรอนิกส์ 1500 ชิ้น/ล็อต 75 ค่า 1/4W 0.25W', 'West Technology Forensics', u.id, 331.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SDDDC4-1T00-G46', 'SanDisk Ultra? Dual Drive Luxe USB Type-CTM Flash Drive,SDDDC4 1TB, USB Type', 'West Technology Forensics', u.id, 2772.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SDS2/64GB', '64GB SDXC Canvas select plus 100R C10 UHS-I U1 V10 100MB/s Read', 'West Technology Forensics', u.id, 190.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SDSD32/140', 'SD card Sandisk 32 GB/140GB', 'West Technology Forensics', u.id, 290.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SDXC-64GB-R200W90', 'Sandisk Extreme ProSDXC UHS-I 64 GB Read 200MB Write 90MB', 'West Technology Forensics', u.id, 590.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SIM-A3PPY', 'AIS ซิมเน็ตมาราธอน Max ซิมเน็ตรายปี speed 15Mbps จำนวน 50GB/เดือน', 'West Technology Forensics', u.id, 2056.07, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SJ-F15ST-SL', 'SHARP ตู้เย็น ประตูเดียว Mini-elegant Freezer 5.3 สีเงิน', 'West Technology Forensics', u.id, 8056.32, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SM-R400NZAAASA', 'Galaxy Buds SM-R400N Gray ASA', 'West Technology Forensics', u.id, 2470.6, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SM-X816BZAATHL', 'tablet SM-X816B Gray THL', 'West Technology Forensics', u.id, 34485.98, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SNG-D4EU01-8G', '8GB DDR4 ECC Unbuffered UDIMM', 'West Technology Forensics', u.id, 5890.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SNG-DS1522PLUS', '5-Bay Ryzen R1600 8GB DDR4 3Y', 'West Technology Forensics', u.id, 24000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SNG-DS1621PLUS', '6-Bay AMD Ryzen V1500B 4GB DDR4,3Y', 'West Technology Forensics', u.id, 33000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SNG-HAT33000-4T', '4TB 3.5 Plus series sata hdd 5400RPM MTBF 1m hour 3y', 'West Technology Forensics', u.id, 3700.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SNG-HAT3300-4T', '4TB 3.5 Plus Series SATA HDD 5400RPM MTBF 1M HOUR 3Y', 'West Technology Forensics', u.id, 3750.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SNG-HAT3310-8T', '8TB 3.5 Plus Series SATA HDD 7200RPM MTBF 1M HOUR 3Y', 'West Technology Forensics', u.id, 7400.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SNSE2020H', 'Dell Monitor E2020H 19.5 inch 3Y', 'West Technology Forensics', u.id, 2600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SSD-SS980P-1TB', 'SSD Samsung 980 PRO PCle 4.0 NVMe M.2 Internal Solid State Drive 1TB', 'West Technology Forensics', u.id, 2921.68, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SSG-MZ-77E2T0BW', 'Samsung SSD 870 EVO SATA3 2.5 2TB', 'West Technology Forensics', u.id, 5540.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST-1100', 'NTS ขาตังลาโพงโลหะสดา', 'West Technology Forensics', u.id, 934.58, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST12000VN0008_3Y', 'Seagate ironwolf 12TB NAS HDD 7200RPM Cache 256MB SATA 3Y', 'West Technology Forensics', u.id, 10376.32, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST8000VN004', 'H/D SEAGATE 8TB IRONWOLF NAS', 'West Technology Forensics', u.id, 7900.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ST8000VN004_3Y', 'SEAGATE IRONWOLF 8TB NAS HDD 7200RPM CACHE 256MB SATA 3YRS', 'West Technology Forensics', u.id, 8300.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'STKY2000400', 'Seagate one touch with password protection 2TB black 3Y', 'West Technology Forensics', u.id, 2495.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'STKY2000400/3Y', 'H/D Seagate 2TB EXT 2.5"" ONE TOUCH WITH PASSWORD PROTECTION  BLACK', 'West Technology Forensics', u.id, 2550.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'SX740 HS', 'canon powershot SX740 HS', 'West Technology Forensics', u.id, 15990.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'T04D100', 'Maintain Box T04D100 กล่องซับหมึก', 'West Technology Forensics', u.id, 394.95, 0, 'STANDARD', true
FROM units u WHERE u.code = 'BOX' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TL-SG1024DE', '24-port Gigabit easy smart switch 24 10/1100/1000Mbps RJ45', 'West Technology Forensics', u.id, 2960.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TN-2560', 'Brother toner black 1.2K ปริมาณการพิมพ์ 1200 แผ่น', 'West Technology Forensics', u.id, 1000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TN-263BK', 'BROTHER TONER TN-263BK', 'West Technology Forensics', u.id, 1500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TN-269 BK', 'Toner Brother TN-269 BK', 'West Technology Forensics', u.id, 1690.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TN-269 C', 'Toner Brother TN-269 C', 'West Technology Forensics', u.id, 2090.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TN-269 M', 'Toner Brother TN-269 M', 'West Technology Forensics', u.id, 2090.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TN-269 Y', 'Toner Brother TN-269 Y', 'West Technology Forensics', u.id, 2090.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'TSP K7', 'เครื่องวัดอุณหภูมิหน้าผาก tsp k7 พร้อมขาตั้ง แบตเตอรี่ อแดปเตอร์', 'West Technology Forensics', u.id, 4000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'UG-DP125 DPTOHDMI', 'UGREEN รุ่น DP125 สายเคเบิลไนล่อนถัก DisplayPort Male', 'West Technology Forensics', u.id, 460.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'US-1002A', 'Link US-1002A CAT6 NEW RJ45 Plug Transparent claer (10Pcs/PKG)', 'West Technology Forensics', u.id, 65.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'US-1070SG', 'Link Cat6A RJ45 Gold Plug (Utp/Shield ,Hybrid w/Boot (1set/Pkg)', 'West Technology Forensics', u.id, 59.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'PACK' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'US-5110LZ-4', 'Link RJ45 TO RJ45 Patch Cord CAT6 10M Blue LSZH', 'West Technology Forensics', u.id, 290.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'US701', 'Ugreen adapter US701 USB A 3.0 เป็น USB C 10Gbps สีดำ', 'West Technology Forensics', u.id, 150.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'US-9106LSZH-1', 'สายแลน Cat 6 UTP (250 MHz) w/Cross Filler 23 AWG LSZH White 100 M Reelex', 'West Technology Forensics', u.id, 1450.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'VY249HF-R', 'Asus Monitor Model VY249HF-R 23.8inch', 'West Technology Forensics', u.id, 2746.2, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'W1107A HP', '107A Black LaserJet toner cart 1K', 'West Technology Forensics', u.id, 1600.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'W1510A', 'Toner Cartridge HP 151A Black Original LaserJet', 'West Technology Forensics', u.id, 3450.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'W1510A HP', '151A Black Laserfet toner Cart .3k', 'West Technology Forensics', u.id, 3500.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'W706', 'Wireless Charger (เครื่องชาร์จไร้สาย) Ugreen W706', 'West Technology Forensics', u.id, 1307.48, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WC-108C', 'Braided Charger/Data C to C 100W 1.2M LED', 'West Technology Forensics', u.id, 490.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WD10EZEX-3Y-1TB', 'HD 1TB 7200RPM CAHCE 64MB SATA3(6Gb/s)', 'West Technology Forensics', u.id, 1446.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WD122KFBX-5Y', 'HDD NAS PRO 12TB SATA3 Z6Gb/s 7200RPM 512 MB 5Y', 'West Technology Forensics', u.id, 10624.56, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WD8002FZBX', 'HDD 8TB WD BLACK SATA 7200RPM 256MB WD8002FZBX Warranty 5 Year', 'West Technology Forensics', u.id, 8100.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WDBYVG0020BBK-WESN', 'WD My Passport 2TB Black USB 3.0 [ External HDD ฮาร์ดดิสก์พกพา 2.5', 'West Technology Forensics', u.id, 2350.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WDS100T3X0E', 'H/D SSD WD 1TB BLACK SN770 M.2 2280 NVMe GEN 4 5-Y', 'West Technology Forensics', u.id, 2050.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WI-LN-001-0010', 'สายชาร์จ ชนิด Lightning 1.0 ม.', 'West Technology Forensics', u.id, 790.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WINDOWS 10 PRO', 'Windows 10 Pro fessional 32/64 bit Eng(USB)', 'West Technology Forensics', u.id, 1028.04, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WINDOWS 11P-64OEM-SK', 'Windows 11 Pro 64 Bit ENG OEM', 'West Technology Forensics', u.id, 747.66, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WINDOWS 7 PRO64', 'Windows 7 Professional 64bit OEM', 'West Technology Forensics', u.id, 2990.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'LICENSE' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'WINMAX SMR005', 'เครื่องอ่านบัตรสมาร์ทการ์ด อ่านเมมโมรี่ เครื่องอ่านการ์ดความจำ 7 ใน 1 Winmax SMR005', 'West Technology Forensics', u.id, 364.49, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'X-52-33-MC', 'โต๊ะทำงานหน้าพ่นสี ขนาด 1.6เมตร สีครีมเมทัลลิก', 'West Technology Forensics', u.id, 6456.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZD4A042-30PE00EZ', 'ZEBRA TT Printer (74/300M) ZD421 203dpi USB USB Host Ethernet BTLE5APAC Cord bundle EU UK', 'West Technology Forensics', u.id, 17000.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'เครื่อง' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'ZEISS', 'ZEISS lens cleaning kit', 'West Technology Forensics', u.id, 950.0, 0, 'STANDARD', true
FROM units u WHERE u.code = 'EA' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00059', '1761560.39', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '4084753.27' LIMIT 1;
INSERT INTO products (code, name, description, unit_id, standard_cost, selling_price, quotation_type, is_active) 
SELECT 'AUTO-00060', '67927151.71', 'West Technology Forensics', u.id, 0, 0, 'STANDARD', true
FROM units u WHERE u.code = '110230650.88' LIMIT 1;
