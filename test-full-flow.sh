#!/bin/bash

# ===========================================
# SVS Stock - Full Flow Test Script
# QT → PO → GR → INV → Payment
# ===========================================

API_URL="https://svs-stock-api.azurewebsites.net/api"
USERNAME="autthapol.s"
PASSWORD="123456"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "==========================================="
echo "🧪 SVS Stock - Full Flow Test"
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
  echo $LOGIN_RESPONSE | jq
  exit 1
fi

echo -e "${GREEN}✅ Login successful${NC}"
echo ""

# ===========================================
# Step 0.1: Get Initial Stock Balance
# ===========================================
echo -e "${BLUE}[Step 0.1]${NC} 📊 Getting initial stock balance..."

INITIAL_STOCK=$(curl -s "$API_URL/stock/balance" \
  -H "Authorization: Bearer $TOKEN")

echo "Initial stock count: $(echo $INITIAL_STOCK | jq 'length') records"
echo ""

# ===========================================
# Step 1: Create Quotation
# ===========================================
echo -e "${BLUE}[Step 1]${NC} 📝 Creating Quotation..."

# Get a customer
CUSTOMER=$(curl -s "$API_URL/customers?limit=1" \
  -H "Authorization: Bearer $TOKEN" | jq '.[0]')

CUSTOMER_ID=$(echo $CUSTOMER | jq -r '.id')
CUSTOMER_NAME=$(echo $CUSTOMER | jq -r '.name')

# Get products
PRODUCTS=$(curl -s "$API_URL/products?limit=2" \
  -H "Authorization: Bearer $TOKEN")

PRODUCT1_ID=$(echo $PRODUCTS | jq -r '.[0].id')
PRODUCT1_NAME=$(echo $PRODUCTS | jq -r '.[0].name')
PRODUCT1_CODE=$(echo $PRODUCTS | jq -r '.[0].code')

PRODUCT2_ID=$(echo $PRODUCTS | jq -r '.[1].id')
PRODUCT2_NAME=$(echo $PRODUCTS | jq -r '.[1].name')
PRODUCT2_CODE=$(echo $PRODUCTS | jq -r '.[1].code')

echo "  Customer: $CUSTOMER_NAME (ID: $CUSTOMER_ID)"
echo "  Product 1: $PRODUCT1_NAME (ID: $PRODUCT1_ID)"
echo "  Product 2: $PRODUCT2_NAME (ID: $PRODUCT2_ID)"

QT_RESPONSE=$(curl -s -X POST "$API_URL/quotations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"customerId\": $CUSTOMER_ID,
    \"customerName\": \"$CUSTOMER_NAME\",
    \"items\": [
      {
        \"sourceType\": \"MASTER\",
        \"productId\": $PRODUCT1_ID,
        \"itemCode\": \"$PRODUCT1_CODE\",
        \"itemName\": \"$PRODUCT1_NAME\",
        \"qty\": 5,
        \"unit\": \"ea\",
        \"unitPrice\": 1000,
        \"estimatedCost\": 800
      },
      {
        \"sourceType\": \"MASTER\",
        \"productId\": $PRODUCT2_ID,
        \"itemCode\": \"$PRODUCT2_CODE\",
        \"itemName\": \"$PRODUCT2_NAME\",
        \"qty\": 3,
        \"unit\": \"ea\",
        \"unitPrice\": 2000,
        \"estimatedCost\": 1500
      }
    ]
  }")

QT_ID=$(echo $QT_RESPONSE | jq -r '.id')
QT_DOC_NO=$(echo $QT_RESPONSE | jq -r '.docFullNo')

if [ "$QT_ID" == "null" ] || [ -z "$QT_ID" ]; then
  echo -e "${RED}❌ Create Quotation failed${NC}"
  echo $QT_RESPONSE | jq
  exit 1
fi

echo -e "${GREEN}✅ Quotation created: $QT_DOC_NO (ID: $QT_ID)${NC}"

# Submit for Approval
echo "  Submitting for approval..."
curl -s -X POST "$API_URL/quotations/$QT_ID/submit" \
  -H "Authorization: Bearer $TOKEN" > /dev/null

# Approve Quotation
echo "  Approving quotation..."
curl -s -X POST "$API_URL/quotations/$QT_ID/approve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"note":"Auto approved by test script"}' > /dev/null

# Send Quotation
echo "  Sending quotation..."
curl -s -X POST "$API_URL/quotations/$QT_ID/send" \
  -H "Authorization: Bearer $TOKEN" > /dev/null

# Confirm Quotation
echo "  Confirming quotation..."
curl -s -X POST "$API_URL/quotations/$QT_ID/confirm" \
  -H "Authorization: Bearer $TOKEN" > /dev/null

echo -e "${GREEN}✅ Quotation approved & confirmed${NC}"
echo ""

