import { User } from '../models/user.model.js';
import { Student } from '../models/student.model.js';
import { Recruiter } from '../models/recruiter.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../services/email.service.js';
import crypto from 'crypto';

const generateAccessTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        return { accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access token");
    }
}

export const registerUser = asyncHandler(async (req, res) => {
    const { email, password, role, firstName, lastName, phone } = req.body;

    if (!email || !password || !role) {
        throw new ApiError(400, "Email, password and role are required");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
        email,
        password,
        role,
        verificationToken,
        verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    if (role === 'Student') {
        if (!firstName || !lastName) throw new ApiError(400, "First and last name required for student");
        await Student.create({
            userId: user._id,
            firstName,
            lastName,
            phone
        });
    } else if (role === 'Recruiter') {
        if (!firstName || !lastName) throw new ApiError(400, "First and last name required for recruiter");
        const { companyId, designation } = req.body;
        if (!companyId) throw new ApiError(400, "Company ID is required for recruiter");
        
        await Recruiter.create({
            userId: user._id,
            firstName,
            lastName,
            companyId,
            designation
        });
    }

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    try {
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            await sendEmail({
                to: user.email,
                subject: 'CampusConnect - Email Verification',
                html: `<p>Please verify your email by clicking on this link: <a href="${verificationUrl}">Verify Email</a></p>`
            });
        } else {
            console.log("No SMTP Config provided. Skipping email send. Verification URL: ", verificationUrl);
            // Auto-verify user for testing without SMTP
            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }
    } catch (err) {
        console.error("Email sending failed:", err);
        // Don't crash registration, just auto-verify for now
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
    }

    const createdUser = await User.findById(user._id).select("-password");

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully. Please verify your email.")
    );
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    
    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired verification token");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Email verified successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    if (!user.isVerified) {
        throw new ApiError(401, "Please verify your email first");
    }

    const { accessToken } = await generateAccessTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200, 
                { user: loggedInUser, accessToken }, 
                "User logged In Successfully"
            )
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});
