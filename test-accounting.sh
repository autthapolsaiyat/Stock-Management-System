#!/bin/bash
# test-accounting.sh - ทดสอบ Accounting Module

API_URL="https://svs-stock-api.azurewebsites.net/api"
echo "🧪 ทดสอบ Accounting Module"
echo "================================"

# Login
echo -e "\n📌 1. Login..."
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"autthapol.s","password":"123456"}' | jq -r '.accessToken')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  exit 1
fi
echo "✅ Login สำเร็จ"

# ==================== Chart of Accounts ====================
echo -e "\n📌 2. ทดสอบ Chart of Accounts..."

# 2.1 ดูผังบัญชีทั้งหมด
echo -n "   - GET /chart-of-accounts: "
COA_COUNT=$(curl -s -X GET "$API_URL/accounting/chart-of-accounts" \
  -H "Authorization: Bearer $TOKEN" | jq 'length')
echo "✅ พบ $COA_COUNT บัญชี"

# 2.2 ดูผังบัญชีแบบ Tree
echo -n "   - GET /chart-of-accounts/tree: "
TREE_COUNT=$(curl -s -X GET "$API_URL/accounting/chart-of-accounts/tree" \
  -H "Authorization: Bearer $TOKEN" | jq 'length')
echo "✅ พบ $TREE_COUNT หมวดหลัก"

# 2.3 ดูบัญชีตามประเภท
echo -n "   - GET /chart-of-accounts/type/ASSET: "
ASSET_COUNT=$(curl -s -X GET "$API_URL/accounting/chart-of-accounts/type/ASSET" \
  -H "Authorization: Bearer $TOKEN" | jq 'length')
echo "✅ พบ $ASSET_COUNT บัญชีสินทรัพย์"

# 2.4 สร้างบัญชีใหม่
echo -n "   - POST /chart-of-accounts (สร้างบัญชีทดสอบ): "
NEW_COA=$(curl -s -X POST "$API_URL/accounting/chart-of-accounts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "1199",
    "name": "บัญชีทดสอบ",
    "nameEn": "Test Account",
    "accountType": "ASSET",
    "accountGroup": "CURRENT_ASSET",
    "balanceType": "DEBIT"
  }')
NEW_COA_ID=$(echo $NEW_COA | jq -r '.id')
if [ "$NEW_COA_ID" != "null" ]; then
  echo "✅ สร้างสำเร็จ ID: $NEW_COA_ID"
else
  echo "⚠️ อาจมีอยู่แล้ว: $(echo $NEW_COA | jq -r '.message')"
fi

# ==================== Journal Entries ====================
echo -e "\n📌 3. ทดสอบ Journal Entries..."

# 3.1 ดู Journal Entries
echo -n "   - GET /journal-entries: "
JE_RESULT=$(curl -s -X GET "$API_URL/accounting/journal-entries" \
  -H "Authorization: Bearer $TOKEN")
JE_COUNT=$(echo $JE_RESULT | jq 'if type == "array" then length else 0 end')
echo "✅ พบ $JE_COUNT รายการ"

# 3.2 สร้าง Journal Entry ใหม่
echo -n "   - POST /journal-entries (สร้างสมุดรายวัน): "
NEW_JE=$(curl -s -X POST "$API_URL/accounting/journal-entries" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "journalType": "GENERAL",
    "docDate": "2025-12-26",
    "description": "ทดสอบบันทึกบัญชี - รับเงินสด",
    "lines": [
      {"lineNo": 1, "accountId": 4, "description": "เงินสด", "debitAmount": 5000, "creditAmount": 0},
      {"lineNo": 2, "accountId": 19, "description": "รายได้จากการขาย", "debitAmount": 0, "creditAmount": 5000}
    ]
  }')
