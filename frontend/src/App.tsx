import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import MainLayout from './layouts/MainLayout';
import {
  LoginPage,
  DashboardPage,
  IntroPage,
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
  QuotationList,
  QuotationForm,
  QuotationDetail,
  UserSettingsPage,
  CompanySettingsPage,
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
        <Route path="intro" element={<IntroPage />} />
        <Route index element={<DashboardPage />} />
        
        {/* Master Data */}
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="warehouses" element={<WarehousesPage />} />

        {/* Quotations */}
        <Route path="quotations" element={<QuotationList />} />
        <Route path="quotations/new" element={<QuotationForm />} />
        <Route path="quotations/:id" element={<QuotationDetail />} />
        <Route path="quotations/:id/edit" element={<QuotationForm />} />

        {/* Sales */}
        <Route path="sales-invoices" element={<SalesInvoicesPage />} />

        {/* Purchase */}
        <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="goods-receipts" element={<GoodsReceiptsPage />} />

        {/* Stock */}
        <Route path="stock-balance" element={<StockBalancePage />} />
        <Route path="stock-issues" element={<StockIssuesPage />} />
        <Route path="stock-transfers" element={<StockTransfersPage />} />
        
        {/* Settings */}
        <Route path="settings" element={<UserSettingsPage />} />
        <Route path="settings/company" element={<CompanySettingsPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
