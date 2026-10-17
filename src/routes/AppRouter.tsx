import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SharedLayout } from '../layouts/SharedLayout/SharedLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const LoginPage = lazy(() =>
  import('../pages/LoginPage/LoginPage').then((module) => ({ default: module.LoginPage })),
);
const HomePage = lazy(() =>
  import('../pages/HomePage/HomePage').then((module) => ({ default: module.HomePage })),
);
const ShopPage = lazy(() =>
  import('../pages/ShopPage/ShopPage').then((module) => ({ default: module.ShopPage })),
);
const MedicineDetailPage = lazy(() =>
  import('../pages/ProductsPage/MedicineDetailPage').then((module) => ({
    default: module.MedicineDetailPage,
  })),
);
const DashboardPage = lazy(() =>
  import('../pages/DashboardPage/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
);
const OrdersPage = lazy(() =>
  import('../pages/OrdersPage/OrdersPage').then((module) => ({ default: module.OrdersPage })),
);
const ProductsPage = lazy(() =>
  import('../pages/ProductsPage/ProductsPage').then((module) => ({
    default: module.ProductsPage,
  })),
);
const CustomersPage = lazy(() =>
  import('../pages/CustomersPage/CustomersPage').then((module) => ({
    default: module.CustomersPage,
  })),
);
const SuppliersPage = lazy(() =>
  import('../pages/SuppliersPage/SuppliersPage').then((module) => ({
    default: module.SuppliersPage,
  })),
);

function LoginRoute({ mode }: { mode: 'login' | 'register' }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/home" replace />;
  return <LoginPage mode={mode} />;
}

export function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense
        fallback={
          <div role="status" className="route-loading">
            Loading…
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<LoginRoute mode="login" />} />
          <Route path="/register" element={<LoginRoute mode="register" />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<SharedLayout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:productId" element={<MedicineDetailPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="suppliers" element={<SuppliersPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