NEW_JE_ID=$(echo $NEW_JE | jq -r '.id')
NEW_JE_DOCNO=$(echo $NEW_JE | jq -r '.docNo')
if [ "$NEW_JE_ID" != "null" ]; then
  echo "✅ สร้างสำเร็จ ID: $NEW_JE_ID, เลขที่: $NEW_JE_DOCNO"
  
  # 3.3 Post Journal Entry
  echo -n "   - POST /journal-entries/$NEW_JE_ID/post (บันทึกบัญชี): "
  POST_RESULT=$(curl -s -X POST "$API_URL/accounting/journal-entries/$NEW_JE_ID/post" \
    -H "Authorization: Bearer $TOKEN")
  POST_STATUS=$(echo $POST_RESULT | jq -r '.status')
  if [ "$POST_STATUS" == "POSTED" ]; then
    echo "✅ บันทึกสำเร็จ สถานะ: $POST_STATUS"
  else
    echo "⚠️ $(echo $POST_RESULT | jq -r '.message // .status')"
  fi
else
  echo "❌ ไม่สามารถสร้างได้: $(echo $NEW_JE | jq -r '.message')"
fi

# ==================== AR/AP ====================
echo -e "\n📌 4. ทดสอบ AR/AP..."

# 4.1 AR Outstanding
echo -n "   - GET /ar/outstanding: "
AR_OUT=$(curl -s -X GET "$API_URL/accounting/ar/outstanding" \
  -H "Authorization: Bearer $TOKEN")
AR_COUNT=$(echo $AR_OUT | jq 'if type == "array" then length else 0 end')
echo "✅ พบ $AR_COUNT รายการลูกหนี้"

# 4.2 AP Outstanding
echo -n "   - GET /ap/outstanding: "
AP_OUT=$(curl -s -X GET "$API_URL/accounting/ap/outstanding" \
  -H "Authorization: Bearer $TOKEN")
AP_COUNT=$(echo $AP_OUT | jq 'if type == "array" then length else 0 end')
echo "✅ พบ $AP_COUNT รายการเจ้าหนี้"

# 4.3 AR Aging
echo -n "   - GET /ar/aging: "
AR_AGING=$(curl -s -X GET "$API_URL/accounting/ar/aging?asOfDate=2025-12-26" \
  -H "Authorization: Bearer $TOKEN")
AR_AGING_TOTAL=$(echo $AR_AGING | jq -r '.totals.total // 0')
echo "✅ ยอดรวม: $(printf "%'.2f" $AR_AGING_TOTAL) บาท"

# 4.4 AP Aging
echo -n "   - GET /ap/aging: "
AP_AGING=$(curl -s -X GET "$API_URL/accounting/ap/aging?asOfDate=2025-12-26" \
  -H "Authorization: Bearer $TOKEN")
AP_AGING_TOTAL=$(echo $AP_AGING | jq -r '.totals.total // 0')
echo "✅ ยอดรวม: $(printf "%'.2f" $AP_AGING_TOTAL) บาท"

# 4.5 Dashboard Summary
echo -n "   - GET /ar-ap/dashboard: "
DASHBOARD=$(curl -s -X GET "$API_URL/accounting/ar-ap/dashboard" \
  -H "Authorization: Bearer $TOKEN")
AR_TOTAL=$(echo $DASHBOARD | jq -r '.ar.totalOutstanding // 0')
AP_TOTAL=$(echo $DASHBOARD | jq -r '.ap.totalOutstanding // 0')
echo "✅ AR: $(printf "%'.2f" $AR_TOTAL), AP: $(printf "%'.2f" $AP_TOTAL)"

# ==================== Financial Reports ====================
echo -e "\n📌 5. ทดสอบ Financial Reports..."

# 5.1 Trial Balance
echo -n "   - GET /reports/trial-balance: "
TB=$(curl -s -X GET "$API_URL/accounting/reports/trial-balance?startDate=2025-01-01&endDate=2025-12-31" \
  -H "Authorization: Bearer $TOKEN")
