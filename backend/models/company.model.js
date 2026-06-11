import mongoose, { Schema } from 'mongoose';

const companySchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        website: { type: String },
        industry: { type: String },
        logo: { type: String },
        description: { type: String }
    },
    { timestamps: true }
);

export const Company = mongoose.model('Company', companySchema);
