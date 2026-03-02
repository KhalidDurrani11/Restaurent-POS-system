
import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'cat1', name: 'OTC Medicines' },
  { id: 'cat2', name: 'Prescription Medicines' },
  { id: 'cat3', name: 'Vitamins & Supplements' },
  { id: 'cat4', name: 'First Aid' },
  { id: 'cat5', name: 'Medical Devices' },
  { id: 'cat6', name: 'Personal Care' },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'prod1', name: 'Paracetamol 500mg (10 tablets)', category: 'OTC Medicines', price: 150, stock: 120 },
  { id: 'prod2', name: 'Ibuprofen 400mg (10 tablets)', category: 'OTC Medicines', price: 220, stock: 80 },
  { id: 'prod3', name: 'Cetirizine 10mg (10 tablets)', category: 'OTC Medicines', price: 180, stock: 100 },
  { id: 'prod4', name: 'Omeprazole 20mg (14 capsules)', category: 'Prescription Medicines', price: 350, stock: 60 },
  { id: 'prod5', name: 'ORS Sachet', category: 'OTC Medicines', price: 60, stock: 200 },
  { id: 'prod6', name: 'Vitamin C 1000mg (30 tablets)', category: 'Vitamins & Supplements', price: 500, stock: 50 },
  { id: 'prod7', name: 'Antiseptic Solution 100ml', category: 'First Aid', price: 180, stock: 75 },
  { id: 'prod8', name: 'Bandage Roll 4 inch', category: 'First Aid', price: 90, stock: 150 },
  { id: 'prod9', name: 'Digital Thermometer', category: 'Medical Devices', price: 650, stock: 25 },
  { id: 'prod10', name: 'Blood Pressure Monitor', category: 'Medical Devices', price: 4500, stock: 10 },
  { id: 'prod11', name: 'Aspirin 75mg (30 tablets)', category: 'OTC Medicines', price: 120, stock: 90 },
  { id: 'prod12', name: 'Amoxicillin 500mg (10 caps)', category: 'Prescription Medicines', price: 280, stock: 45 },
  { id: 'prod13', name: 'Multivitamin (60 tablets)', category: 'Vitamins & Supplements', price: 650, stock: 70 },
  { id: 'prod14', name: 'Calcium + D3 (30 tablets)', category: 'Vitamins & Supplements', price: 420, stock: 55 },
  { id: 'prod15', name: 'Cotton Wool 100g', category: 'First Aid', price: 85, stock: 120 },
  { id: 'prod16', name: 'Adhesive Plasters (20 pcs)', category: 'First Aid', price: 95, stock: 100 },
  { id: 'prod17', name: 'Face Mask (50 pcs)', category: 'First Aid', price: 350, stock: 80 },
  { id: 'prod18', name: 'Glucose Meter', category: 'Medical Devices', price: 1200, stock: 15 },
  { id: 'prod19', name: 'Pulse Oximeter', category: 'Medical Devices', price: 850, stock: 20 },
  { id: 'prod20', name: 'Hand Sanitizer 500ml', category: 'Personal Care', price: 220, stock: 60 },
  { id: 'prod21', name: 'Soap Bar (pack of 3)', category: 'Personal Care', price: 150, stock: 90 },
  { id: 'prod22', name: 'Cough Syrup 100ml', category: 'OTC Medicines', price: 180, stock: 65 },
  { id: 'prod23', name: 'Diclofenac Gel 30g', category: 'OTC Medicines', price: 240, stock: 40 },
  { id: 'prod24', name: 'Eye Drops 10ml', category: 'OTC Medicines', price: 160, stock: 75 },
  { id: 'prod25', name: 'Vitamin B Complex (30)', category: 'Vitamins & Supplements', price: 380, stock: 50 },
];
