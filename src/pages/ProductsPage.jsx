import React, { useState } from "react";
import { Search, Plus, Filter, MoreVertical, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Sample categories and subcategories
const categories = {
  Electronics: ["Audio", "Computers", "Accessories"],
  Sports: ["Footwear", "Apparel", "Equipment"],
  Fashion: ["Men", "Women", "Kids"],
};

const ProductForm = React.memo(({ initialData, onSubmit, onClose, isEdit }) => {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => {
      if (field === "category") {
        return { ...prev, category: value, subcategory: "" };
      }
      return { ...prev, [field]: value };
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="image" className="text-right">
            Image URL
          </Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => handleFieldChange("image", e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Category
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleFieldChange("category", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(categories).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {formData.category && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subcategory" className="text-right">
              Subcategory
            </Label>
            <Select
              value={formData.subcategory}
              onValueChange={(value) => handleFieldChange("subcategory", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                {categories[formData.category]?.map((subcategory) => (
                  <SelectItem key={subcategory} value={subcategory}>
                    {subcategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Price
          </Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleFieldChange("price", e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="stock" className="text-right">
            Stock
          </Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => handleFieldChange("stock", e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Save Changes" : "Add Product"}</Button>
      </DialogFooter>
    </form>
  );
});

ProductForm.displayName = "ProductForm";

const SearchInput = React.memo(({ value, onChange }) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search products..."
        className="pl-8"
        value={value}
        onChange={onChange}
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";

const ProductsPage = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      image: "/api/placeholder/100/100",
      category: "Electronics",
      subcategory: "Audio",
      price: 99.99,
      stock: 45,
      status: "In Stock",
    },
    {
      id: 2,
      name: "Running Shoes",
      image: "/api/placeholder/100/100",
      category: "Sports",
      subcategory: "Footwear",
      price: 79.99,
      stock: 28,
      status: "Low Stock",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const emptyProduct = {
    name: "",
    image: "/api/placeholder/100/100",
    category: "",
    subcategory: "",
    price: "",
    stock: "",
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = React.useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleAddProduct = (formData) => {
    setProducts([
      ...products,
      { ...formData, id: products.length + 1, status: "In Stock" },
    ]);
    setIsAddModalOpen(false);
  };

  const handleEditProduct = (formData) => {
    setProducts(
      products.map((product) =>
        product.id === selectedProduct.id
          ? {
              ...formData,
              id: selectedProduct.id,
              status: selectedProduct.status,
            }
          : product
      )
    );
    setIsEditModalOpen(false);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "text-green-600";
      case "Low Stock":
        return "text-yellow-600";
      case "Out of Stock":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <div className="flex gap-4 mt-4">
            <SearchInput value={searchTerm} onChange={handleSearch} />
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subcategory</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.subcategory}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <span className={getStatusColor(product.status)}>
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => openEditModal(product)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            initialData={emptyProduct}
            onSubmit={handleAddProduct}
            onClose={() => setIsAddModalOpen(false)}
            isEdit={false}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            initialData={selectedProduct}
            onSubmit={handleEditProduct}
            onClose={() => setIsEditModalOpen(false)}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
