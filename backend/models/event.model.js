import mongoose, { Schema } from 'mongoose';

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        type: {
            type: String,
            enum: ['Hackathon', 'Workshop', 'Seminar', 'Pre-Placement Talk', 'Other'],
            required: true
        },
        organizerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        location: {
            type: String,
            default: 'Campus'
        },
        attendees: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        status: {
            type: String,
            enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
            default: 'Upcoming'
        }
    },
    { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);
