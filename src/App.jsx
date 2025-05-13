import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import useAuthStore from "@/stores/authStore";

import AdminSidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomersPage";
import SettingsPage from "./pages/SettingsPage";
import CategoriesPage from "./pages/CategoriesPage";
import SubcategoriesPage from "./pages/SubcategoriesPage";
import SignIn from "./pages/auth/SignIn";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AuthLayout from "./pages/auth/AuthLayout";

import { Toaster } from "@/components/ui/sonner";

// Protected route component using Zustand auth store
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  // Check authentication status when component mounts
  useEffect(() => {
    // Verify auth status with backend
    checkAuth().catch(error => {
      console.error("Auth check failed:", error);
    });
  }, [checkAuth]);

  // If still loading, you could show a spinner here
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="signin" element={<SignIn />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Admin routes - protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminSidebar />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/subcategories" element={<SubcategoriesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
