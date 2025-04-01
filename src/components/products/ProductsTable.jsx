// src/components/products/ProductsTable.jsx
import React from "react";
import { Edit, Trash, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const ProductsTable = ({ products, onEdit, onDelete }) => {
  // Get status text and color based on stock and availability
  const getProductStatus = (product) => {
    if (!product.isAvailable) {
      return { text: "Unavailable", color: "text-red-600" };
    }

    if (product.stock <= 0) {
      return { text: "Out of Stock", color: "text-red-600" };
    }

    if (product.stock < 10) {
      return { text: "Low Stock", color: "text-yellow-600" };
    }

    return { text: "In Stock", color: "text-green-600" };
  };

  return (
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
        {products.map((product) => {
          const status = getProductStatus(product);
          return (
            <TableRow key={product._id}>
              <TableCell>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/100x100";
                    }}
                  />
                ) : (
                  <img
                    src="/api/placeholder/100/100"
                    alt="No image"
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category?.name || "—"}</TableCell>
              <TableCell>{product.subcategory?.name || "—"}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <span className={status.color}>{status.text}</span>
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
                    <DropdownMenuItem onClick={() => onEdit(product)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete(product._id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ProductsTable;
