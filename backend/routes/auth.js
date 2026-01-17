const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { userId, password } = req.body;

        if (!userId || !password) {
            return res.status(400).json({ message: 'Please provide userId and password' });
        }

        // Check if it's admin login
        if (userId === process.env.ADMIN_ID) {
            if (password === process.env.ADMIN_PASSWORD) {
                // Create admin user if doesn't exist
                let admin = await User.findOne({ userId: process.env.ADMIN_ID });

                if (!admin) {
                    admin = new User({
                        userId: process.env.ADMIN_ID,
                        password: process.env.ADMIN_PASSWORD,
                        role: 'admin',
                    });
                    await admin.save();
                }

                const token = jwt.sign(
                    { userId: admin._id, role: admin.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                return res.json({
                    token,
                    user: {
                        id: admin._id,
                        userId: admin.userId,
                        role: admin.role,
                    },
                });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        }

        // Sales Manager login
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                userId: user.userId,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Change password (Sales Manager only)
router.post('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide current and new password' });
        }

        if (req.user.role === 'admin') {
            return res.status(403).json({ message: 'Admin cannot change password through this route' });
        }

        const user = await User.findById(req.userId);
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