# ===========================================
# Step 2: Create Purchase Order from Quotation
# ===========================================
echo -e "${BLUE}[Step 2]${NC} 🛒 Creating Purchase Order..."

# Get a supplier
SUPPLIER=$(curl -s "$API_URL/suppliers?limit=1" \
  -H "Authorization: Bearer $TOKEN" | jq '.[0]')

SUPPLIER_ID=$(echo $SUPPLIER | jq -r '.id')
SUPPLIER_NAME=$(echo $SUPPLIER | jq -r '.name')

echo "  Supplier: $SUPPLIER_NAME (ID: $SUPPLIER_ID)"

PO_RESPONSE=$(curl -s -X POST "$API_URL/purchase-orders/from-quotation/$QT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"supplierId\": $SUPPLIER_ID,
    \"supplierName\": \"$SUPPLIER_NAME\"
  }")

PO_ID=$(echo $PO_RESPONSE | jq -r '.id')
PO_DOC_NO=$(echo $PO_RESPONSE | jq -r '.docFullNo')

if [ "$PO_ID" == "null" ] || [ -z "$PO_ID" ]; then
  echo -e "${RED}❌ Create PO failed${NC}"
  echo $PO_RESPONSE | jq
  exit 1
fi

echo -e "${GREEN}✅ PO created: $PO_DOC_NO (ID: $PO_ID)${NC}"

# Submit PO for approval
echo "  Submitting PO for approval..."
curl -s -X POST "$API_URL/purchase-orders/$PO_ID/submit" \
  -H "Authorization: Bearer $TOKEN" > /dev/null

# Approve PO
echo "  Approving PO..."
curl -s -X POST "$API_URL/purchase-orders/$PO_ID/approve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"note":"Auto approved by test"}' > /dev/null

# Send PO
echo "  Sending PO..."
curl -s -X POST "$API_URL/purchase-orders/$PO_ID/send" \
  -H "Authorization: Bearer $TOKEN" > /dev/null

echo -e "${GREEN}✅ PO approved & sent${NC}"
echo ""

# ===========================================
# Step 3: Create Goods Receipt from PO
# ===========================================
echo -e "${BLUE}[Step 3]${NC} 📦 Creating Goods Receipt..."

# Get a warehouse
WAREHOUSE=$(curl -s "$API_URL/warehouses?limit=1" \
  -H "Authorization: Bearer $TOKEN" | jq '.[0]')

WAREHOUSE_ID=$(echo $WAREHOUSE | jq -r '.id')
WAREHOUSE_NAME=$(echo $WAREHOUSE | jq -r '.name')

echo "  Warehouse: $WAREHOUSE_NAME (ID: $WAREHOUSE_ID)"

GR_RESPONSE=$(curl -s -X POST "$API_URL/goods-receipts/from-po/$PO_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"warehouseId\": $WAREHOUSE_ID,
    \"warehouseName\": \"$WAREHOUSE_NAME\"
  }")

GR_ID=$(echo $GR_RESPONSE | jq -r '.id')
GR_DOC_NO=$(echo $GR_RESPONSE | jq -r '.docFullNo')

if [ "$GR_ID" == "null" ] || [ -z "$GR_ID" ]; then
  echo -e "${RED}❌ Create GR failed${NC}"
  echo $GR_RESPONSE | jq
  exit 1
fi

echo -e "${GREEN}✅ GR created: $GR_DOC_NO (ID: $GR_ID)${NC}"

# Post GR (this adds to FIFO)
echo "  Posting GR (adding to stock)..."
POST_GR_RESPONSE=$(curl -s -X POST "$API_URL/goods-receipts/$GR_ID/post" \
  -H "Authorization: Bearer $TOKEN")

GR_STATUS=$(echo $POST_GR_RESPONSE | jq -r '.status')

if [ "$GR_STATUS" != "POSTED" ]; then
  echo -e "${RED}❌ Post GR failed${NC}"
  echo $POST_GR_RESPONSE | jq
  exit 1
fi

echo -e "${GREEN}✅ GR posted - Stock added to FIFO${NC}"
echo ""

# ===========================================
# Step 3.1: Check Stock After GR
# ===========================================
echo -e "${BLUE}[Step 3.1]${NC} 📊 Checking stock after GR..."

