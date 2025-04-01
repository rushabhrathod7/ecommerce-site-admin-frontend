// src/services/api.js
import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchProducts = async (
  page = 1,
  limit = 10,
  sort = "-createdAt",
  search = ""
) => {
  try {
    let url = `/products?page=${page}&limit=${limit}&sort=${sort}`;

    if (search) {
      url = `/products/search?q=${search}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Failed to fetch products";
    toast.error("Error", {
      description: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch categories";
    toast.error("Error", {
      description: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

export const fetchSubcategories = async () => {
  try {
    const response = await api.get("/subcategories");
    return response.data.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch subcategories";
    toast.error("Error", {
      description: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData);
    toast.success("Product Added", {
      description: "Product added successfully",
    });
    return response.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Failed to add product";
    toast.error("Error", {
      description: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/products/${productId}`, productData);
    toast.success("Product Updated", {
      description: "Product updated successfully",
    });
    return response.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Failed to update product";
    toast.error("Error", {
      description: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

export const deleteProduct = async (productId) => {
  try {
    await api.delete(`/products/${productId}`);
    toast.success("Success", {
      description: "Product deleted successfully",
    });
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Failed to delete product";
    toast.error("Error", {
      description: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

export default api;
