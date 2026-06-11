import mongoose, { Schema } from 'mongoose';

const interviewSchema = new Schema(
    {
        applicationId: {
            type: Schema.Types.ObjectId,
            ref: 'Application',
            required: true
        },
        recruiterId: {
            type: Schema.Types.ObjectId,
            ref: 'Recruiter',
            required: true
        },
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        jobId: {
            type: Schema.Types.ObjectId,
            ref: 'Job',
            required: true
        },
        dateTime: { type: Date, required: true },
        type: { type: String, required: true }, // e.g., 'Technical', 'HR'
        mode: { type: String, enum: ['Online', 'Offline'], required: true },
        linkOrLocation: { type: String, required: true },
        status: {
            type: String,
            enum: ['Scheduled', 'Completed', 'Cancelled'],
            default: 'Scheduled'
        }
    },
    { timestamps: true }
);

export const Interview = mongoose.model('Interview', interviewSchema);
