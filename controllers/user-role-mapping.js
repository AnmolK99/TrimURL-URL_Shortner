const UserRoleMapping = require('../models/user-role-mapping');

// Create user-role mapping
const createUserRoleMapping = async (userId, roleId) => {
  try {
    // Validate inputs
    if (!userId || !roleId) {
      throw new Error('Both userId and roleId are required');
    }

    // Check if mapping already exists
    const existingMapping = await UserRoleMapping.findOne({ userId, roleId });
    if (existingMapping) {
      throw new Error('User already has this role');
    }

    // Create new mapping
    const userRoleMapping = await UserRoleMapping.create({
      userId,
      roleId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return {
      success: true,
      data: userRoleMapping
    };

  } catch (error) {
    throw error;
  }
};

// Get user roles
const getUserRoles = async (userId) => {
  try {
    const userRoles = await UserRoleMapping.find({ userId })
      .populate('roleId', 'name description')
      .exec();

    return {
      success: true,
      data: userRoles
    };

  } catch (error) {
    throw error;
  }
};

// Remove user role mapping
const removeUserRoleMapping = async (userId, roleId) => {
  try {
    const deletedMapping = await UserRoleMapping.findOneAndDelete({ userId, roleId });

    if (!deletedMapping) {
      throw new Error('User role mapping not found');
    }

    return {
      success: true,
      message: 'User role mapping removed successfully'
    };

  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUserRoleMapping,
  getUserRoles,
  removeUserRoleMapping
};
