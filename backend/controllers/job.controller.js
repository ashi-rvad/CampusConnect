import { Job } from '../models/job.model.js';
import { Recruiter } from '../models/recruiter.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createJob = asyncHandler(async (req, res) => {
    const { title, description, role, location, salary, skillsRequired, eligibility, deadline } = req.body;

    if (!title || !description || !role || !location || !deadline) {
        throw new ApiError(400, "Please provide all required fields");
    }

    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) throw new ApiError(404, "Recruiter profile not found");

    if (!recruiter.isApproved) {
        throw new ApiError(403, "Your recruiter account is not yet approved by PO");
    }

    const job = await Job.create({
        companyId: recruiter.companyId,
        recruiterId: recruiter._id,
        title,
        description,
        role,
        location,
        salary,
        skillsRequired,
        eligibility,
        deadline
    });

    return res.status(201).json(new ApiResponse(201, job, "Job created successfully"));
});

export const getJobs = asyncHandler(async (req, res) => {
    const { role, location, companyId, minSalary } = req.query;
    
    let query = {};
    if (role) query.role = { $regex: role, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (companyId) query.companyId = companyId;
    if (minSalary) query['salary.min'] = { $gte: Number(minSalary) };

    const jobs = await Job.find(query).populate('companyId', 'name logo');
    
    return res.status(200).json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
});

export const getJobById = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id).populate('companyId').populate('recruiterId', 'firstName lastName');
    if (!job) throw new ApiError(404, "Job not found");
    return res.status(200).json(new ApiResponse(200, job, "Job fetched successfully"));
});

export const updateJob = asyncHandler(async (req, res) => {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) throw new ApiError(404, "Job not found");
    return res.status(200).json(new ApiResponse(200, job, "Job updated successfully"));
});
