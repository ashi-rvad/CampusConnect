import mongoose, { Schema } from 'mongoose';

const recruiterSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        designation: { type: String },
        isApproved: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export const Recruiter = mongoose.model('Recruiter', recruiterSchema);
