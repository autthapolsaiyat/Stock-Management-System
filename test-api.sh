#!/bin/bash

# SVS Stock Management System - API Test Script
# =============================================

BASE_URL="https://svs-stock-api.bravetree-eb71039c.southeastasia.azurecontainerapps.io"
RESULTS_FILE="test_results_$(date +%Y%m%d_%H%M%S).txt"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
PASSED=0
FAILED=0

# Log function
log() {
    echo -e "$1" | tee -a "$RESULTS_FILE"
}

# Test function
test_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    local expected_status=$5
    local description=$6
    
    TOTAL=$((TOTAL + 1))
    
    if [ -n "$token" ]; then
        AUTH_HEADER="-H \"Authorization: Bearer $token\""
    else
        AUTH_HEADER=""
    fi
    
    if [ -n "$data" ]; then
        DATA_ARG="-d '$data'"
    else
        DATA_ARG=""
    fi
    
    # Build and execute curl command
    CMD="curl -s -w '\n%{http_code}' -X $method \"$BASE_URL$endpoint\" -H \"Content-Type: application/json\""
    [ -n "$token" ] && CMD="$CMD -H \"Authorization: Bearer $token\""
    [ -n "$data" ] && CMD="$CMD -d '$data'"
    
    RESPONSE=$(eval $CMD)
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" == "$expected_status" ]; then
        log "${GREEN}✓ PASS${NC} [$method] $endpoint - $description (HTTP $HTTP_CODE)"
        PASSED=$((PASSED + 1))
        echo "$BODY" | head -c 200
        echo ""
    else
        log "${RED}✗ FAIL${NC} [$method] $endpoint - $description (Expected: $expected_status, Got: $HTTP_CODE)"
        FAILED=$((FAILED + 1))
        echo "Response: $BODY" | head -c 500
        echo ""
    fi
    
    echo ""
}

# Extract value from JSON
extract_json() {
    echo "$1" | grep -o "\"$2\":[^,}]*" | head -1 | cut -d: -f2 | tr -d '"' | tr -d ' '
}

log "=============================================="
log "SVS Stock Management System - API Test Report"
log "=============================================="
log "Base URL: $BASE_URL"
log "Test Date: $(date)"
log "=============================================="
log ""

# ========================================
# 1. HEALTH CHECK
# ========================================
log "${BLUE}=== 1. HEALTH CHECK ===${NC}"
test_api "GET" "/api/health" "" "" "200" "Health check endpoint"

# ========================================
# 2. AUTHENTICATION
# ========================================
log "${BLUE}=== 2. AUTHENTICATION ===${NC}"

# Test invalid login
test_api "POST" "/api/auth/login" '{"username":"wrong","password":"wrong"}' "" "401" "Invalid credentials"

# Test valid login - Admin
log "Testing Admin Login..."
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}')

ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ADMIN_TOKEN" ]; then
    log "${GREEN}✓ PASS${NC} Admin login successful"
    PASSED=$((PASSED + 1))
else
    log "${RED}✗ FAIL${NC} Admin login failed"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

# ========================================
# 3. USER MANAGEMENT APIs
# ========================================
log ""
log "${BLUE}=== 3. USER MANAGEMENT APIs ===${NC}"

# Get all users
test_api "GET" "/api/users" "" "$ADMIN_TOKEN" "200" "Get all users"

# Get roles
test_api "GET" "/api/users/roles" "" "$ADMIN_TOKEN" "200" "Get all roles"

# Create new user
NEW_USER='{"username":"testuser1","password":"Test1234!","fullName":"Test User 1","email":"test1@svs.com","roleIds":[2]}'
test_api "POST" "/api/users" "$NEW_USER" "$ADMIN_TOKEN" "201" "Create new user"

# Get user by ID
test_api "GET" "/api/users/1" "" "$ADMIN_TOKEN" "200" "Get user by ID"

# Update user
UPDATE_USER='{"fullName":"Updated Test User"}'
test_api "PUT" "/api/users/2" "$UPDATE_USER" "$ADMIN_TOKEN" "200" "Update user"

# ========================================
# 4. PRODUCT APIs
# ========================================
log ""
log "${BLUE}=== 4. PRODUCT APIs ===${NC}"

# Get all products
test_api "GET" "/api/products" "" "$ADMIN_TOKEN" "200" "Get all products"

# Get categories
test_api "GET" "/api/products/categories" "" "$ADMIN_TOKEN" "200" "Get product categories"

# Get units
test_api "GET" "/api/products/units" "" "$ADMIN_TOKEN" "200" "Get units"

# Create category
NEW_CATEGORY='{"name":"Test Category","description":"Test category description"}'
test_api "POST" "/api/products/categories" "$NEW_CATEGORY" "$ADMIN_TOKEN" "201" "Create product category"

# Create unit
NEW_UNIT='{"code":"BOX","name":"Box"}'
test_api "POST" "/api/products/units" "$NEW_UNIT" "$ADMIN_TOKEN" "201" "Create unit"

# Create product
NEW_PRODUCT='{"sku":"TEST-001","name":"Test Product 1","unitId":1,"unitPrice":100,"costPrice":80}'
test_api "POST" "/api/products" "$NEW_PRODUCT" "$ADMIN_TOKEN" "201" "Create product"

# Get product by ID
test_api "GET" "/api/products/1" "" "$ADMIN_TOKEN" "200" "Get product by ID"

# Update product
UPDATE_PRODUCT='{"name":"Updated Test Product","unitPrice":150}'
test_api "PUT" "/api/products/1" "$UPDATE_PRODUCT" "$ADMIN_TOKEN" "200" "Update product"

# ========================================
# 5. UNAUTHORIZED ACCESS TEST
# ========================================
log ""
log "${BLUE}=== 5. UNAUTHORIZED ACCESS TEST ===${NC}"

# Test without token
test_api "GET" "/api/users" "" "" "401" "Access without token should fail"
test_api "GET" "/api/products" "" "" "401" "Products without token should fail"

# Test with invalid token
test_api "GET" "/api/users" "" "invalid_token_123" "401" "Access with invalid token should fail"

# ========================================
# 6. SUMMARY
# ========================================
log ""
log "=============================================="
log "                TEST SUMMARY                  "
log "=============================================="
log "Total Tests: $TOTAL"
log "${GREEN}Passed: $PASSED${NC}"
log "${RED}Failed: $FAILED${NC}"
log "Success Rate: $(echo "scale=2; $PASSED * 100 / $TOTAL" | bc)%"
log "=============================================="
log ""

# Check available endpoints
log "${BLUE}=== AVAILABLE API ENDPOINTS ===${NC}"
log ""
log "HEALTH:"
log "  GET  /api/health"
log ""
log "AUTH:"
log "  POST /api/auth/login"
log ""
log "USERS:"
log "  GET    /api/users"
log "  GET    /api/users/:id"
log "  GET    /api/users/roles"
log "  POST   /api/users"
log "  PUT    /api/users/:id"
log "  DELETE /api/users/:id"
log ""
log "PRODUCTS:"
log "  GET    /api/products"
log "  GET    /api/products/:id"
log "  GET    /api/products/categories"
log "  GET    /api/products/units"
log "  POST   /api/products"
log "  POST   /api/products/categories"
log "  POST   /api/products/units"
log "  PUT    /api/products/:id"
log "  DELETE /api/products/:id"
log ""
log "Results saved to: $RESULTS_FILE"
