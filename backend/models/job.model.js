import mongoose, { Schema } from 'mongoose';

const jobSchema = new Schema(
    {
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        recruiterId: {
            type: Schema.Types.ObjectId,
            ref: 'Recruiter',
            required: true
        },
        title: { type: String, required: true },
        description: { type: String, required: true },
        role: { type: String, required: true },
        location: { type: String, required: true },
        salary: {
            min: { type: Number },
            max: { type: Number }
        },
        skillsRequired: [{ type: String }],
        eligibility: {
            minCGPA: { type: Number },
            allowedBranches: [{ type: String }]
        },
        deadline: { type: Date, required: true },
        status: {
            type: String,
            enum: ['Open', 'Closed'],
            default: 'Open'
        }
    },
    { timestamps: true }
);

export const Job = mongoose.model('Job', jobSchema);
