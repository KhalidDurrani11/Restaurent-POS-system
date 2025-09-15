import React, { useState, useContext } from 'react';
import { DataContext } from '../../App';
import { Product } from '../../types';
// FIX: Imported the missing `ProductIcon` component.
import { EditIcon, DeleteIcon, PlusIcon, TagIcon, CashIcon, StockIcon, ActionsIcon, ProductIcon } from '../ui/Icons';
import Modal from '../ui/Modal';
import ProductForm from './ProductForm';

const ProductManagement: React.FC = () => {
    const { products, setProducts, categories } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

    const handleSave = (product: Product) => {
        if (selectedProduct) { // Editing existing
            setProducts(prev => prev.map(p => p.id === product.id ? product : p));
        } else { // Adding new
            setProducts(prev => [...prev, { ...product, id: `prod-${Date.now()}` }]);
        }
        closeModal();
    };

    const handleDelete = (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(prev => prev.filter(p => p.id !== productId));
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

export default ProductManagement;