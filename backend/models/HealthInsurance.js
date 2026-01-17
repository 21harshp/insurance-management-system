const mongoose = require('mongoose');

const healthInsuranceSchema = new mongoose.Schema({
    policyStartDate: {
        type: Date,
        required: true,
    },
    policyEndDate: {
        type: Date,
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
    companyName: {
        type: String,
        required: true,
    },
    tpaName: {
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
    agentName: {
        type: String,
        default: '',
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
healthInsuranceSchema.index({ createdBy: 1, policyEndDate: 1 });
healthInsuranceSchema.index({ policyHolderName: 'text' });

module.exports = mongoose.model('HealthInsurance', healthInsuranceSchema);
