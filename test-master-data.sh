#!/bin/bash

# ===========================================
# SVS Stock - Master Data Test Script
# Products, Categories, Customers, Suppliers, Warehouses
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

# Helper function
test_result() {
  if [ "$1" == "true" ]; then
    echo -e "${GREEN}✅ PASS${NC} - $2"
    ((PASSED++))
  else
    echo -e "${RED}❌ FAIL${NC} - $2"
    ((FAILED++))
  fi
}

echo ""
echo "==========================================="
echo "🧪 SVS Stock - Master Data Test"
echo "==========================================="
echo ""

# ===========================================
# Step 0: Login
# ===========================================
echo -e "${BLUE}[Step 0]${NC} 🔐 Login..."

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
# 1. CATEGORIES (หมวดหมู่สินค้า)
# ===========================================
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}[1] 🏷️  CATEGORIES (หมวดหมู่สินค้า)${NC}"
echo -e "${CYAN}========================================${NC}"

# 1.1 Get All Categories
echo -e "\n${BLUE}[1.1]${NC} Get All Categories..."
CAT_LIST=$(curl -s "$API_URL/categories" -H "Authorization: Bearer $TOKEN")
CAT_COUNT=$(echo $CAT_LIST | jq 'length')
test_result "$([ "$CAT_COUNT" -ge 0 ] && echo true)" "GET /categories - Found $CAT_COUNT categories"

# 1.2 Create Category
echo -e "\n${BLUE}[1.2]${NC} Create Category..."
NEW_CAT=$(curl -s -X POST "$API_URL/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Category $(date +%s)\",
    \"description\": \"Created by test script\"
  }")
NEW_CAT_ID=$(echo $NEW_CAT | jq -r '.id')
test_result "$([ "$NEW_CAT_ID" != "null" ] && [ -n "$NEW_CAT_ID" ] && echo true)" "POST /categories - Created ID: $NEW_CAT_ID"

# 1.3 Get Category by ID
echo -e "\n${BLUE}[1.3]${NC} Get Category by ID..."
if [ "$NEW_CAT_ID" != "null" ] && [ -n "$NEW_CAT_ID" ]; then
  GET_CAT=$(curl -s "$API_URL/categories/$NEW_CAT_ID" -H "Authorization: Bearer $TOKEN")
  GET_CAT_NAME=$(echo $GET_CAT | jq -r '.name')
  test_result "$([ -n "$GET_CAT_NAME" ] && [ "$GET_CAT_NAME" != "null" ] && echo true)" "GET /categories/$NEW_CAT_ID - Name: $GET_CAT_NAME"
else
  test_result "false" "GET /categories/:id - Skipped (no ID)"
fi

# 1.4 Update Category
echo -e "\n${BLUE}[1.4]${NC} Update Category..."
if [ "$NEW_CAT_ID" != "null" ] && [ -n "$NEW_CAT_ID" ]; then
  UPD_CAT=$(curl -s -X PUT "$API_URL/categories/$NEW_CAT_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Updated Category $(date +%s)\"}")
  UPD_CAT_ID=$(echo $UPD_CAT | jq -r '.id')
  test_result "$([ "$UPD_CAT_ID" == "$NEW_CAT_ID" ] && echo true)" "PUT /categories/$NEW_CAT_ID - Updated"
else
  test_result "false" "PUT /categories/:id - Skipped"
fi

# 1.5 Delete Category
echo -e "\n${BLUE}[1.5]${NC} Delete Category..."
if [ "$NEW_CAT_ID" != "null" ] && [ -n "$NEW_CAT_ID" ]; then
  DEL_CAT=$(curl -s -X DELETE "$API_URL/categories/$NEW_CAT_ID" \
    -H "Authorization: Bearer $TOKEN" -w "%{http_code}" -o /dev/null)
  test_result "$([ "$DEL_CAT" == "200" ] || [ "$DEL_CAT" == "204" ] && echo true)" "DELETE /categories/$NEW_CAT_ID - Status: $DEL_CAT"
else
  test_result "false" "DELETE /categories/:id - Skipped"
fi

# ===========================================
# 2. PRODUCTS (สินค้า)
# ===========================================
echo -e "\n${CYAN}========================================${NC}"
echo -e "${CYAN}[2] 📦 PRODUCTS (สินค้า)${NC}"
echo -e "${CYAN}========================================${NC}"

# 2.1 Get All Products
echo -e "\n${BLUE}[2.1]${NC} Get All Products..."
PROD_LIST=$(curl -s "$API_URL/products" -H "Authorization: Bearer $TOKEN")
PROD_COUNT=$(echo $PROD_LIST | jq 'length')
test_result "$([ "$PROD_COUNT" -ge 0 ] && echo true)" "GET /products - Found $PROD_COUNT products"

