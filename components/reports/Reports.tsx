
import React, { useContext } from 'react';
import { DataContext } from '../../App';

const Reports: React.FC = () => {
  const { sales, products } = useContext(DataContext);

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Sales Reports</h2>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4">Transaction ID</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {sales.slice().reverse().map(sale => (
              <tr key={sale.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono text-sm text-gray-500">{sale.id}</td>
                <td className="p-4 text-gray-600">{new Date(sale.timestamp).toLocaleString()}</td>
                <td className="p-4 text-gray-600">
                    <ul className="list-disc list-inside">
                        {sale.items.map((item, index) => (
                            <li key={index}>{getProductName(item.productId)} x {item.quantity}</li>
                        ))}
                    </ul>
                </td>
                <td className="p-4 text-gray-800 font-semibold">Rs. {sale.totalAmount.toFixed(2)}</td>
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
