#!/bin/bash

# ===========================================
# SVS Stock - Frontend API Compatibility Test
# ตรวจสอบว่า Frontend API calls ตรงกับ Backend
# ===========================================

API_URL="https://svs-stock-api.azurewebsites.net/api"
USERNAME="autthapol.s"
PASSWORD="123456"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Test counters
PASSED=0
FAILED=0

test_endpoint() {
  local METHOD=$1
  local ENDPOINT=$2
  local EXPECTED=$3
  local DATA=$4
  
  if [ -n "$DATA" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X $METHOD "$API_URL$ENDPOINT" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$DATA")
  else
    RESPONSE=$(curl -s -w "\n%{http_code}" -X $METHOD "$API_URL$ENDPOINT" \
      -H "Authorization: Bearer $TOKEN")
  fi
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  
  if [[ "$HTTP_CODE" =~ ^($EXPECTED)$ ]]; then
    echo -e "${GREEN}✅ PASS${NC} $METHOD $ENDPOINT (HTTP $HTTP_CODE)"
    ((PASSED++))
  else
    echo -e "${RED}❌ FAIL${NC} $METHOD $ENDPOINT (HTTP $HTTP_CODE, expected $EXPECTED)"
    ((FAILED++))
  fi
}

echo ""
echo "==========================================="
echo "🧪 SVS Stock - Frontend API Compatibility"
echo "==========================================="
echo ""

# Login
echo -e "${BLUE}[Login]${NC} 🔐 Authenticating..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Login successful${NC}"
echo ""

# ===========================================
# 1. AUTH API
# ===========================================
echo -e "${CYAN}[1] 🔐 AUTH API${NC}"
test_endpoint "POST" "/auth/login" "200|201" '{"username":"autthapol.s","password":"123456"}'
echo ""

# ===========================================
# 2. USERS API
# ===========================================
echo -e "${CYAN}[2] 👤 USERS API${NC}"
test_endpoint "GET" "/users" "200"
test_endpoint "GET" "/users/1" "200"
test_endpoint "GET" "/users/roles" "200"
echo ""

# ===========================================
# 3. PRODUCTS API
# ===========================================
echo -e "${CYAN}[3] 📦 PRODUCTS API${NC}"
test_endpoint "GET" "/products" "200"
test_endpoint "GET" "/products/1" "200|404"
test_endpoint "GET" "/products/categories" "200"
test_endpoint "GET" "/products/units" "200"
echo ""

# ===========================================
# 4. CATEGORIES API (Standalone endpoint)
# ===========================================
echo -e "${CYAN}[4] 🏷️  CATEGORIES API${NC}"
test_endpoint "GET" "/categories" "200"
test_endpoint "GET" "/categories/1" "200|404"
echo ""

# ===========================================
# 5. CUSTOMERS API
# ===========================================
echo -e "${CYAN}[5] 👥 CUSTOMERS API${NC}"
test_endpoint "GET" "/customers" "200"
test_endpoint "GET" "/customers/1" "200"
echo ""

# ===========================================
# 6. SUPPLIERS API
# ===========================================
echo -e "${CYAN}[6] 🏭 SUPPLIERS API${NC}"
test_endpoint "GET" "/suppliers" "200"
test_endpoint "GET" "/suppliers/6" "200"
echo ""

# ===========================================
# 7. WAREHOUSES API
# ===========================================
echo -e "${CYAN}[7] 🏢 WAREHOUSES API${NC}"
test_endpoint "GET" "/warehouses" "200"
test_endpoint "GET" "/warehouses/1" "200"
echo ""

# ===========================================
# 8. STOCK API
# ===========================================
echo -e "${CYAN}[8] 📊 STOCK API${NC}"
test_endpoint "GET" "/stock/balance" "200"
echo ""

# ===========================================
# 9. QUOTATIONS API
# ===========================================
echo -e "${CYAN}[9] 📝 QUOTATIONS API${NC}"
test_endpoint "GET" "/quotations" "200"
test_endpoint "GET" "/quotations/1" "200|404"
echo ""

# ===========================================
# 10. PURCHASE ORDERS API
# ===========================================
echo -e "${CYAN}[10] 🛒 PURCHASE ORDERS API${NC}"
test_endpoint "GET" "/purchase-orders" "200"
test_endpoint "GET" "/purchase-orders/1" "200|404"
echo ""

# ===========================================
# 11. GOODS RECEIPTS API
# ===========================================
echo -e "${CYAN}[11] 📦 GOODS RECEIPTS API${NC}"
test_endpoint "GET" "/goods-receipts" "200"
test_endpoint "GET" "/goods-receipts/1" "200|404"
echo ""

# ===========================================
# 12. SALES INVOICES API
# ===========================================
echo -e "${CYAN}[12] 🧾 SALES INVOICES API${NC}"
test_endpoint "GET" "/sales-invoices" "200"
test_endpoint "GET" "/sales-invoices/1" "200|404"
echo ""

# ===========================================
# 13. STOCK ISSUES API
# ===========================================
echo -e "${CYAN}[13] 📤 STOCK ISSUES API${NC}"
test_endpoint "GET" "/stock-issues" "200"
echo ""

# ===========================================
# 14. STOCK TRANSFERS API
# ===========================================
echo -e "${CYAN}[14] 🔄 STOCK TRANSFERS API${NC}"
test_endpoint "GET" "/stock-transfers" "200"
echo ""

# ===========================================
# 15. SYSTEM SETTINGS API
# ===========================================
echo -e "${CYAN}[15] ⚙️  SYSTEM SETTINGS API${NC}"
test_endpoint "GET" "/system-settings" "200"
echo ""

# ===========================================
# 16. USER SETTINGS API
# ===========================================
echo -e "${CYAN}[16] 👤 USER SETTINGS API${NC}"
test_endpoint "GET" "/user-settings" "200"
test_endpoint "GET" "/user-settings/seller" "200"
test_endpoint "GET" "/user-settings/employees" "200"
echo ""

# ===========================================
# Summary
# ===========================================
echo "==========================================="
echo -e "${CYAN}📊 Test Summary${NC}"
echo "==========================================="
echo ""
echo -e "  ${GREEN}✅ Passed: $PASSED${NC}"
echo -e "  ${RED}❌ Failed: $FAILED${NC}"
echo -e "  📋 Total:  $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All Frontend API endpoints are compatible!${NC}"
else
  echo -e "${YELLOW}⚠️  Some endpoints need attention.${NC}"
fi

echo ""
echo "==========================================="