# 2.2 Create Product
echo -e "\n${BLUE}[2.2]${NC} Create Product..."
NEW_PROD=$(curl -s -X POST "$API_URL/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\": \"TEST-$(date +%s)\",
    \"name\": \"Test Product $(date +%s)\",
    \"description\": \"Created by test script\",
    \"unit\": \"ea\",
    \"standardCost\": 100,
    \"sellingPrice\": 150
  }")
NEW_PROD_ID=$(echo $NEW_PROD | jq -r '.id')
test_result "$([ "$NEW_PROD_ID" != "null" ] && [ -n "$NEW_PROD_ID" ] && echo true)" "POST /products - Created ID: $NEW_PROD_ID"

# 2.3 Get Product by ID
echo -e "\n${BLUE}[2.3]${NC} Get Product by ID..."
if [ "$NEW_PROD_ID" != "null" ] && [ -n "$NEW_PROD_ID" ]; then
  GET_PROD=$(curl -s "$API_URL/products/$NEW_PROD_ID" -H "Authorization: Bearer $TOKEN")
  GET_PROD_NAME=$(echo $GET_PROD | jq -r '.name')
  test_result "$([ -n "$GET_PROD_NAME" ] && echo true)" "GET /products/$NEW_PROD_ID - Name: $GET_PROD_NAME"
else
  test_result "false" "GET /products/:id - Skipped"
fi

# 2.4 Update Product
echo -e "\n${BLUE}[2.4]${NC} Update Product..."
if [ "$NEW_PROD_ID" != "null" ] && [ -n "$NEW_PROD_ID" ]; then
  UPD_PROD=$(curl -s -X PUT "$API_URL/products/$NEW_PROD_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Updated Product $(date +%s)\", \"sellingPrice\": 200}")
  UPD_PROD_ID=$(echo $UPD_PROD | jq -r '.id')
  test_result "$([ "$UPD_PROD_ID" == "$NEW_PROD_ID" ] && echo true)" "PUT /products/$NEW_PROD_ID - Updated"
else
  test_result "false" "PUT /products/:id - Skipped"
fi

# 2.5 Delete Product
echo -e "\n${BLUE}[2.5]${NC} Delete Product..."
if [ "$NEW_PROD_ID" != "null" ] && [ -n "$NEW_PROD_ID" ]; then
  DEL_PROD=$(curl -s -X DELETE "$API_URL/products/$NEW_PROD_ID" \
    -H "Authorization: Bearer $TOKEN" -w "%{http_code}" -o /dev/null)
  test_result "$([ "$DEL_PROD" == "200" ] || [ "$DEL_PROD" == "204" ] && echo true)" "DELETE /products/$NEW_PROD_ID - Status: $DEL_PROD"
else
  test_result "false" "DELETE /products/:id - Skipped"
fi

# ===========================================
# 3. CUSTOMERS (ลูกค้า)
# ===========================================
echo -e "\n${CYAN}========================================${NC}"
echo -e "${CYAN}[3] 👥 CUSTOMERS (ลูกค้า)${NC}"
echo -e "${CYAN}========================================${NC}"

# 3.1 Get All Customers
echo -e "\n${BLUE}[3.1]${NC} Get All Customers..."
CUST_LIST=$(curl -s "$API_URL/customers" -H "Authorization: Bearer $TOKEN")
CUST_COUNT=$(echo $CUST_LIST | jq 'length')
test_result "$([ "$CUST_COUNT" -ge 0 ] && echo true)" "GET /customers - Found $CUST_COUNT customers"

# 3.2 Create Customer
echo -e "\n${BLUE}[3.2]${NC} Create Customer..."
NEW_CUST=$(curl -s -X POST "$API_URL/customers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\": \"CUST-$(date +%s)\",
    \"name\": \"Test Customer $(date +%s)\",
    \"address\": \"123 Test Street\",
    \"phone\": \"02-123-4567\",
    \"email\": \"test@example.com\",
    \"taxId\": \"1234567890123\",
    \"contactPerson\": \"Mr. Test\"
  }")
NEW_CUST_ID=$(echo $NEW_CUST | jq -r '.id')
test_result "$([ "$NEW_CUST_ID" != "null" ] && [ -n "$NEW_CUST_ID" ] && echo true)" "POST /customers - Created ID: $NEW_CUST_ID"

# 3.3 Get Customer by ID
echo -e "\n${BLUE}[3.3]${NC} Get Customer by ID..."
if [ "$NEW_CUST_ID" != "null" ] && [ -n "$NEW_CUST_ID" ]; then
  GET_CUST=$(curl -s "$API_URL/customers/$NEW_CUST_ID" -H "Authorization: Bearer $TOKEN")
  GET_CUST_NAME=$(echo $GET_CUST | jq -r '.name')
  test_result "$([ -n "$GET_CUST_NAME" ] && echo true)" "GET /customers/$NEW_CUST_ID - Name: $GET_CUST_NAME"