STOCK_AFTER_GR=$(curl -s "$API_URL/stock/balance?warehouseId=$WAREHOUSE_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Stock in $WAREHOUSE_NAME:"
echo $STOCK_AFTER_GR | jq '.[] | {productId, qtyOnHand}'
echo ""

# ===========================================
# Step 4: Create Sales Invoice from Quotation
# ===========================================
echo -e "${BLUE}[Step 4]${NC} 🧾 Creating Sales Invoice..."

INV_RESPONSE=$(curl -s -X POST "$API_URL/sales-invoices/from-quotation/$QT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"warehouseId\": $WAREHOUSE_ID,
    \"warehouseName\": \"$WAREHOUSE_NAME\"
  }")

INV_ID=$(echo $INV_RESPONSE | jq -r '.id')
INV_DOC_NO=$(echo $INV_RESPONSE | jq -r '.docFullNo')

if [ "$INV_ID" == "null" ] || [ -z "$INV_ID" ]; then
  echo -e "${RED}❌ Create Invoice failed${NC}"
  echo $INV_RESPONSE | jq
  exit 1
fi

echo -e "${GREEN}✅ Invoice created: $INV_DOC_NO (ID: $INV_ID)${NC}"

# Post Invoice (this deducts from FIFO)
echo "  Posting Invoice (deducting from stock)..."
POST_INV_RESPONSE=$(curl -s -X POST "$API_URL/sales-invoices/$INV_ID/post" \
  -H "Authorization: Bearer $TOKEN")

INV_STATUS=$(echo $POST_INV_RESPONSE | jq -r '.status')

if [ "$INV_STATUS" != "POSTED" ]; then
  echo -e "${RED}❌ Post Invoice failed${NC}"
  echo $POST_INV_RESPONSE | jq
  exit 1
fi

echo -e "${GREEN}✅ Invoice posted - Stock deducted from FIFO${NC}"
echo ""

# ===========================================
# Step 4.1: Check Stock After Invoice
# ===========================================
echo -e "${BLUE}[Step 4.1]${NC} 📊 Checking stock after Invoice..."

STOCK_AFTER_INV=$(curl -s "$API_URL/stock/balance?warehouseId=$WAREHOUSE_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Stock in $WAREHOUSE_NAME:"
echo $STOCK_AFTER_INV | jq '.[] | {productId, qtyOnHand}'
echo ""

# ===========================================
# Step 5: Mark Invoice as Paid
# ===========================================
echo -e "${BLUE}[Step 5]${NC} 💰 Marking Invoice as Paid..."

PAID_RESPONSE=$(curl -s -X POST "$API_URL/sales-invoices/$INV_ID/mark-paid" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"paymentMethod\": \"TRANSFER\",
    \"paymentReference\": \"TEST-$(date +%s)\"
  }")

PAID_STATUS=$(echo $PAID_RESPONSE | jq -r '.status')

if [ "$PAID_STATUS" != "PAID" ]; then
  echo -e "${RED}❌ Mark as Paid failed${NC}"
  echo $PAID_RESPONSE | jq
  exit 1
fi

echo -e "${GREEN}✅ Invoice marked as PAID${NC}"
echo ""

# ===========================================
# Step 6: Verify Final Quotation Status
# ===========================================
echo -e "${BLUE}[Step 6]${NC} 🔍 Verifying Quotation Status..."

QT_FINAL=$(curl -s "$API_URL/quotations/$QT_ID" \
  -H "Authorization: Bearer $TOKEN")

QT_FINAL_STATUS=$(echo $QT_FINAL | jq -r '.status')
QT_FULFILLMENT=$(echo $QT_FINAL | jq -r '.fulfillmentPercent')

echo "  Quotation Status: $QT_FINAL_STATUS"
echo "  Fulfillment: $QT_FULFILLMENT%"
echo ""

# ===========================================
# Step 7: Check for Negative Stock
# ===========================================
echo -e "${BLUE}[Step 7]${NC} ⚠️  Checking for negative stock..."

NEGATIVE_STOCK=$(curl -s "$API_URL/stock/balance" \
  -H "Authorization: Bearer $TOKEN" | jq '[.[] | select(.qtyOnHand | tonumber < 0)]')

NEGATIVE_COUNT=$(echo $NEGATIVE_STOCK | jq 'length')

if [ "$NEGATIVE_COUNT" -gt 0 ]; then
  echo -e "${RED}❌ Found $NEGATIVE_COUNT negative stock records:${NC}"
  echo $NEGATIVE_STOCK | jq
else
  echo -e "${GREEN}✅ No negative stock found${NC}"
fi
echo ""

# ===========================================
# Summary
# ===========================================
echo "==========================================="
echo -e "${GREEN}🎉 Full Flow Test Complete!${NC}"
echo "==========================================="
echo ""
echo "📋 Documents Created:"
echo "  • Quotation:    $QT_DOC_NO (ID: $QT_ID)"
echo "  • PO:           $PO_DOC_NO (ID: $PO_ID)"
echo "  • GR:           $GR_DOC_NO (ID: $GR_ID)"
echo "  • Invoice:      $INV_DOC_NO (ID: $INV_ID)"
echo ""
echo "📊 Final Status:"
echo "  • QT Status:    $QT_FINAL_STATUS"
echo "  • Negative Stock: $NEGATIVE_COUNT records"
echo ""
echo "==========================================="
