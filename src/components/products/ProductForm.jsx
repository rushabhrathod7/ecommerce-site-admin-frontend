// src/components/products/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetFooter } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductForm = ({
  initialData,
  onSubmit,
  onClose,
  isEdit,
  categories,
  subcategories,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  useEffect(() => {
    if (formData.category && subcategories) {
      const filtered = subcategories.filter(
        (sub) => sub.category._id === formData.category
      );
      setAvailableSubcategories(filtered);
    }
  }, [formData.category, subcategories]);

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

  // Find the category name for display
  const categoryName =
    categories?.find((c) => c._id === formData.category)?.name || "";

  // Find the subcategory name for display
  const subcategoryName =
    subcategories?.find((s) => s._id === formData.subcategory)?.name || "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="sku" className="text-right">
            SKU
          </Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleFieldChange("sku", e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="images" className="text-right">
            Image URL
          </Label>
          <Input
            id="images"
            value={formData.images?.[0] || ""}
            onChange={(e) => handleFieldChange("images", [e.target.value])}
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
              {categoryName || "Select category"}
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
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
                {subcategoryName || "Select subcategory"}
              </SelectTrigger>
              <SelectContent>
                {availableSubcategories.map((subcategory) => (
                  <SelectItem key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
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
            onChange={(e) => handleFieldChange("price", Number(e.target.value))}
            className="col-span-3"
            min="0"
            step="0.01"
            required
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
            onChange={(e) => handleFieldChange("stock", Number(e.target.value))}
            className="col-span-3"
            min="0"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="isAvailable" className="text-right">
            Available
          </Label>
          <Select
            value={formData.isAvailable.toString()}
            onValueChange={(value) =>
              handleFieldChange("isAvailable", value === "true")
            }
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <SheetFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Save Changes" : "Add Product"}</Button>
      </SheetFooter>
    </form>
  );
};

export default ProductForm;