else
  test_result "false" "GET /customers/:id - Skipped"
fi

# 3.4 Update Customer
echo -e "\n${BLUE}[3.4]${NC} Update Customer..."
if [ "$NEW_CUST_ID" != "null" ] && [ -n "$NEW_CUST_ID" ]; then
  UPD_CUST=$(curl -s -X PUT "$API_URL/customers/$NEW_CUST_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Updated Customer $(date +%s)\", \"phone\": \"02-999-8888\"}")
  UPD_CUST_ID=$(echo $UPD_CUST | jq -r '.id')
  test_result "$([ "$UPD_CUST_ID" == "$NEW_CUST_ID" ] && echo true)" "PUT /customers/$NEW_CUST_ID - Updated"
else
  test_result "false" "PUT /customers/:id - Skipped"
fi

# 3.5 Delete Customer
echo -e "\n${BLUE}[3.5]${NC} Delete Customer..."
if [ "$NEW_CUST_ID" != "null" ] && [ -n "$NEW_CUST_ID" ]; then
  DEL_CUST=$(curl -s -X DELETE "$API_URL/customers/$NEW_CUST_ID" \
    -H "Authorization: Bearer $TOKEN" -w "%{http_code}" -o /dev/null)
  test_result "$([ "$DEL_CUST" == "200" ] || [ "$DEL_CUST" == "204" ] && echo true)" "DELETE /customers/$NEW_CUST_ID - Status: $DEL_CUST"
else
  test_result "false" "DELETE /customers/:id - Skipped"
fi

# ===========================================
# 4. SUPPLIERS (ผู้จำหน่าย)
# ===========================================
echo -e "\n${CYAN}========================================${NC}"
echo -e "${CYAN}[4] 🏭 SUPPLIERS (ผู้จำหน่าย)${NC}"
echo -e "${CYAN}========================================${NC}"

# 4.1 Get All Suppliers
echo -e "\n${BLUE}[4.1]${NC} Get All Suppliers..."
SUPP_LIST=$(curl -s "$API_URL/suppliers" -H "Authorization: Bearer $TOKEN")
SUPP_COUNT=$(echo $SUPP_LIST | jq 'length')
test_result "$([ "$SUPP_COUNT" -ge 0 ] && echo true)" "GET /suppliers - Found $SUPP_COUNT suppliers"

# 4.2 Create Supplier
echo -e "\n${BLUE}[4.2]${NC} Create Supplier..."
NEW_SUPP=$(curl -s -X POST "$API_URL/suppliers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\": \"SUPP-$(date +%s)\",
    \"name\": \"Test Supplier $(date +%s)\",
    \"address\": \"456 Supplier Road\",
    \"phone\": \"02-456-7890\",
    \"email\": \"supplier@example.com\",
    \"taxId\": \"9876543210123\",
    \"contactPerson\": \"Ms. Supplier\"
  }")
NEW_SUPP_ID=$(echo $NEW_SUPP | jq -r '.id')
test_result "$([ "$NEW_SUPP_ID" != "null" ] && [ -n "$NEW_SUPP_ID" ] && echo true)" "POST /suppliers - Created ID: $NEW_SUPP_ID"

# 4.3 Get Supplier by ID
echo -e "\n${BLUE}[4.3]${NC} Get Supplier by ID..."
if [ "$NEW_SUPP_ID" != "null" ] && [ -n "$NEW_SUPP_ID" ]; then
  GET_SUPP=$(curl -s "$API_URL/suppliers/$NEW_SUPP_ID" -H "Authorization: Bearer $TOKEN")
  GET_SUPP_NAME=$(echo $GET_SUPP | jq -r '.name')
  test_result "$([ -n "$GET_SUPP_NAME" ] && echo true)" "GET /suppliers/$NEW_SUPP_ID - Name: $GET_SUPP_NAME"
else
  test_result "false" "GET /suppliers/:id - Skipped"
fi

# 4.4 Update Supplier
echo -e "\n${BLUE}[4.4]${NC} Update Supplier..."
if [ "$NEW_SUPP_ID" != "null" ] && [ -n "$NEW_SUPP_ID" ]; then
  UPD_SUPP=$(curl -s -X PUT "$API_URL/suppliers/$NEW_SUPP_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Updated Supplier $(date +%s)\", \"phone\": \"02-111-2222\"}")
  UPD_SUPP_ID=$(echo $UPD_SUPP | jq -r '.id')
  test_result "$([ "$UPD_SUPP_ID" == "$NEW_SUPP_ID" ] && echo true)" "PUT /suppliers/$NEW_SUPP_ID - Updated"
else
  test_result "false" "PUT /suppliers/:id - Skipped"
fi

