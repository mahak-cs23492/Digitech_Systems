import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import connectDB from '../config/db.js';

dotenv.config();

const users = [
  {
    name: 'Digitech Admin',
    email: 'admin@digitech.com',
    password: 'admin123',
    isAdmin: true,
    shippingAddress: {
      address: '101 Admin HQ, Tech Plaza',
      city: 'Silicon Valley',
      postalCode: '94025',
      country: 'USA'
    }
  },
  {
    name: 'John Doe',
    email: 'customer@digitech.com',
    password: 'customer123',
    isAdmin: false,
    shippingAddress: {
      address: '456 customer street, Apt 2B',
      city: 'Tech City',
      postalCode: '12345',
      country: 'USA'
    }
  }
];

const products = [
  {
    name: 'HP Victus 15 Gaming Laptop',
    description: 'Experience intense gaming performance with the HP Victus 15. Powered by AMD Ryzen processor and NVIDIA RTX graphics, it offers a seamless gameplay experience on a stunning 144Hz display.',
    brand: 'HP',
    category: 'Laptops',
    price: 799,
    discountPrice: 749,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop'
    ],
    specifications: {
      'Processor': 'AMD Ryzen 5 5600H (6 Cores, Up to 4.2 GHz)',
      'RAM': '16GB DDR4 3200MHz',
      'Storage': '512GB PCIe NVMe M.2 SSD',
      'Graphics': 'NVIDIA GeForce RTX 3050 (4GB GDDR6)',
      'Display': '15.6-inch FHD (1920 x 1080), 144Hz, IPS',
      'Operating System': 'Windows 11 Home',
      'Warranty': '1 Year Limited',
      'Color': 'Performance Blue'
    },
    featured: true,
    bestSeller: false,
    newArrival: true,
    isHidden: false,
    reviews: [],
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Lenovo ThinkPad E14 Gen 5',
    description: 'The Lenovo ThinkPad E14 Gen 5 is a robust business laptop engineered for professionals. Featuring Intel Core 13th Gen processors, legendary ThinkPad durability, and robust security features.',
    brand: 'Lenovo',
    category: 'Laptops',
    price: 949,
    discountPrice: 899,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1569762224037-c750ec0c8dec?q=80&w=600&auto=format&fit=crop'
    ],
    specifications: {
      'Processor': 'Intel Core i5-1335U (10 Cores, Up to 4.6 GHz)',
      'RAM': '16GB DDR4 3200MHz (Upgradeable)',
      'Storage': '512GB SSD M.2 2242 PCIe Gen4 TLC Opal 2.0',
      'Graphics': 'Intel Iris Xe Graphics',
      'Display': '14-inch WUXGA (1920 x 1200) IPS, Anti-Glare',
      'Operating System': 'Windows 11 Pro',
      'Warranty': '3 Years Premier Support',
      'Color': 'Black'
    },
    featured: true,
    bestSeller: true,
    newArrival: false,
    isHidden: false,
    reviews: [],
    rating: 0,
    numReviews: 0
  },
  {
    name: 'HP LaserJet Pro M404dn',
    description: 'Designed to let you focus on growing your business, the HP LaserJet Pro M404dn offers fast two-sided printing, strong security, and low energy usage, perfect for workspaces.',
    brand: 'HP',
    category: 'Printers',
    price: 299,
    discountPrice: 0,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=600&auto=format&fit=crop'
    ],
    specifications: {
      'Print Speed': 'Up to 40 pages per minute (ppm)',
      'Connectivity': 'Hi-Speed USB 2.0, Gigabit Ethernet',
      'Duplex Printing': 'Automatic (Standard)',
      'Duty Cycle': 'Up to 80,000 pages monthly',
      'Paper Capacity': '250-sheet input tray, 100-sheet multipurpose tray',
      'Warranty': '1 Year Next Business Day Exchange'
    },
    featured: false,
    bestSeller: true,
    newArrival: false,
    isHidden: false,
    reviews: [],
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Canon PIXMA G3010 Ink Tank Printer',
    description: 'High page yield Ink Tank printer with wireless capability for home and small business users. Print, scan, copy and enjoy low cost printing without frequent refills.',
    brand: 'Canon',
    category: 'Printers',
    price: 199,
    discountPrice: 179,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1563223552-30d01fda3ea6?q=80&w=600&auto=format&fit=crop'
    ],
    specifications: {
      'Functions': 'Print, Scan, Copy',
      'Ink System': 'Refillable Ink Tank (Built-in)',
      'Print Speed': '8.8 ipm (Black) / 5.0 ipm (Color)',
      'Connectivity': 'USB 2.0, Wi-Fi 802.11 b/g/n',
      'Paper Size': 'A4, A5, B5, Letter, Legal',
      'Warranty': '1 Year Carry-In Warranty'
    },
    featured: false,
    bestSeller: false,
    newArrival: true,
    isHidden: false,
    reviews: [],
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Dell S2721HN 27" IPS Monitor',
    description: 'Beautifully designed 27-inch monitor that easily fits into any space ready for your everyday lifestyle. It features ultra-thin bezels, Dual HDMI ports and AMD FreeSync technology.',
    brand: 'Dell',
    category: 'Monitors',
    price: 189,
    discountPrice: 159,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop'
    ],
    specifications: {
      'Resolution': 'Full HD (1920 x 1080) at 75Hz',
      'Panel Type': 'IPS',
      'Response Time': '4ms (Gray to Gray) Extreme Mode',
      'Aspect Ratio': '16:9',
      'Contrast Ratio': '1000:1',
      'Ports': '2 x HDMI 1.4, 1 x Audio Line-Out',
      'Adaptive Sync': 'AMD FreeSync',
      'Warranty': '3 Years Advanced Exchange Service'
    },
    featured: true,
    bestSeller: false,
    newArrival: false,
    isHidden: false,
    reviews: [],
    rating: 0,
    numReviews: 0
  },
  {
    name: 'LG UltraGear 32" QHD Gaming Monitor',
    description: 'Get fully immersed in your games with this giant 32-inch gaming monitor. Features AMD FreeSync Premium, high refresh rate, and crystal-clear QHD resolution.',
    brand: 'LG',
    category: 'Monitors',
    price: 349,
    discountPrice: 319,
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600&auto=format&fit=crop'
    ],
    specifications: {
      'Resolution': 'QHD (2560 x 1440)',
      'Refresh Rate': '165Hz',
      'Panel Type': 'VA',
      'Response Time': '1ms MBR',
      'Contrast Ratio': '3000:1',
      'Ports': '2 x HDMI 2.0, 1 x DisplayPort 1.4, Headphone Out',
      'Sync Technology': 'AMD FreeSync Premium',
      'Warranty': '1 Year Parts and Labor'
    },
    featured: false,
    bestSeller: true,
    newArrival: true,
    isHidden: false,
    reviews: [],
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'An icon remastered. Feel every moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks and an 8,000 DPI track-on-glass sensor.',
    brand: 'Logitech',
    category: 'Accessories',
    price: 99,
    discountPrice: 0,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop'
    ],
    specifications: {
      'Connectivity': 'Bluetooth Low Energy & Logi Bolt USB Receiver',
      'Sensor DPI': '200 to 8000 DPI (Set in increments of 50 DPI)',
      'Buttons': '7 buttons (Left/Right-click, Back/Forward, App-Switch, Wheel mode-shift, Middle click)',
      'Battery': 'Rechargeable Li-Po (500 mAh) - Up to 70 days battery life',
      'Charging': 'USB-C Cable',
      'Warranty': '1 Year Hardware Warranty'
    },
    featured: true,
    bestSeller: true,
    newArrival: false,
    isHidden: false,
    reviews: [],
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Corsair K70 RGB PRO Mechanical Keyboard',
    description: 'The CORSAIR K70 RGB PRO Mechanical Gaming Keyboard delivers an iconic aluminum frame and even better performance, powered by CORSAIR AXON Hyper-Processing Technology.',
    brand: 'Corsair',
    category: 'Accessories',
    price: 169,
    discountPrice: 149,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop'
    ],
    specifications: {
      'Switches': 'CHERRY MX Speed (Linear & Fast)',
      'Backlighting': 'Per-key RGB Backlit, Customizable',
      'Chassis': 'Aircraft-grade Anodized Brushed Aluminum',
      'Connectivity': 'Detachable Braided USB Type-C',
      'Keycaps': 'Double-shot PBT Keycaps (1.5mm thick)',
      'Polling Rate': 'Up to 8,000Hz hyper-polling with CORSAIR AXON',
      'Warranty': '2 Years'
    },
    featured: false,
    bestSeller: false,
    newArrival: true,
    isHidden: false,
    reviews: [],
    rating: 0,
    numReviews: 0
  }
];

export const seedDatabaseCloud = async () => {
  // Clear collection data
  await User.deleteMany();
  await Product.deleteMany();
  await Order.deleteMany();

  console.log('Old collections cleared.');

  // Seed users (using save() individually to trigger pre-save password hashing hooks)
  const createdUsers = [];
  for (const u of users) {
    const user = new User(u);
    await user.save();
    createdUsers.push(user);
  }
  console.log(`Seeded ${createdUsers.length} users successfully.`);

  // Seed products
  const createdProducts = await Product.insertMany(products);
  console.log(`Seeded ${createdProducts.length} products successfully.`);

  console.log('Database Seeding Completed Successfully!');
  return {
    usersCount: createdUsers.length,
    productsCount: createdProducts.length
  };
};

