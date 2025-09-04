import React, { useRef } from 'react';
import { CartItem } from '../../types';

interface ReceiptProps {
  cart: CartItem[];
  total: number;
  onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ cart, total, onClose }) => {
    const receiptRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = receiptRef.current;
        if (printContent) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow?.document.write('<html><head><title>Print Receipt</title>');
            printWindow?.document.write('<script src="https://cdn.tailwindcss.com"></script>');
            printWindow?.document.write('<style>body { background-color: #fff; color: #000; font-family: sans-serif; }</style>');
            printWindow?.document.write('</head><body class="p-8">');
            printWindow?.document.write(printContent.innerHTML);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            printWindow?.print();
        }
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-800 border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md text-white">
        <div ref={receiptRef}>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-400 text-transparent bg-clip-text">AI POS</h2>
                <p className="text-gray-400">Sale Receipt</p>
                <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>
            </div>
            <div className="space-y-2 mb-4 border-t border-b border-white/20 py-4">
                {cart.map(item => (
                    <div key={item.id} className="flex justify-between">
                        <span className="text-gray-300">{item.name} x{item.quantity}</span>
                        <span className="text-gray-100 font-medium">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
            </div>
            <p className="text-center text-gray-400 mt-6">Thank you for your purchase!</p>
        </div>
        <div className="mt-8 flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 bg-white/10 text-gray-200 rounded-lg hover:bg-white/20 transition-colors">Close</button>
            <button onClick={handlePrint} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md shadow-indigo-500/30">Print</button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;