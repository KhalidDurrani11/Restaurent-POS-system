
import React, { useState, useContext, useMemo } from 'react';
import { DataContext, AuthContext } from '../../App';
import { Product, CartItem } from '../../types';
import Receipt from './Receipt';

const PosScreen: React.FC = () => {
    const { products, addSale } = useContext(DataContext);
    const { user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastSale, setLastSale] = useState<CartItem[] | null>(null);

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) && product.stock > 0
        );
    }, [products, searchTerm]);

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                if (existingItem.quantity < product.stock) {
                    return prevCart.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return prevCart; // Do not add more than available in stock
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        setCart(prevCart => {
            if (quantity <= 0) {
                return prevCart.filter(item => item.id !== productId);
            }
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
    
    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cart]);

    const handleCheckout = () => {
        if (cart.length === 0 || !user) return;
        addSale(cart, user.id);
        setLastSale(cart);
        setCart([]);
        setShowReceipt(true);
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6">
            {showReceipt && lastSale && (
                <Receipt cart={lastSale} total={lastSale.reduce((acc, item) => acc + item.price * item.quantity, 0)} onClose={() => setShowReceipt(false)} />
            )}
            {/* Products Section */}
            <div className="lg:w-3/5 bg-white p-6 rounded-lg shadow-md flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Products</h2>
                <input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="border rounded-lg p-3 cursor-pointer hover:shadow-lg transition-shadow text-center flex flex-col justify-between"
                            >
                                <h3 className="font-semibold text-gray-700">{product.name}</h3>
                                <div>
                                    <p className="text-indigo-600 font-bold">Rs. {product.price.toFixed(2)}</p>
                                    <p className={`text-sm ${product.stock < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                                        Stock: {product.stock}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart Section */}
            <div className="lg:w-2/5 bg-white p-6 rounded-lg shadow-md flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Cart</h2>
                <div className="flex-1 overflow-y-auto -mx-6 px-6">
                    {cart.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {cart.map(item => (
                                <li key={item.id} className="py-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">Rs. {item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                            className="w-16 text-center border rounded-md py-1"
                                            min="1"
                                            max={item.stock}
                                        />
                                        <p className="w-20 text-right font-semibold text-gray-900">
                                            Rs. {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center text-xl font-bold mb-4">
                        <span>Total:</span>
                        <span>Rs. {cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PosScreen;
