const mongoose = require('mongoose');

const userRoleMappingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate role assignments
userRoleMappingSchema.index({ userId: 1, roleId: 1 }, { unique: true });

const UserRoleMapping = mongoose.model('UserRoleMapping', userRoleMappingSchema);

module.exports = UserRoleMapping;
