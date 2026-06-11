import { Event } from '../models/event.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createEvent = asyncHandler(async (req, res) => {
    const { title, description, date, type, location } = req.body;

    if (!title || !description || !date || !type) {
        throw new ApiError(400, 'All required fields must be provided');
    }

    const event = await Event.create({
        title,
        description,
        date,
        type,
        location,
        organizerId: req.user._id
    });

    return res.status(201).json(new ApiResponse(201, event, 'Event created successfully'));
});

export const getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find()
        .populate('organizerId', 'firstName lastName email')
        .sort({ date: 1 }); // Sort by closest date first

    return res.status(200).json(new ApiResponse(200, events, 'Events retrieved successfully'));
});

export const registerForEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId);

    if (!event) {
        throw new ApiError(404, 'Event not found');
    }

    // Check if user is already registered
    if (event.attendees.includes(userId)) {
        throw new ApiError(400, 'You are already registered for this event');
    }

    event.attendees.push(userId);
    await event.save();

    return res.status(200).json(new ApiResponse(200, event, 'Successfully registered for event'));
});

export const deleteEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.id;
    
    const event = await Event.findById(eventId);
    if (!event) {
        throw new ApiError(404, 'Event not found');
    }

    if (event.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        throw new ApiError(403, 'You do not have permission to delete this event');
    }

    await event.deleteOne();

    return res.status(200).json(new ApiResponse(200, {}, 'Event deleted successfully'));
});
