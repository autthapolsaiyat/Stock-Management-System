# SVS Stock Management - Frontend

ระบบจัดการคลังสินค้า (Stock Management System) - Frontend

## Tech Stack

- **React 18** + **TypeScript**
- **Ant Design 5** - UI Components
- **React Router 6** - Routing
- **Axios** - API Client
- **Vite** - Build Tool

## Theme

ใช้ **Hologram Theme** แบบ Dark Mode พร้อม:
- Gradient หลัก: Indigo → Purple → Pink → Cyan
- Glass/Blur effects
- Grid background

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features

### ข้อมูลหลัก (Master Data)
- ✅ สินค้า (Products)
- ✅ ลูกค้า (Customers)
- ✅ ผู้จำหน่าย (Suppliers)
- ✅ คลังสินค้า (Warehouses)

### การขาย (Sales)
- 🚧 ใบเสนอราคา (Quotations)
- 🚧 ใบขายสินค้า (Sales Invoices)

### การซื้อ (Purchase)
- 🚧 ใบสั่งซื้อ (Purchase Orders)
- 🚧 ใบรับสินค้า (Goods Receipts)

### คลังสินค้า (Inventory)
- ✅ ยอดสินค้าคงเหลือ (Stock Balance)
- 🚧 เบิกสินค้า (Stock Issues)
- 🚧 โอนสินค้า (Stock Transfers)

## API Connection

Backend API: `https://svs-stock-api.bravetree-eb71039c.southeastasia.azurecontainerapps.io`

สามารถเปลี่ยน URL ได้ที่ `.env`:
```
VITE_API_URL=http://localhost:3000
```

## Demo Account

- Username: `admin`
- Password: `admin123`
