import { Student } from '../models/student.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinaryUpload.js';

export const getStudentProfile = asyncHandler(async (req, res) => {
    const student = await Student.findOne({ userId: req.user._id }).populate('userId', 'email role isVerified');
    
    if (!student) {
        throw new ApiError(404, "Student profile not found");
    }

    return res.status(200).json(new ApiResponse(200, student, "Student profile fetched successfully"));
});

export const updateStudentProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, phone, academicDetails, skills, projects, certifications } = req.body;

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
        throw new ApiError(404, "Student profile not found");
    }

    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;
    if (phone) student.phone = phone;
    
    if (academicDetails) {
        const parsedAcademicDetails = typeof academicDetails === 'string' ? JSON.parse(academicDetails) : academicDetails;
        student.academicDetails = { ...student.academicDetails, ...parsedAcademicDetails };
    }

    if (skills) student.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    if (projects) student.projects = typeof projects === 'string' ? JSON.parse(projects) : projects;
    if (certifications) student.certifications = typeof certifications === 'string' ? JSON.parse(certifications) : certifications;

    // Handle files
    if (req.files?.profilePicture) {
        const profilePicLocalPath = req.files.profilePicture[0].path;
        const profilePic = await uploadOnCloudinary(profilePicLocalPath);
        if (profilePic) student.profilePicture = profilePic.url;
    }

    if (req.files?.resume) {
        const resumeLocalPath = req.files.resume[0].path;
        const resume = await uploadOnCloudinary(resumeLocalPath);
        if (resume) student.resumeUrl = resume.url;
    }

    // Calculate profile completion percentage
    let completedFields = 0;
    const totalFields = 6; // basic, academic, skills, projects, certifications, resume
    if (student.firstName && student.lastName) completedFields++;
    if (student.academicDetails?.cgpa) completedFields++;
    if (student.skills?.length > 0) completedFields++;
    if (student.projects?.length > 0) completedFields++;
    if (student.certifications?.length > 0) completedFields++;
    if (student.resumeUrl) completedFields++;
    
    student.profileCompletionPercentage = Math.round((completedFields / totalFields) * 100);

    await student.save();

    return res.status(200).json(new ApiResponse(200, student, "Student profile updated successfully"));
});

export const getAllStudents = asyncHandler(async (req, res) => {
    // For Recruiter and PO
    const { skills, minCgpa, branch } = req.query;
    
    let query = {};
    if (skills) {
        query.skills = { $in: skills.split(',') };
    }
    if (minCgpa) {
        query['academicDetails.cgpa'] = { $gte: Number(minCgpa) };
    }
    if (branch) {
        query['academicDetails.branch'] = branch;
    }

    const students = await Student.find(query).populate('userId', 'email');
    
    return res.status(200).json(new ApiResponse(200, students, "Students fetched successfully"));
});
