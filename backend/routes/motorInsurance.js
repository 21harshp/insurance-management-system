const express = require('express');
const router = express.Router();
const MotorInsurance = require('../models/MotorInsurance');
const { auth } = require('../middleware/auth');

// Get all motor insurance policies for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const { month, year, search } = req.query;
        let query = { createdBy: req.userId };

        // Filter by month and year if provided
        if (month !== undefined && month !== '') {
            const monthNum = parseInt(month);
            const yearNum = year ? parseInt(year) : new Date().getFullYear();
            const startDate = new Date(yearNum, monthNum, 1);
            const endDate = new Date(yearNum, monthNum + 1, 0);

            query.policyEndDate = {
                $gte: startDate,
                $lte: endDate,
            };
        } else if (year) {
            // Filter by year only if month is not provided
            const yearNum = parseInt(year);
            const startDate = new Date(yearNum, 0, 1);
            const endDate = new Date(yearNum, 11, 31, 23, 59, 59);

            query.policyEndDate = {
                $gte: startDate,
                $lte: endDate,
            };
        }

        // Search by policy holder name
        if (search) {
            query.policyHolderName = { $regex: search, $options: 'i' };
        }

        const policies = await MotorInsurance.find(query)
            .sort({ policyEndDate: -1 })
            .lean();

        res.json(policies);
    } catch (error) {
        console.error('Get motor insurance error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create motor insurance policy
router.post('/', auth, async (req, res) => {
    try {
        const policyData = {
            ...req.body,
            createdBy: req.userId,
        };

        const policy = new MotorInsurance(policyData);
        await policy.save();

        res.status(201).json(policy);
    } catch (error) {
        console.error('Create motor insurance error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Update motor insurance policy
router.put('/:id', auth, async (req, res) => {
    try {
        const policy = await MotorInsurance.findOne({
            _id: req.params.id,
            createdBy: req.userId,
        });

        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        Object.assign(policy, req.body);
        await policy.save();

        res.json(policy);
    } catch (error) {
        console.error('Update motor insurance error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete motor insurance policy
router.delete('/:id', auth, async (req, res) => {
    try {
        const policy = await MotorInsurance.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.userId,
        });

        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        res.json({ message: 'Policy deleted successfully' });
    } catch (error) {
        console.error('Delete motor insurance error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
