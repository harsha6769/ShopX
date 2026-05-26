const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const products = [
  // ELECTRONICS
  {
    name: 'iPhone 15 Pro',
    description: 'Apple iPhone 15 Pro with A17 Bionic chip, titanium design, 48MP camera system, and Action Button. The most powerful iPhone ever made.',
    price: 129999, originalPrice: 139999,
    category: 'Electronics', stock: 25, featured: true,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'],
    ratings: { average: 4.8, count: 256 }, tags: ['apple', 'smartphone', '5G']
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung Galaxy S24 Ultra with Snapdragon 8 Gen 3, 200MP camera, built-in S Pen, and 5000mAh battery.',
    price: 124999, originalPrice: 134999,
    category: 'Electronics', stock: 20, featured: true,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'],
    ratings: { average: 4.7, count: 189 }, tags: ['samsung', 'smartphone', '5G']
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancelling headphones with 30hr battery, multipoint connection, and crystal clear calls.',
    price: 24990, originalPrice: 34990,
    category: 'Electronics', stock: 50, featured: true,
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500'],
    ratings: { average: 4.9, count: 1203 }, tags: ['sony', 'headphones', 'wireless']
  },
  {
    name: 'MacBook Air M3',
    description: '15-inch MacBook Air with M3 chip, 18-hour battery life, Liquid Retina display, and MagSafe charging.',
    price: 134900, originalPrice: 144900,
    category: 'Electronics', stock: 15, featured: true,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
    ratings: { average: 4.8, count: 432 }, tags: ['apple', 'laptop', 'M3']
  },
  {
    name: 'Samsung 65" 4K OLED TV',
    description: 'Stunning 65-inch OLED display with Dolby Vision, Dolby Atmos, and Smart TV powered by Tizen OS.',
    price: 149999, originalPrice: 179999,
    category: 'Electronics', stock: 10, featured: true,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=500'],
    ratings: { average: 4.7, count: 89 }, tags: ['samsung', 'TV', 'OLED']
  },
  {
    name: 'iPad Pro 12.9"',
    description: 'iPad Pro with M2 chip, Liquid Retina XDR display, Thunderbolt port, and all-day battery life.',
    price: 99900, originalPrice: 109900,
    category: 'Electronics', stock: 18, featured: false,
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'],
    ratings: { average: 4.7, count: 321 }, tags: ['apple', 'tablet', 'iPad']
  },
  {
    name: 'Canon EOS R50 Camera',
    description: 'Mirrorless camera with 24.2MP sensor, 4K video, Eye AF, and compact lightweight body. Perfect for creators.',
    price: 74990, originalPrice: 84990,
    category: 'Electronics', stock: 12, featured: false,
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500'],
    ratings: { average: 4.6, count: 178 }, tags: ['canon', 'camera', 'mirrorless']
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Apple Watch Series 9 with S9 chip, Double Tap gesture, Always-On Retina display, and health sensors.',
    price: 41900, originalPrice: 45900,
    category: 'Electronics', stock: 30, featured: false,
    images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500'],
    ratings: { average: 4.8, count: 567 }, tags: ['apple', 'smartwatch', 'fitness']
  },
  {
    name: 'PlayStation 5',
    description: 'Sony PlayStation 5 with ultra-high speed SSD, ray tracing, 4K gaming, and DualSense controller.',
    price: 54990, originalPrice: 59990,
    category: 'Electronics', stock: 8, featured: true,
    images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500'],
    ratings: { average: 4.9, count: 892 }, tags: ['sony', 'gaming', 'console']
  },
  {
    name: 'Bose QuietComfort 45',
    description: 'Bose QC45 wireless headphones with world-class noise cancellation, 24-hour battery, and premium comfort.',
    price: 19990, originalPrice: 29990,
    category: 'Electronics', stock: 35, featured: false,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    ratings: { average: 4.6, count: 445 }, tags: ['bose', 'headphones', 'wireless']
  },

  // CLOTHING
  {
    name: 'Men\'s Premium Cotton Tee',
    description: 'Premium 100% organic cotton t-shirt, pre-shrunk, available in 12 colors. Soft, breathable and durable.',
    price: 699, originalPrice: 999,
    category: 'Clothing', stock: 200, featured: false,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    ratings: { average: 4.3, count: 876 }, tags: ['cotton', 'casual', 'men']
  },
  {
    name: 'Women\'s Yoga Leggings',
    description: 'High-waist compression leggings with moisture-wicking fabric, 4-way stretch, and hidden pocket.',
    price: 1499, originalPrice: 2199,
    category: 'Clothing', stock: 150, featured: true,
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500'],
    ratings: { average: 4.6, count: 543 }, tags: ['yoga', 'sports', 'women']
  },
  {
    name: 'Men\'s Slim Fit Jeans',
    description: 'Classic slim fit jeans with stretch fabric for all-day comfort. Available in dark blue and black.',
    price: 1999, originalPrice: 2999,
    category: 'Clothing', stock: 120, featured: false,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
    ratings: { average: 4.4, count: 632 }, tags: ['jeans', 'casual', 'men']
  },
  {
    name: 'Women\'s Floral Dress',
    description: 'Beautiful floral print midi dress perfect for summer. Lightweight fabric with V-neck design.',
    price: 1799, originalPrice: 2499,
    category: 'Clothing', stock: 80, featured: true,
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500'],
    ratings: { average: 4.5, count: 289 }, tags: ['dress', 'summer', 'women']
  },
  {
    name: 'Men\'s Hoodie',
    description: 'Cozy fleece hoodie with kangaroo pocket and adjustable drawstring. Perfect for winter.',
    price: 1299, originalPrice: 1999,
    category: 'Clothing', stock: 160, featured: false,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500'],
    ratings: { average: 4.4, count: 412 }, tags: ['hoodie', 'winter', 'men']
  },
  {
    name: 'Women\'s Denim Jacket',
    description: 'Classic denim jacket with button closure and chest pockets. A timeless wardrobe staple.',
    price: 2499, originalPrice: 3499,
    category: 'Clothing', stock: 90, featured: false,
    images: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500'],
    ratings: { average: 4.3, count: 234 }, tags: ['jacket', 'denim', 'women']
  },

  // BOOKS
  {
    name: 'Atomic Habits',
    description: 'The #1 New York Times bestseller by James Clear. Tiny changes, remarkable results. Transform your habits.',
    price: 399, originalPrice: 699,
    category: 'Books', stock: 300, featured: false,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'],
    ratings: { average: 4.9, count: 4521 }, tags: ['self-help', 'habits', 'bestseller']
  },
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel. A must-read for everyone.',
    price: 349, originalPrice: 599,
    category: 'Books', stock: 250, featured: false,
    images: ['https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=500'],
    ratings: { average: 4.7, count: 2341 }, tags: ['finance', 'money', 'investing']
  },
  {
    name: 'Rich Dad Poor Dad',
    description: 'Robert Kiyosaki\'s #1 Personal Finance book of all time. What the rich teach their kids about money.',
    price: 299, originalPrice: 499,
    category: 'Books', stock: 280, featured: false,
    images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500'],
    ratings: { average: 4.6, count: 5632 }, tags: ['finance', 'money', 'bestseller']
  },
  {
    name: 'The Alchemist',
    description: 'Paulo Coelho\'s masterpiece about following your dreams. One of the best-selling books in history.',
    price: 249, originalPrice: 399,
    category: 'Books', stock: 320, featured: false,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'],
    ratings: { average: 4.8, count: 7823 }, tags: ['fiction', 'inspiration', 'classic']
  },

  // HOME
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker and warmer in one pot.',
    price: 8999, originalPrice: 12999,
    category: 'Home', stock: 45, featured: true,
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'],
    ratings: { average: 4.6, count: 789 }, tags: ['kitchen', 'cooking', 'appliance']
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Powerful cordless vacuum with laser dust detection, HEPA filtration, and 60 min battery life.',
    price: 52900, originalPrice: 59900,
    category: 'Home', stock: 20, featured: false,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
    ratings: { average: 4.7, count: 234 }, tags: ['dyson', 'vacuum', 'cordless']
  },
  {
    name: 'Philips Air Fryer XXL',
    description: 'Extra large air fryer with Rapid Air technology. Fry, bake, grill and roast with up to 90% less fat.',
    price: 12999, originalPrice: 17999,
    category: 'Home', stock: 35, featured: false,
    images: ['https://images.unsplash.com/photo-1648803948985-b3f16e77d3c3?w=500'],
    ratings: { average: 4.5, count: 567 }, tags: ['airfryer', 'kitchen', 'healthy']
  },
  {
    name: 'Luxury Bedsheet Set',
    description: '100% Egyptian cotton 1000 thread count bedsheet set. Includes 1 flat sheet, 1 fitted sheet, 2 pillowcases.',
    price: 3999, originalPrice: 5999,
    category: 'Home', stock: 60, featured: false,
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500'],
    ratings: { average: 4.4, count: 345 }, tags: ['bedding', 'cotton', 'luxury']
  },

  // SPORTS
  {
    name: 'Nike Air Zoom Pegasus 40',
    description: 'Legendary running shoe with React foam and Air Zoom units for a responsive and cushioned ride.',
    price: 9995, originalPrice: 11495,
    category: 'Sports', stock: 60, featured: true,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    ratings: { average: 4.7, count: 892 }, tags: ['nike', 'running', 'shoes']
  },
  {
    name: 'Resistance Bands Set',
    description: 'Set of 5 premium resistance bands with handles, door anchor, ankle straps, and carry bag.',
    price: 899, originalPrice: 1499,
    category: 'Sports', stock: 100, featured: false,
    images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500'],
    ratings: { average: 4.4, count: 1123 }, tags: ['fitness', 'gym', 'workout']
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick 6mm non-slip yoga mat with carrying strap. Perfect for yoga, pilates and floor exercises.',
    price: 1299, originalPrice: 1999,
    category: 'Sports', stock: 85, featured: false,
    images: ['https://images.unsplash.com/photo-1601925228184-8de7cdde70bd?w=500'],
    ratings: { average: 4.5, count: 678 }, tags: ['yoga', 'fitness', 'mat']
  },
  {
    name: 'Adjustable Dumbbell Set',
    description: 'Space-saving adjustable dumbbells from 5kg to 25kg. Replace 9 sets of weights with one compact set.',
    price: 14999, originalPrice: 19999,
    category: 'Sports', stock: 25, featured: true,
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500'],
    ratings: { average: 4.6, count: 432 }, tags: ['dumbbells', 'gym', 'fitness']
  },

  // BEAUTY
  {
    name: 'Dyson Airwrap Styler',
    description: 'Multi-styler and dryer with no extreme heat. Curl, wave, smooth and dry your hair with one tool.',
    price: 44900, originalPrice: 49900,
    category: 'Beauty', stock: 15, featured: true,
    images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500'],
    ratings: { average: 4.8, count: 567 }, tags: ['dyson', 'hair', 'styler']
  },
  {
    name: 'Skincare Essentials Kit',
    description: 'Complete skincare routine with cleanser, toner, serum, moisturizer and SPF50 sunscreen.',
    price: 2999, originalPrice: 4999,
    category: 'Beauty', stock: 70, featured: false,
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500'],
    ratings: { average: 4.5, count: 345 }, tags: ['skincare', 'beauty', 'routine']
  },

  // TOYS
  {
    name: 'LEGO Technic Bugatti',
    description: 'LEGO Technic Bugatti Chiron with 3599 pieces. Features working 8-speed gearbox and W16 engine.',
    price: 18999, originalPrice: 22999,
    category: 'Toys', stock: 20, featured: false,
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500'],
    ratings: { average: 4.9, count: 234 }, tags: ['lego', 'technic', 'collectible']
  },
  {
    name: 'Remote Control Car',
    description: 'High-speed RC car with 4WD, 45km/h top speed, waterproof design and 30min battery life.',
    price: 2999, originalPrice: 4499,
    category: 'Toys', stock: 40, featured: false,
    images: ['https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500'],
    ratings: { average: 4.4, count: 456 }, tags: ['RC', 'car', 'kids']
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    await User.create({
      name: 'Admin User',
      email: 'admin@shopx.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('👤 Admin: admin@shopx.com / admin123');

    await User.create({
      name: 'Test User',
      email: 'user@shopx.com',
      password: 'user1234',
      role: 'user'
    });
    console.log('👤 User: user@shopx.com / user1234');

    await Product.insertMany(products);
    console.log(`📦 ${products.length} products seeded!`);

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();