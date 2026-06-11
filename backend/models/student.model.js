import mongoose, { Schema } from 'mongoose';

const studentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        profilePicture: { type: String },
        phone: { type: String },
        academicDetails: {
            cgpa: { type: Number },
            branch: { type: String },
            graduationYear: { type: Number },
            tenthPercentage: { type: Number },
            twelfthPercentage: { type: Number }
        },
        skills: [{ type: String }],
        projects: [
            {
                title: String,
                description: String,
                link: String
            }
        ],
        certifications: [
            {
                name: String,
                issuer: String,
                date: Date
            }
        ],
        resumeUrl: { type: String },
        profileCompletionPercentage: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

export const Student = mongoose.model('Student', studentSchema);
