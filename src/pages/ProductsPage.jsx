import React, { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import SearchInput from "@/components/products/SearchInput";
import ProductsTable from "@/components/products/ProductsTable";
import ProductForm from "@/components/products/ProductForm";
import ProductPagination from "@/components/products/ProductPagination";
import {
  fetchProducts,
  fetchCategories,
  fetchSubcategories,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/services/api";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  // Sorting state
  const [sortField, setSortField] = useState("-createdAt");

  const emptyProduct = {
    name: "",
    description: "",
    sku: "",
    images: [""],
    category: "",
    subcategory: "",
    price: "",
    stock: "",
    isAvailable: true,
  };

  // Load products data
  const loadProducts = async (page = currentPage) => {
    setLoading(true);
    try {
      const data = await fetchProducts(page, limit, sortField, searchTerm);
      setProducts(data.data);
      if (data.pagination) {
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setLimit(data.pagination.limit);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load products
        await loadProducts();

        // Load categories and subcategories in parallel
        const [categoriesData, subcategoriesData] = await Promise.all([
          fetchCategories(),
          fetchSubcategories(),
        ]);

        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, []);

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadProducts(page);
  };

  // Handle add product
  const handleAddProduct = async (formData) => {
    try {
      await addProduct(formData);
      await loadProducts();
      setIsAddSheetOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Handle edit product
  const handleEditProduct = async (formData) => {
    try {
      await updateProduct(selectedProduct._id, formData);
      await loadProducts();
      setIsEditSheetOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Open edit modal
  const openEditSheet = (product) => {
    setSelectedProduct(product);
    setIsEditSheetOpen(true);
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(productId);
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" richColors closeButton />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700 dark:bg-yellow-500"
          onClick={() => setIsAddSheetOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <form onSubmit={handleSearchSubmit} className="flex gap-4 mt-4">
            <SearchInput value={searchTerm} onChange={handleSearch} />
            <Button type="submit" variant="secondary">
              Search
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setSearchTerm("");
                loadProducts(1);
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">No products found</div>
          ) : (
            <>
              <ProductsTable
                products={products}
                onEdit={openEditSheet}
                onDelete={handleDeleteProduct}
              />

              <ProductPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Product Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
          </SheetHeader>
          <ProductForm
            initialData={emptyProduct}
            onSubmit={handleAddProduct}
            onClose={() => setIsAddSheetOpen(false)}
            isEdit={false}
            categories={categories}
            subcategories={subcategories}
          />
        </SheetContent>
      </Sheet>

      {/* Edit Product Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Product</SheetTitle>
          </SheetHeader>
          {selectedProduct && (
            <ProductForm
              initialData={selectedProduct}
              onSubmit={handleEditProduct}
              onClose={() => setIsEditSheetOpen(false)}
              isEdit={true}
              categories={categories}
              subcategories={subcategories}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProductsPage;
