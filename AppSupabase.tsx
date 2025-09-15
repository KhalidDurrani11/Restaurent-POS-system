import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { User, UserRole, Product, CartItem, SaleTransaction, Category } from './types';
import { productService, categoryService, transactionService, userService } from './services/databaseService';
import LoginSupabase from './components/auth/LoginSupabase';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import PosScreen from './components/pos/PosScreen';
import ProductManagementSupabase from './components/products/ProductManagementSupabase';
import Reports from './components/reports/Reports';
import AiAssistant from './components/ai/AiAssistant';
import Spinner from './components/ui/Spinner';

export const DataContext = React.createContext<{
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: SaleTransaction[];
  addSale: (cart: CartItem[], cashierId: string) => void;
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}>({
  products: [],
  setProducts: () => {},
  sales: [],
  addSale: () => {},
  categories: [],
  loading: false,
  error: null,
  refreshData: () => {},
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

const AppSupabase: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sales, setSales] = useState<SaleTransaction[]>([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data when user logs in
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load products, categories, and recent sales in parallel
      const [productsData, categoriesData, salesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        transactionService.getAll()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      setSales(salesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = useCallback(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const login = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === UserRole.Cashier) {
      setActiveView('pos');
    } else {
      setActiveView('dashboard');
    }
  };

  const logout = async () => {
    try {
      await userService.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setUser(null);
      setActiveView('dashboard');
      setProducts([]);
      setCategories([]);
      setSales([]);
    }
  };

  const addSale = useCallback(async (cart: CartItem[], cashierId: string) => {
    try {
      setError(null);
      
      const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      
      const transactionData = {
        total_amount: totalAmount,
        cashier_id: cashierId,
        payment_method: 'CASH' as const,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
        }))
      };

      // Create transaction in Supabase
      const newTransaction = await transactionService.create(transactionData);
      
      // Add to local state for immediate UI update
      const saleTransaction: SaleTransaction = {
        id: newTransaction.id,
        timestamp: newTransaction.timestamp,
        totalAmount: newTransaction.total_amount,
        cashierId: newTransaction.cashier_id,
        paymentMethod: newTransaction.payment_method,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
        }))
      };

      setSales(prevSales => [saleTransaction, ...prevSales]);

      // Update local products stock (Supabase already updated the database)
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

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
      console.error('Error creating transaction:', err);
    }
  }, []);

  const dataContextValue = useMemo(() => ({
    products,
    setProducts,
    sales,
    addSale,
    categories,
    loading,
    error,
    refreshData,
  }), [products, sales, addSale, categories, loading, error, refreshData]);

  const authContextValue = useMemo(() => ({ user, login, logout }), [user]);
  
  const renderContent = () => {
    if (!user) return <LoginSupabase onLogin={login} />;
    if (user.role === UserRole.Cashier) return <PosScreen />;

    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'pos':
        return <PosScreen />;
      case 'products':
        return <ProductManagementSupabase />;
      case 'reports':
        return <Reports />;
      case 'ai':
        return <AiAssistant />;
      default:
        return <Dashboard />;
    }
  };
  
  const animatedContent = useMemo(() => {
    if (loading && !products.length) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      );
    }

    return (
      <div key={activeView} className="animate-fade-in">
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
            <button 
              onClick={refreshData}
              className="mt-2 text-red-400 hover:text-red-300 underline"
            >
              Retry
            </button>
          </div>
        )}
        {renderContent()}
      </div>
    );
  }, [activeView, user, loading, products.length, error, refreshData]);

  if (!user) {
    return (
      <AuthContext.Provider value={authContextValue}>
        <LoginSupabase onLogin={login} />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <DataContext.Provider value={dataContextValue}>
        <div className="flex h-screen text-gray-200">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
          <div className="flex-1 flex flex-col overflow-hidden bg-black/30">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
              {animatedContent}
            </main>
          </div>
        </div>
      </DataContext.Provider>
    </AuthContext.Provider>
  );
};

export default AppSupabase;

