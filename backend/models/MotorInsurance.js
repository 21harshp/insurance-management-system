const mongoose = require('mongoose');

const motorInsuranceSchema = new mongoose.Schema({
    registrationNumber: {
        type: String,
        required: true,
    },
    policyStartDate: {
        type: Date,
        required: true,
    },
    policyEndDate: {
        type: Date,
        required: true,
    },
    policyNumber: {
        type: String,
        required: true,
    },
    insuranceCompanyName: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    policyHolderName: {
        type: String,
        required: true,
    },
    policyHolderDOB: {
        type: Date,
        required: true,
    },
    nomineeName: {
        type: String,
        required: true,
    },
    nomineeDOB: {
        type: Date,
        required: true,
    },
    agentName: {
        type: String,
        required: true,
    },
    serviceProviderCompanyName: {
        type: String,
        required: true,
    },
    premiumAmount: {
        type: Number,
        required: true,
    },
    policyCopyLink: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

// Index for efficient querying
motorInsuranceSchema.index({ createdBy: 1, policyEndDate: 1 });
motorInsuranceSchema.index({ policyHolderName: 'text' });

module.exports = mongoose.model('MotorInsurance', motorInsuranceSchema);
