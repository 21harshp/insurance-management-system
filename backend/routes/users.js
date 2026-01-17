const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// Get all sales managers (Admin only)
router.get('/sales-managers', auth, isAdmin, async (req, res) => {
    try {
        const salesManagers = await User.find({ role: 'salesManager' })
            .select('-__v')
            .sort({ createdAt: -1 });

        // Return sales managers with plain text passwords
        // Note: In production, you should store passwords separately or use a different approach
        // For this requirement, we'll need to decrypt or store passwords differently
        res.json(salesManagers);
    } catch (error) {
        console.error('Get sales managers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create sales manager (Admin only)
router.post('/sales-managers', auth, isAdmin, async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Please provide a password' });
        }

        // Generate unique userId for sales manager
        const count = await User.countDocuments({ role: 'salesManager' });
        const userId = `SM${String(count + 1).padStart(4, '0')}`;

        const salesManager = new User({
            userId,
            password,
            role: 'salesManager',
            createdBy: req.userId,
        });

        await salesManager.save();

        res.status(201).json({
            id: salesManager._id,
            userId: salesManager.userId,
            role: salesManager.role,
            createdAt: salesManager.createdAt,
            message: 'Sales Manager created successfully',
        });
    } catch (error) {
        console.error('Create sales manager error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset sales manager password (Admin only)
router.put('/sales-managers/:id/reset-password', auth, isAdmin, async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { id } = req.params;

        if (!newPassword) {
            return res.status(400).json({ message: 'Please provide a new password' });
        }

        const salesManager = await User.findById(id);

        if (!salesManager || salesManager.role !== 'salesManager') {
            return res.status(404).json({ message: 'Sales Manager not found' });
        }

        salesManager.password = newPassword;
        await salesManager.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
