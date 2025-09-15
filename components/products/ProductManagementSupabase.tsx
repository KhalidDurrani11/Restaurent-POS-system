import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types';
import { productService, categoryService } from '../../services/databaseService';
import { EditIcon, DeleteIcon, PlusIcon, TagIcon, CashIcon, StockIcon, ActionsIcon, ProductIcon } from '../ui/Icons';
import Modal from '../ui/Modal';
import ProductForm from './ProductForm';
import Spinner from '../ui/Spinner';

const ProductManagementSupabase: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Load products and categories in parallel
            const [productsData, categoriesData] = await Promise.all([
                productService.getAll(),
                categoryService.getAll()
            ]);
            
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load data');
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const openModalForNew = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleSave = async (product: Product) => {
        try {
            setError(null);
            
            if (selectedProduct) {
                // Editing existing product
                const updatedProduct = await productService.update(selectedProduct.id, {
                    name: product.name,
                    category_id: product.category_id || '',
                    price: product.price,
                    stock: product.stock,
                    description: product.description,
                    image_url: product.image_url
                });
                
                setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));
            } else {
                // Adding new product
                const newProduct = await productService.create({
                    name: product.name,
                    category_id: product.category_id || '',
                    price: product.price,
                    stock: product.stock,
                    description: product.description,
                    image_url: product.image_url
                });
                
                setProducts(prev => [...prev, newProduct]);
            }
            
            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save product');
            console.error('Error saving product:', err);
        }
    };

    const handleDelete = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                setError(null);
                await productService.delete(productId);
                setProducts(prev => prev.filter(p => p.id !== productId));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete product');
                console.error('Error deleting product:', err);
            }
        }
    };

    const TableHeader: React.FC<{icon: React.ReactNode, children: React.ReactNode}> = ({icon, children}) => (
        <th className="p-4 text-gray-300 font-semibold">
            <div className="flex items-center space-x-2">
                {icon}
                <span>{children}</span>
            </div>
        </th>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-100">Product Management</h2>
                <button
                    onClick={openModalForNew}
                    className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-400 text-white px-4 py-2 rounded-lg hover:from-teal-600 hover:to-cyan-500 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/40"
                >
                    <PlusIcon className="w-5 h-5"/>
                    <span>Add Product</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                    <button 
                        onClick={loadData}
                        className="mt-2 text-red-400 hover:text-red-300 underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10">
                            <TableHeader icon={<TagIcon className="w-5 h-5 opacity-70"/>}>Name</TableHeader>
                            <TableHeader icon={<ProductIcon className="w-5 h-5 opacity-70"/>}>Category</TableHeader>
                            <TableHeader icon={<CashIcon className="w-5 h-5 opacity-70"/>}>Price</TableHeader>
                            <TableHeader icon={<StockIcon className="w-5 h-5 opacity-70"/>}>Stock</TableHeader>
                            <TableHeader icon={<ActionsIcon className="w-5 h-5 opacity-70"/>}>Actions</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 stagger-in" style={{animationDelay: `${index * 50}ms`}}>
                                <td className="p-4 font-medium text-gray-200">{product.name}</td>
                                <td className="p-4 text-gray-400">{product.category}</td>
                                <td className="p-4 text-gray-400">Rs. {product.price.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.stock < 10 ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="p-4 flex space-x-2">
                                    <button onClick={() => openModalForEdit(product)} className="text-cyan-400 hover:text-cyan-300 p-1"><EditIcon /></button>
                                    <button onClick={() => handleDelete(product.id)} className="text-rose-400 hover:text-rose-300 p-1"><DeleteIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedProduct ? 'Edit Product' : 'Add Product'}>
                <ProductForm
                    product={selectedProduct}
                    categories={categories}
                    onSave={handleSave}
                    onCancel={closeModal}
                />
            </Modal>
        </div>
    );
};

export default ProductManagementSupabase;
