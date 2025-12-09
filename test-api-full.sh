#!/bin/bash

# ============================================
# SVS Stock Management System - API Test Script
# ============================================

BASE_URL="https://svs-stock-api.bravetree-eb71039c.southeastasia.azurecontainerapps.io"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Counters
TOTAL=0
PASSED=0
FAILED=0

echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}SVS Stock API - Comprehensive Test Suite${NC}"
echo -e "${CYAN}============================================${NC}"
echo "Base URL: $BASE_URL"
echo "Date: $(date)"
echo ""

# Test function
test_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    local expected=$5
    local desc=$6
    
    TOTAL=$((TOTAL + 1))
    
    CMD="curl -s -w '\n%{http_code}' -X $method '$BASE_URL$endpoint' -H 'Content-Type: application/json'"
    [ -n "$token" ] && CMD="$CMD -H 'Authorization: Bearer $token'"
    [ -n "$data" ] && CMD="$CMD -d '$data'"
    
    RESP=$(eval $CMD 2>/dev/null)
    CODE=$(echo "$RESP" | tail -1)
    BODY=$(echo "$RESP" | sed '$d')
    
    if [ "$CODE" == "$expected" ]; then
        echo -e "${GREEN}✓${NC} [$method] $endpoint - $desc (HTTP $CODE)"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗${NC} [$method] $endpoint - $desc (Expected: $expected, Got: $CODE)"
        FAILED=$((FAILED + 1))
    fi
    
    # Return body for extraction
    echo "$BODY" > /tmp/last_response.json
}

# ============================================
# 1. HEALTH CHECK
# ============================================
echo -e "\n${BLUE}=== 1. HEALTH CHECK ===${NC}"
test_api "GET" "/api/health" "" "" "200" "Health check"

# ============================================
# 2. AUTHENTICATION
# ============================================
echo -e "\n${BLUE}=== 2. AUTHENTICATION ===${NC}"
test_api "POST" "/api/auth/login" '{"username":"wrong","password":"wrong"}' "" "401" "Invalid login"

