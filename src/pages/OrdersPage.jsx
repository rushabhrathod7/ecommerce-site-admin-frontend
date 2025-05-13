import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
});

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            console.log('Fetching orders...');
            const response = await api.get('/api/admin/orders');
            console.log('API Response:', response.data);
            setOrders(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching orders:', err);
            let errorMessage = 'Failed to fetch orders';
            if (err.response) {
                if (err.response.status === 401) {
                    errorMessage = 'Please log in to view orders';
                } else if (err.response.status === 403) {
                    errorMessage = 'You do not have permission to view orders';
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
            }
            setError(errorMessage);
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.patch(`/api/admin/orders/${orderId}`, {
                status: newStatus
            });
            fetchOrders(); // Refresh orders after update
        } catch (err) {
            console.error('Error updating order status:', err);
            setError('Failed to update order status');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-500",
            processing: "bg-blue-500",
            shipped: "bg-purple-500",
            delivered: "bg-green-500",
            cancelled: "bg-red-500",
            confirmed: "bg-blue-500",
            returned: "bg-red-500"
        };
        return colors[status] || "bg-gray-500";
    };

    console.log('Current orders state:', orders);
    console.log('Loading state:', loading);
    console.log('Error state:', error);

    if (loading) {
        return (
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Orders Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Orders Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-red-500 text-center">{error}</div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Orders Management</CardTitle>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 ? (
                        <div className="text-center py-8">No orders found</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order Number</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>
                                            <div className="font-medium">{order.orderNumber}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.userId?.email}</div>
                                            <div className="text-sm text-gray-500">
                                                {order.shippingAddress?.street}, {order.shippingAddress?.city}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {order.items.map(item => item.name).join(', ')}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">₹{order.total.toFixed(2)}</div>
                                            <div className="text-sm text-gray-500">
                                                {order.shipping.method}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(order.payment.status)}>
                                                {order.payment.method.toUpperCase()} - {order.payment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                defaultValue={order.status}
                                                onValueChange={(value) => updateOrderStatus(order._id, value)}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Update Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                                    <SelectItem value="processing">Processing</SelectItem>
                                                    <SelectItem value="shipped">Shipped</SelectItem>
                                                    <SelectItem value="delivered">Delivered</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    <SelectItem value="returned">Returned</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default OrdersPage;
