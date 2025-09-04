
import React, { useContext, useMemo } from 'react';
import { DataContext } from '../../App';
import { SaleTransaction, Product } from '../../types';
import StatCard from './StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CurrencyDollarIcon, ShoppingCartIcon, UsersIcon, ChartBarIcon } from '../ui/Icons';


const Dashboard: React.FC = () => {
    const { sales, products } = useContext(DataContext);

    const today = new Date().toISOString().split('T')[0];

    const stats = useMemo(() => {
        const todaySales = sales.filter(sale => sale.timestamp.startsWith(today));
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const revenueToday = todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const lowStockItems = products.filter(p => p.stock < 10).length;

        return {
            totalRevenue,
            revenueToday,
            totalTransactions: sales.length,
            lowStockItems
        };
    }, [sales, products, today]);

    const salesByDay = useMemo(() => {
        const salesData: { [key: string]: number } = {};
        sales.forEach(sale => {
            const date = new Date(sale.timestamp).toLocaleDateString('en-CA'); // YYYY-MM-DD format
            salesData[date] = (salesData[date] || 0) + sale.totalAmount;
        });
        return Object.entries(salesData)
            .map(([date, total]) => ({ name: date, sales: total }))
            .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
            .slice(-7); // Last 7 days
    }, [sales]);

    const topSellingProducts = useMemo(() => {
        const productSales: { [key: string]: number } = {};
        sales.forEach(sale => {
            sale.items.forEach(item => {
                productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
            });
        });
        return Object.entries(productSales)
            .map(([productId, quantity]) => ({
                product: products.find(p => p.id === productId),
                quantity
            }))
            .filter(item => item.product)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5)
            .map(item => ({ name: item.product!.name, quantity: item.quantity }));
    }, [sales, products]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`Rs. ${stats.totalRevenue.toFixed(2)}`} icon={<CurrencyDollarIcon />} />
                <StatCard title="Revenue Today" value={`Rs. ${stats.revenueToday.toFixed(2)}`} icon={<ChartBarIcon />} />
                <StatCard title="Total Transactions" value={stats.totalTransactions.toString()} icon={<ShoppingCartIcon />} />
                <StatCard title="Low Stock Items" value={stats.lowStockItems.toString()} icon={<UsersIcon />} color="text-red-500"/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-lg mb-4 text-gray-700">Last 7 Days Sales</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesByDay}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `Rs. ${value.toFixed(2)}`}/>
                            <Legend />
                            <Bar dataKey="sales" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-lg mb-4 text-gray-700">Top Selling Products</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={topSellingProducts}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="quantity"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {topSellingProducts.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number, name: string) => [`${value} units`, name]}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
