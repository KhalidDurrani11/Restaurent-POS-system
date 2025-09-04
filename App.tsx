import React, { useState, useMemo, useCallback } from 'react';
import { User, UserRole, Product, CartItem, SaleTransaction, Category } from './types';
import { INITIAL_PRODUCTS, CATEGORIES } from './constants';
import Login from './components/auth/Login';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import PosScreen from './components/pos/PosScreen';
import ProductManagement from './components/products/ProductManagement';
import Reports from './components/reports/Reports';
import AiAssistant from './components/ai/AiAssistant';

export const DataContext = React.createContext<{
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: SaleTransaction[];
  addSale: (cart: CartItem[], cashierId: string) => void;
  categories: Category[];
}>({
  products: [],
  setProducts: () => {},
  sales: [],
  addSale: () => {},
  categories: [],
});

export const AuthContext = React.createContext<{
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {},
});


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<SaleTransaction[]>([]);
  const [activeView, setActiveView] = useState('dashboard');

  const login = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === UserRole.Cashier) {
      setActiveView('pos');
    } else {
      setActiveView('dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    setActiveView('dashboard');
  };

  const addSale = useCallback((cart: CartItem[], cashierId: string) => {
    const newSale: SaleTransaction = {
      id: `sale-${Date.now()}`,
      timestamp: new Date().toISOString(),
      cashierId,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      totalAmount: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    };

    setSales(prevSales => [...prevSales, newSale]);

    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      cart.forEach(cartItem => {
        const productIndex = updatedProducts.findIndex(p => p.id === cartItem.id);
        if (productIndex !== -1) {
          updatedProducts[productIndex].stock -= cartItem.quantity;
        }
      });
      return updatedProducts;
    });
  }, []);

  const dataContextValue = useMemo(() => ({
    products,
    setProducts,
    sales,
    addSale,
    categories: CATEGORIES,
  }), [products, sales, addSale]);

  const authContextValue = useMemo(() => ({ user, login, logout }), [user]);
  
  const renderContent = () => {
    if (!user) return <Login />;
    if (user.role === UserRole.Cashier) return <PosScreen />;

    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'pos':
        return <PosScreen />;
      case 'products':
        return <ProductManagement />;
      case 'reports':
        return <Reports />;
      case 'ai':
        return <AiAssistant />;
      default:
        return <Dashboard />;
    }
  };

  if (!user) {
    return (
        <AuthContext.Provider value={authContextValue}>
            <Login />
        </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <DataContext.Provider value={dataContextValue}>
        <div className="flex h-screen bg-slate-900 text-gray-200">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-800 p-4 md:p-8">
              {renderContent()}
            </main>
          </div>
        </div>
      </DataContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;