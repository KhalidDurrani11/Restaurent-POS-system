import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types';

interface ProductFormProps {
    product: Product | null;
    categories: Category[];
    onSave: (product: Product) => void;
    onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, categories, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: '',
        category: categories.length > 0 ? categories[0].name : '',
        price: 0,
        stock: 0,
    });
    
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                category: product.category,
                price: product.price,
                stock: product.stock,
            });
        } else {
             setFormData({
                name: '',
                category: categories.length > 0 ? categories[0].name : '',
                price: 0,
                stock: 0,
            });
        }
    }, [product, categories]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: product ? product.id : '',
            ...formData,
        });
    };
    
    const inputClasses = "mt-1 block w-full border border-white/20 bg-white/10 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Product Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputClasses} />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                <select name="category" id="category" value={formData.category} onChange={handleChange} required className={inputClasses}>
                    {categories.map(cat => <option key={cat.id} value={cat.name} className="bg-slate-800">{cat.name}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price</label>
                    <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-300">Stock Quantity</label>
                    <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required min="0" className={inputClasses} />
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-white/10 text-gray-200 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
                <button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">Save</button>
            </div>
        </form>
    );
};

export default ProductForm;