import mongoose, { Schema } from 'mongoose';

const applicationSchema = new Schema(
    {
        jobId: {
            type: Schema.Types.ObjectId,
            ref: 'Job',
            required: true
        },
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        status: {
            type: String,
            enum: ['Applied', 'Shortlisted', 'Interview_Scheduled', 'Selected', 'Rejected'],
            default: 'Applied'
        },
        appliedAt: { type: Date, default: Date.now },
        resumeUrl: { type: String, required: true }
    },
    { timestamps: true }
);

export const Application = mongoose.model('Application', applicationSchema);
