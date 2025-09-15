import React, { useContext } from 'react';
import { DataContext } from '../../App';

const Reports: React.FC = () => {
  const { sales, products } = useContext(DataContext);

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-100">Sales Reports</h2>
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4 text-gray-300 font-semibold">Transaction ID</th>
              <th className="p-4 text-gray-300 font-semibold">Timestamp</th>
              <th className="p-4 text-gray-300 font-semibold">Items</th>
              <th className="p-4 text-gray-300 font-semibold">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {sales.slice().reverse().map((sale, index) => (
              <tr key={sale.id} className="border-b border-white/10 hover:bg-white/5 stagger-in" style={{animationDelay: `${index * 50}ms`}}>
                <td className="p-4 font-mono text-sm text-gray-500">{sale.id}</td>
                <td className="p-4 text-gray-400">{new Date(sale.timestamp).toLocaleString()}</td>
                <td className="p-4 text-gray-400">
                    <ul className="space-y-1">
                        {sale.items.map((item, index) => (
                            <li key={index}><span className="text-gray-200">{getProductName(item.productId)}</span> x {item.quantity}</li>
                        ))}
                    </ul>
                </td>
                <td className="p-4 text-gray-100 font-semibold">Rs. {sale.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
             {sales.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center p-8 text-gray-500">No sales transactions yet.</td>
                </tr>
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;