const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

const normalizeDate = (value) => {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return undefined;
    return date;
};

const getDaysLeftUntilEnd = (endDate) => {
    if (!endDate) return null;
    const now = new Date();
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const diffMs = end.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

// Get all sales managers (Admin only)
router.get('/sales-managers', auth, isAdmin, async (req, res) => {
    try {
        const salesManagers = await User.find({ role: 'salesManager' })
            .select('-__v')
            .sort({ createdAt: -1 });
        let hasStatusUpdates = false;

        const managersWithPlanState = salesManagers.map((manager) => {
            const daysLeft = getDaysLeftUntilEnd(manager.packageEndDate);
            const isExpired = daysLeft !== null && daysLeft <= 0;
            const isExpiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 10;

            // Only toggle status automatically; keep all fields editable in admin panel.
            if (isExpired && manager.isEnabled !== false) {
                manager.isEnabled = false;
                hasStatusUpdates = true;
            }

            const managerObj = manager.toObject();
            return {
                ...managerObj,
                plan: {
                    daysLeft,
                    isExpired,
                    isExpiringSoon,
                },
            };
        });

        if (hasStatusUpdates) {
            await Promise.all(
                salesManagers
                    .filter((manager) => manager.isModified('isEnabled'))
                    .map((manager) => manager.save())
            );
        }

        managersWithPlanState.sort((a, b) => {
            const priority = (item) => {
                if (item.plan?.isExpired) return 0;
                if (item.plan?.isExpiringSoon) return 1;
                return 2;
            };

            const priorityDiff = priority(a) - priority(b);
            if (priorityDiff !== 0) return priorityDiff;

            const aDays = a.plan?.daysLeft ?? Number.MAX_SAFE_INTEGER;
            const bDays = b.plan?.daysLeft ?? Number.MAX_SAFE_INTEGER;
            if (aDays !== bDays) return aDays - bDays;

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        res.json(managersWithPlanState);
    } catch (error) {
        console.error('Get sales managers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create sales manager (Admin only)
router.post('/sales-managers', auth, isAdmin, async (req, res) => {
    try {
        const { password, name, email, packageStartDate, packageEndDate } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Please provide a password' });
        }
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Please provide a name' });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Please provide an email' });
        }

        // Check if email is already in use
        const emailExists = await User.findOne({ email: email.trim().toLowerCase() });
        if (emailExists) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // Generate unique userId for sales manager
        const count = await User.countDocuments({ role: 'salesManager' });
        const userId = `SM${String(count + 1).padStart(4, '0')}`;

        const salesManager = new User({
            userId,
            password,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            packageStartDate: normalizeDate(packageStartDate),
            packageEndDate: normalizeDate(packageEndDate),
            role: 'salesManager',
            createdBy: req.userId,
        });

        await salesManager.save();

        res.status(201).json({
            id: salesManager._id,
            userId: salesManager.userId,
            name: salesManager.name,
            email: salesManager.email,
            role: salesManager.role,
            packageStartDate: salesManager.packageStartDate,
            packageEndDate: salesManager.packageEndDate,
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
// Update sales manager profile — name & email (Admin only)
router.patch('/sales-managers/:id/profile', auth, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, packageStartDate, packageEndDate } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Name is required' });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const salesManager = await User.findById(id);
        if (!salesManager || salesManager.role !== 'salesManager') {
            return res.status(404).json({ message: 'Sales Manager not found' });
        }

        // Check email uniqueness (excluding self)
        const emailExists = await User.findOne({
            email: email.trim().toLowerCase(),
            _id: { $ne: id },
        });
        if (emailExists) {
            return res.status(400).json({ message: 'Email is already in use by another manager' });
        }

        salesManager.name = name.trim();
        salesManager.email = email.trim().toLowerCase();
        const normalizedStart = normalizeDate(packageStartDate);
        const normalizedEnd = normalizeDate(packageEndDate);

        if (normalizedStart !== undefined) {
            salesManager.packageStartDate = normalizedStart;
        }
        if (normalizedEnd !== undefined) {
            salesManager.packageEndDate = normalizedEnd;
            const daysLeft = getDaysLeftUntilEnd(normalizedEnd);
            if (daysLeft !== null && daysLeft <= 0) {
                salesManager.isEnabled = false;
            }
        }
        await salesManager.save();

        res.json({
            message: 'Profile updated successfully',
            name: salesManager.name,
            email: salesManager.email,
            packageStartDate: salesManager.packageStartDate,
            packageEndDate: salesManager.packageEndDate,
            isEnabled: salesManager.isEnabled,
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/sales-managers/:id/toggle-status', auth, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const salesManager = await User.findById(id);

        if (!salesManager || salesManager.role !== 'salesManager') {
            return res.status(404).json({ message: 'Sales Manager not found' });
        }

        salesManager.isEnabled = !salesManager.isEnabled;
        await salesManager.save();

        res.json({
            message: `Sales Manager ${salesManager.isEnabled ? 'enabled' : 'disabled'} successfully`,
            isEnabled: salesManager.isEnabled,
        });
    } catch (error) {
        console.error('Toggle status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update sales manager notes (Admin only)
router.patch('/sales-managers/:id/notes', auth, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const salesManager = await User.findById(id);

        if (!salesManager || salesManager.role !== 'salesManager') {
            return res.status(404).json({ message: 'Sales Manager not found' });
        }

        salesManager.notes = notes || '';
        await salesManager.save();

        res.json({ message: 'Notes updated successfully', notes: salesManager.notes });
    } catch (error) {
        console.error('Update notes error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
