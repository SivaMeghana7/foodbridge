const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Donation = require('./models/Donation');
const Claim = require('./models/Claim');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/foodbridge');
    console.log('[MongoDB] Connected for Seeding');
  } catch (err) {
    console.error('[MongoDB] Connection error:', err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Claim.deleteMany();
    await Donation.deleteMany();
    await User.deleteMany();
    console.log('✓ Cleared existing records.');

    // 1. Create Users
    const donor1 = await User.create({
      fullName: 'Green Earth Organic Bakery',
      email: 'donor@bakery.org',
      phone: '+1 555 123 4567',
      password: 'Password123!',
      role: 'Donor',
    });

    const donor2 = await User.create({
      fullName: 'Golden Harvest Catering',
      email: 'donor@catering.com',
      phone: '+1 555 987 6543',
      role: 'Donor',
      password: 'Password123!',
    });

    const recipient1 = await User.create({
      fullName: 'Hope Community Shelter',
      email: 'shelter@hope.org',
      phone: '+1 555 333 4444',
      role: 'Recipient',
      password: 'Password123!',
    });

    const recipient2 = await User.create({
      fullName: 'City Youth Center',
      email: 'youth@center.org',
      phone: '+1 555 777 8888',
      role: 'Recipient',
      password: 'Password123!',
    });

    console.log('✓ Created 4 sample users (2 Donors, 2 Recipients).');

    // Future dates helper
    const futureDate = (daysAhead, hoursAhead = 18) => {
      const d = new Date();
      d.setDate(d.getDate() + daysAhead);
      d.setHours(hoursAhead, 0, 0, 0);
      return d;
    };

    // 2. Create Donations
    const donation1 = await Donation.create({
      donorId: donor1._id,
      donorName: donor1.fullName,
      contact: donor1.phone,
      foodName: 'Artisan Sourdough Loaves & Seeded Baguettes',
      category: 'Bakery',
      description:
        'Surplus daily bake from our organic stoneground oven. Packaged in sealed food-safe paper bags. Ideal for shelter soup kitchens.',
      quantity: 35,
      unit: 'Meals',
      imageUrl:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      pickupLocation: '412 Baker Street, Loading Bay 2',
      availableUntil: futureDate(1, 21),
      status: 'Partially Claimed',
      claimedQuantity: 10,
    });

    const donation2 = await Donation.create({
      donorId: donor2._id,
      donorName: donor2.fullName,
      contact: donor2.phone,
      foodName: 'Vegetable Biryani & Lentil Curry Warm Trays',
      category: 'Cooked Food',
      description:
        'Freshly prepared lunch buffet surplus. Kept hot in commercial thermal catering pans. 100% vegetarian, nutritious, and balanced.',
      quantity: 50,
      unit: 'Meals',
      imageUrl:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      pickupLocation: 'Grand Central Plaza, Catering Kitchen Floor 1',
      availableUntil: futureDate(1, 23),
      status: 'Partially Claimed',
      claimedQuantity: 15,
    });

    const donation3 = await Donation.create({
      donorId: donor1._id,
      donorName: donor1.fullName,
      contact: donor1.phone,
      foodName: 'Sweet Honeycrisp Apples & Navel Oranges',
      category: 'Fruits',
      description:
        'Crates of crisp farm orchard fruits. Washed and sorted. Great for youth breakfast packs or pantry distribution.',
      quantity: 25,
      unit: 'Kg',
      imageUrl:
        'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
      pickupLocation: '412 Baker Street, Produce Counter',
      availableUntil: futureDate(3, 18),
      status: 'Available',
      claimedQuantity: 0,
    });

    const donation4 = await Donation.create({
      donorId: donor2._id,
      donorName: donor2.fullName,
      contact: donor2.phone,
      foodName: 'Farm Fresh Baby Spinach & Sweet Peppers',
      category: 'Vegetables',
      description:
        'Crisp greens, cucumbers, and colorful bell peppers. Harvested yesterday, refrigerated and intact.',
      quantity: 20,
      unit: 'Kg',
      imageUrl:
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      pickupLocation: 'Grand Central Plaza, Loading Dock B',
      availableUntil: futureDate(2, 19),
      status: 'Available',
      claimedQuantity: 0,
    });

    const donation5 = await Donation.create({
      donorId: donor1._id,
      donorName: donor1.fullName,
      contact: donor1.phone,
      foodName: 'Pasteurized Whole Milk & Natural Yogurt Tubs',
      category: 'Dairy',
      description:
        'Fresh whole milk jugs and Greek yogurt tubs from regional dairy co-op. Kept continuously cold at 3°C.',
      quantity: 30,
      unit: 'Litres',
      imageUrl:
        'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80',
      pickupLocation: '412 Baker Street, Cold Room Entrance',
      availableUntil: futureDate(2, 14),
      status: 'Available',
      claimedQuantity: 0,
    });

    const donation6 = await Donation.create({
      donorId: donor2._id,
      donorName: donor2.fullName,
      contact: donor2.phone,
      foodName: 'Rolled Oats & Whole Grain Cereal Packs',
      category: 'Packaged Food',
      description:
        'Unopened, factory-sealed boxes of organic breakfast cereals and rolled oats. Shelf life over 6 months.',
      quantity: 40,
      unit: 'Boxes',
      imageUrl:
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      pickupLocation: 'Grand Central Plaza, Storage Room 104',
      availableUntil: futureDate(14, 18),
      status: 'Available',
      claimedQuantity: 0,
    });

    console.log('✓ Created 6 high-quality food donation listings.');

    // 3. Create Sample Claims
    await Claim.create({
      donationId: donation1._id,
      recipientId: recipient1._id,
      recipientName: recipient1.fullName,
      contact: recipient1.phone,
      quantityRequested: 10,
      status: 'Confirmed',
    });

    await Claim.create({
      donationId: donation2._id,
      recipientId: recipient2._id,
      recipientName: recipient2.fullName,
      contact: recipient2.phone,
      quantityRequested: 15,
      status: 'Confirmed',
    });

    console.log('✓ Created 2 confirmed claims linking donations and recipients.');
    console.log('\n=========================================');
    console.log('🌱 SEEDING COMPLETED SUCCESSFULLY IN ATLAS!');
    console.log('Database:  test (in Cluster0)');
    console.log('Demo Credentials:');
    console.log('Donor:     donor@bakery.org     / Password123!');
    console.log('Donor:     donor@catering.com   / Password123!');
    console.log('Recipient: shelter@hope.org     / Password123!');
    console.log('Recipient: youth@center.org     / Password123!');
    console.log('=========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Claim.deleteMany();
    await Donation.deleteMany();
    await User.deleteMany();
    console.log('🗑️ All database records deleted.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Destroy error:', err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
