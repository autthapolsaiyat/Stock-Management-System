import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import MainLayout from './layouts/MainLayout';
import {
  LoginPage,
  DashboardPage,
  ProductsPage,
  CategoriesPage,
  CustomersPage,
  SuppliersPage,
  WarehousesPage,
  StockBalancePage,
  SalesInvoicesPage,
  PurchaseOrdersPage,
  GoodsReceiptsPage,
  StockIssuesPage,
  StockTransfersPage,
} from './pages';
import { useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020617',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Placeholder pages for routes not yet implemented
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="page-container">
    <div className="page-header">
      <h1 className="text-gradient">{title}</h1>
      <p>หน้านี้กำลังพัฒนา</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        
        {/* Master Data */}
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="warehouses" element={<WarehousesPage />} />

        {/* Sales */}
        <Route path="quotations" element={<PlaceholderPage title="ใบเสนอราคา" />} />
        <Route path="sales-invoices" element={<SalesInvoicesPage />} />

        {/* Purchase */}
        <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="goods-receipts" element={<GoodsReceiptsPage />} />

        {/* Stock */}
        <Route path="stock-balance" element={<StockBalancePage />} />
        <Route path="stock-issues" element={<StockIssuesPage />} />
        <Route path="stock-transfers" element={<StockTransfersPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
