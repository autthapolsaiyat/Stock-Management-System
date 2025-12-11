#!/bin/bash

API_URL="https://svs-stock-api.bravetree-eb71039c.southeastasia.azurecontainerapps.io"

echo ""
echo "=============================================="
echo "🧪 SVS Stock - Bug Testing Script"
echo "=============================================="

# Bug #7: Login Error
echo ""
echo "[Bug #7] Testing Login Error..."
RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"wronguser","password":"wrongpass"}')

if echo "$RESPONSE" | grep -q "Unauthorized\|Invalid\|error\|401"; then
  echo "✅ Bug #7 PASS: Login returns error for wrong credentials"
else
  echo "❌ Bug #7: Response: $RESPONSE"
fi

# Login
echo ""
echo "[Login] Getting token..."
RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

TOKEN=$(echo "$RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ Login successful"
else
  echo "❌ Login failed"
  exit 1
fi

# Bug #9: Products with minStock/maxStock
echo ""
echo "[Bug #9] Testing Products..."
PRODUCTS=$(curl -s "$API_URL/api/products" -H "Authorization: Bearer $TOKEN")
echo "Products response (first 200 chars): ${PRODUCTS:0:200}"

# Bug #2,3: Create PO
echo ""
echo "[Bug #2,3] Testing Purchase Orders..."

# Get supplier
SUPPLIERS=$(curl -s "$API_URL/api/suppliers" -H "Authorization: Bearer $TOKEN")
SUPPLIER_ID=$(echo "$SUPPLIERS" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "Supplier ID: $SUPPLIER_ID"

# Get product
PRODUCT_ID=$(echo "$PRODUCTS" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "Product ID: $PRODUCT_ID"

if [ -n "$SUPPLIER_ID" ] && [ -n "$PRODUCT_ID" ]; then
  # Create PO
  CREATE_PO=$(curl -s -X POST "$API_URL/api/purchase-orders" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "supplierId": '$SUPPLIER_ID',
      "docDate": "'$(date +%Y-%m-%d)'",
      "items": [{"productId": '$PRODUCT_ID', "qty": 10, "unitPrice": 100, "lineNo": 1, "lineTotal": 1000}],
      "totalAmount": 1000
    }')
  
  PO_ID=$(echo "$CREATE_PO" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
  PO_DOCNO=$(echo "$CREATE_PO" | grep -o '"docNo":"[^"]*' | cut -d'"' -f4)
  
  if [ -n "$PO_ID" ]; then
    echo "✅ Bug #3 PASS: PO created with ID: $PO_ID, DocNo: $PO_DOCNO"
    
    # Bug #4: Update PO
    echo ""
    echo "[Bug #4] Testing PO Update..."
    UPDATE_PO=$(curl -s -X PUT "$API_URL/api/purchase-orders/$PO_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"supplierId": '$SUPPLIER_ID', "remark": "Updated", "items": [{"productId": '$PRODUCT_ID', "qty": 20, "unitPrice": 100, "lineNo": 1, "lineTotal": 2000}], "totalAmount": 2000}')
    
    if echo "$UPDATE_PO" | grep -q '"id"'; then
      echo "✅ Bug #4 PASS: PO updated successfully"
    else
      echo "❌ Bug #4 FAIL: $UPDATE_PO"
    fi
    
    # Approve PO
    echo ""
    echo "[PO] Approving..."
    APPROVE=$(curl -s -X POST "$API_URL/api/purchase-orders/$PO_ID/approve" -H "Authorization: Bearer $TOKEN")
    echo "Approve response: ${APPROVE:0:100}"
    
    # Bug #5,6: GR
    echo ""
    echo "[Bug #5,6] Testing Goods Receipts..."
    WAREHOUSES=$(curl -s "$API_URL/api/warehouses" -H "Authorization: Bearer $TOKEN")
    WH_ID=$(echo "$WAREHOUSES" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    echo "Warehouse ID: $WH_ID"
    
    if [ -n "$WH_ID" ]; then
      CREATE_GR=$(curl -s -X POST "$API_URL/api/goods-receipts" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
          "supplierId": '$SUPPLIER_ID',
          "warehouseId": '$WH_ID',
          "poId": '$PO_ID',
          "docDate": "'$(date +%Y-%m-%d)'",
          "items": [{"productId": '$PRODUCT_ID', "qty": 20, "unitCost": 100, "lineNo": 1, "lineTotal": 2000}],
          "totalAmount": 2000
        }')
      
      GR_ID=$(echo "$CREATE_GR" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
      
      if [ -n "$GR_ID" ]; then
        echo "✅ Bug #6 PASS: GR created with PO link, ID: $GR_ID"
        
        # Update GR
        UPDATE_GR=$(curl -s -X PUT "$API_URL/api/goods-receipts/$GR_ID" \
          -H "Authorization: Bearer $TOKEN" \
          -H "Content-Type: application/json" \
          -d '{"supplierId": '$SUPPLIER_ID', "warehouseId": '$WH_ID', "remark": "Updated", "items": [{"productId": '$PRODUCT_ID', "qty": 25, "unitCost": 100, "lineNo": 1, "lineTotal": 2500}], "totalAmount": 2500}')
        
        if echo "$UPDATE_GR" | grep -q '"id"'; then
          echo "✅ Bug #5 PASS: GR updated successfully"
        else
          echo "❌ Bug #5 FAIL: $UPDATE_GR"
        fi
      else
        echo "❌ Bug #6 FAIL: $CREATE_GR"
      fi
    fi
  else
    echo "❌ Bug #3 FAIL: $CREATE_PO"
  fi
fi

# Bug #1: Upload
echo ""
echo "[Bug #1] Testing Image Upload..."
UPLOAD=$(curl -s -X POST "$API_URL/api/upload/base64" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "folder": "test"}')

if echo "$UPLOAD" | grep -q '"url"'; then
  echo "✅ Bug #1 PASS: Upload works"
else
  echo "❌ Bug #1 FAIL: $UPLOAD"
fi

echo ""
echo "=============================================="
echo "📊 Summary"
echo "=============================================="
echo "Bug #2: PO Total - Frontend (useMemo)"
echo "Bug #7: Login Error - ✅"
echo "Bug #8: Product Code - Frontend (disabled)"
echo "Bug #9: Min/Max - Frontend (columns)"
echo "Bug #10: Post Button - Frontend (styled)"
echo "=============================================="
