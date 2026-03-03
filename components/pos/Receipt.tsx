import React, { useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { CartItem } from '../../types';
import type { PaymentMethod } from '../../types';

interface ReceiptProps {
  cart: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  receiptNumber?: string;
  onClose: () => void;
  onPrint: () => void;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CASH: 'Cash',
  CARD: 'Card',
  DIGITAL: 'Digital Payment',
};

const SHOP_NAME = 'Khan Medical';
const SHOP_TAGLINE = 'Pharmacy & Medical Store';
const SHOP_ADDRESS = 'Your address here • Phone: ----------';

function formatDate() {
  const d = new Date();
  return d.toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true,
  });
}

const Receipt: React.FC<ReceiptProps> = ({
  cart,
  total,
  paymentMethod,
  receiptNumber,
  onClose,
  onPrint,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const receiptId = receiptNumber ?? `REC-${Date.now().toString(36).toUpperCase()}`;
  const dateTime = useMemo(() => formatDate(), []);

  const getPrintDocument = () => {
    const rows = cart
      .map(
        (item) => `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:13px;">${escapeHtml(item.name)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:center;font-size:13px;">${item.quantity}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:right;font-size:13px;">Rs. ${item.price.toFixed(2)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:right;font-size:13px;font-weight:600;">Rs. ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
      )
      .join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt - ${escapeHtml(receiptId)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #fff;
      color: #111;
      padding: 24px;
      max-width: 400px;
      margin: 0 auto;
      font-size: 14px;
    }
    .header {
      text-align: center;
      padding-bottom: 16px;
      border-bottom: 2px solid #0d9488;
      margin-bottom: 16px;
    }
    .shop-name { font-size: 22px; font-weight: 700; color: #0f766e; letter-spacing: 0.5px; }
    .tagline { font-size: 12px; color: #64748b; margin-top: 4px; }
    .meta { font-size: 11px; color: #64748b; margin-top: 12px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th {
      text-align: left;
      padding: 8px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      border-bottom: 1px solid #e5e7eb;
    }
    th:nth-child(2) { text-align: center; }
    th:nth-child(3), th:nth-child(4) { text-align: right; }
    .total-row {
      border-top: 2px solid #0d9488;
      font-size: 16px;
      font-weight: 700;
      padding: 12px 8px;
    }
    .payment-row { font-size: 12px; color: #475569; padding: 4px 8px 12px; }
    .footer {
      text-align: center;
      padding-top: 16px;
      border-top: 1px dashed #cbd5e1;
      font-size: 12px;
      color: #64748b;
    }
    .thanks { font-size: 14px; font-weight: 600; color: #0f766e; margin-bottom: 8px; }
    @media print {
      body { padding: 12px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="shop-name">${escapeHtml(SHOP_NAME)}</div>
    <div class="tagline">${escapeHtml(SHOP_TAGLINE)}</div>
    <div class="meta">${escapeHtml(receiptId)} &nbsp;|&nbsp; ${escapeHtml(dateTime)}</div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:center;">Qty</th>
        <th style="text-align:right;">Unit Price</th>
        <th style="text-align:right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
  <div class="payment-row">Payment: ${escapeHtml(PAYMENT_LABELS[paymentMethod])}</div>
  <div class="total-row" style="display:flex;justify-content:space-between;">
    <span>TOTAL</span>
    <span>Rs. ${total.toFixed(2)}</span>
  </div>
  <div class="footer">
    <div class="thanks">Thank you for your purchase</div>
    <div>Get well soon. Take medicines as prescribed.</div>
    <div style="margin-top:8px;font-size:11px;">${escapeHtml(SHOP_ADDRESS)}</div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 250);
    };
  </script>
</body>
</html>`;
  };

  function escapeHtml(text: string) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  const handlePrint = () => {
    const html = getPrintDocument();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!printWindow) {
      URL.revokeObjectURL(url);
      alert('Please allow pop-ups to print the receipt.');
      return;
    }
    // Give it time to load, then we can revoke the URL
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    onPrint();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
      <div className="bg-slate-800/95 border border-white/20 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* On-screen receipt preview */}
        <div className="p-6 overflow-y-auto flex-1">
          <div ref={receiptRef} className="bg-slate-900/50 rounded-xl border border-white/10 p-5 text-left">
            <div className="text-center pb-4 border-b border-teal-500/40">
              <h2 id="receipt-title" className="text-xl font-bold text-teal-400">{SHOP_NAME}</h2>
              <p className="text-xs text-gray-500 mt-1">{SHOP_TAGLINE}</p>
              <p className="text-xs text-gray-400 mt-2 font-mono">{receiptId}</p>
              <p className="text-xs text-gray-500 mt-1">{dateTime}</p>
            </div>
            <table className="w-full mt-4 text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-white/10">
                  <th className="text-left py-2 font-medium">Item</th>
                  <th className="text-center py-2 font-medium w-12">Qty</th>
                  <th className="text-right py-2 font-medium">Price</th>
                  <th className="text-right py-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b border-white/5">
                    <td className="py-2.5 text-gray-200">{item.name}</td>
                    <td className="py-2.5 text-center text-gray-400">{item.quantity}</td>
                    <td className="py-2.5 text-right text-gray-400">Rs. {item.price.toFixed(2)}</td>
                    <td className="py-2.5 text-right font-medium text-gray-100">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-xs text-gray-500">Payment: {PAYMENT_LABELS[paymentMethod]}</div>
            <div className="mt-2 pt-3 border-t border-teal-500/40 flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">Thank you for your purchase.</p>
          </div>
        </div>
        <div className="p-4 border-t border-white/10 bg-slate-800/80 space-y-3">
          <p className="text-xs text-gray-500 text-center sm:text-right">
            Choose &quot;Save as PDF&quot; or a printer in the next window.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 shadow-lg shadow-cyan-500/25 transition-all"
            >
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' && document.body
    ? ReactDOM.createPortal(modalContent, document.body)
    : modalContent;
};

export default Receipt;
