const mongoose = require('mongoose');

const lifeInsuranceSchema = new mongoose.Schema({
    policyHolderName: {
        type: String,
        required: true,
    },
    policyHolderAddress: {
        type: String,
        required: true,
    },
    policyNumber: {
        type: String,
        required: true,
    },
    dateOfCommencement: {
        type: Date,
        required: true,
    },
    planTermPPT: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Validate format: nnn/nn/nn (e.g., 100/20/15)
                return /^\d{1,3}\/\d{1,2}\/\d{1,2}$/.test(v);
            },
            message: props => `${props.value} is not a valid Plan/Term/PPT format! Use format: nnn/nn/nn`
        }
    },
    premiumAmount: {
        type: Number,
        required: true,
    },
    firstUnpaidPremium: {
        type: Date,
        required: true,
    },
    paymentMode: {
        type: String,
        enum: ['Monthly ECS', 'Quarterly', 'Half-Yearly', 'Yearly'],
        required: true,
    },
    sumAssured: {
        type: Number,
        required: true,
    },
    dateOfLastPremium: {
        type: Date,
        required: true,
    },
    maturityAmount: {
        type: Number,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    agentCode: {
        type: String,
        required: true,
    },
    nomineeName: {
        type: String,
        required: true,
    },
    nomineeRelation: {
        type: String,
        required: true,
    },
    nomineeDOB: {
        type: Date,
        required: true,
    },
    document: {
        type: String,
        required: false,
    },
    proposalForm: {
        type: String,
        required: false,
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
lifeInsuranceSchema.index({ createdBy: 1, dateOfCommencement: 1 });
lifeInsuranceSchema.index({ policyHolderName: 'text' });

module.exports = mongoose.model('LifeInsurance', lifeInsuranceSchema);
