const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('../models/Company');
const Category = require('../models/Category');
const Product = require('../models/Product');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Clear existing
    await Company.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    // 1. Create Companies
    const kots = await Company.create({ name: 'KOTS Food & Beverages', description: 'Premium snacks and healthy beverages agency.' });
    const arihant = await Company.create({ name: 'Arihant Agencies', description: 'Bulk groceries and essentials.' });

    // 2. Create Categories
    const snacks = await Category.create({ name: 'Snacks', companyId: kots._id });
    const beverages = await Category.create({ name: 'Beverages', companyId: kots._id });
    const groceries = await Category.create({ name: 'Groceries', companyId: arihant._id });

    // 3. Create Products
    await Product.create([
      {
        name: 'Kots Potato Chips (Classic)',
        description: 'Crispy classic salted potato chips in bulk packaging.',
        companyId: kots._id,
        categoryId: snacks._id,
        basePrice: 450,
        unit: 'Box',
        stock: 100,
        minOrderQty: 5,
        priceTiers: [{ minQty: 10, price: 420 }, { minQty: 20, price: 400 }]
      },
      {
        name: 'Kots Mango Juice 200ml',
        description: 'Natural mango juice, 24 bottles per case.',
        companyId: kots._id,
        categoryId: beverages._id,
        basePrice: 600,
        unit: 'Case',
        stock: 50,
        minOrderQty: 2,
        priceTiers: [{ minQty: 5, price: 570 }]
      },
      {
        name: 'Premium Basmati Rice',
        description: 'Long grain aromatic basmati rice.',
        companyId: arihant._id,
        categoryId: groceries._id,
        basePrice: 1200,
        unit: 'Bag (25kg)',
        stock: 30,
        minOrderQty: 1,
        priceTiers: [{ minQty: 10, price: 1100 }]
      }
    ]);

    console.log('Database Seeded Successfully! 🌱');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
