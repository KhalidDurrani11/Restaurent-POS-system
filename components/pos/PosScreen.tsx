import React, { useState, useContext, useMemo } from 'react';
import { DataContext, AuthContext } from '../../App';
import { Product, CartItem, PaymentMethod } from '../../types';
import Receipt from './Receipt';
import { BandageIcon, CareIcon, DeviceIcon, PillIcon, VitaminIcon } from '../ui/Icons';

const PosScreen: React.FC = () => {
  const { products, categories, addSale } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<CartItem[] | null>(null);
  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter(product => {
      const matchesName = !term || product.name.toLowerCase().includes(term);
      const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
      return matchesName && matchesCategory && product.stock > 0;
    });
  }, [products, searchTerm, selectedCategory]);

  const categoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('otc')) return <PillIcon className="w-5 h-5 flex-shrink-0" />;
    if (n.includes('prescription')) return <PillIcon className="w-5 h-5 flex-shrink-0" />;
    if (n.includes('vitamin')) return <VitaminIcon className="w-5 h-5 flex-shrink-0" />;
    if (n.includes('first aid')) return <BandageIcon className="w-5 h-5 flex-shrink-0" />;
    if (n.includes('device')) return <DeviceIcon className="w-5 h-5 flex-shrink-0" />;
    if (n.includes('care')) return <CareIcon className="w-5 h-5 flex-shrink-0" />;
    return <PillIcon className="w-5 h-5 flex-shrink-0" />;
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return prevCart;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    setCart(prevCart => {
      if (quantity <= 0) return prevCart.filter(item => item.id !== productId);
      if (quantity > product.stock) {
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: product.stock } : item
        );
      }
      return prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const cartTotal = useMemo(() => cart.reduce((t, i) => t + i.price * i.quantity, 0), [cart]);

  const handleCheckout = () => {
    if (cart.length === 0 || !user) return;
    setReceiptNumber(`REC-${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '')}`);
    setLastSale(cart);
    setShowReceipt(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-0 flex-1">
      {showReceipt && lastSale && (
        <Receipt
          cart={lastSale}
          total={lastSale.reduce((acc, item) => acc + item.price * item.quantity, 0)}
          paymentMethod={paymentMethod}
          receiptNumber={receiptNumber}
          onClose={() => setShowReceipt(false)}
          onPrint={() => {
            if (user) {
              addSale(lastSale, user.id, paymentMethod);
              setCart([]);
            }
            setShowReceipt(false);
          }}
        />
      )}

      {/* Products – left side: clear sections, no overlap */}
      <div className="flex flex-col flex-1 min-w-0 lg:max-w-[60%] bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/10 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Sell items</h2>
          {/* Categories: single scrollable row so they never wrap/overlap */}
          <p className="text-sm text-gray-400 mb-2">Choose category</p>
          <div className="overflow-x-auto pb-1 -mx-1 flex gap-2 flex-nowrap">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-cyan-500/25 border-cyan-400/60 text-white'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  selectedCategory === cat.name
                    ? 'bg-cyan-500/25 border-cyan-400/60 text-white'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                {categoryIcon(cat.name)}
                <span className="whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>
          <label className="block mt-3 text-sm text-gray-400 mb-1">Search by name</label>
          <input
            type="text"
            placeholder="Type item name..."
            className="w-full px-4 py-3 text-base border border-white/20 bg-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Product grid: spacious cards, no overlapping text */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                type="button"
                onClick={() => addToCart(product)}
                className="flex flex-col text-left min-h-[140px] sm:min-h-[160px] p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-400/30 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                  {categoryIcon(product.category)}
                  <span className="truncate">{product.category}</span>
                </div>
                <p className="font-semibold text-gray-100 text-sm sm:text-base leading-snug line-clamp-2 flex-1 mb-2">
                  {product.name}
                </p>
                <p className="text-cyan-400 font-bold text-base">Rs. {product.price.toFixed(0)}</p>
                <p className={`text-xs mt-0.5 ${product.stock < 10 ? 'text-red-400' : 'text-gray-500'}`}>
                  In stock: {product.stock}
                </p>
              </button>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 py-8">No items in this category. Try another or search.</p>
          )}
        </div>
      </div>

      {/* Cart – right side: simple and clear */}
      <div className="flex flex-col w-full lg:w-[380px] flex-shrink-0 bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Your cart</h2>
          <p className="text-sm text-gray-400 mt-1">
            {cart.length === 0 ? 'Cart is empty' : `${cart.reduce((a, i) => a + i.quantity, 0)} item(s)`}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Tap items on the left to add.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map(item => (
                <li key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-100 text-sm leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Rs. {item.price.toFixed(0)} each</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                      className="w-14 h-10 text-center rounded-lg border border-white/20 bg-white/10 text-white text-base font-medium"
                      min={1}
                      max={item.stock}
                    />
                    <span className="w-16 text-right font-semibold text-white text-sm">
                      Rs. {(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 sm:p-5 border-t border-white/10 space-y-3 flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-400">Payment:</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white text-sm"
            >
              <option className="bg-slate-800" value="CASH">Cash</option>
              <option className="bg-slate-800" value="CARD">Card</option>
              <option className="bg-slate-800" value="DIGITAL">Digital</option>
            </select>
            <button
              type="button"
              onClick={() => cart.length > 0 && window.confirm('Clear cart?') && setCart([])}
              className="text-sm text-gray-400 hover:text-white px-2 py-1"
            >
              Clear cart
            </button>
          </div>
          <div className="flex justify-between items-center text-lg font-bold text-white">
            <span>Total</span>
            <span>Rs. {cartTotal.toFixed(0)}</span>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-teal-500 to-cyan-400 text-white hover:from-teal-600 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-600 transition-all"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosScreen;