# Login as admin
echo -n "Logging in as admin... "
ADMIN_RESP=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}')
ADMIN_TOKEN=$(echo "$ADMIN_RESP" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ADMIN_TOKEN" ]; then
    echo -e "${GREEN}SUCCESS${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}FAILED${NC}"
    echo "Response: $ADMIN_RESP"
    FAILED=$((FAILED + 1))
    echo -e "\n${RED}Cannot continue without admin token!${NC}"
    exit 1
fi
TOTAL=$((TOTAL + 1))

# ============================================
# 3. USER APIs
# ============================================
echo -e "\n${BLUE}=== 3. USER MANAGEMENT ===${NC}"
test_api "GET" "/api/users" "" "$ADMIN_TOKEN" "200" "Get all users"
test_api "GET" "/api/users/roles" "" "$ADMIN_TOKEN" "200" "Get all roles"
test_api "GET" "/api/users/1" "" "$ADMIN_TOKEN" "200" "Get user by ID"

# ============================================
# 4. PRODUCT APIs
# ============================================
echo -e "\n${BLUE}=== 4. PRODUCTS ===${NC}"
test_api "GET" "/api/products" "" "$ADMIN_TOKEN" "200" "Get all products"
test_api "GET" "/api/products/categories" "" "$ADMIN_TOKEN" "200" "Get categories"
test_api "GET" "/api/products/units" "" "$ADMIN_TOKEN" "200" "Get units"

# Create product
test_api "POST" "/api/products" '{"sku":"TEST-001","name":"Test Product","unitId":1,"unitPrice":100}' "$ADMIN_TOKEN" "201" "Create product"

# ============================================
# 5. CUSTOMER APIs
# ============================================
echo -e "\n${BLUE}=== 5. CUSTOMERS ===${NC}"
test_api "GET" "/api/customers" "" "$ADMIN_TOKEN" "200" "Get all customers"

# Create customer
test_api "POST" "/api/customers" '{"code":"CUST001","name":"Test Customer"}' "$ADMIN_TOKEN" "201" "Create customer"

# ============================================
# 6. SUPPLIER APIs
# ============================================
echo -e "\n${BLUE}=== 6. SUPPLIERS ===${NC}"
test_api "GET" "/api/suppliers" "" "$ADMIN_TOKEN" "200" "Get all suppliers"

# Create supplier
test_api "POST" "/api/suppliers" '{"code":"SUPP001","name":"Test Supplier"}' "$ADMIN_TOKEN" "201" "Create supplier"

# ============================================
# 7. WAREHOUSE APIs
# ============================================
echo -e "\n${BLUE}=== 7. WAREHOUSES ===${NC}"
test_api "GET" "/api/warehouses" "" "$ADMIN_TOKEN" "200" "Get all warehouses"

# ============================================
# 8. QUOTATION APIs
# ============================================
echo -e "\n${BLUE}=== 8. QUOTATIONS ===${NC}"
test_api "GET" "/api/quotations" "" "$ADMIN_TOKEN" "200" "Get all quotations"

# Create quotation
QUOT_DATA='{"customerId":1,"items":[{"productId":1,"qty":10,"unitPrice":100}]}'
test_api "POST" "/api/quotations" "$QUOT_DATA" "$ADMIN_TOKEN" "201" "Create quotation"

# Get created quotation ID
QUOT_ID=$(cat /tmp/last_response.json | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
if [ -n "$QUOT_ID" ]; then
    test_api "GET" "/api/quotations/$QUOT_ID" "" "$ADMIN_TOKEN" "200" "Get quotation by ID"
    test_api "POST" "/api/quotations/$QUOT_ID/confirm" "" "$ADMIN_TOKEN" "200" "Confirm quotation"
fi

# ============================================
# 9. PURCHASE ORDER APIs
# ============================================
echo -e "\n${BLUE}=== 9. PURCHASE ORDERS ===${NC}"
test_api "GET" "/api/purchase-orders" "" "$ADMIN_TOKEN" "200" "Get all POs"

# Create PO
PO_DATA='{"supplierId":1,"items":[{"productId":1,"qty":50,"unitPrice":80}]}'
test_api "POST" "/api/purchase-orders" "$PO_DATA" "$ADMIN_TOKEN" "201" "Create PO"

PO_ID=$(cat /tmp/last_response.json | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
if [ -n "$PO_ID" ]; then
    test_api "GET" "/api/purchase-orders/$PO_ID" "" "$ADMIN_TOKEN" "200" "Get PO by ID"
    test_api "POST" "/api/purchase-orders/$PO_ID/approve" "" "$ADMIN_TOKEN" "200" "Approve PO"
fi

# ============================================
# 10. GOODS RECEIPT APIs
# ============================================
echo -e "\n${BLUE}=== 10. GOODS RECEIPTS ===${NC}"
test_api "GET" "/api/goods-receipts" "" "$ADMIN_TOKEN" "200" "Get all GRNs"

# Create GRN
GRN_DATA='{"supplierId":1,"warehouseId":1,"items":[{"productId":1,"qty":50,"unitCost":80}]}'
test_api "POST" "/api/goods-receipts" "$GRN_DATA" "$ADMIN_TOKEN" "201" "Create GRN"

GRN_ID=$(cat /tmp/last_response.json | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
if [ -n "$GRN_ID" ]; then
    test_api "GET" "/api/goods-receipts/$GRN_ID" "" "$ADMIN_TOKEN" "200" "Get GRN by ID"
    test_api "POST" "/api/goods-receipts/$GRN_ID/post" "" "$ADMIN_TOKEN" "200" "Post GRN (add stock)"
fi

# ============================================
# 11. STOCK APIs
# ============================================
echo -e "\n${BLUE}=== 11. STOCK BALANCE ===${NC}"
test_api "GET" "/api/stock/balance" "" "$ADMIN_TOKEN" "200" "Get stock balance"
test_api "GET" "/api/stock/balance?productId=1" "" "$ADMIN_TOKEN" "200" "Get balance by product"
test_api "GET" "/api/stock/fifo-layers?productId=1" "" "$ADMIN_TOKEN" "200" "Get FIFO layers"

# ============================================
# 12. STOCK ISSUE APIs
# ============================================
echo -e "\n${BLUE}=== 12. STOCK ISSUES ===${NC}"
test_api "GET" "/api/stock-issues" "" "$ADMIN_TOKEN" "200" "Get all stock issues"

# Create and post issue
ISSUE_DATA='{"warehouseId":1,"issueType":"general","items":[{"productId":1,"qty":5}]}'
test_api "POST" "/api/stock-issues" "$ISSUE_DATA" "$ADMIN_TOKEN" "201" "Create stock issue"

ISSUE_ID=$(cat /tmp/last_response.json | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
if [ -n "$ISSUE_ID" ]; then
    test_api "POST" "/api/stock-issues/$ISSUE_ID/post" "" "$ADMIN_TOKEN" "200" "Post stock issue"
fi

# ============================================
# 13. STOCK TRANSFER APIs
# ============================================
echo -e "\n${BLUE}=== 13. STOCK TRANSFERS ===${NC}"
test_api "GET" "/api/stock-transfers" "" "$ADMIN_TOKEN" "200" "Get all transfers"

# ============================================
# 14. SALES INVOICE APIs
# ============================================
echo -e "\n${BLUE}=== 14. SALES INVOICES ===${NC}"
test_api "GET" "/api/sales-invoices" "" "$ADMIN_TOKEN" "200" "Get all invoices"

# Create invoice
INV_DATA='{"customerId":1,"warehouseId":1,"items":[{"productId":1,"qty":5,"unitPrice":150}]}'
test_api "POST" "/api/sales-invoices" "$INV_DATA" "$ADMIN_TOKEN" "201" "Create invoice"

INV_ID=$(cat /tmp/last_response.json | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
if [ -n "$INV_ID" ]; then
    test_api "GET" "/api/sales-invoices/$INV_ID" "" "$ADMIN_TOKEN" "200" "Get invoice by ID"
    test_api "POST" "/api/sales-invoices/$INV_ID/post" "" "$ADMIN_TOKEN" "200" "Post invoice"
fi

# ============================================
# 15. UNAUTHORIZED ACCESS
# ============================================
echo -e "\n${BLUE}=== 15. SECURITY TESTS ===${NC}"
test_api "GET" "/api/users" "" "" "401" "Users without token"
test_api "GET" "/api/products" "" "" "401" "Products without token"
test_api "GET" "/api/quotations" "" "" "401" "Quotations without token"
test_api "GET" "/api/users" "" "invalid_token" "401" "Invalid token"

# ============================================
# SUMMARY
# ============================================
echo -e "\n${CYAN}============================================${NC}"
echo -e "${CYAN}                TEST SUMMARY               ${NC}"
echo -e "${CYAN}============================================${NC}"
echo -e "Total Tests:  $TOTAL"
echo -e "${GREEN}Passed:       $PASSED${NC}"
echo -e "${RED}Failed:       $FAILED${NC}"
SUCCESS_RATE=$(echo "scale=1; $PASSED * 100 / $TOTAL" | bc)
echo -e "Success Rate: ${SUCCESS_RATE}%"
echo -e "${CYAN}============================================${NC}"

# ============================================
# API ENDPOINTS SUMMARY
# ============================================
echo -e "\n${YELLOW}=== AVAILABLE API ENDPOINTS ===${NC}"
cat << 'ENDPOINTS'

AUTHENTICATION:
  POST /api/auth/login              - Login and get JWT token

USERS:
  GET    /api/users                 - List all users
  GET    /api/users/:id             - Get user by ID
  GET    /api/users/roles           - List all roles
  POST   /api/users                 - Create user
  PUT    /api/users/:id             - Update user
  DELETE /api/users/:id             - Delete user

PRODUCTS:
  GET    /api/products              - List products
  GET    /api/products/:id          - Get product by ID
  GET    /api/products/categories   - List categories
  GET    /api/products/units        - List units
  POST   /api/products              - Create product
  POST   /api/products/categories   - Create category
  POST   /api/products/units        - Create unit
  PUT    /api/products/:id          - Update product
  DELETE /api/products/:id          - Delete product

CUSTOMERS:
  GET    /api/customers             - List customers
  GET    /api/customers/:id         - Get customer by ID
  POST   /api/customers             - Create customer
  PUT    /api/customers/:id         - Update customer

SUPPLIERS:
  GET    /api/suppliers             - List suppliers
  GET    /api/suppliers/:id         - Get supplier by ID
  POST   /api/suppliers             - Create supplier
  PUT    /api/suppliers/:id         - Update supplier

WAREHOUSES:
  GET    /api/warehouses            - List warehouses
  GET    /api/warehouses/:id        - Get warehouse by ID
  POST   /api/warehouses            - Create warehouse
  PUT    /api/warehouses/:id        - Update warehouse

QUOTATIONS:
  GET    /api/quotations            - List quotations
  GET    /api/quotations/:id        - Get quotation by ID
  POST   /api/quotations            - Create quotation
  POST   /api/quotations/:id/confirm - Confirm quotation
  POST   /api/quotations/:id/cancel  - Cancel quotation

PURCHASE ORDERS:
  GET    /api/purchase-orders       - List POs
  GET    /api/purchase-orders/:id   - Get PO by ID
  POST   /api/purchase-orders       - Create PO
  POST   /api/purchase-orders/:id/approve - Approve PO
  POST   /api/purchase-orders/:id/cancel  - Cancel PO

GOODS RECEIPTS:
  GET    /api/goods-receipts        - List GRNs
  GET    /api/goods-receipts/:id    - Get GRN by ID
  POST   /api/goods-receipts        - Create GRN
  POST   /api/goods-receipts/:id/post   - Post GRN (add stock)
  POST   /api/goods-receipts/:id/cancel - Cancel GRN

STOCK ISSUES:
  GET    /api/stock-issues          - List stock issues
  GET    /api/stock-issues/:id      - Get issue by ID
  POST   /api/stock-issues          - Create stock issue
  POST   /api/stock-issues/:id/post - Post issue (deduct stock)

STOCK TRANSFERS:
  GET    /api/stock-transfers       - List transfers
  GET    /api/stock-transfers/:id   - Get transfer by ID
  POST   /api/stock-transfers       - Create transfer
  POST   /api/stock-transfers/:id/post - Post transfer

SALES INVOICES:
  GET    /api/sales-invoices        - List invoices
  GET    /api/sales-invoices/:id    - Get invoice by ID
  POST   /api/sales-invoices        - Create invoice
  POST   /api/sales-invoices/:id/post   - Post invoice (deduct stock)
  POST   /api/sales-invoices/:id/cancel - Cancel invoice

STOCK:
  GET    /api/stock/balance         - Get stock balance
  GET    /api/stock/fifo-layers     - Get FIFO layers

HEALTH:
  GET    /api/health                - Health check
ENDPOINTS

# Cleanup
rm -f /tmp/last_response.json
