#!/bin/bash

# SVS Stock - Create Users Script
# ================================

API_URL="https://svs-stock-api.bravetree-eb71039c.southeastasia.azurecontainerapps.io"

echo "=============================================="
echo "🔐 SVS Stock - Create Users Script"
echo "=============================================="

# Login to get token
echo ""
echo "[1/8] Logging in as admin..."
TOKEN=$(curl -s "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  exit 1
fi
echo "✅ Login successful"

# Function to create user
create_user() {
  local username=$1
  local password=$2
  local email=$3
  local fullName=$4
  local roleId=$5
  local roleName=$6
  
  echo ""
  echo "[Creating] $username ($roleName)..."
  
  RESPONSE=$(curl -s -X POST "$API_URL/api/users" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"username\": \"$username\",
      \"password\": \"$password\",
      \"email\": \"$email\",
      \"fullName\": \"$fullName\",
      \"roleIds\": [$roleId]
    }")
  
  if echo "$RESPONSE" | grep -q '"id"'; then
    echo "✅ Created: $username / $password"
  else
    echo "⚠️  $username: $(echo $RESPONSE | grep -o '"message":"[^"]*' | cut -d'"' -f4)"
  fi
}

# Create users for each role
echo ""
echo "=============================================="
echo "📝 Creating Users..."
echo "=============================================="

create_user "manager1" "Manager@123" "manager@svs.com" "ผู้จัดการ ใจดี" 2 "MANAGER"
create_user "warehouse1" "Warehouse@123" "warehouse@svs.com" "คลัง สินค้า" 3 "WAREHOUSE"
create_user "sales1" "Sales@123" "sales@svs.com" "ฝ่ายขาย รักลูกค้า" 4 "SALES"
create_user "purchasing1" "Purchasing@123" "purchasing@svs.com" "จัดซื้อ ประหยัด" 5 "PURCHASING"
create_user "accounting1" "Accounting@123" "accounting@svs.com" "บัญชี ตรงเวลา" 6 "ACCOUNTING"
create_user "viewer1" "Viewer@123" "viewer@svs.com" "ผู้ชม อ่านอย่างเดียว" 7 "VIEWER"

echo ""
echo "=============================================="
echo "✅ Done! User Credentials Summary"
echo "=============================================="
echo ""
echo "| Username     | Password       | Role        |"
echo "|--------------|----------------|-------------|"
echo "| admin        | admin123       | ADMIN       |"
echo "| manager1     | Manager@123    | MANAGER     |"
echo "| warehouse1   | Warehouse@123  | WAREHOUSE   |"
echo "| sales1       | Sales@123      | SALES       |"
echo "| purchasing1  | Purchasing@123 | PURCHASING  |"
echo "| accounting1  | Accounting@123 | ACCOUNTING  |"
echo "| viewer1      | Viewer@123     | VIEWER      |"
echo ""
echo "🌐 Login URL: https://witty-mushroom-0d3c50600.3.azurestaticapps.net"
echo "=============================================="
