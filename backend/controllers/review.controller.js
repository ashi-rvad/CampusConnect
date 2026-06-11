import { Review } from '../models/review.model.js';
import { Company } from '../models/company.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const addReview = asyncHandler(async (req, res) => {
    const { companyId, rating, comment, isAnonymous } = req.body;
    const studentId = req.user._id;

    if (!companyId || !rating || !comment) {
        throw new ApiError(400, 'All fields are required');
    }

    const company = await Company.findById(companyId);
    if (!company) {
        throw new ApiError(404, 'Company not found');
    }

    const existingReview = await Review.findOne({ companyId, studentId });
    if (existingReview) {
        throw new ApiError(400, 'You have already reviewed this company');
    }

    const review = await Review.create({
        companyId,
        studentId,
        rating,
        comment,
        isAnonymous
    });

    return res.status(201).json(new ApiResponse(201, review, 'Review added successfully'));
});

export const getCompanyReviews = asyncHandler(async (req, res) => {
    const { companyId } = req.params;

    const reviews = await Review.find({ companyId })
        .populate('studentId', 'firstName lastName profilePicture')
        .sort({ createdAt: -1 });

    // Sanitize anonymous reviews
    const sanitizedReviews = reviews.map(review => {
        if (review.isAnonymous) {
            return {
                ...review.toObject(),
                studentId: {
                    firstName: 'Anonymous',
                    lastName: 'Student',
                    profilePicture: null
                }
            };
        }
        return review;
    });

    return res.status(200).json(new ApiResponse(200, sanitizedReviews, 'Reviews retrieved successfully'));
});
