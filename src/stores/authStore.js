import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// Configure axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Important for cookies to be sent
});

const useAuthStore = create(
  persist(
    (set, get) => ({
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login function
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/login", { email, password });
          set({
            admin: response.data.admin,
            isAuthenticated: true,
            isLoading: false,
          });
          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Failed to login";
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Logout function
      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post("/auth/logout");
          set({ admin: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          // Still clear the state even if the server request fails
          set({ admin: null, isAuthenticated: false });
        }
      },

      // Get current user profile
      fetchProfile: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get("/auth/me");
          set({
            admin: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
          return response.data;
        } catch (error) {
          set({ isLoading: false, admin: null, isAuthenticated: false });
          throw new Error("Failed to fetch profile");
        }
      },

      // Change password
      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true });
        try {
          const response = await api.put("/auth/change-password", {
            currentPassword,
            newPassword,
          });
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Failed to change password";
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Forgot password
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/forgot-password", { email });
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Failed to send reset link";
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Reset password
      resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(`/auth/reset-password/${token}`, {
            password,
          });
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Failed to reset password";
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Clear any errors
      clearError: () => set({ error: null }),
    }),
    {
      name: "admin-auth-storage",
      // Only persist these fields
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
