import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema(
    {
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            trim: true
        },
        isAnonymous: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

// One student can only review a company once
reviewSchema.index({ companyId: 1, studentId: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
