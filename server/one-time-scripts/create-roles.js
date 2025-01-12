const mongoose = require('mongoose');
const Role = require('../../models/role'); // Make sure this path is correct

// MongoDB connection URI - replace with your actual URI
const MONGODB_URI = 'mongodb://localhost:27017/url-shortner';

const defaultRoles = [
  {
    name: 'ADMIN',
    description: 'System administrator with full access',
    permissions: ['read', 'write', 'delete', 'manage_users', 'manage_roles']
  },
  {
    name: 'USER',
    description: 'Regular user with basic access',
    permissions: ['read', 'write']
  },
  {
    name: 'GUEST',
    description: 'Guest user with limited access',
    permissions: ['read']
  }
];

async function seedRoles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Insert roles
    for (const role of defaultRoles) {
      // Using findOneAndUpdate with upsert to avoid duplicates
      await Role.findOneAndUpdate(
        { name: role.name },
        role,
        { upsert: true, new: true }
      );
      console.log(`Role ${role.name} created/updated successfully`);
    }

    console.log('Roles seeding completed');
  } catch (error) {
    console.error('Error seeding roles:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedRoles();
