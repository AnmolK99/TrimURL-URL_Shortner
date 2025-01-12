const mongoose = require('mongoose');
const { createUserRoleMapping } = require('../../controllers/user-role-mapping');
const User = require('../../models/user');
const Role = require('../../models/role');

async function assignRole() {
  try {
    // First connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/url-shortner', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const userData = await User.findOne({ email: 'afsdnfsd@nsfnd.sodfi' });
    const roleData = await Role.findOne({ name: 'GUEST' });

    console.log('User data fetched', userData);
    console.log('roleData data fetched', roleData);

    if (userData && roleData) {
      const result = await createUserRoleMapping(userData.id, roleData.id);
      console.log('Role assigned successfully:', result);
    }
    else {
      if (!userData)
        console.log('User not found');
      else
        console.log('Role not found');
    }
  } catch (error) {
    console.error('Error assigning role:', error.message);
  } finally {
    // Close the connection when done
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Execute the function
assignRole(); 