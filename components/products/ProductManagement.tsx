
import React, { useState, useContext } from 'react';
import { DataContext } from '../../App';
import { Product } from '../../types';
import { EditIcon, DeleteIcon, PlusIcon } from '../ui/Icons';
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
                <button
                    onClick={openModalForNew}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5"/>
                    <span>Add Product</span>
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{product.name}</td>
                                <td className="p-4 text-gray-600">{product.category}</td>
                                <td className="p-4 text-gray-600">Rs. {product.price.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="p-4 flex space-x-2">
                                    <button onClick={() => openModalForEdit(product)} className="text-indigo-600 hover:text-indigo-800 p-1"><EditIcon /></button>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 p-1"><DeleteIcon /></button>
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