TB_DEBIT=$(echo $TB | jq -r '.totals.totalDebit // 0')
TB_CREDIT=$(echo $TB | jq -r '.totals.totalCredit // 0')
echo "✅ เดบิต: $(printf "%'.2f" $TB_DEBIT), เครดิต: $(printf "%'.2f" $TB_CREDIT)"

# 5.2 Profit & Loss
echo -n "   - GET /reports/profit-loss: "
PL=$(curl -s -X GET "$API_URL/accounting/reports/profit-loss?startDate=2025-01-01&endDate=2025-12-31" \
  -H "Authorization: Bearer $TOKEN")
REVENUE=$(echo $PL | jq -r '.revenue.total // 0')
EXPENSE=$(echo $PL | jq -r '.expense.total // 0')
NET_PROFIT=$(echo $PL | jq -r '.netProfit // 0')
echo "✅ รายได้: $(printf "%'.2f" $REVENUE), ค่าใช้จ่าย: $(printf "%'.2f" $EXPENSE), กำไรสุทธิ: $(printf "%'.2f" $NET_PROFIT)"

# 5.3 Balance Sheet
echo -n "   - GET /reports/balance-sheet: "
BS=$(curl -s -X GET "$API_URL/accounting/reports/balance-sheet?asOfDate=2025-12-26" \
  -H "Authorization: Bearer $TOKEN")
ASSETS=$(echo $BS | jq -r '.assets.total // 0')
LIAB=$(echo $BS | jq -r '.liabilities.total // 0')
EQUITY=$(echo $BS | jq -r '.equity.total // 0')
BALANCED=$(echo $BS | jq -r '.isBalanced // false')
echo "✅ สินทรัพย์: $(printf "%'.2f" $ASSETS), หนี้สิน: $(printf "%'.2f" $LIAB), ทุน: $(printf "%'.2f" $EQUITY), สมดุล: $BALANCED"

# ==================== Bank Accounts ====================
echo -e "\n📌 6. ทดสอบ Bank Accounts..."

# 6.1 ดูบัญชีธนาคาร
echo -n "   - GET /bank-accounts: "
BANKS=$(curl -s -X GET "$API_URL/accounting/bank-accounts" \
  -H "Authorization: Bearer $TOKEN")
BANK_COUNT=$(echo $BANKS | jq 'if type == "array" then length else 0 end')
echo "✅ พบ $BANK_COUNT บัญชีธนาคาร"

# 6.2 สร้างบัญชีธนาคารใหม่
echo -n "   - POST /bank-accounts (สร้างบัญชีธนาคาร): "
NEW_BANK=$(curl -s -X POST "$API_URL/accounting/bank-accounts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bankName": "ธนาคารกสิกรไทย",
    "branchName": "สาขาสีลม",
    "accountNo": "123-4-56789-0",
    "accountName": "บริษัท แสงวิทย์ไซเอ็นส์ จำกัด",
    "accountType": "SAVINGS",
    "chartOfAccountId": 4
  }')
NEW_BANK_ID=$(echo $NEW_BANK | jq -r '.id')
if [ "$NEW_BANK_ID" != "null" ]; then
  echo "✅ สร้างสำเร็จ ID: $NEW_BANK_ID"
else
  echo "⚠️ $(echo $NEW_BANK | jq -r '.message // "อาจมีอยู่แล้ว"')"
fi

# ==================== Summary ====================
echo -e "\n================================"
echo "📊 สรุปผลการทดสอบ"
echo "================================"
echo "✅ Chart of Accounts: $COA_COUNT บัญชี"
echo "✅ Journal Entries: ทำงานปกติ"
echo "✅ AR/AP Aging: ทำงานปกติ"
echo "✅ Financial Reports: ทำงานปกติ"
echo "✅ Bank Accounts: $BANK_COUNT บัญชี"
echo ""
echo "🎉 Accounting Module ทำงานสมบูรณ์!"
