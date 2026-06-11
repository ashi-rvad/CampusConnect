import { Application } from '../models/application.model.js';
import { Job } from '../models/job.model.js';
import { Student } from '../models/student.model.js';
import { Recruiter } from '../models/recruiter.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const applyForJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) throw new ApiError(404, "Student profile not found");
    
    if (!student.resumeUrl) {
        throw new ApiError(400, "Please upload a resume to your profile before applying");
    }

    const job = await Job.findById(jobId);
    if (!job) throw new ApiError(404, "Job not found");

    if (job.status !== 'Open' || new Date(job.deadline) < new Date()) {
        throw new ApiError(400, "This job is no longer accepting applications");
    }

    const existingApplication = await Application.findOne({ jobId, studentId: student._id });
    if (existingApplication) {
        throw new ApiError(400, "You have already applied for this job");
    }

    const application = await Application.create({
        jobId,
        studentId: student._id,
        resumeUrl: student.resumeUrl
    });

    return res.status(201).json(new ApiResponse(201, application, "Successfully applied for the job"));
});

export const getStudentApplications = asyncHandler(async (req, res) => {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) throw new ApiError(404, "Student profile not found");

    const applications = await Application.find({ studentId: student._id }).populate({
        path: 'jobId',
        populate: { path: 'companyId', select: 'name logo' }
    });

    return res.status(200).json(new ApiResponse(200, applications, "Applications fetched successfully"));
});

export const getJobApplications = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    
    // verify recruiter owns the job
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    const job = await Job.findById(jobId);

    if (req.user.role === 'Recruiter' && job.recruiterId.toString() !== recruiter._id.toString()) {
        throw new ApiError(403, "You can only view applications for your own jobs");
    }

    const applications = await Application.find({ jobId }).populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'email' }
    });

    return res.status(200).json(new ApiResponse(200, applications, "Applicants fetched successfully"));
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    const application = await Application.findByIdAndUpdate(id, { status }, { new: true });
    if (!application) throw new ApiError(404, "Application not found");

    return res.status(200).json(new ApiResponse(200, application, `Application status updated to ${status}`));
});
