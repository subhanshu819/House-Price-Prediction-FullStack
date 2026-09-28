const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Prediction = require('../models/Prediction');

/**
 * GET /api/user/profile
 * Returns the authenticated user's profile (excluding password).
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ status: 'success', user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * PUT /api/user/profile
 * Updates the authenticated user's name and/or email.
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // At least one field must be provided
    if (!name && !email) {
      return res.status(400).json({ message: 'Please provide name or email to update.' });
    }

    const updateFields = {};
    if (name && name.trim()) updateFields.name = name.trim();
    if (email && email.trim()) {
      const normalizedEmail = email.trim().toLowerCase();

      // Check if the new email is already taken by another user
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ message: 'This email is already in use by another account.' });
      }
      updateFields.email = normalizedEmail;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * PUT /api/user/password
 * Changes the authenticated user's password.
 * Requires: currentPassword, newPassword
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current password and new password.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    // Fetch user with password
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    // Hash new password and save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Password changed successfully.',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * DELETE /api/user/account
 * Permanently deletes the authenticated user's account and all their predictions.
 */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete all predictions belonging to this user
    await Prediction.deleteMany({ user: userId });

    // Delete the user account
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Account and all associated data have been permanently deleted.',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
};
