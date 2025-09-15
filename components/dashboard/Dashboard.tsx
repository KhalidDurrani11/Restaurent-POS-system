import React, { useContext, useMemo } from 'react';
import { DataContext } from '../../App';
import { SaleTransaction, Product } from '../../types';
import StatCard from './StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CurrencyRupeeIcon, ShoppingCartIcon, UsersIcon, ChartBarIcon } from '../ui/Icons';


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

    const PIE_COLORS = ['#2dd4bf', '#22d3ee', '#a3e635', '#6366f1', '#ec4899'];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent < 0.05) return null;

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-semibold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const statCards = [
        { title: "Total Revenue", value: `Rs. ${stats.totalRevenue.toFixed(2)}`, icon: <CurrencyRupeeIcon />, color: "from-green-500 to-emerald-500" },
        { title: "Revenue Today", value: `Rs. ${stats.revenueToday.toFixed(2)}`, icon: <ChartBarIcon />, color: "from-cyan-500 to-sky-500" },
        { title: "Total Transactions", value: stats.totalTransactions.toString(), icon: <ShoppingCartIcon />, color: "from-teal-500 to-cyan-500" },
        { title: "Low Stock Items", value: stats.lowStockItems.toString(), icon: <UsersIcon />, color: "from-amber-500 to-orange-500" }
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-100">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <div key={card.title} className="stagger-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <StatCard title={card.title} value={card.value} icon={card.icon} color={card.color}/>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 stagger-in" style={{ animationDelay: '400ms' }}>
                    <h3 className="font-semibold text-lg mb-4 text-gray-200">Last 7 Days Sales</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesByDay}>
                             <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" tick={{ fill: '#a0aec0' }} />
                            <YAxis tick={{ fill: '#a0aec0' }}/>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(12, 17, 24, 0.8)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} formatter={(value: number) => [`Rs. ${value.toFixed(2)}`, 'Sales']}/>
                            <Legend wrapperStyle={{ color: '#fff' }} />
                            <Bar dataKey="sales" fill="url(#colorSales)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 stagger-in" style={{ animationDelay: '500ms' }}>
                    <h3 className="font-semibold text-lg mb-4 text-gray-200">Top Selling Products</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={topSellingProducts}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={110}
                                fill="#8884d8"
                                dataKey="quantity"
                                nameKey="name"
                            >
                                {topSellingProducts.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(12, 17, 24, 0.8)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} formatter={(value: number, name: string) => [`${value} units`, name]}/>
                            <Legend wrapperStyle={{ color: '#fff' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;