# 4.5 Delete Supplier
echo -e "\n${BLUE}[4.5]${NC} Delete Supplier..."
if [ "$NEW_SUPP_ID" != "null" ] && [ -n "$NEW_SUPP_ID" ]; then
  DEL_SUPP=$(curl -s -X DELETE "$API_URL/suppliers/$NEW_SUPP_ID" \
    -H "Authorization: Bearer $TOKEN" -w "%{http_code}" -o /dev/null)
  test_result "$([ "$DEL_SUPP" == "200" ] || [ "$DEL_SUPP" == "204" ] && echo true)" "DELETE /suppliers/$NEW_SUPP_ID - Status: $DEL_SUPP"
else
  test_result "false" "DELETE /suppliers/:id - Skipped"
fi

# ===========================================
# 5. WAREHOUSES (คลังสินค้า)
# ===========================================
echo -e "\n${CYAN}========================================${NC}"
echo -e "${CYAN}[5] 🏢 WAREHOUSES (คลังสินค้า)${NC}"
echo -e "${CYAN}========================================${NC}"

# 5.1 Get All Warehouses
echo -e "\n${BLUE}[5.1]${NC} Get All Warehouses..."
WH_LIST=$(curl -s "$API_URL/warehouses" -H "Authorization: Bearer $TOKEN")
WH_COUNT=$(echo $WH_LIST | jq 'length')
test_result "$([ "$WH_COUNT" -ge 0 ] && echo true)" "GET /warehouses - Found $WH_COUNT warehouses"

# 5.2 Create Warehouse
echo -e "\n${BLUE}[5.2]${NC} Create Warehouse..."
NEW_WH=$(curl -s -X POST "$API_URL/warehouses" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\": \"WH-$(date +%s)\",
    \"name\": \"Test Warehouse $(date +%s)\",
    \"address\": \"789 Warehouse Ave\",
    \"description\": \"Created by test script\"
  }")
NEW_WH_ID=$(echo $NEW_WH | jq -r '.id')
test_result "$([ "$NEW_WH_ID" != "null" ] && [ -n "$NEW_WH_ID" ] && echo true)" "POST /warehouses - Created ID: $NEW_WH_ID"

# 5.3 Get Warehouse by ID
echo -e "\n${BLUE}[5.3]${NC} Get Warehouse by ID..."
if [ "$NEW_WH_ID" != "null" ] && [ -n "$NEW_WH_ID" ]; then
  GET_WH=$(curl -s "$API_URL/warehouses/$NEW_WH_ID" -H "Authorization: Bearer $TOKEN")
  GET_WH_NAME=$(echo $GET_WH | jq -r '.name')
  test_result "$([ -n "$GET_WH_NAME" ] && echo true)" "GET /warehouses/$NEW_WH_ID - Name: $GET_WH_NAME"
else
  test_result "false" "GET /warehouses/:id - Skipped"
fi

# 5.4 Update Warehouse
echo -e "\n${BLUE}[5.4]${NC} Update Warehouse..."
if [ "$NEW_WH_ID" != "null" ] && [ -n "$NEW_WH_ID" ]; then
  UPD_WH=$(curl -s -X PUT "$API_URL/warehouses/$NEW_WH_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Updated Warehouse $(date +%s)\"}")
  UPD_WH_ID=$(echo $UPD_WH | jq -r '.id')
  test_result "$([ "$UPD_WH_ID" == "$NEW_WH_ID" ] && echo true)" "PUT /warehouses/$NEW_WH_ID - Updated"
else
  test_result "false" "PUT /warehouses/:id - Skipped"
fi

# 5.5 Delete Warehouse
echo -e "\n${BLUE}[5.5]${NC} Delete Warehouse..."
if [ "$NEW_WH_ID" != "null" ] && [ -n "$NEW_WH_ID" ]; then
  DEL_WH=$(curl -s -X DELETE "$API_URL/warehouses/$NEW_WH_ID" \
    -H "Authorization: Bearer $TOKEN" -w "%{http_code}" -o /dev/null)
  test_result "$([ "$DEL_WH" == "200" ] || [ "$DEL_WH" == "204" ] && echo true)" "DELETE /warehouses/$NEW_WH_ID - Status: $DEL_WH"
else
  test_result "false" "DELETE /warehouses/:id - Skipped"
fi

# ===========================================
# Summary
# ===========================================
echo ""
echo "==========================================="
echo -e "${CYAN}📊 Test Summary${NC}"
echo "==========================================="
echo ""
echo -e "  ${GREEN}✅ Passed: $PASSED${NC}"
echo -e "  ${RED}❌ Failed: $FAILED${NC}"
echo -e "  📋 Total:  $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed!${NC}"
else
  echo -e "${YELLOW}⚠️  Some tests failed. Please check the logs above.${NC}"
fi

echo ""
echo "==========================================="
